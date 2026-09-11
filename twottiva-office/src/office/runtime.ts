/**
 * TWOTTIVA AI Office — TASK 기반 상태 엔진 (dayScript 대체)
 *
 * 기존 픽셀 오피스는 dayScript()가 시간표에 따라 캐릭터를 랜덤/고정 이동시켰다.
 * 이 런타임은 그 자리를 대신한다. 캐릭터의 방·자리·말풍선은 오직
 * 중앙 TASK 상태에서만 파생된다. TASK가 없으면 캐릭터는 움직이지 않는다.
 *
 * 계약:
 *   runtime.tick(state)            -> 데이터 변화 감지 → TASK 자동 생성 → 담당자 배정
 *   runtime.snapshot()             -> 32명 전원의 PixelAgentState (캐릭터 위치)
 *   runtime.start(taskId)          -> queued → working (캐릭터 이동)
 *   runtime.complete(taskId, done) -> working → completed + 다음 부서 인계 TASK 생성
 *   runtime.ceoBrief()             -> 대표 할 일. 항상 3건 이하.
 */
import { EMPLOYEES, EMPLOYEE_BY_ID, EmployeeRule } from './employees';
import { OfficeTask, OfficeState, generateAutonomousTasks, buildCEOBrief } from './daily-engine';
import { PixelAgentState, taskToPixelState, officeSimulationSnapshot } from './simulation';
import { generateTargetTasks, backcast, gapReport } from './targets';

export const CEO_TODO_MAX = 3;

/** 완료 4필드. 하나라도 비면 completed로 넘어가지 않는다. */
export type TaskResult = {
  result: string;
  evidence: string[];
  nextAction: string;
  ownerDeadline: string;
};

export type HandoffRecord = {
  fromTask: string;
  fromEmployee: string;
  fromTeam: string;
  toEmployee: string;
  toTeam: string;
  newTask: string;
  caseId?: string;
};

/** 팀의 대표 수신자 = 그 팀에서 첫 번째로 정의된 사람(팀장). */
const TEAM_LEAD: Record<string, EmployeeRule> = (() => {
  const m: Record<string, EmployeeRule> = {};
  for (const e of EMPLOYEES) if (!m[e.team]) m[e.team] = e;
  return m;
})();

export class OfficeRuntime {
  tasks: OfficeTask[] = [];
  handoffs: HandoffRecord[] = [];
  private state: OfficeState;
  private seq = 0;

  constructor(state: OfficeState) { this.state = state; }

  /**
   * 시간당 1회. 중앙 데이터를 다시 분석하지 않고 변화분만 큐에 넣는다.
   * CASE에서 파생된 TASK와 월 수주 목표에서 역산된 TASK를 함께 넣는다.
   */
  tick(state?: OfficeState): OfficeTask[] {
    if (state) this.state = state;
    const generated = [...generateAutonomousTasks(this.state), ...generateTargetTasks(this.state)];
    const known = new Set(this.tasks.map(t => `${t.employeeId}:${t.title}`));
    const fresh = generated.filter(t => !known.has(`${t.employeeId}:${t.title}`));
    this.tasks.push(...fresh);
    return fresh;
  }

  byEmployee(employeeId: string): OfficeTask[] {
    return this.tasks.filter(t => t.employeeId === employeeId);
  }

  get(taskId: string): OfficeTask {
    const t = this.tasks.find(x => x.id === taskId);
    if (!t) throw new Error(`unknown task: ${taskId}`);
    return t;
  }

  /** queued → working. 캐릭터가 자기 자리에서 담당 업무실로 이동한다. */
  start(taskId: string, caseId?: string): OfficeTask {
    const t = this.get(taskId);
    t.status = 'working';
    if (caseId) t.caseId = caseId;
    return t;
  }

  block(taskId: string, why: string): OfficeTask {
    const t = this.get(taskId);
    t.status = 'blocked';
    t.nextAction = why;
    return t;
  }

