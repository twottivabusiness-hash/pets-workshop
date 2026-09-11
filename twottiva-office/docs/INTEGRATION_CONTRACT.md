# TWOTTIVA AI Office — Integration Contract

## Non-negotiable behavior

The CEO can work from ChatGPT or the AI Office web UI. Both surfaces must operate on the same cases, tasks, approvals and event history.

### Chat -> Office
Every substantive CEO instruction should be representable as `dispatch_task` and immediately persisted. The web dashboard must show it without manual copying.

### Office -> Chat
Before continuing an existing business case, ChatGPT should be able to call `get_case_context` / `get_office_pulse` and receive all changes made by workers or the web UI since the previous interaction.

### Offline operation
Browser tabs are irrelevant to execution. The worker service polls/claims queued or scheduled tasks and continues work while the CEO is offline.

### Employee model
Employees are stable identities with role, department and capabilities. They do not have isolated truth stores. Their working memory is derived from the shared case, task and event records.

## MCP tools exposed by the office backend

- `get_office_pulse(since?)`
- `get_case_context(case_id | external_key)`
- `dispatch_task(case_id?, employee_id?, instructions, approval_required?)`
- `list_tasks(status?, employee_id?)`
- `record_event(source, actor, event_type, case_id?, task_id?, payload)`
- `request_approval(task_id, action_type, preview)`
- `approve_action(approval_id)`
- `reject_action(approval_id, reason?)`

## Adapter rules

### Gmail / Drive
Inbound mail and document changes are normalized into office events and linked to a case. Drafting may be automatic. Sending external email requires CEO approval unless a policy explicitly permits the exact class of message.

### Monday CRM
CRM activity is a projection of office state. Case/stage changes must be written to the office first, then synchronized to Monday. Do not let CRM become a competing source of truth.

### Postiz
Content plans and assets live as tasks/case artifacts. Publishing is an adapter action and follows approval policy.

## 24/7 execution loop

1. Claim due task atomically.
2. Load case context + latest events.
3. Select employee/tool adapter from capability policy.
4. Execute bounded step.
5. Persist result/event before any next step.
6. If external/high-impact action requires approval, create approval and stop that branch.
7. Otherwise enqueue the next task and continue.
8. Retry transient failures with idempotency keys; never duplicate outbound actions.

## Required UI changes

The existing AI Office UI should read these endpoints rather than local/static employee state. Every employee card should display current task, case, last event and status from the shared backend. Add an Activity Stream and Approval Inbox. Add a ChatGPT-origin badge to tasks dispatched from chat.
