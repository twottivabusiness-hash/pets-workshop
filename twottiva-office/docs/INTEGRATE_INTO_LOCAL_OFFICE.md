# Integrate the autonomous staff engine into the existing TWOTTIVA pixel office

Do not redesign the UI. The existing pixel office remains the main screen.

## Files to merge
- `src/office/employees.ts`: canonical 32-person operating model.
- `src/office/daily-engine.ts`: autonomous task generation + CEO brief cap.
- `src/office/simulation.ts`: real TASK state -> pixel character state/room/station.

## Required runtime wiring
1. On worker tick (hourly or event-driven), load current CASEs, events, KPI metrics, Gmail/Drive normalized changes.
2. Call `generateAutonomousTasks(state)`.
3. Before insert, dedupe against open tasks by `(employee_id, title, case_id)` and an idempotency key for the tick.
4. Persist tasks to the central task table. Do not create CEO todos for delegated work.
5. Build the CEO brief with `buildCEOBrief(openTasks, cases)`. Hard cap: 3 CEO decisions.
6. Create a simulation snapshot with `officeSimulationSnapshot(employeeIds, openTasks)`.
7. Existing pixel characters must render from this snapshot. No `dayScript()` random movement may override task-driven movement.
8. Character click panel reads the same task/case from the DB.
9. Department pages are drill-down views only; they do not require manual input to start work.
10. CEO Console is override/priority/approval only. It must not be the normal source of daily tasks.

## Event triggers
- Gmail new inquiry/reply -> normalize event -> CASE update/create -> planner tick.
- Drive new/changed relevant file -> normalize event -> CASE link -> planner tick.
- CEO command -> route to an employee/team task via secretary.hq; never add all substeps to CEO todo.
- Task completed -> persist RESULT/EVIDENCE/NEXT_ACTION/OWNER+DEADLINE -> create downstream handoff if applicable.
- Approval required -> only one compact CEO approval item.

## CEO workload invariant
`CEO_TODO_COUNT <= 3` for normal daily operations.

Anything an employee can research, draft, classify, compare, QA, schedule, record, or prepare is delegated automatically and must not appear as a CEO task.

## Acceptance test
Use one real active CASE and show this end-to-end without manual form filling:

`data detected -> task auto-created -> named employee assigned -> pixel character moves -> task executes -> result saved -> case updated -> handoff to next team -> character moves -> only true approval reaches CEO`

If the test requires the CEO to type target/event/topic data already available in Drive, Gmail, CASEs, or pipeline, it fails.
