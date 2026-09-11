/**
 * 목표 → 행동량 역산
 *
 * 장애 4: 월 수주 목표가 문서에만 있고 직원 TASK와 연결되지 않던 문제를 없앤다.
 * 수주 목표 건수에서 필요한 제안·상담·리드·조사 건수를 역산하고,
 * 남은 주수로 나눠 주간 할당량이 붙은 TASK를 만든다.
 *
 * 원칙: 계약서 또는 예약금이 확인된 건만 수주로 집계한다.
 *       잠재 문의 금액은 확정 계약액에 포함하지 않는다.
 */
import { EMPLOYEES, EmployeeRule } from './employees';
import type { OfficeTask, OfficeState } from './daily-engine';

export type MonthlyTarget = {
  month: number;          // 1-12
  wonMin: number;         // 수주 건수 하한
  wonMax: number;         // 수주 건수 상한
  valueMin: number;       // 계약액 하한 (원)
  valueMax: number;       // 계약액 상한 (원)
};

/** 대표 지정 목표. 임의로 바꾸지 않는다. */
export const MONTHLY_TARGETS: MonthlyTarget[] = [
  { month:  9, wonMin: 2, wonMax: 2, valueMin:  5_000_000, valueMax:  7_000_000 },
  { month: 10, wonMin: 3, wonMax: 3, valueMin:  8_000_000, valueMax: 10_000_000 },
  { month: 11, wonMin: 4, wonMax: 4, valueMin: 11_000_000, valueMax: 14_000_000 },
  { month: 12, wonMin: 5, wonMax: 6, valueMin: 15_000_000, valueMax: 20_000_000 },
];

/**
 * 퍼널 역산 사다리. 수주 1건을 만들기 위해 각 단계에 필요한 건수.
 * 기본값은 작업 가정이며, 강성아(pipeline.review)가 실측 전환율을 넘기면
 * state.metrics로 덮어쓴다. 실측이 없으면 기본값을 쓰되 추정임을 표시한다.
 */
export const DEFAULT_LADDER = { proposal: 3, consult: 5, lead: 10, research: 20 };

export type Backcast = {
  month: number;
  wonTarget: number;
  valueTarget: number;
  /** 월 전체 필요 행동량 */
  monthly: { proposal: number; consult: number; lead: number; research: number };
  /** 남은 주수로 나눈 주간 할당량 */
  weekly:  { proposal: number; consult: number; lead: number; research: number };
  weeksLeft: number;
  ladderSource: '실측' | '추정';
};

const round = (n: number) => Math.max(1, Math.ceil(n));

export function targetFor(month: number): MonthlyTarget | undefined {
  return MONTHLY_TARGETS.find(t => t.month === month);
}

/** 월말까지 남은 주수. 최소 1. */
export function weeksLeftInMonth(now: Date): number {
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return Math.max(1, Math.ceil((last - now.getDate() + 1) / 7));
}

export function backcast(now: Date, metrics: Record<string, number> = {}): Backcast | null {
  const t = targetFor(now.getMonth() + 1);
  if (!t) return null;

  const measured = ['proposal','consult','lead','research']
    .every(k => typeof metrics[`ladder_${k}`] === 'number' && metrics[`ladder_${k}`] > 0);
  const ladder = measured
    ? { proposal: metrics.ladder_proposal, consult: metrics.ladder_consult,
        lead: metrics.ladder_lead, research: metrics.ladder_research }
    : DEFAULT_LADDER;

  const won = t.wonMax;
  const monthly = {
    proposal: round(won * ladder.proposal),
    consult:  round(won * ladder.consult),
    lead:     round(won * ladder.lead),
    research: round(won * ladder.research),
  };
  const weeksLeft = weeksLeftInMonth(now);
  return {
    month: t.month,
    wonTarget: won,
    valueTarget: t.valueMin,
    monthly,
    weekly: {
      proposal: round(monthly.proposal / weeksLeft),
      consult:  round(monthly.consult  / weeksLeft),
      lead:     round(monthly.lead     / weeksLeft),
      research: round(monthly.research / weeksLeft),
    },
    weeksLeft,
    ladderSource: measured ? '실측' : '추정',
  };
}

export type GapReport = {
  month: number;
  wonConfirmed: number;
  valueConfirmed: number;
  wonGap: number;
  valueGap: number;
  /** 확정이 아닌 진행 중 유효 문의. 계약액에 합산하지 않는다. */
  pipelineCount: number;
  pipelineValue: number;
};

/** 계약서·예약금이 확인된 건만 수주로 센다. */
const isWon = (c: Record<string, any>) =>
  ['won','won_closed','confirmed','delivered'].includes(String(c.status)) &&
  (c.contract_signed === true || c.deposit_received === true);

