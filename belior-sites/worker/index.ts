/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { integrationStatus, publishReport, type DayReport, type PublishEnv } from "./report";
import { assignment, classify, executeTask, rowToTask } from "./tasks";

interface Env extends PublishEnv {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/inquiries") {
      if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
      if (request.headers.get("origin") !== url.origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
      try {
        const body = await request.json() as Record<string, unknown>;
        const name = String(body.name || "").trim();
        const email = String(body.email || "").trim();
        const message = String(body.message || "").trim();
        if (!name || name.length > 120 || email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length > 4000) return Response.json({error: "Invalid inquiry"}, {status: 400});
        await env.DB.prepare("CREATE TABLE IF NOT EXISTS belior_inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, type TEXT, preferred_date TEXT, message TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)").run();
        await env.DB.prepare("DELETE FROM belior_inquiries WHERE created_at < datetime('now', '-1 year')").run();
        const count = await env.DB.prepare("SELECT COUNT(*) AS total FROM belior_inquiries WHERE email = ? AND created_at > datetime('now', '-1 hour')").bind(email).first<{total:number}>();
        if (count && count.total >= 5) return Response.json({error: "Please try again later"}, {status:429});
        await env.DB.prepare("INSERT INTO belior_inquiries (name, email, type, preferred_date, message) VALUES (?, ?, ?, ?, ?)").bind(name, email, String(body.type || "").slice(0,100), String(body.date || "").slice(0,20), message).run();
        return Response.json({ok:true}, {status:201});
      } catch { return Response.json({error: "Unable to save inquiry"}, {status:500}); }
    }

    if (url.pathname === "/api/tasks" && request.method === "GET") {
      const rows = await env.DB.prepare("SELECT * FROM tasks ORDER BY id DESC LIMIT 50").all();
      return Response.json({ tasks: rows.results.map((row) => rowToTask(row as Record<string, unknown>)) });
    }

    if (url.pathname === "/api/tasks" && request.method === "POST") {
      try {
        const body = (await request.json()) as { instruction?: string };
        const instruction = body.instruction?.trim();
        if (!instruction) return Response.json({ error: "업무 지시를 입력해주세요." }, { status: 400 });
        const kind = classify(instruction);
        const owner = assignment(kind);
        const output = executeTask(kind, instruction);
        const inserted = await env.DB.prepare(
          `INSERT INTO tasks (instruction, department, assignee, kind, status, result, tool_log, approval_required, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) RETURNING *`,
        ).bind(instruction, owner.department, owner.assignee, kind, output.status, output.result, JSON.stringify(output.toolLog), output.approvalRequired ? 1 : 0).first();
        return Response.json({ task: rowToTask(inserted as Record<string, unknown>) }, { status: 201 });
      } catch (error) {
        return Response.json({ error: String(error) }, { status: 500 });
      }
    }

    const approvalMatch = url.pathname.match(/^\/api\/tasks\/(\d+)\/approve$/);
    if (approvalMatch && request.method === "POST") {
      const id = Number(approvalMatch[1]);
      const row = await env.DB.prepare(
        "UPDATE tasks SET status = 'done', approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'approval' RETURNING *",
      ).bind(id).first();
      if (!row) return Response.json({ error: "승인 가능한 Task가 없습니다." }, { status: 404 });
      return Response.json({ task: rowToTask(row as Record<string, unknown>) });
    }

    // 연동 설정 여부만 알려준다 (값은 절대 내보내지 않는다)
    if (url.pathname === "/api/integrations") {
      return Response.json(integrationStatus(env));
    }

    // 완료 보고를 Notion + Discord로 동시 발행
    if (url.pathname === "/api/report") {
      if (request.method !== "POST") return new Response("POST only", { status: 405 });
      try {
        const report = (await request.json()) as DayReport;
        const result = await publishReport(report, env);
        return Response.json(result);
      } catch (error) {
        return Response.json({ error: String(error) }, { status: 400 });
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