  /** 외부 승인이 필요한 TASK. 대표 결재함으로만 올라간다. */
  requestApproval(taskId: string, reason: string): OfficeTask {
    const t = this.get(taskId);
    t.status = 'approval_required';
    t.approvalRequired = true;
    t.nextAction = reason;
    return t;
  }

  /**
   * working → completed. 완료 4필드가 모두 있어야 한다.
   * 완료 즉시 employees.ts의 handoffTo를 읽어 다음 부서 TASK를 만든다.
   */
  complete(taskId: string, done: TaskResult): { task: OfficeTask; handoffs: HandoffRecord[] } {
    const t = this.get(taskId);
    const missing = (['result','evidence','nextAction','ownerDeadline'] as const)
      .filter(k => !done[k] || (Array.isArray(done[k]) && (done[k] as string[]).length === 0));
    if (missing.length) throw new Error(`완료 4필드 누락 (${missing.join(', ')}) — ${t.title}`);

    t.status = 'completed';
    t.result = done.result;
    t.evidence = done.evidence;
    t.nextAction = done.nextAction;

    const me = EMPLOYEE_BY_ID[t.employeeId];
    const made: HandoffRecord[] = [];
    for (const team of me.handoffTo) {
      if (team === 'CEO' || team === 'all teams') continue;
      const to = TEAM_LEAD[team];
      if (!to) continue;
      const next: OfficeTask = {
        id: `task_handoff_${++this.seq}`,
        employeeId: to.id, team: to.team,
        title: `[인계] ${t.title}`,
        instructions: `${me.name}(${me.title}) 완료분 인계. 결과: ${done.result} / 다음 행동: ${done.nextAction}`,
        priority: t.priority, source: 'case',
        approvalRequired: false, status: 'queued',
        caseId: t.caseId, dueAt: done.ownerDeadline,
      };
      this.tasks.push(next);
      const rec: HandoffRecord = {
        fromTask: t.id, fromEmployee: me.name, fromTeam: me.team,
        toEmployee: to.name, toTeam: to.team, newTask: next.id, caseId: t.caseId,
      };
      this.handoffs.push(rec); made.push(rec);
    }
    return { task: t, handoffs: made };
  }

  /** 32명 전원의 캐릭터 위치. 활성 TASK가 없는 사람은 자기 부서 자기 자리에 idle. */
  snapshot(): PixelAgentState[] {
    return officeSimulationSnapshot(EMPLOYEES.map(e => e.id), this.tasks);
  }

  agent(employeeId: string): PixelAgentState {
    const s = this.snapshot().find(a => a.employeeId === employeeId);
    if (!s) throw new Error(`unknown employee: ${employeeId}`);
    return s;
  }

  /** 이번 달 목표 대비 현황. 확정 계약만 집계하고 파이프라인은 분리한다. */
  targetStatus() {
    return { backcast: backcast(this.state.now, this.state.metrics),
             gap: gapReport(this.state.now, this.state.cases) };
  }

  /** 대표 할 일. 3건 초과는 엔진이 잘라낸다 — 김세리의 규칙을 코드로 강제. */
  ceoBrief() {
    const brief = buildCEOBrief(this.tasks, this.state.cases);
    if (brief.ceoTodoCount > CEO_TODO_MAX) {
      brief.decisions = brief.decisions.slice(0, CEO_TODO_MAX);
      brief.ceoTodoCount = brief.decisions.length;
    }
    return brief;
  }
}

export { taskToPixelState };
export type { PixelAgentState, OfficeTask, OfficeState };

// 픽셀 오피스에서 바로 쓰도록 재수출
export { EMPLOYEES, EMPLOYEE_BY_ID } from './employees';
export { generateAutonomousTasks, buildCEOBrief } from './daily-engine';
export { officeSimulationSnapshot } from './simulation';
export { MONTHLY_TARGETS, DEFAULT_LADDER, backcast, gapReport, generateTargetTasks } from './targets';
