// BELiOR AI Office. Department IDs are stable keys used by the simulation.
export const COMPANY = {
  name: "Maison BELiOR S&M Office", logoLetter: "B",
  titlePrefix: "메종 벨리오르", titleAccent: "Sales & Marketing",
  pageTitle: "Maison BELiOR — Sales & Marketing Office",
  description: "BELiOR의 VIP 인콰이어리, 브랜드 경험, 비스포크 제안과 파트너십을 관리하는 오피스",
  windowLabel: "belior_office.exe — 마케팅 총괄실", reportName: "BELiOR S&M AI Office",
} as const;

export const CEO_PROFILE = {
  name: "총괄 디렉터", callsign: "디렉터", role: "BELiOR 마케팅·세일즈 총괄",
  hair: "#141413", shirt: "#C0A050", accent: "#8A6A20", skin: "#f4efe5",
  thoughts: ["가장 오래 남는 아름다움은 조용히 말합니다.", "할인이나 저가 라인업으로 타협하지 않아요.", "VIP 경험 설계가 최우선입니다."],
};

export const DEPARTMENTS = [
  { id: "research", name: "VIP 인콰이어리팀", short: "vip.inbox", icon: "📩", task: "프라이빗 문의 및 B2B 리드 접수", report: "문의 대상의 격에 맞는 응대 방식을 분류해요." },
  { id: "brand", name: "브랜드 경험 기획팀", short: "brand.exp", icon: "🏛️", task: "컬렉션(LION/SWAN 등) 고객 경험 설계", report: "제품과 공연이 전하는 하우스의 서사를 설계합니다." },
  { id: "strategy1", name: "비스포크 제안팀", short: "bespoke.quote", icon: "🖋️", task: "호텔·기업 VIP 행사 및 기프트 제안서 작성", report: "고객 조건에 맞춘 음악·경험·패키징 2안을 만듭니다." },
  { id: "qa", name: "톤앤매너 검수팀", short: "tone.qa", icon: "👁️", task: "모든 외부 발송물 및 카피 품질 검수", report: "사실관계와 수신자를 확인하고 과장된 표현을 걸러냅니다." },
  { id: "strategy2", name: "B2B 파트너십팀", short: "partnership", icon: "🤝", task: "특급호텔 및 글로벌 브랜드 제휴 계약 진행", report: "디렉터가 승인한 파트너와만 계약을 진행해요." },
  { id: "reels", name: "오프라인 아틀리에팀", short: "atelier.ops", icon: "🕯️", task: "공연·팝업·시향회·VIP 초청 행사 현장 운영", report: "조도, 향, 음악, 동선을 큐시트에 맞춥니다." },
  { id: "carousel", name: "매거진·디지털 PR팀", short: "magazine.pr", icon: "📖", task: "하이엔드 에디토리얼 원고 작성", report: "확인된 사례를 바탕으로 정제된 아티클을 만듭니다." },
  { id: "partner", name: "글로벌 세일즈팀", short: "global.sales", icon: "🌍", task: "VIP 라운지 및 백화점 명품관 제휴 조사", report: "연락 대상, 접점, 적합한 컬렉션을 검증합니다." },
  { id: "finance", name: "재무 및 정산팀", short: "finance.xls", icon: "🧾", task: "B2B 계약·기프트 세트 정산 관리", report: "검증된 증빙으로 대금과 세금계산서를 관리해요." },
  { id: "review", name: "CRM 데이터팀", short: "crm.data", icon: "📊", task: "수주 전환율 및 VIP 고객 유지 분석", report: "근거 있는 매출과 관계 지표를 살핍니다." },
  { id: "ops", name: "시네마틱 캠페인팀", short: "visual.camp", icon: "🎬", task: "BELiOR 릴스·필름 기획", report: "컬렉션의 물성과 공간을 아트 필름으로 표현합니다." },
  { id: "secretary", name: "총괄 비서실", short: "director.hq", icon: "📋", task: "부서별 핵심 안건 필터링 및 디렉터 보고", report: "브랜드 가치와 사실관계의 위험을 먼저 올립니다." },
  { id: "score", name: "컬렉션 기획(MD)팀", short: "collection.md", icon: "🦢", task: "SWAN LAKE 등 신규 오브제·향수 상품화 기획", report: "제작·테스트 결과를 확인하며 일정을 관리합니다." },
] as const;

export type StaffEntry = { dept: string; rank: "lead" | "member"; name: string; role: string; colors: [string, string, string]; thoughts: string[]; callsign?: string };
const palette: [string, string, string][] = [
  ["#2A241C", "#E8D9B4", "#A8873F"], ["#4A3226", "#FBF4E4", "#8A6C2C"],
  ["#2E2620", "#FFFDF7", "#A8873F"], ["#38291F", "#BDB4D6", "#2A241C"],
  ["#553A29", "#E5DAC4", "#8A6C2C"], ["#2A241C", "#8FCBB0", "#4A3226"],
];
const staff = (dept: string, rank: "lead" | "member", name: string, role: string, thought: string, n: number, callsign?: string): StaffEntry =>
  ({ dept, rank, name, role, colors: palette[n % palette.length], thoughts: [thought], ...(callsign ? { callsign } : {}) });

