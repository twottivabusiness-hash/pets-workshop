"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OfficeWorld from "../game/OfficeWorld";
import {
  buildReport,
  fetchIntegrations,
  publish,
  type IntegrationStatus,
  type PublishResult,
} from "../game/report";
import { Company, PHASES, type Agent, type DeptStatus, type Snapshot } from "../game/sim";
import { CEO, DEPT_BRIEF, DEPT_LEAD, STAFF } from "../game/staff";
import { DEPT_ROOMS } from "../game/world";
import { COMPANY, STORAGE_LINK } from "../../company.config";

type View = "live" | "dashboard";
type WorkTask = {
  id: number;
  instruction: string;
  department: string;
  assignee: string;
  kind: string;
  status: "approval" | "blocked" | "done";
  result: string;
  toolLog: string[];
  approvalRequired: boolean;
  createdAt: string;
};

const statusClass: Record<DeptStatus, string> = {
  "완료": "done",
  "진행 중": "working",
  "승인 대기": "approval",
  "연동 대기": "blocked",
  "대기": "waiting",
};

/** 링크만 걸려 있는 항목 (서버 연동과 무관) */
const integrations2Static = STORAGE_LINK
  ? [{ name: "결과물 보관함", status: "링크 연결", tone: "mint", href: STORAGE_LINK }]
  : [];

function PixelEmployee({ hair, shirt, accent }: { hair: string; shirt: string; accent: string }) {
  const style = {
    "--pixel-hair": hair,
    "--pixel-shirt": shirt,
    "--pixel-accent": accent,
  } as CSSProperties;
  return (
    <span className="pixel-employee" style={style} aria-hidden="true">
      <i className="pixel-shadow" />
      <i className="pixel-legs" />
      <i className="pixel-body" />
      <i className="pixel-arm left" />
      <i className="pixel-arm right" />
      <i className="pixel-face">
        <b className="pixel-eyes" />
      </i>
      <i className="pixel-hair" />
      <i className="pixel-headset" />
    </span>
  );
}