export function gapReport(now: Date, cases: Array<Record<string, any>>): GapReport | null {
  const t = targetFor(now.getMonth() + 1);
  if (!t) return null;
  const sameMonth = (c: Record<string, any>) => {
    const d = c.won_at || c.contract_date || c.event_date;
    return d ? new Date(d).getMonth() === now.getMonth() : false;
  };

  const wonCases = cases.filter(c => isWon(c) && sameMonth(c));
  const pipeline = cases.filter(c =>
    !isWon(c) && ['lead','qualified','contacted','replied','proposal','proposal_needed','negotiation','verbal_yes'].includes(String(c.status)));

  const valueConfirmed = wonCases.reduce((s, c) => s + Number(c.value || 0), 0);
  return {
    month: t.month,
    wonConfirmed: wonCases.length,
    valueConfirmed,
    wonGap: Math.max(0, t.wonMax - wonCases.length),
    valueGap: Math.max(0, t.valueMin - valueConfirmed),
    pipelineCount: pipeline.length,
    pipelineValue: pipeline.reduce((s, c) => s + Number(c.value || 0), 0),
  };
}

const byName = (name: string): EmployeeRule => {
  const e = EMPLOYEES.find(x => x.name === name);
  if (!e) throw new Error(`Unknown employee: ${name}`);
  return e;
};

let seq = 0;
const make = (e: EmployeeRule, title: string, instructions: string,
              priority: OfficeTask['priority']): OfficeTask => ({
  id: `task_target_${++seq}`, employeeId: e.id, team: e.team, title, instructions,
  priority, source: 'kpi', approvalRequired: false, status: 'queued',
});

const man = (won: number) => `${(won / 10000).toLocaleString()}만원`;

/**
 * 목표에서 직접 파생된 TASK. 숫자 할당량이 본문에 박힌다.
 * 목표를 이미 채웠으면 발굴 TASK 대신 클로징 TASK를 만든다.
 */
export function generateTargetTasks(state: OfficeState): OfficeTask[] {
  const bc = backcast(state.now, state.metrics);
  const gap = gapReport(state.now, state.cases);
  if (!bc || !gap) return [];

  const head = `${bc.month}월 목표 ${bc.wonTarget}건·${man(bc.valueTarget)} / ` +
    `확정 ${gap.wonConfirmed}건·${man(gap.valueConfirmed)} / ` +
    `부족 ${gap.wonGap}건·${man(gap.valueGap)} / 남은 ${bc.weeksLeft}주`;

  const out: OfficeTask[] = [];

  if (gap.wonGap === 0) {
    out.push(make(byName('정파랑'), `${bc.month}월 목표 달성 — 다음 달 선행 확보`,
      `${head}. 이번 달 목표는 채웠다. ${bc.month + 1}월 목표를 위한 선행 리드를 확보한다.`, 'P2'));
  } else {
    out.push(make(byName('정파랑'), `주간 리드 ${bc.weekly.lead}건 확보`,
      `${head}. 이번 주 유효리드 ${bc.weekly.lead}건을 확보한다. ` +
      `파이프라인 ${gap.pipelineCount}건·${man(gap.pipelineValue)}(미확정, 계약액 불산입)의 클로징을 신규 발굴보다 먼저 처리한다. ` +
      `역산 기준 ${bc.ladderSource}.`, 'P1'));
    out.push(make(byName('구예성'), `주간 기업조사 ${bc.weekly.research}건`,
      `${head}. 이번 주 ${bc.weekly.research}개사의 실제 행사 근거·개최시기·담당부서·공식 접점을 확보하고 ` +
      `CONFIRMED/LIKELY/LEAD로 구분한다. 근거 URL 없는 건은 제출하지 않는다.`, 'P2'));
    out.push(make(byName('박보라'), `주간 상담 ${bc.weekly.consult}건 진행`,
      `${head}. 이번 주 상담 ${bc.weekly.consult}건에 대해 행사 목적·참석자·공간·식순 기준으로 ` +
      `적합 편성 방향과 최소 확인 질문을 만든다.`, 'P1'));
    out.push(make(byName('최아름'), `주간 제안서 ${bc.weekly.proposal}건 발행`,
      `${head}. 이번 주 제안서 ${bc.weekly.proposal}건을 내부결재 가능한 구조로 완성한다. ` +
      `견적은 면세 · 전자계산서 발행 기준으로 표기한다.`, 'P1'));
  }

  out.push(make(byName('강성아'), '역산 전환율 실측 갱신',
    `${head}. 실제 조사→리드→상담→제안→수주 전환율을 계산해 metrics.ladder_* 로 갱신한다. ` +
    `현재 역산 기준은 ${bc.ladderSource}(제안 ${bc.monthly.proposal} / 상담 ${bc.monthly.consult} / ` +
    `리드 ${bc.monthly.lead} / 조사 ${bc.monthly.research}).`, 'P1'));

  return out;
}
