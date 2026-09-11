import { EMPLOYEES, EmployeeRule } from './employees';

export type OfficeTask = {
  id: string;
  employeeId: string;
  team: string;
  title: string;
  instructions: string;
  priority: 'P0'|'P1'|'P2'|'P3';
  source: 'system'|'case'|'gmail'|'drive'|'ceo'|'kpi';
  approvalRequired: boolean;
  status: 'queued'|'working'|'waiting_external'|'approval_required'|'blocked'|'completed';
  dueAt?: string;
  caseId?: string;
  evidence?: string[];
  result?: unknown;
  nextAction?: string;
};

export type OfficeState = {
  now: Date;
  cases: Array<Record<string, any>>;
  events: Array<Record<string, any>>;
  metrics: Record<string, number>;
  externalChanges: Array<Record<string, any>>;
};

const id = () => `task_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
const task = (employee: EmployeeRule, title: string, instructions: string, priority: OfficeTask['priority'], source: OfficeTask['source'], opts: Partial<OfficeTask> = {}): OfficeTask => ({
  id: id(), employeeId: employee.id, team: employee.team, title, instructions, priority, source,
  approvalRequired: false, status: 'queued', ...opts,
});

const byName = (name: string) => {
  const e = EMPLOYEES.find(x => x.name === name);
  if (!e) throw new Error(`Unknown employee: ${name}`);
  return e;
};

export function generateAutonomousTasks(state: OfficeState): OfficeTask[] {
  const out: OfficeTask[] = [];
  const active = state.cases.filter(c => !['won_closed','lost_closed','archived'].includes(String(c.status)));
  const now = state.now.getTime();
  const hoursUntil = (iso?: string) => iso ? (new Date(iso).getTime()-now)/36e5 : Infinity;

  // 1) 문의 접수·분류
  const unstructured = state.externalChanges.filter(x => ['gmail','website','drive_inquiry'].includes(x.type) && !x.caseId);
  if (unstructured.length) out.push(task(byName('김서연'),'신규 문의 CASE화',`${unstructured.length}건 신규 문의를 중복검사 후 CASE로 구조화하고 누락정보는 확인 필요로 표시한다.`,'P0','system'));
  if (unstructured.length) out.push(task(byName('오태윤'),'신규 문의 등급 분류','신규 CASE에 행사 유형, 고객 tier, priority, due_at을 지정한다.','P1','system'));

  const noNext = active.filter(c => !c.next_action || !c.due_at);
  if (noNext.length) out.push(task(byName('하은채'),'후속 일정 복구',`${noNext.length}건 active CASE에 next_action과 due_at을 만든다.`,'P1','case'));

  // 2) 상담·일정
  const qualified = active.filter(c => ['qualified','inquiry'].includes(String(c.status)));
  if (qualified.length) out.push(task(byName('박보라'),'상담 방향 설계',`${qualified.length}건의 행사 목적·참석자·공간·식순을 기준으로 적합 편성 방향과 최소 확인 질문을 만든다.`,'P1','case'));
  if (qualified.some(c => !c.rehearsal || !c.audio || !c.run_of_show)) out.push(task(byName('신재원'),'운영 조건 확인','식순·리허설·음향·멘트·VIP 동선 누락을 확인 필요 목록으로 만든다.','P1','case'));
  if (active.some(c => ['hold','confirmed'].includes(String(c.status)))) out.push(task(byName('임다혜'),'일정 충돌 검사','확정·홀드·문의 일정 및 이동/리허설 버퍼를 비교해 충돌과 대안을 기록한다.','P0','system'));

  // 3) 제안·견적
  const proposalNeeded = active.filter(c => ['qualified','proposal_needed'].includes(String(c.status)));
  if (proposalNeeded.length) out.push(task(byName('최아름'),'제안서 패키지 준비',`${proposalNeeded.length}건을 내부결재 가능한 제안서 구조로 완성한다.`,'P1','case'));
  if (proposalNeeded.length) out.push(task(byName('정유진'),'프로그램 방향 제시','각 CASE에 프로그램 방향·대표곡·편성 논리를 작성하되 계약 전 최종 세트리스트는 제공하지 않는다.','P2','case'));
  if (proposalNeeded.length) out.push(task(byName('배시현'),'견적 옵션 설계','330/500/700 기준과 실제 조건을 비교해 기본·추천·확장안을 만든다.','P1','case'));

  // 4) QA
  const outgoing = active.filter(c => ['proposal_ready','reply_ready','quote_ready'].includes(String(c.status)));
  if (outgoing.length) {
    out.push(task(byName('윤규아'),'외부발송 QA',`${outgoing.length}건의 수신자·첨부·금액·일정·브랜드 오류를 검수한다.`,'P0','case'));
    out.push(task(byName('강태오'),'금액·행사정보 대조','CASE 원본과 외부 문서의 일정·장소·금액·VAT/면세·편성을 대조한다.','P0','case'));
    out.push(task(byName('문세라'),'수신자·첨부 검수','To/CC·최신 첨부·중복발송 여부를 확인한다.','P0','case'));
  }

  // 5) 계약·운영
  const negotiation = active.filter(c => ['negotiation','verbal_yes','won'].includes(String(c.status)));
  if (negotiation.length) out.push(task(byName('한도빈'),'계약 전환 관리',`${negotiation.length}건의 합의조건·취소·추가시간·장소변경·저작권 조건을 계약 상태로 정리한다.`,'P0','case'));
  if (negotiation.length) out.push(task(byName('조민서'),'계약/정산 서류 준비','계약서·사업자·면세·전자계산서 관련 필수 필드를 확인한다.','P1','case'));
  if (negotiation.some(c => String(c.status)==='won')) out.push(task(byName('백가온'),'계약 후 일정 생성','확정 CASE의 리허설·자료마감·잔금·콜타임 TASK를 생성한다.','P0','case'));

  const upcoming = active.filter(c => c.event_date && hoursUntil(c.event_date) <= 24*30 && !['lost','cancelled'].includes(String(c.status)));
  if (upcoming.length) {
    out.push(task(byName('송리원'),'30일 공연 운영 점검',`${upcoming.length}건에 MASTER EVENT SHEET, RUN OF SHOW, MUSIC CUE SHEET, ARTIST CALL SHEET 상태를 점검한다.`,'P0','case'));
    out.push(task(byName('권지호'),'연주진·편성 확정도 점검','각 행사별 confirmed/backup 연주진과 복장·콜타임 누락을 확인한다.','P1','case'));
    out.push(task(byName('유세아'),'식순·큐시트 최신화','최신 식순과 이전 버전을 비교해 시작/종료/전환/담당자/신호를 갱신한다.','P0','case'));
  }

  // 6) SEO
  out.push(task(byName('이가림'),'하반기 구매검색 우선순위 갱신','기업행사·송년회·VIP·호텔·시상식 키워드 중 수주 가능성이 높은 주제를 선정하고 새 글/업데이트를 배정한다.','P2','kpi'));
  out.push(task(byName('남주하'),'검색 의도·콘텐츠 갭 조사','고의도 검색어를 intent/priority/content type으로 정리한다.','P2','kpi'));
  const wonRecent = active.filter(c => ['won','delivered'].includes(String(c.status)));
  if (wonRecent.length) out.push(task(byName('표하늘'),'실적형 원고 준비','확인된 CASE만 사용해 문제→해결→TWOTTIVA 운영→체크리스트→홈페이지 문의 CTA 구조로 원고를 만든다.','P2','case'));

  // 7) 영업
  const followups = active.filter(c => c.due_at && hoursUntil(c.due_at) <= 24 && ['lead','contacted','replied','proposal','negotiation'].includes(String(c.status)));
  if (followups.length) out.push(task(byName('정파랑'),'오늘의 수주 파이프라인',`${followups.length}건 후속을 우선 처리하고 부족하면 하반기 S/A급 신규 리드 최대 10개를 발굴한다.`,'P1','case'));
  else out.push(task(byName('정파랑'),'S/A급 신규 리드 발굴','11~12월 기업·호텔·협회·브랜드 행사 중 실제 개최 근거가 있는 유효리드를 최대 10개 발굴한다.','P2','kpi'));
  out.push(task(byName('구예성'),'리드 근거·구매접점 확보','정파랑 우선리드의 공식 행사 근거, 개최시기, 담당부서, 공식 이메일/접점을 확보하고 CONFIRMED/LIKELY/LEAD를 구분한다.','P2','kpi'));

  // 8) 정산
  const moneyCases = active.filter(c => ['won','confirmed','delivered'].includes(String(c.status)));
  if (moneyCases.length) {
    out.push(task(byName('오재민'),'매출·미수·객단가 점검',`${moneyCases.length}건의 계약금액·정산상태·다음 정산일을 점검한다.`,'P1','case'));
    out.push(task(byName('심우진'),'정산 증빙 점검','전자계산서·입금·출연료·비용증빙 누락을 확인한다.','P1','case'));
  }

  // 9) 퍼널
  out.push(task(byName('강성아'),'퍼널 병목 진단','LEAD→QUALIFIED→CONTACTED→REPLIED→PROPOSAL→NEGOTIATION→WON 수치와 전일 대비 병목을 계산하고 담당팀 개선 TASK를 만든다.','P1','kpi'));
  out.push(task(byName('마지훈'),'성장 지표 수집','신규리드·회신·제안·협상·수주·매출·검색유입을 출처와 함께 갱신한다.','P2','kpi'));
  if (active.some(c => ['lost','delivered','won'].includes(String(c.status)))) out.push(task(byName('여름'),'수주/실패 학습 반영','WON/LOST/DELIVERED CASE의 반복 패턴을 다음 영업·제안·운영 규칙으로 전환한다.','P3','case'));

  // 10) SNS
  if (wonRecent.length || state.externalChanges.some(x => x.type==='drive_media')) {
    out.push(task(byName('안도현'),'브랜드 콘텐츠 큐 편성','신규 실적/사진/영상에서 BRAND/TRUST/LEAD/PORTFOLIO 목적별 콘텐츠 우선순위를 만든다.','P2','drive'));
    out.push(task(byName('천유나'),'실적 기반 콘텐츠 초안','실제 호텔·기업·리허설·큐·관객반응 자료로 릴스/피드/스토리 중 가치 높은 1개 패키지를 만든다.','P2','drive'));
  }

  // 11) 비서실: CEO에게 일을 만들지 않고 줄인다.
  const urgent = active.filter(c => (c.due_at && hoursUntil(c.due_at)<=48) || c.priority==='P0' || c.blocked_since);
  out.push(task(byName('김세리'),'CEO 브리프 압축',`전체 CASE와 TASK에서 돈·브랜드·사람에 직접 영향 있는 결정만 최대 3건 선별한다. 현재 긴급 후보 ${urgent.length}건. 직원이 처리 가능한 것은 CEO에게 올리지 않는다.`,'P0','system'));
  out.push(task(byName('홍보람'),'대표 지시·결정 라우팅','CEO 명령과 승인/거절/수정 결과를 해당 employee owner의 TASK와 원 CASE에 반영한다. CEO 개인 TODO로 복제하지 않는다.','P1','system'));

  return dedupe(out).slice(0, 40);
}

function dedupe(tasks: OfficeTask[]): OfficeTask[] {
  const seen = new Set<string>();
  return tasks.filter(t => {
    const key = `${t.employeeId}:${t.title}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}

export function buildCEOBrief(tasks: OfficeTask[], cases: Array<Record<string,any>>) {
  const candidates = cases
    .filter(c => ['approval_required','negotiation','blocked'].includes(String(c.status)) || c.priority==='P0')
    .sort((a,b) => Number(b.value||0)-Number(a.value||0))
    .slice(0,3)
    .map(c => ({
      caseId: c.id,
      title: c.title,
      situation: c.summary || c.next_action || '상황 요약 필요',
      recommendation: c.recommendation || '담당팀 추천안 작성 필요',
      decision: c.decision_needed || '승인/수정/거절',
    }));
  return {
    ceoTodoCount: candidates.length,
    maxAllowed: 3,
    decisions: candidates,
    delegatedTaskCount: tasks.length,
    rule: '직원이 할 수 있는 일은 CEO 할 일로 만들지 않는다.'
  };
}