export default function Home() {
  const [engine] = useState(() => new Company());
  const [snap, setSnap] = useState<Snapshot>(() => engine.snapshot());
  const [view, setView] = useState<View>("live");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [follow, setFollow] = useState(true);
  const [briefing, setBriefing] = useState(false);
  const [filter, setFilter] = useState<"전체" | DeptStatus>("전체");
  const [toast, setToast] = useState("");
  const [integrations, setIntegrations] = useState<IntegrationStatus | null>(null);
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [taskBusy, setTaskBusy] = useState(false);
  const [publishState, setPublishState] = useState<{ busy: boolean; result: PublishResult | null; error: string }>({
    busy: false,
    result: null,
    error: "",
  });
  const publishedRef = useRef(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      engine.tick(dt);
      acc += dt;
      if (acc >= 0.18) {
        acc = 0;
        setSnap(engine.snapshot());
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  useEffect(() => {
    engine.setBriefingHandler(() => setBriefing(true));
    return () => engine.setBriefingHandler(null);
  }, [engine]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }, []);

  const loadTasks = useCallback(async () => {
    const response = await fetch("/api/tasks", { cache: "no-store" });
    if (!response.ok) throw new Error("업무 기록을 불러오지 못했습니다.");
    const data = (await response.json()) as { tasks: WorkTask[] };
    setTasks(data.tasks);
  }, []);

  useEffect(() => {
    void loadTasks().catch(() => undefined);
  }, [loadTasks]);

  const createTask = useCallback(async (instruction: string) => {
    setTaskBusy(true);
    engine.pushChat("ceo", CEO.name, instruction);
    engine.pushChat("staff", "오세리", "지시를 실제 Task로 등록하고 담당자에게 배정하는 중입니다.");
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ instruction }),
      });
      const data = (await response.json()) as { task?: WorkTask; error?: string };
      if (!response.ok || !data.task) throw new Error(data.error ?? "Task 생성 실패");
      setTasks((current) => [data.task!, ...current]);
      const task = data.task;
      engine.pushLog(task.status === "blocked" ? "🔌" : "📦", `Task #${task.id} · ${task.department} · ${task.status === "blocked" ? "연동 대기" : "결과물 생성 완료"}`, task.status === "blocked" ? "lav" : "mint");
      engine.pushChat("staff", task.assignee, `Task #${task.id} 처리 결과입니다.\n${task.toolLog.join(" → ")}\n${task.status === "blocked" ? "필요한 외부 권한이 없어 대기로 기록했습니다." : "결과물을 만들었고 대표 승인함에 올렸습니다."}`);
      showToast(task.status === "blocked" ? "Task는 생성됐지만 외부 도구 연동이 필요합니다" : "실제 Task와 결과물이 저장됐습니다");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      engine.pushChat("staff", "오세리", `Task 실행 실패: ${message}`);
      showToast("Task 실행 실패");
    } finally {
      setTaskBusy(false);
    }
  }, [engine, showToast]);

  const approveTask = useCallback(async (id: number) => {
    const response = await fetch(`/api/tasks/${id}/approve`, { method: "POST" });
    const data = (await response.json()) as { task?: WorkTask; error?: string };
    if (!response.ok || !data.task) throw new Error(data.error ?? "승인 실패");
    setTasks((current) => current.map((task) => task.id === id ? data.task! : task));
    engine.pushChat("staff", "오세리", `Task #${id} 대표 승인이 실제 기록됐습니다. 외부 발송·게시는 별도 연동 전까지 실행하지 않습니다.`);
    showToast(`Task #${id} 승인 완료`);
  }, [engine, showToast]);

  const onSelect = useCallback((agent: Agent) => setSelectedId(agent.id), []);

  // 연동 설정 여부를 서버에서 받아온다 (값이 아니라 설정 여부만)
  useEffect(() => {
    fetchIntegrations()
      .then(setIntegrations)
      .catch(() => setIntegrations(null));
  }, []);

  const sendReport = useCallback(
    async (auto: boolean) => {
      setPublishState((state) => ({ ...state, busy: true, error: "" }));
      try {
        const result = await publish(buildReport(engine.snapshot()));
        setPublishState({ busy: false, result, error: "" });

        const parts: string[] = [];
        parts.push(result.notion.ok ? "Notion 저장 완료" : `Notion ${result.notion.detail ?? "실패"}`);
        parts.push(result.discord.ok ? "Discord 전송 완료" : `Discord ${result.discord.detail ?? "실패"}`);
        engine.pushLog(
          result.notion.ok && result.discord.ok ? "📤" : "⚠️",
          `완료 보고 발행 — ${parts.join(" / ")}`,
          result.notion.ok && result.discord.ok ? "mint" : "lav",
        );
        engine.pushChat("staff", "오세리", `보고서 발행 결과입니다.\n· ${parts.join("\n· ")}`);
        if (!auto) showToast(result.notion.ok || result.discord.ok ? "보고서를 발행했어요" : "발행 실패 — 연동 설정 필요");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setPublishState({ busy: false, result: null, error: message });
        engine.pushLog("⚠️", `완료 보고 발행 실패 — ${message}`, "lav");
        if (!auto) showToast("발행 실패 — 연동 설정을 확인해주세요");
      }
    },
    [engine, showToast],
  );

  // 하루가 끝나면 자동으로 한 번 발행한다
  useEffect(() => {
    if (snap.dayComplete && !publishedRef.current) {
      publishedRef.current = true;
      void sendReport(true);
    }
    if (!snap.dayComplete && snap.running) publishedRef.current = false;
  }, [snap.dayComplete, snap.running, sendReport]);

  const askAgent = useCallback(
    (agent: Agent) => {
      engine.command(`${agent.name} 지금 뭐해?`);
      setSelectedId(null);
      window.setTimeout(
        () => document.getElementById("ceo-console")?.scrollIntoView({ behavior: "smooth", block: "center" }),
        60,
      );
    },
    [engine],
  );

  const start = () => {
    engine.start();
    void createTask("BELiOR VIP 응대·비스포크 제안·브랜드 경험 시연 흐름을 준비해");
    setBriefing(false);
    setView("live");
    showToast(`07:00 — BELiOR ${STAFF.length}명이 시연 업무를 시작합니다`);
  };

  const approve = () => {
    engine.approve();
    showToast("시연안 승인 완료! 브랜드 경험·캠페인팀이 움직여요");
  };

  const teams = useMemo(
    () =>
      DEPT_ROOMS.map((room) => {
        const lead = DEPT_LEAD[room.id];
        const status = snap.deptStatus[room.id] ?? "대기";
        return {
          id: room.id,
          icon: room.icon,
          name: room.name,
          room: room.short,
          lead,
          status,
          ...DEPT_BRIEF[room.id],
        };
      }),
    [snap.deptStatus],
  );

  const filteredTeams = filter === "전체" ? teams : teams.filter((team) => team.status === filter);
  const selected = selectedId ? engine.agentById.get(selectedId) ?? null : null;
  const todo = snap.approvalPending ? 1 : 0;
  const onDuty = engine.agents.filter((a) => a.status !== "출근 전").length;

  return (
    <main className="page-shell">
      <div className="wrap">
        <nav className="app-nav" aria-label="AI Company 화면 전환">
          <div className="brand-chip">
            <span>{COMPANY.logoLetter}</span>
            <b>{COMPANY.name}</b>
          </div>
          <div className="nav-tabs">
            <button className={view === "live" ? "active" : ""} onClick={() => setView("live")}>
              🎮 라이브 오피스
            </button>
            <button className={view === "dashboard" ? "active" : ""} onClick={() => setView("dashboard")}>
              📊 대시보드
            </button>
            <button
              className={`todo-tab ${todo ? "urgent" : ""}`}
              onClick={() => {
                setView("live");
                window.setTimeout(
                  () => document.getElementById("ceo-approval")?.scrollIntoView({ behavior: "smooth", block: "center" }),
                  60,
                );
              }}
            >
              📋 대표 할 일 <i>{todo}</i>
            </button>
          </div>
        </nav>

        {view === "live" ? (
          <LiveView
            engine={engine}
            snap={snap}
            follow={follow}
            setFollow={setFollow}
            selectedId={selectedId}
            onSelect={onSelect}
            onStart={start}
            onApprove={approve}
            onDuty={onDuty}
            onPublish={() => void sendReport(false)}
            publishBusy={publishState.busy}
            publishResult={publishState.result}
            tasks={tasks}
            taskBusy={taskBusy}
            onCreateTask={createTask}
            onApproveTask={approveTask}
          />
        ) : (
          <DashboardView
            teams={teams}
            filteredTeams={filteredTeams}
            filter={filter}
            setFilter={setFilter}
            snap={snap}
            onStart={start}
            onApprove={approve}
            onSelect={(id) => setSelectedId(id)}
            integrations={integrations}
            publishResult={publishState.result}
          />
        )}

        <footer>
          Maison BELiOR · Sales & Marketing Office
          <br />VIP 인콰이어리 · 비스포크 제안 · 아틀리에 · 브랜드 경험
          <br />© BELiOR
        </footer>
      </div>

      {selected ? (
        <ProfileModal
          agent={selected}
          onClose={() => setSelectedId(null)}
          onAsk={(agent) => {
            setView("live");
            askAgent(agent);
          }}
        />
      ) : null}
      {briefing ? <BriefingModal snap={snap} onClose={() => setBriefing(false)} /> : null}
      <div className={`toast ${toast ? "show" : ""}`} role="status">
        {toast}
      </div>
    </main>
  );
}