export const STAFF_LIST: StaffEntry[] = [
  staff("research","lead","김민주","VIP 접수 팀장","어떤 고객인지가 가장 중요해요.",0,"인박스"),
  staff("research","member","이현우","인콰이어리 분류","대량 구매 문의도 브랜드 결이 맞는지부터 봅니다.",1),
  staff("research","member","최서아","B2B 리드 관리","담당자와 최근 행사 이력을 확인합니다.",2),
  staff("brand","lead","박태형","경험 기획 팀장","SWAN의 감각을 공간에 어떻게 담을까요?",3,"익스피리언스"),
  staff("brand","member","정해인","공간 연출","빛과 동선이 만나는 지점을 표시할게요.",4),
  staff("brand","member","강유진","시향 컨설팅","시향 결과는 실제 테스트 기록을 기준으로 말합니다.",5),
  staff("strategy1","lead","윤지훈","제안서 팀장","SWAN LAKE 기프트 15세트 기획안을 확인할게요.",1,"비스포크"),
  staff("strategy1","member","송지아","B2B 견적 설계","가격에는 근거와 범위가 필요해요.",2),
  staff("strategy1","member","한서준","패키징 옵션","기성 상자와 인쇄 옵션을 실제 견적으로 확인합니다.",4),
  staff("qa","lead","윤규아","톤앤매너 검수 팀장","외부 발송 전에 사실과 사용 허락을 확인합니다.",0,"톤QA"),
  staff("qa","member","강태오","행사 정보 검수","날짜와 수신자를 원문으로 다시 확인합니다.",1),
  staff("qa","member","문세라","브랜드 카피 검수","과장은 덜고 장면은 선명하게 씁니다.",2),
  staff("strategy2","lead","한도빈","파트너십 팀장","상대의 의사결정 경로부터 확인합니다.",1,"파트너십"),
  staff("strategy2","member","조민서","계약·서류","합의된 범위와 납기를 계약서에 반영합니다.",2),
  staff("reels","lead","송리원","아틀리에 운영 팀장","향, 조명, 음악, 동선을 큐시트로 맞춥니다.",3,"아틀리에"),
  staff("reels","member","권지호","연주·프로그램 운영","확정된 곡과 연주 시간을 점검합니다.",4),
  staff("reels","member","유세아","VIP 동선·리허설","리허설과 실제 입장 큐를 구분합니다.",5),
  staff("carousel","lead","이가림","에디토리얼 팀장","공개 허락을 받은 사례만 발행합니다.",0,"매거진"),
  staff("carousel","member","남주하","아티클 기획","사진의 흐름과 근거를 먼저 봅니다.",1),
  staff("partner","lead","정파랑","글로벌 세일즈 팀장","공식 창구와 기존 발송 기록을 확인합니다.",2,"글로벌"),
  staff("partner","member","구예성","VIP 리드 발굴","공개된 기획 담당 창구만 후보로 올립니다.",3),
  staff("finance","lead","오재민","재무·정산 팀장","실제 계약과 입금 자료를 기준으로 기록합니다.",4,"파이낸스"),
  staff("finance","member","심우진","B2B 정산","잔금일과 증빙을 함께 확인합니다.",5),
  staff("review","lead","강성아","CRM 데이터 팀장","확정과 제안을 같은 매출로 세지 않습니다.",0,"CRM"),
  staff("review","member","마지훈","전환 지표","수주 단계의 근거를 붙입니다.",1),
  staff("ops","lead","홍수아","캠페인 팀장","로고 원본의 비율은 그대로 유지합니다.",3,"비주얼"),
  staff("ops","member","천유나","아트 필름 기획","게시 허락과 음악 권리를 확인합니다.",4),
  staff("secretary","lead","오세리","비서실장","디렉터님, 승인하실 안건만 추렸습니다.",0,"치프"),
  staff("secretary","member","홍보람","디렉터 브리핑","상태와 다음 행동을 한 줄로 보고합니다.",1),
  staff("score","lead","권우진","컬렉션 기획","SWAN LAKE 디퓨저의 소재 테스트를 확인해야 합니다.",4,"MD"),
  staff("score","member","서가은","향·오브제 개발","시향 기록과 제품 사양을 구분합니다.",5),
];

export const PROPOSAL_KIT = `[BELiOR 마케팅 및 제안서 제작 기준]
0) LION, SWAN, ORCA, LEOPARD, PANTHER, PHOENIX의 승인된 색상과 키워드만 사용합니다.
1) 최고·완벽 등의 과장과 임의 할인 없이 검증된 사실을 씁니다.
2) SWAN LAKE 카디퓨저 15세트는 VIP 선물 기획 수량입니다. 생산 확정 전에는 납품 완료로 표현하지 않습니다.
3) BELiOR 엠블럼과 워드마크의 비율·형태를 임의로 바꾸지 않습니다.
4) 행사 제안은 식순, 편성, 공연 시간, 리허설, 예산과 사용 허락을 확인합니다.`;

export const PENDING_INTEGRATIONS: Record<string, string> = {
  partner: "외부 영업 대상 DB 미연동", finance: "실제 입금 자료 미연동",
};
export const STORAGE_LINK = "";
