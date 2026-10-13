import { PROPOSAL_KIT } from "../company.config";

export type TaskKind = "blog" | "instagram" | "sales" | "proposal" | "email" | "collection" | "general";
export type TaskStatus = "approval" | "blocked" | "done";
export type TaskRecord = { id: number; instruction: string; department: string; assignee: string; kind: TaskKind; status: TaskStatus; result: string; toolLog: string[]; approvalRequired: boolean; approvedAt: string | null; createdAt: string; updatedAt: string };

const OWNERS: Record<TaskKind, { department: string; assignee: string }> = {
  blog: { department: "매거진·디지털 PR팀", assignee: "이가림 팀장" },
  instagram: { department: "시네마틱 캠페인팀", assignee: "홍수아 팀장" },
  sales: { department: "글로벌 세일즈팀", assignee: "정파랑 팀장" },
  proposal: { department: "비스포크 제안팀", assignee: "윤지훈 팀장" },
  email: { department: "톤앤매너 검수팀", assignee: "윤규아 팀장" },
  collection: { department: "컬렉션 기획(MD)팀", assignee: "권우진 팀장" },
  general: { department: "총괄 비서실", assignee: "오세리 실장" },
};

export function classify(text: string): TaskKind {
  const q = text.toLowerCase();
  if (/향수|디퓨저|오브제|컬렉션|swan|lion|orca|leopard|panther|phoenix|md/.test(q)) return "collection";
  if (/매거진|에디토리얼|블로그|seo|검색글|원고/.test(q)) return "blog";
  if (/인스타|릴스|캐러셀|sns|피드|캠페인|필름/.test(q)) return "instagram";
  if (/영업|행사.*찾|잠재|호텔|기업.*찾|파트너|입점|이메일.*수집/.test(q)) return "sales";
  if (/제안서|견적|구성안|비스포크/.test(q)) return "proposal";
  if (/메일|이메일|회신/.test(q)) return "email";
  return "general";
}
export const assignment = (kind: TaskKind) => OWNERS[kind];

export function executeTask(kind: TaskKind, instruction: string) {
  const log = ["대표 지시 접수", "실제 Task 생성", `${OWNERS[kind].assignee}에게 배정`];
  if (kind === "blog") return { status: "approval" as TaskStatus, approvalRequired: true, toolLog: [...log, "BELiOR 톤 적용", "에디토리얼 구조 생성", "공개 권한 확인 대기"], result: `# BELiOR 에디토리얼 기획\n\n요청: ${instruction}\n\n구성: 한 장면의 묘사 → 브랜드 경험의 의도 → 음악·공간·오브제의 연결 → 문의 동선\n\n필요 자료: 승인된 사진·행사명·컬렉션 정보. 확인 전에는 고객명·성능·실적을 사실처럼 쓰지 않습니다.\n\n${PROPOSAL_KIT}` };
  if (kind === "instagram") return { status: "approval" as TaskStatus, approvalRequired: true, toolLog: [...log, "BELiOR 캠페인 규칙 적용", "아트 필름 구성 생성", "게시 승인 대기"], result: `# 시네마틱 캠페인 기획\n\n요청: ${instruction}\n\n장면: 빛과 공간 → 물성의 클로즈업 → 음악의 여운 → BELiOR 워드마크\n\n제작 전 확인: 원본 로고, 촬영물 사용 허락, 음악 권리와 실제 제품 상태.\n\n${PROPOSAL_KIT}` };
  if (kind === "sales") return { status: "blocked" as TaskStatus, approvalRequired: false, toolLog: [...log, "외부 자료 권한 확인", "중복 발송 검증 불가", "연동 대기 처리"], result: `# 글로벌 세일즈 조사 대기\n\n요청: ${instruction}\n\n이 Site에는 웹 검색 및 Gmail 보낸편지함 권한이 없어 실제 행사·담당 창구와 중복 발송 여부를 검증할 수 없습니다. 후보를 지어내지 않았습니다.\n\n연결 후: 공식 행사 확인 → 발주 주체 확인 → 기존 발송 이력 확인 → 행사에 맞는 BELiOR 경험 제안 → 디렉터 승인` };
  if (kind === "proposal") return { status: "approval" as TaskStatus, approvalRequired: true, toolLog: [...log, "고객 조건 추출", "비스포크 구조 생성", "디렉터 승인 대기"], result: `# BELiOR 비스포크 제안 작업지시서\n\n요청: ${instruction}\n\n필수 확인: 고객·담당자·행사일·장소·경험 목적·편성·예산·사용 허락. 기프트라면 수량·소재·납기·제작 확정 여부.\n제안 구성: 행사 이해 → 경험 콘셉트 → 음악 또는 오브제 구성 2안 → 현장 운영 → 견적 → 다음 단계.\n\n미확인 값은 추측하지 않습니다.\n\n${PROPOSAL_KIT}` };
  if (kind === "email") return { status: "approval" as TaskStatus, approvalRequired: true, toolLog: [...log, "수신자·행사 정보·사용 허락 QA", "회신 구조 생성", "발송 승인 대기"], result: `# BELiOR 메일 검수안\n\n요청: ${instruction}\n\n수신자와 실제 발신 계정, 최신 행사 공지, 금액·첨부, 경쟁 브랜드 충돌, 사용 허락을 확인한 뒤 해당 고객을 위한 본문을 작성합니다. 현재 요청만으로는 확인되지 않은 정보가 있어 실제 발송 문구를 완성했다고 표시하지 않습니다.\n\n${PROPOSAL_KIT}` };
  if (kind === "collection") return { status: "approval" as TaskStatus, approvalRequired: true, toolLog: [...log, "컬렉션 사양 확인", "제작 상태 구분", "디렉터 검토 대기"], result: `# 컬렉션 기획 기록\n\n요청: ${instruction}\n\n확인 항목: 컬렉션 모티프·샘플 수량·소재·향료 안전성·시향 기록·패키징 견적·납기.\n\nSWAN LAKE 15세트는 기획 수량이며 생산 확정 및 테스트 결과는 자료 확인 전까지 미확인입니다.\n\n${PROPOSAL_KIT}` };
  return { status: "approval" as TaskStatus, approvalRequired: true, toolLog: [...log, "업무 범위 분석", "실행안 생성", "대표 확인 요청"], result: `# 비서실 업무 정리\n\n대표 지시: ${instruction}\n\n처리 순서: 필요한 자료 확인 → 담당팀 배정 → 초안 생성 → QA → 대표 승인 → 외부 실행` };
}

export function rowToTask(row: Record<string, unknown>): TaskRecord {
  return { id: Number(row.id), instruction: String(row.instruction), department: String(row.department), assignee: String(row.assignee), kind: row.kind as TaskKind, status: row.status as TaskStatus, result: String(row.result ?? ""), toolLog: JSON.parse(String(row.tool_log ?? "[]")), approvalRequired: Boolean(row.approval_required), approvedAt: row.approved_at ? String(row.approved_at) : null, createdAt: String(row.created_at), updatedAt: String(row.updated_at) };
}