function LiveView({
  engine,
  snap,
  follow,
  setFollow,
  selectedId,
  onSelect,
  onStart,
  onApprove,
  onDuty,
  onPublish,
  publishBusy,
  publishResult,
  tasks,
  taskBusy,
  onCreateTask,
  onApproveTask,
}: {
  engine: Company;
  snap: Snapshot;
  follow: boolean;
  setFollow: (value: boolean) => void;
  selectedId: string | null;
  onSelect: (agent: Agent) => void;
  onStart: () => void;
  onApprove: () => void;
  onDuty: number;
  onPublish: () => void;
  publishBusy: boolean;
  publishResult: PublishResult | null;
  tasks: WorkTask[];
  taskBusy: boolean;
  onCreateTask: (instruction: string) => Promise<void>;
  onApproveTask: (id: number) => Promise<void>;
}) {
  const progress = Math.round((snap.phaseIndex / (PHASES.length - 1)) * 100);

  return (
    <>
      <header className="live-hero">
        <div>
          <p className="eyebrow">LIVE OFFICE · 32 AI STAFF · REAL-TIME</p>
          <h1>
            {COMPANY.titlePrefix} <em className="highlight">{COMPANY.titleAccent}</em>
          </h1>
          <p>출근하고, 자리에서 일하고, 회의실에 모여 회의하고, 대표실로 보고하러 갑니다.</p>
        </div>
        <div className="live-clock">
          <span>SEOUL</span>
          <b>{snap.clock}</b>
          <small>{snap.phase}</small>
        </div>
      </header>

      <section className="live-bar">
        <button className="btn btn-primary" onClick={onStart} disabled={snap.running}>
          {snap.running ? "직원들이 일하는 중…" : snap.dayComplete ? "다시 출근시키기" : "오늘 업무 시작하기"}
        </button>
        <button className="btn btn-ghost" onClick={() => engine.togglePause()}>
          {snap.paused ? "▶ 재생" : "⏸ 일시정지"}
        </button>
        <div className="speed-wrap">
          <span className="speed-label" title="시뮬레이션 전체(걷기·업무·대사)가 함께 빨라져요. 실제 외부 작업 속도와는 무관합니다.">
            재생 속도
          </span>
          <div className="speed-group" role="group" aria-label="재생 속도">
            {[1, 2, 4].map((value) => (
              <button
                key={value}
                className={!snap.turbo && snap.speed === value ? "on" : ""}
                onClick={() => engine.setSpeed(value)}
                title={value === 1 ? "말풍선 읽기·화면녹화용" : value === 4 ? "결과만 빠르게" : "기본"}
              >
                {value}x
              </button>
            ))}
            <button
              className={`skip ${snap.turbo ? "on" : ""}`}
              onClick={() => engine.skipToDecision()}
              disabled={!snap.running || snap.approvalPending}
              title="대표님이 결정할 일이 생길 때까지 단숨에 건너뜁니다"
            >
              {snap.turbo ? "건너뛰는 중…" : "⏭ 결정까지"}
            </button>
          </div>
        </div>
        <button className={`btn btn-ghost ${follow ? "on" : ""}`} onClick={() => setFollow(!follow)}>
          🎥 자동 추적 {follow ? "ON" : "OFF"}
        </button>
        <button
          className={`btn btn-ghost publish-btn ${publishResult?.notion.ok || publishResult?.discord.ok ? "sent" : ""}`}
          onClick={onPublish}
          disabled={publishBusy}
          title="연동된 보관함으로 완료 보고를 발행합니다"
        >
          {publishBusy ? "발행 중…" : "📤 보고 발행"}
        </button>
        <div className="live-progress">
          <span>
            {snap.phase} · {progress}%
          </span>
          <i>
            <b style={{ width: `${progress}%` }} />
          </i>
        </div>
        <div className="live-counts">
          <span className="lc on-duty">근무 {onDuty}</span>
          <span className="lc done">완료 {snap.stats.done}</span>
          <span className="lc working">진행 {snap.stats.working}</span>
          <span className="lc blocked">연동대기 {snap.stats.blocked}</span>
        </div>
      </section>

      <section className="live-grid">
        <OfficeWorld engine={engine} snap={snap} selectedId={selectedId} follow={follow} onSelect={onSelect} />

        <aside className="live-rail">
          <CeoConsole engine={engine} snap={snap} busy={taskBusy} onCreateTask={onCreateTask} />

          <TaskDesk tasks={tasks} onApprove={onApproveTask} />

          <section className="win rail-card" id="ceo-approval">
            <div className="win-bar">
              <span>✅ ceo.approval</span>
              <span className="window-controls">—　▢　✕</span>
            </div>
            <div className={`win-body approval-body ${snap.approvalPending ? "pending" : ""}`}>
              {snap.approvalPending ? (
                <>
                  <div className="approval-top">
                    <span className="mini-badge yellow">우선 CASE 1건</span>
                    <span className="score blink">결재 대기</span>
                  </div>
                  <h3>행사 맞춤 제안서·견적·회신 초안을 승인할까요?</h3>
                  <p>회의실에서 제안서팀장·메일 QA팀장·비서실장이 여혜린 대표님을 기다리고 있어요.</p>
                  <div className="reason-list">
                    <span>① 행사 조건 확인</span>
                    <span>② 금액·부가세·첨부 검수</span>
                    <span>③ 승인 후 계약 진행</span>
                  </div>
                  <button className="btn approve-button" onClick={onApprove}>
                    이 CASE 승인하기
                  </button>
                </>
              ) : (
                <>
                  <div className="approval-top">
                    <span className="mini-badge mint">{snap.approved ? "오늘 결재 완료" : "결재 대기 없음"}</span>
                  </div>
                  <h3>{snap.approved ? "승인하신 CASE를 후속 진행 중이에요" : "아직 올라온 안건이 없어요"}</h3>
                  <p>
                    {snap.approved
                      ? "디렉터 확인 후 파트너십 → 아틀리에 → 캠페인 시연안으로 이어집니다."
                      : "업무를 시작하면 VIP 응대·비스포크·톤앤매너팀이 시연 안건을 회의실로 올려요."}
                  </p>
                </>
              )}
            </div>
          </section>

          <section className="win rail-card feed-card">
            <div className="win-bar">
              <span>📡 live.feed</span>
              <span className="window-controls">—　▢　✕</span>
            </div>
            <div className="win-body feed-body">
              {snap.meetingTitle ? <div className="feed-now">💬 회의 진행 중 — {snap.meetingTitle}</div> : null}
              <ul className="feed-list">
                {snap.log.map((entry) => (
                  <li key={entry.id} className={entry.tone}>
                    <b>{entry.time}</b>
                    <i>{entry.icon}</i>
                    <span>{entry.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="win rail-card">
            <div className="win-bar">
              <span>👥 staff.roster</span>
              <span className="window-controls">—　▢　✕</span>
            </div>
            <div className="win-body roster-body">
              {DEPT_ROOMS.map((room) => (
                <div className="roster-dept" key={room.id}>
                  <p>
                    <b>
                      {room.icon} {room.name}
                    </b>
                    <i className={`rm-dot ${statusClass[snap.deptStatus[room.id] ?? "대기"]}`} />
                  </p>
                  <div className="roster-chips">
                    {STAFF.filter((s) => s.deptId === room.id).map((seed) => {
                      const agent = engine.agentById.get(seed.id);
                      return (
                        <button
                          key={seed.id}
                          className={`roster-chip ${selectedId === seed.id ? "on" : ""}`}
                          onClick={() => agent && onSelect(agent)}
                        >
                          <i style={{ background: seed.shirt, borderColor: seed.hair }} />
                          {seed.name}
                          <small>{agent?.status ?? "출근 전"}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </>
  );
}

const QUICK_ORDERS = [
  { label: "현황 보고", command: "현황 보고해줘" },
  { label: "왜 늦어져?", command: "왜 늦어지고 있어?" },
  { label: "회의 소집", command: "전 부서 회의 소집" },
  { label: "지금 브리핑", command: "지금 브리핑 올라와" },
  { label: "집중 모드", command: "집중 모드" },
  { label: "속도 올려", command: "속도 좀 올려줘" },
];

function CeoConsole({ engine, snap, busy, onCreateTask }: { engine: Company; snap: Snapshot; busy: boolean; onCreateTask: (instruction: string) => Promise<void> }) {
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const count = snap.chat.length;

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    if (/현황|왜 늦|회의 소집|지금 브리핑|집중 모드|속도/.test(value)) engine.command(value);
    else void onCreateTask(value);
    setDraft("");
  };

  return (
    <section className="win rail-card console-card" id="ceo-console">
      <div className="win-bar">
        <span>🎤 ceo.console — 대표 지시창</span>
        <span className="window-controls">—　▢　✕</span>
      </div>
      <div className="win-body console-body">
        <div className="console-status">
          <span className={`mini-badge ${snap.focusMode ? "yellow" : "mint"}`}>
            {snap.focusMode ? "집중 모드 ON" : "평시 운영"}
          </span>
          {busy || snap.busyWithOrder ? <span className="mini-badge lav">실제 Task 처리 중…</span> : null}
        </div>

        <div className="console-log" ref={logRef}>
          {snap.chat.map((entry) => (
            <div key={entry.id} className={`console-line ${entry.from}`}>
              <b>{entry.from === "ceo" ? "대표님" : entry.name}</b>
              <p>{entry.text}</p>
              <small>{entry.time}</small>
            </div>
          ))}
        </div>

        <div className="console-quick">
          {QUICK_ORDERS.map((item) => (
            <button key={item.label} onClick={() => send(item.command)}>
              {item.label}
            </button>
          ))}
        </div>

        <form
          className="console-input"
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="예: 캐러셀팀 지금 뭐해? / 왜 늦어져?"
            aria-label="대표 지시 입력"
          />
          <button type="submit" disabled={busy}>{busy ? "실행 중" : "Task 실행"}</button>
        </form>
      </div>
    </section>
  );
}

function TaskDesk({ tasks, onApprove }: { tasks: WorkTask[]; onApprove: (id: number) => Promise<void> }) {
  return (
    <section className="win rail-card task-desk">
      <div className="win-bar"><span>🧾 real.tasks — 실제 업무 기록</span><span className="window-controls">—　▢　✕</span></div>
      <div className="win-body">
        {tasks.length === 0 ? <p className="task-empty">대표 지시창에 업무를 입력하면 서버 Task가 생성됩니다.</p> : tasks.slice(0, 6).map((task) => (
          <article className={`real-task ${task.status}`} key={task.id}>
            <div><b>#{task.id} · {task.department}</b><span>{task.status === "approval" ? "승인 대기" : task.status === "blocked" ? "연동 대기" : "완료"}</span></div>
            <small>{task.assignee} · {task.instruction}</small>
            <details><summary>실제 처리 기록·결과 보기</summary><ol>{task.toolLog.map((item) => <li key={item}>{item}</li>)}</ol><pre>{task.result}</pre></details>
            {task.status === "approval" ? <button className="btn approve-button" onClick={() => void onApprove(task.id)}>이 결과 승인</button> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileModal({
  agent,
  onClose,
  onAsk,
}: {
  agent: Agent;
  onClose: () => void;
  onAsk: (agent: Agent) => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="win team-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${agent.name} 프로필`}
      >
        <div className="win-bar">
          <span>👤 employee_profile.exe</span>
          <button className="window-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="win-body employee-profile">
          <div className="profile-top">
            <PixelEmployee hair={agent.hair} shirt={agent.shirt} accent={agent.accent} />
            <div>
              <span className="status-pill working">{agent.status}</span>
              <h2>
                {agent.name}
                {agent.callsign ? <small> · {agent.callsign}</small> : null}
              </h2>
              <p>{agent.role}</p>
            </div>
          </div>
          <div className="profile-task">
            <span className="tiny-label">지금 하는 일</span>
            <strong>{agent.taskLabel}</strong>
            {agent.anim === "type" ? (
              <span className="profile-progress">
                <i style={{ width: `${Math.round(agent.progress * 100)}%` }} />
              </span>
            ) : null}
          </div>
          <div className="report-box">
            <span className="tiny-label">한마디</span>
            <strong>{agent.speech ?? agent.thoughts[0]}</strong>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => onAsk(agent)}>
              🎤 지금 뭐 하는지 물어보기
            </button>
            <button className="text-button" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function BriefingModal({ snap, onClose }: { snap: Snapshot; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="win team-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="BELiOR 비서실 브리핑"
      >
        <div className="win-bar">
          <span>📋 director_hq.brief</span>
          <button className="window-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="win-body">
          <p className="brief-date">{snap.clock} · BELiOR 비서실장 시연 브리핑</p>
          <h3>디렉터님, 시연 흐름이 정리됐어요.</h3>
          <ul>
            <li>
              <span className="dot green" />
              완료 {snap.stats.done}팀 — VIP 응대·제안·브랜드 경험·캠페인 시연을 마쳤어요
            </li>
            <li>
              <span className="dot green" />
              시연안 승인 반영 — 아틀리에·캠페인 흐름 확인 완료
            </li>
            <li>
              <span className="dot gray" />
              연동 대기 {snap.stats.blocked}팀 — 외부 서비스 연결이 필요해요
            </li>
          </ul>
          <div className="decision-box">
            <span className="tiny-label">오늘 대표님이 결정할 것</span>
            <strong>실제 고객 조건과 제품 사양을 확인해 주세요.</strong>
          </div>
          <button className="btn btn-primary" onClick={onClose}>
            확인
          </button>
        </div>
      </section>
    </div>
  );
}

type TeamRow = {
  id: string;
  icon: string;
  name: string;
  room: string;
  lead: (typeof DEPT_LEAD)[string];
  status: DeptStatus;
  task: string;
  report: string;
};

function DashboardView({
  teams,
  filteredTeams,
  filter,
  setFilter,
  snap,
  onStart,
  onApprove,
  onSelect,
  integrations,
  publishResult,
}: {
  teams: TeamRow[];
  filteredTeams: TeamRow[];
  filter: "전체" | DeptStatus;
  setFilter: (value: "전체" | DeptStatus) => void;
  snap: Snapshot;
  onStart: () => void;
  onApprove: () => void;
  onSelect: (id: string) => void;
  integrations: IntegrationStatus | null;
  publishResult: PublishResult | null;
}) {
  // 서버가 알려준 실제 설정 상태로 표시한다 (연결됐다고 거짓 보고하지 않는다)
  const liveRows = integrations
    ? [
        {
          name: "Notion 저장",
          status: publishResult?.notion.ok
            ? "저장 성공"
            : integrations.notion?.configured
              ? "키 설정됨"
              : "키 미설정",
          tone: publishResult?.notion.ok ? "mint" : integrations.notion?.configured ? "yellow" : "lav",
          href: "",
        },
        {
          name: "Discord 전송",
          status: publishResult?.discord.ok
            ? "전송 성공"
            : integrations.discord?.configured
              ? "웹훅 설정됨"
              : "웹훅 미설정",
          tone: publishResult?.discord.ok ? "mint" : integrations.discord?.configured ? "yellow" : "lav",
          href: "",
        },
        { name: "Instagram", status: integrations.instagram?.need ?? "연동 대기", tone: "lav", href: "" },
        { name: "Gmail", status: integrations.gmail?.need ?? "연동 대기", tone: "lav", href: "" },
        { name: "재무 파일", status: integrations.finance?.need ?? "자료 대기", tone: "lav", href: "" },
      ]
    : [];
  const rows = [...integrations2Static, ...liveRows];

  return (
    <>
      <header className="win hero">
        <div className="win-bar">
          <span>🎀 {COMPANY.windowLabel}</span>
          <span className="window-controls" aria-hidden="true">
            —　▢　✕
          </span>
        </div>
        <div className="hero-body">
          <div className="hero-copy">
            <p className="eyebrow">TODAY · 07:00 AUTO START</p>
            <h1>
              오늘 회사가 어떻게 움직이는지 <em className="highlight">한눈에</em> 보여드려요
            </h1>
            <p>{teams.length}개 팀의 시연 흐름에서 VIP 문의, 비스포크 제안, 아틀리에, 컬렉션 기획까지 살펴보세요.</p>
          </div>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onStart} disabled={snap.running}>
              {snap.running ? "AI 팀원들이 근무 중…" : "오늘 업무 시작하기"}
            </button>
            <span className="trust-copy">실제 전송·게시·결제는 대표 승인 후 진행해요</span>
          </div>
        </div>
      </header>

      <section className="summary-grid" aria-label="오늘 업무 요약">
        <article className="metric yellow">
          <span>AI 직원</span>
          <strong>32</strong>
          <small>STAFF</small>
        </article>
        <article className="metric mint">
          <span>완료</span>
          <strong>{snap.stats.done}</strong>
          <small>DONE</small>
        </article>
        <article className="metric pink">
          <span>진행 중</span>
          <strong>{snap.stats.working}</strong>
          <small>WORKING</small>
        </article>
        <article className="metric lav">
          <span>대표 확인</span>
          <strong>{snap.stats.approval}</strong>
          <small>APPROVAL</small>
        </article>
        <article className="metric white">
          <span>연동 대기</span>
          <strong>{snap.stats.blocked}</strong>
          <small>WAITING</small>
        </article>
      </section>

      <section className="workspace">
        <aside className="side-stack">
          <section className="win">
            <div className="win-bar">
              <span>⚡ automation.status</span>
              <span className="window-controls">—　▢　✕</span>
            </div>
            <div className="win-body">
              <div className="schedule-card">
                <div>
                  <span className="tiny-label">NEXT RUN</span>
                  <strong>매일 오전 7:00</strong>
                  <p>컴퓨터 지시 없이 하루 업무 시작</p>
                </div>
                <span className="toggle-on">ON</span>
              </div>
              <div className="flow-list">
                {PHASES.slice(1, 12).map((item, index) => (
                  <div className={`flow-row ${snap.phaseIndex > index + 1 ? "past" : ""}`} key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{item}</b>
                    <i>{snap.phaseIndex === index + 1 ? "●" : snap.phaseIndex > index + 1 ? "✓" : "·"}</i>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="win">
            <div className="win-bar">
              <span>🔗 integrations.link</span>
              <span className="window-controls">—　▢　✕</span>
            </div>
            <div className="win-body integration-list">
              {rows.map((item) =>
                item.href ? (
                  <a key={item.name} href={item.href} target="_blank" rel="noreferrer" className="integration-row">
                    <b>{item.name}</b>
                    <span className={`mini-badge ${item.tone}`}>{item.status}</span>
                  </a>
                ) : (
                  <div key={item.name} className="integration-row">
                    <b>{item.name}</b>
                    <span className={`mini-badge ${item.tone}`}>{item.status}</span>
                  </div>
                ),
              )}
            </div>
          </section>
        </aside>

        <div className="main-stack">
          <section className="win">
            <div className="win-bar">
              <span>🏢 team_office.board</span>
              <span className="window-controls">—　▢　✕</span>
            </div>
            <div className="win-body">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">LIVE OFFICE</p>
                  <h2>{teams.length}개 부서 · 팀장 {teams.length}명 근무 현황</h2>
                </div>
                <div className="filter-tabs" role="group" aria-label="팀 상태 필터">
                  {(["전체", "진행 중", "완료", "승인 대기", "연동 대기"] as const).map((item) => (
                    <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="team-grid">
                {filteredTeams.map((team) => (
                  <button className="team-card" key={team.id} onClick={() => onSelect(team.lead.id)}>
                    <span className={`status-dot ${statusClass[team.status]}`} aria-hidden="true" />
                    <span className="mini-pixel">
                      <PixelEmployee hair={team.lead.hair} shirt={team.lead.shirt} accent={team.lead.accent} />
                    </span>
                    <span className="team-copy">
                      <b>
                        {team.lead.name} · {team.name}
                      </b>
                      <small>{team.task}</small>
                    </span>
                    <span className={`status-pill ${statusClass[team.status]}`}>{team.status}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="two-col">
            <section className="win">
              <div className="win-bar">
                <span>✅ ceo.approval</span>
                <span className="window-controls">—　▢　✕</span>
              </div>
              <div className="win-body approval-body">
                <div className="approval-top">
                  <span className="mini-badge yellow">우선 CASE 1건</span>
                  <span className="score">결재</span>
                </div>
                <h3>
                  행사 맞춤 제안서와 회신을
                  <br />
                  승인할까요?
                </h3>
                <p>행사 조건·금액·부가세·첨부파일과 회신 이력을 검수한 CASE입니다.</p>
                <button
                  className={`btn approve-button ${snap.approved ? "approved" : ""}`}
                  onClick={onApprove}
                  disabled={!snap.approvalPending}
                >
                  {snap.approved ? "승인 완료 · 후속팀 전달됨" : snap.approvalPending ? "이 CASE 승인하기" : "대기 중인 안건 없음"}
                </button>
              </div>
            </section>

            <section className="win secretary">
              <div className="win-bar">
                <span>📋 kim_secretary.brief</span>
                <span className="window-controls">—　▢　✕</span>
              </div>
              <div className="win-body">
                <p className="brief-date">2026.07.26 · {snap.clock} 현재</p>
                <h3>{snap.dayComplete ? "디렉터님, 시연 흐름이 정리됐어요." : "디렉터님, 현재 시연 상황이에요."}</h3>
                <ul>
                  <li>
                    <span className="dot green" />
                    {snap.phase} 진행 중 — 완료 {snap.stats.done}팀
                  </li>
                  <li>
                    <span className={`dot ${snap.approvalPending ? "yellow" : "green"}`} />
                    {snap.approvalPending ? "우선 CASE 1건 대표 확인 필요" : "대기 중인 결재 없음"}
                  </li>
                  <li>
                    <span className="dot gray" />
                    외부 서비스 연동 대기
                  </li>
                </ul>
                <div className="decision-box">
                  <span className="tiny-label">디렉터 확인 안건</span>
                  <strong>
                    {snap.approvalPending
                      ? "비스포크 시연안을 확인해 주세요. 실제 발송은 별도입니다."
                      : snap.approved
                        ? "시연안 확인 완료! 아틀리에·캠페인팀이 움직입니다."
                        : "아직 올라온 안건이 없어요."}
                  </strong>
                </div>
              </div>
            </section>
          </section>
        </div>
      </section>

      <section className="win storage">
        <div className="win-bar">
          <span>📦 result_storage</span>
          <span className="window-controls">—　▢　✕</span>
        </div>
        <div className="win-body">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECENT OUTPUTS</p>
              <h2>결과물 창고</h2>
            </div>
            {STORAGE_LINK ? (
              <a className="btn btn-small" href={STORAGE_LINK} target="_blank" rel="noreferrer">
                보관함 열기
              </a>
            ) : null}
          </div>
          <div className="result-table">
            <div className="result-row header">
              <span>결과물</span>
              <span>담당팀</span>
              <span>상태</span>
              <span>바로가기</span>
            </div>
            <div className="result-row">
              <b>VIP 기프트 비스포크 시연안</b>
              <span>비스포크 제안팀</span>
              <span className="status-pill done">시연용</span>
              <span>—</span>
            </div>
            <div className="result-row">
              <b>아틀리에 큐시트·캠페인 콘셉트</b>
              <span>오프라인 아틀리에·시네마틱 캠페인팀</span>
              <span className="status-pill done">시연용</span>
              <span>—</span>
            </div>
          </div>
        </div>
      </section>

      <p className="dash-note">
        {CEO.name}({CEO.callsign}) · {teams.length}개 부서 {STAFF.length}명 · 이 화면은 라이브 오피스와 같은 시연 상태를
        공유해요.
      </p>
    </>
  );
}
