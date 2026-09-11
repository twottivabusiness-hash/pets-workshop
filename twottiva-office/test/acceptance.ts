/**
 * 인수 테스트 — 실제 CASE 1건
 * CASE: 20260901_KYEX_20261105_브랜드디너칵테일 (결재함 DB pending 컬렉션 실데이터)
 * 검증: 데이터 감지 → TASK 자동생성 → 지명 직원 배정 → 캐릭터 이동
 *      → 업무 실행 → 결과 저장 → CASE 갱신 → 다음 부서 인계 → 캐릭터 재이동
 *      → 진짜 승인건만 대표에게 도달 (CEO 할 일 ≤ 3)
 */
import { EMPLOYEES, EMPLOYEE_BY_ID } from '../src/office/employees';
import { OfficeRuntime, CEO_TODO_MAX } from '../src/office/runtime';
import type { OfficeState } from '../src/office/daily-engine';

const NOW = new Date('2026-09-10T09:00:00+09:00');
let fails = 0;
const check = (label: string, ok: boolean, detail = '') => {
  if (!ok) fails++;
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${label}${detail ? ' — ' + detail : ''}`);
};
const where = (rt: OfficeRuntime, id: string) => {
  const a = rt.agent(id);
  return `${EMPLOYEE_BY_ID[id].name} @ ${a.room}/${a.station} [${a.status}] "${a.bubble}"`;
};

// ── 실제 CASE 데이터 (결재함 DB에서 그대로) ────────────────────────────────
const KYEX = {
  id: '20260901_KYEX_20261105_브랜드디너칵테일',
  title: 'KYEX 글로벌 럭셔리 브랜드 디너·칵테일',
  status: 'proposal_needed',
  priority: 'P0',
  value: 5_400_000,
  event_date: '2026-11-05',
  due_at: '2026-09-10T18:00:00+09:00',
  next_action: '후속 메일 발송 승인',
  summary: '4중주 2일 540만원 / 3중주 2일 430만원 제시. 후속 메일 초안 09-09 작성 완료, 발송 대기.',
  recommendation: '구성A 4중주 540만원을 기본안으로 발송, 구성B를 대안으로 병기',
  decision_needed: '후속 메일 발송 승인 / 공개 금액 기준 300만·330만 확정',
  담당자: '김나연 과장',
  미확인: ['장소', '예상인원', '리허설', '예산'],
};

const state: OfficeState = {
  now: NOW,
  cases: [KYEX],
  events: [],
  metrics: {},
  externalChanges: [{ type: 'gmail', subject: 'KYEX 회신', caseId: KYEX.id }],
};

console.log('\n═══ TWOTTIVA AI OFFICE — 인수 테스트 ═══');
console.log(`CASE  ${KYEX.id}`);
console.log(`      ${KYEX.title} / ${(KYEX.value/10000).toLocaleString()}만원 / 행사일 ${KYEX.event_date}\n`);

const rt = new OfficeRuntime(state);

// ── 0. 32명 전원 SOP 연결 ────────────────────────────────────────────────
console.log('[0] 직원 로스터 · SOP 연결');
check('employees.ts 32명 정의', EMPLOYEES.length === 32, `${EMPLOYEES.length}명`);
const noSop = EMPLOYEES.filter(e => !e.daily.length || !e.doneWhen.length || !e.never.length);
check('전원 daily/doneWhen/never SOP 보유', noSop.length === 0, `누락 ${noSop.length}명`);
const teams = [...new Set(EMPLOYEES.map(e => e.team))];
check('12개 부서 전원 배치', teams.length === 12, teams.join(', '));

// ── 1. 데이터 감지 → TASK 자동 생성 → 지명 직원 배정 ──────────────────────
console.log('\n[1] tick() — 데이터 감지 → TASK 자동 생성 → 배정');
const fresh = rt.tick();
console.log(`      생성된 TASK ${fresh.length}건 (대표 입력 0회)`);
check('TASK가 자동 생성됨', fresh.length > 0, `${fresh.length}건`);
check('모든 TASK에 실명 담당자 배정', fresh.every(t => !!EMPLOYEE_BY_ID[t.employeeId]));
check('무작위 업무 없음 — 전원 자기 팀 TASK', fresh.every(t => EMPLOYEE_BY_ID[t.employeeId].team === t.team));

const 최아름 = 'proposal.choi-areum';
const 제안 = rt.byEmployee(최아름)[0];
check('최아름에게 제안서 TASK 배정', !!제안, 제안?.title);

// ── 2. 캐릭터 이동 (배정 직후) ───────────────────────────────────────────
console.log('\n[2] 캐릭터 위치 — 배정 직후');
const snap0 = rt.snapshot();
check('32명 전원 캐릭터 상태 산출', snap0.length === 32, `${snap0.length}명`);
const idle0 = snap0.filter(a => a.status === 'idle').length;
console.log(`      가동 ${32 - idle0}명 / 대기 ${idle0}명  (TASK 없는 직원은 이동하지 않음)`);
console.log(`      ${where(rt, 최아름)}`);
check('TASK 있는 직원만 업무실 배치', snap0.filter(a => a.status !== 'idle').every(a => a.room !== 'home-team-room'));

// ── 3. 업무 실행 ────────────────────────────────────────────────────────
console.log('\n[3] 업무 실행 — start()');
rt.start(제안.id, KYEX.id);
console.log(`      ${where(rt, 최아름)}`);
check('queued → working 상태 전이', rt.get(제안.id).status === 'working');
check('캐릭터가 proposal-room으로 이동', rt.agent(최아름).room === 'proposal-room');
check('CASE ID가 캐릭터에 연결', rt.agent(최아름).caseId === KYEX.id);

// ── 4. 업무 완료 (4필드 강제) ────────────────────────────────────────────
console.log('\n[4] 업무 완료 — 완료 4필드 검증');
let rejected = false;
try { rt.complete(제안.id, { result: '했음', evidence: [], nextAction: '', ownerDeadline: '' } as any); }
catch { rejected = true; }
check('증빙·다음행동 없는 완료는 거부', rejected);

const done = rt.complete(제안.id, {
  result: 'KYEX 제안서 v1 완성 — 구성A 4중주 2일 540만원(기본안) / 구성B 3중주 2일 430만원(대안). 면세 · 전자계산서 발행.',
  evidence: ['02_제안서·견적/KYEX_글로벌브랜드디너칵테일_20261105-06/', '결재함 pending/20260901_KYEX_20261105'],
  nextAction: '윤규아 QA 통과 후 대표 승인 → 김나연 과장 발송 (발송은 대표가 직접)',
  ownerDeadline: '2026-09-11T18:00:00+09:00',
});
console.log(`      결과: ${String(done.task.result).slice(0, 60)}…`);
console.log(`      ${where(rt, 최아름)}`);
check('completed 상태 + 결과 저장', done.task.status === 'completed' && !!done.task.result);
check('증빙 2건 저장', (done.task.evidence || []).length === 2);
check('캐릭터가 handoff-desk로 이동', rt.agent(최아름).station === 'handoff-desk');

// ── 5. 다음 부서 인계 ───────────────────────────────────────────────────
console.log('\n[5] 다음 부서 인계 — employees.ts handoffTo 기준');
check('인계 발생', done.handoffs.length > 0, `${done.handoffs.length}건`);
for (const h of done.handoffs) {
  console.log(`      ${h.fromEmployee}(${h.fromTeam}) ──▶ ${h.toEmployee}(${h.toTeam})`);
  console.log(`         ${where(rt, EMPLOYEES.find(e => e.name === h.toEmployee)!.id)}`);
}
const 윤규아 = 'mail.yoon-gyua';
const qa = rt.byEmployee(윤규아).find(t => t.title.startsWith('[인계]'));
check('QA팀(윤규아)에게 인계 TASK 생성', !!qa, qa?.title);
check('인계 TASK가 같은 CASE를 물고 감', qa?.caseId === KYEX.id);
check('인계받은 직원 캐릭터 이동', rt.agent(윤규아).room === 'qa-room');

// ── 6. QA 실행 → 대표 승인 요청 ─────────────────────────────────────────
console.log('\n[6] QA 실행 → 진짜 승인건만 대표에게');
rt.start(qa!.id);
rt.complete(qa!.id, {
  result: 'QA 통과 — 행사일 2026-11-05/06, 금액 540만원, 면세·전자계산서 표기 일치. 수신자 김나연 과장 확인.',
  evidence: ['CASE 원본 대조', '첨부 최신본 v1 확인'],
  nextAction: '대표 발송 승인 요청',
  ownerDeadline: '2026-09-11T12:00:00+09:00',
});
const 김세리 = 'secretary.kim-seri';
const brief = rt.byEmployee(김세리).find(t => t.title.startsWith('[인계]')) || rt.byEmployee(김세리)[0];
rt.requestApproval(brief.id, '외부 발송 승인 — 발송은 대표가 직접 하십니다');
console.log(`      ${where(rt, 김세리)}`);
check('승인 대기 캐릭터는 approval-room', rt.agent(김세리).room === 'approval-room');

const ceo = rt.ceoBrief();
console.log(`\n      대표 할 일 ${ceo.ceoTodoCount}건 / 상한 ${ceo.maxAllowed}건 · 직원 처리 ${ceo.delegatedTaskCount}건`);
ceo.decisions.forEach((d, i) => {
  console.log(`      ${i + 1}. ${d.title}`);
  console.log(`         상황: ${d.situation}`);
  console.log(`         추천: ${d.recommendation}`);
  console.log(`         결정: ${d.decision}`);
});
check(`CEO 할 일 ≤ ${CEO_TODO_MAX}`, ceo.ceoTodoCount <= CEO_TODO_MAX, `${ceo.ceoTodoCount}건`);
check('직원 업무가 CEO로 복제되지 않음', ceo.delegatedTaskCount > ceo.ceoTodoCount);
check('모든 대표 결정에 추천안 존재', ceo.decisions.every(d => !!d.recommendation));

// ── 7. 최종 오피스 상태 ─────────────────────────────────────────────────
console.log('\n[7] 최종 오피스 — 32명 배치');
const rooms: Record<string, string[]> = {};
for (const a of rt.snapshot()) rooms[a.room] = [...(rooms[a.room] || []), EMPLOYEE_BY_ID[a.employeeId].name];
for (const [r, names] of Object.entries(rooms).sort((a, b) => b[1].length - a[1].length))
  console.log(`      ${r.padEnd(18)} ${names.length}명  ${names.join(' ')}`);

console.log(`\n═══ ${fails === 0 ? '전체 통과' : `실패 ${fails}건`} ═══\n`);
process.exit(fails === 0 ? 0 : 1);
