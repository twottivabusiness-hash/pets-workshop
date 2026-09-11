/**
 * 장애 4 검증 — 목표와 실제 TASK의 연결
 * 월 수주 목표 → 역산 행동량 → 주간 할당량 → 실명 TASK 까지 끊기지 않는지 확인한다.
 */
import { OfficeRuntime } from '../src/office/runtime';
import { MONTHLY_TARGETS, backcast, gapReport } from '../src/office/targets';
import { EMPLOYEE_BY_ID } from '../src/office/employees';
import type { OfficeState } from '../src/office/daily-engine';

let fails = 0;
const check = (label: string, ok: boolean, detail = '') => {
  if (!ok) fails++;
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${label}${detail ? ' — ' + detail : ''}`);
};
const man = (n: number) => `${(n / 10000).toLocaleString()}만원`;

console.log('\n═══ 장애 4 — 목표 ↔ TASK 연결 검증 ═══\n');

// ── 1. 대표 지정 목표가 그대로 들어있는가 ────────────────────────────────
console.log('[1] 월별 수주 목표');
for (const t of MONTHLY_TARGETS)
  console.log(`      ${t.month}월  ${t.wonMin === t.wonMax ? t.wonMin : `${t.wonMin}~${t.wonMax}`}건  ${man(t.valueMin)}~${man(t.valueMax)}`);
check('9~12월 4개월 목표 등록', MONTHLY_TARGETS.length === 4);
check('목표가 월마다 증가', MONTHLY_TARGETS.every((t, i, a) => i === 0 || t.wonMax >= a[i-1].wonMax));

// ── 2. 역산 ─────────────────────────────────────────────────────────────
console.log('\n[2] 역산 — 수주 목표 → 필요 행동량');
for (const m of [9, 10, 11, 12]) {
  const bc = backcast(new Date(2026, m - 1, 1))!;
  console.log(`      ${m}월 수주 ${bc.wonTarget}건 ← 제안 ${bc.monthly.proposal} ← 상담 ${bc.monthly.consult} ← 리드 ${bc.monthly.lead} ← 조사 ${bc.monthly.research}  (${bc.ladderSource})`);
}
const dec = backcast(new Date(2026, 11, 1))!;
check('12월 6건 → 제안 18 / 상담 30 / 리드 60 / 조사 120',
  dec.monthly.proposal === 18 && dec.monthly.consult === 30 && dec.monthly.lead === 60 && dec.monthly.research === 120);

// ── 3. 실측 전환율이 오면 추정을 덮어쓰는가 ──────────────────────────────
console.log('\n[3] 강성아 실측 전환율 반영');
const measured = backcast(new Date(2026, 11, 1),
  { ladder_proposal: 4, ladder_consult: 7, ladder_lead: 14, ladder_research: 28 })!;
console.log(`      실측 적용 시 12월: 제안 ${measured.monthly.proposal} / 상담 ${measured.monthly.consult} / 리드 ${measured.monthly.lead} / 조사 ${measured.monthly.research}`);
check('실측값이 기본 사다리를 덮어씀', measured.monthly.proposal === 24 && measured.ladderSource === '실측');
check('실측 없으면 추정으로 표시', dec.ladderSource === '추정');

// ── 4. 수주 집계 규칙 — 계약서/예약금 확인 건만 ─────────────────────────
console.log('\n[4] 수주 집계 규칙');
const now = new Date('2026-09-11T09:00:00+09:00');
const cases = [
  { id:'A', status:'won', value:3_000_000, contract_signed:true,  won_at:'2026-09-05' },
  { id:'B', status:'won', value:9_900_000, contract_signed:false, deposit_received:false, won_at:'2026-09-06' }, // 구두합의만
  { id:'C', status:'confirmed', value:2_500_000, deposit_received:true, won_at:'2026-09-08' },
  { id:'D', status:'proposal_needed', value:5_400_000, event_date:'2026-11-05' },                                // 파이프라인
];
const g = gapReport(now, cases)!;
console.log(`      확정 ${g.wonConfirmed}건 · ${man(g.valueConfirmed)}   부족 ${g.wonGap}건 · ${man(g.valueGap)}`);
console.log(`      파이프라인 ${g.pipelineCount}건 · ${man(g.pipelineValue)} (계약액 불산입)`);
check('계약서/예약금 확인 건만 수주 집계', g.wonConfirmed === 2, `${g.wonConfirmed}건`);
check('구두합의 990만원은 계약액에서 제외', g.valueConfirmed === 5_500_000, man(g.valueConfirmed));
check('파이프라인은 별도 집계', g.pipelineCount === 1 && g.pipelineValue === 5_400_000);

// ── 5. TASK로 내려가는가 ────────────────────────────────────────────────
console.log('\n[5] 역산 → 실명 TASK');
// 목표 미달 상태 — 확정 1건(300만) + 구두합의 1건 + 파이프라인 1건
const gapCases = [
  { id:'A', status:'won', value:3_000_000, contract_signed:true, won_at:'2026-09-05' },
  { id:'B', status:'won', value:9_900_000, contract_signed:false, deposit_received:false, won_at:'2026-09-06' },
  { id:'D', status:'proposal_needed', value:5_400_000, event_date:'2026-11-05' },
];
const state: OfficeState = { now, cases: gapCases, events: [], metrics: {}, externalChanges: [] };
const rt = new OfficeRuntime(state);
const tasks = rt.tick();
const targetTasks = tasks.filter(t => t.source === 'kpi' && /주간|목표|역산/.test(t.title));
for (const t of targetTasks)
  console.log(`      ${EMPLOYEE_BY_ID[t.employeeId].name.padEnd(4)} ${t.title}`);
check('목표 파생 TASK 생성', targetTasks.length >= 4, `${targetTasks.length}건`);
check('전 TASK에 숫자 할당량 포함', targetTasks.every(t => /\d/.test(t.title) || /\d+건/.test(t.instructions)));
check('본문에 목표·확정·부족이 함께 명시',
  targetTasks.every(t => t.instructions.includes('목표') && t.instructions.includes('부족')));

const lead = targetTasks.find(t => t.employeeId === 'sales.jeong-parang')!;
console.log(`\n      예: ${lead.title}\n         ${lead.instructions}`);
check('정파랑 TASK가 파이프라인 클로징 우선을 명시', lead.instructions.includes('클로징'));
check('파이프라인 금액이 계약액 불산입으로 표기', lead.instructions.includes('불산입'));

// ── 6. 목표 달성 시 행동이 바뀌는가 ──────────────────────────────────────
console.log('\n[6] 목표 달성 시');
const full = [
  { id:'A', status:'won', value:4_000_000, contract_signed:true, won_at:'2026-09-05' },
  { id:'B', status:'won', value:3_500_000, contract_signed:true, won_at:'2026-09-06' },
];
const rt2 = new OfficeRuntime({ now, cases: full, events: [], metrics: {}, externalChanges: [] });
const done = rt2.tick().filter(t => t.source === 'kpi' && /목표/.test(t.title));
const g2 = rt2.targetStatus().gap!;
console.log(`      확정 ${g2.wonConfirmed}건 · ${man(g2.valueConfirmed)} → 부족 ${g2.wonGap}건`);
done.forEach(t => console.log(`      ${EMPLOYEE_BY_ID[t.employeeId].name} ${t.title}`));
check('목표 달성 시 발굴 대신 선행 확보로 전환',
  done.some(t => t.title.includes('선행')) && !done.some(t => t.title.includes('주간 리드')));

console.log(`\n═══ ${fails === 0 ? '전체 통과' : `실패 ${fails}건`} ═══\n`);
process.exit(fails === 0 ? 0 : 1);
