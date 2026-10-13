import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  instruction: text("instruction").notNull(),
  department: text("department").notNull(),
  assignee: text("assignee").notNull(),
  kind: text("kind").notNull(),
  status: text("status").notNull().default("working"),
  result: text("result").notNull().default(""),
  toolLog: text("tool_log").notNull().default("[]"),
  approvalRequired: integer("approval_required", { mode: "boolean" }).notNull().default(false),
  approvedAt: text("approved_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
