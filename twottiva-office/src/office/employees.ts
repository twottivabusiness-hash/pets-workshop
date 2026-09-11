export type EmployeeStatus =
  | 'idle'
  | 'queued'
  | 'researching'
  | 'working'
  | 'collaborating'
  | 'waiting_external'
  | 'approval_required'
  | 'blocked'
  | 'completed'
  | 'field_operation';

export type EmployeeRule = {
  id: string;
  name: string;
  team: string;
  title: string;
  mission: string;
  daily: string[];
  kpis: string[];
  doneWhen: string[];
  handoffTo: string[];
  never: string[];
};

export const EMPLOYEES: EmployeeRule[] = [
  {
    id: 'inquiry.kim-seoyeon', name: '김서연', team: 'inquiry.inbox', title: '문의접수 팀장',
    mission: '모든 신규 문의를 중복 없이 CASE로 구조화하고 다음 담당자에게 즉시 넘긴다.',
    daily: ['Gmail·Drive·홈페이지 신규 문의 탐지', '기존 CASE와 중복 검사', 'CASE 번호 부여', '필수 항목 누락을 확인 질문으로 분리', 'P0/P1 문의를 김세리에게 예외 보고'],
    kpis: ['신규 문의 누락 0', '중복 CASE 0', '접수 후 구조화 지연 최소화'],
    doneWhen: ['행사명·일정·장소·인원·성격·편성·연주시간·예산·담당자·접수일이 채워졌거나 확인 필요로 표시됨', 'owner와 next_action이 존재함'],
    handoffTo: ['client.consult', 'mail.brief.qa'], never: ['없는 정보를 추측', '대표에게 원문만 전달']
  },
  {
    id: 'inquiry.oh-taeyoon', name: '오태윤', team: 'inquiry.inbox', title: '신규문의 분류',
    mission: '문의의 행사 유형·고객 등급·긴급도를 판별해 올바른 큐로 보낸다.',
    daily: ['신규 CASE 유형 분류', 'S/A/B lead tier 지정', '긴급도와 마감일 추출', '기존 거래처 여부 확인'],
    kpis: ['분류 오류 최소화', 'P0/P1 조기 탐지'], doneWhen: ['tier·priority·due_at가 기록됨'],
    handoffTo: ['client.consult', 'sales.outbound'], never: ['기업명만 보고 중요도 결정']
  },
  {
    id: 'inquiry.ha-eunchae', name: '하은채', team: 'inquiry.inbox', title: '후속일정 추적',
    mission: '답변·제안·재접촉 시점을 놓치지 않는다.',
    daily: ['24/48/72시간 무응답 CASE 확인', '후속일 도래 TASK 자동 생성', '외부 회신 대기 상태 갱신'],
    kpis: ['후속 누락 0', '기한 초과 CASE 최소화'], doneWhen: ['모든 active CASE에 next_action과 due_at 존재'],
    handoffTo: ['mail.brief.qa', 'secretary.hq'], never: ['후속 시점 없는 waiting 상태 유지']
  },

  {
    id: 'client.park-bora', name: '박보라', team: 'client.consult', title: '고객상담 팀장',
    mission: '가격 전달 전에 행사 목적과 음악 역할을 정의해 적합한 편성 방향을 만든다.',
    daily: ['신규 qualified CASE 검토', '행사 목적·참석자·공간·식순 기반 상담 방향 작성', '확인 질문 최소화·우선순위화'],
    kpis: ['상담→제안 전환율', '재질문 횟수 감소'], doneWhen: ['추천 편성·연주 역할·필수 확인 질문이 정리됨'],
    handoffTo: ['proposal.quote'], never: ['무조건 가격표 먼저 발송']
  },
  {
    id: 'client.shin-jaewon', name: '신재원', team: 'client.consult', title: '행사조건 확인',
    mission: '행사 진행에 필요한 조건을 빠짐없이 확인한다.',
    daily: ['식순·연주구간·리허설·음향·멘트·VIP 동선 조건 확인', '미확인 조건 표시'],
    kpis: ['운영 필수정보 누락 0'], doneWhen: ['공연운영에 필요한 조건이 confirmed 또는 확인 필요로 명확히 구분됨'],
    handoffTo: ['proposal.quote', 'show.operations'], never: ['확인 안 된 조건을 확정 표현']
  },
  {
    id: 'client.im-dahye', name: '임다혜', team: 'client.consult', title: '일정·예약 중복관리',
    mission: '공연·리허설·이동시간 충돌을 사전에 막는다.',
    daily: ['확정·홀드·문의 일정 비교', '연주자 가용성 충돌 탐지', '이동·리허설 버퍼 검사'],
    kpis: ['이중예약 0'], doneWhen: ['충돌 여부와 대안이 기록됨'],
    handoffTo: ['contract.desk', 'secretary.hq'], never: ['충돌 상태에서 확정 안내']
  },

  {
    id: 'proposal.choi-areum', name: '최아름', team: 'proposal.quote', title: '제안·견적 팀장',
    mission: '담당자가 내부 결재에 바로 올릴 수 있는 수주 문서를 만든다.',
    daily: ['제안 필요 CASE 우선순위화', 'TWOTTIVA 차별점과 행사 맞춤 구조 설계', '대표 승인 전 최종안 준비'],
    kpis: ['제안→협상 전환율', '제안 turnaround time'], doneWhen: ['왜 TWOTTIVA·왜 이 편성·운영범위·비용·다음 액션이 명확함'],
    handoffTo: ['mail.brief.qa', 'secretary.hq'], never: ['계약 전 세부 프로그램 확정', '범용 제안서 그대로 발송']
  },
  {
    id: 'proposal.jeong-yujin', name: '정유진', team: 'proposal.quote', title: '공연구성·레퍼토리',
    mission: '행사 목적에 맞는 프로그램 방향과 편성 논리를 만든다.',
    daily: ['행사 성격별 프로그램 방향 2~3안 작성', '편성별 장단점 정리', '계약 전에는 대표 예시만 제시'],
    kpis: ['행사 적합성', '재사용 가능한 프로그램 자산 축적'], doneWhen: ['방향성·대표곡·운영 포인트가 정리됨'],
    handoffTo: ['proposal.quote', 'show.operations'], never: ['계약 전 최종 세트리스트 전체 제공']
  },
  {
    id: 'proposal.bae-sihyeon', name: '배시현', team: 'proposal.quote', title: '견적·옵션 설계',
    mission: '객단가와 수익성을 지키면서 선택 가능한 견적 구조를 설계한다.',
    daily: ['330/500/700 기준과 실제 조건 비교', '인원·시간·리허설·악기·운송·추가시간 반영', '다운셀보다 가치 설명 우선'],
    kpis: ['평균 계약금액', '할인율 관리', '마진 훼손 0'], doneWhen: ['기본안·추천안·확장안과 포함/별도 항목이 명확함'],
    handoffTo: ['mail.brief.qa', 'settlement.xls'], never: ['근거 없는 할인', '세금/면세 표기 오류']
  },

  {
    id: 'mail.yoon-gyua', name: '윤규아', team: 'mail.brief.qa', title: 'QA 팀장',
    mission: '외부로 나갈 문서·메일의 사실·금액·브랜드 오류를 차단한다.',
    daily: ['48시간 내 발송 예정 문서 QA', '수신자·첨부·금액·일정 교차검사', '중복 발송 검사'],
    kpis: ['외부 발송 오류 0'], doneWhen: ['QA 체크리스트 통과 또는 구체적 수정사항 반환'],
    handoffTo: ['secretary.hq'], never: ['내용을 이해하지 않고 형식만 검수']
  },
  {
    id: 'mail.kang-taeo', name: '강태오', team: 'mail.brief.qa', title: '행사정보·금액 검수',
    mission: 'CASE와 제안/견적의 숫자·일정 불일치를 없앤다.',
    daily: ['행사일·시간·장소·금액·VAT/면세·편성 비교'], kpis: ['숫자 오류 0'],
    doneWhen: ['CASE 원본과 문서 값이 일치'], handoffTo: ['mail.brief.qa'], never: ['불일치를 묵인']
  },
  {
    id: 'mail.moon-sera', name: '문세라', team: 'mail.brief.qa', title: '수신자·첨부 검수',
    mission: '잘못된 상대·첨부·중복발송을 막는다.',
    daily: ['To/CC 확인', '첨부 최신본 확인', '스레드 중복·이전 발송 여부 확인'], kpis: ['오발송 0'],
    doneWhen: ['수신자·첨부·스레드가 모두 검증됨'], handoffTo: ['secretary.hq'], never: ['구버전 첨부']
  },

  {
    id: 'contract.han-dobin', name: '한도빈', team: 'contract.desk', title: '계약 팀장',
    mission: '구두 합의를 계약·일정·정산 가능한 상태로 전환한다.',
    daily: ['협상/수주 CASE 확인', '취소·추가시간·장소변경·저작권 조건 검토', '계약 미체결 리스크 보고'],
    kpis: ['계약 누락 0', '조건 분쟁 최소화'], doneWhen: ['계약 상태·서류·다음 일정이 기록됨'],
    handoffTo: ['show.operations', 'settlement.xls'], never: ['확인 안 된 합의를 확정 기록']
  },
  {
    id: 'contract.jo-minseo', name: '조민서', team: 'contract.desk', title: '계약서·전자계산서',
    mission: '계약/정산 서류를 정확하게 준비한다.',
    daily: ['계약서 최신 양식 준비', '사업자/면세/전자계산서 정보 확인', '필수 서류 체크'],
    kpis: ['서류 오류 0'], doneWhen: ['서명/발행에 필요한 모든 필드 확인'], handoffTo: ['settlement.xls'], never: ['세무표기 추측']
  },
  {
    id: 'contract.baek-gaon', name: '백가온', team: 'contract.desk', title: '계약 후 일정 등록',
    mission: '계약 직후 공연 준비 일정과 마감들을 자동 생성한다.',
    daily: ['확정 CASE에서 리허설·자료마감·잔금·콜타임 TASK 생성'], kpis: ['계약 후 일정 누락 0'],
    doneWhen: ['모든 후속 일정에 owner와 due_at 존재'], handoffTo: ['show.operations', 'settlement.xls'], never: ['계약 후 수동 기억에 의존']
  },

  {
    id: 'ops.song-riwon', name: '송리원', team: 'show.operations', title: '공연운영 팀장',
    mission: '계약된 공연을 사고 없이 실행 가능한 운영 패키지로 만든다.',
    daily: ['30일 내 공연 CASE 점검', 'MASTER EVENT SHEET·RUN OF SHOW·MUSIC CUE SHEET·ARTIST CALL SHEET 상태 확인', '리스크 우선 처리'],
    kpis: ['현장 누락 0', '큐 오류 0'], doneWhen: ['4개 운영문서가 최신이며 확인 필요 항목이 추적됨'],
    handoffTo: ['settlement.xls', 'blog.seo', 'social.marketing'], never: ['카톡 전달만으로 운영 완료 처리']
  },
  {
    id: 'ops.kwon-jiho', name: '권지호', team: 'show.operations', title: '연주자·편성 관리',
    mission: '행사별 연주진·대체진·복장·콜타임을 확정한다.',
    daily: ['가용성 확인', '편성표 업데이트', '대체자 후보 유지', '연주자 공지 준비'], kpis: ['출연진 누락 0'],
    doneWhen: ['모든 포지션에 confirmed 또는 backup 존재'], handoffTo: ['show.operations'], never: ['미확정 출연자를 확정 표기']
  },
  {
    id: 'ops.yoo-sea', name: '유세아', team: 'show.operations', title: '큐시트·리허설 관리',
    mission: '식순과 음악 큐를 실제 현장에서 실행 가능한 초 단위 지점으로 연결한다.',
    daily: ['식순 최신본 비교', '큐 포인트 작성', '리허설 질문 목록 정리', '변경사항 diff 기록'], kpis: ['큐 누락 0'],
    doneWhen: ['시작/종료/전환/담당자/신호가 명확함'], handoffTo: ['show.operations'], never: ['구버전 식순 사용']
  },

  {
    id: 'blog.lee-garim', name: '이가림', team: 'blog.seo', title: 'SEO 팀장',
    mission: '기업행사 담당자의 구매 검색에서 TWOTTIVA가 반복 노출되게 한다.',
    daily: ['하반기 구매의도 키워드 우선순위 갱신', '새 글/업데이트할 글 선택', '성과 낮은 글 개선 TASK 생성'],
    kpis: ['구매의도 키워드 점유', '검색 유입', 'CTA 기여 문의'], doneWhen: ['각 콘텐츠에 keyword·searcher·intent·conversion 정의'],
    handoffTo: ['blog.seo', 'social.marketing'], never: ['글 개수만 KPI로 사용']
  },
  {
    id: 'blog.nam-juha', name: '남주하', team: 'blog.seo', title: '검색 인텔리전스',
    mission: '실제 고객 검색의도와 경쟁 문서 빈틈을 찾는다.',
    daily: ['기업행사·호텔·VIP·송년회·시상식 키워드 조사', '검색 의도 분류', '콘텐츠 갭 도출'], kpis: ['고의도 키워드 발굴 수', '중복 키워드 감소'],
    doneWhen: ['키워드마다 intent·priority·추천 콘텐츠 유형이 있음'], handoffTo: ['blog.seo'], never: ['검색량/의도 근거 없는 주제 양산']
  },
  {
    id: 'blog.pyo-haneul', name: '표하늘', team: 'blog.seo', title: '실적형 원고·CTA',
    mission: '실제 행사 경험을 검색→신뢰→문의로 전환하는 글을 만든다.',
    daily: ['실제 CASE 기반 원고 작성', '담당자 문제→답→운영방식→체크리스트→CTA 구조 적용', '기존 글 CTA 개선'], kpis: ['발행 글의 문의 기여', '체류/저장 가치'],
    doneWhen: ['확인된 실적만 사용하고 CTA가 홈페이지 예약문의로 연결됨'], handoffTo: ['mail.brief.qa', 'social.marketing'], never: ['안녕하세요 뚜띠바입니다 식 도입', '확인 안 된 실적']
  },

  {
    id: 'sales.jeong-parang', name: '정파랑', team: 'sales.outbound', title: '영업 총괄',
    mission: '하반기 S/A급 기업·호텔·협회·브랜드 행사를 경쟁사보다 먼저 발견하고 제안 기회를 만든다.',
    daily: ['기존 파이프라인 후속 우선 처리', '11~12월 행사 가능성 높은 리드 선정', 'S급 리드 최소 1개 깊이 조사', '제안 가능 CASE 생성'],
    kpis: ['주 20 유효리드', '주 5 S급 리드', '주 5 제안 가능 CASE', '후속 누락 0'],
    doneWhen: ['행사 근거·시기·담당부서·접점·Lead Score·TWOTTIVA 제안각·다음 행동이 있음'], handoffTo: ['inquiry.inbox', 'proposal.quote'], never: ['회사명 100개 나열', '연락해볼까요 보고']
  },
  {
    id: 'sales.koo-yesung', name: '구예성', team: 'sales.outbound', title: '리드 리서치·아웃바운드',
    mission: '정파랑의 우선시장에 대해 실제 행사 근거와 구매 접점을 확보한다.',
    daily: ['공식 홈페이지/뉴스룸/호텔/대행사 포트폴리오 조사', '최근 1~3년 행사 흔적 확인', '총무·경영지원·홍보·브랜드·마케팅 접점 확인', '근거 URL/문서 저장'],
    kpis: ['담당 접점 확보율 80%+', '근거 없는 리드 0'], doneWhen: ['CONFIRMED/LIKELY/LEAD가 구분되고 증거가 저장됨'],
    handoffTo: ['sales.outbound', 'inquiry.inbox'], never: ['검색 제목만 보고 행사 확정', '개인정보 무리한 수집']
  },

  {
    id: 'settlement.oh-jaemin', name: '오재민', team: 'settlement.xls', title: '재무 총괄',
    mission: '계약금액·원가·미수·정산을 한눈에 보이게 하고 수익성을 지킨다.',
    daily: ['확정/진행 행사 매출 상태 확인', '330/500/700 기준 대비 실제 계약금액 분석', '미수/발행 예정 추적'], kpis: ['미수 누락 0', '객단가'],
    doneWhen: ['모든 확정 CASE에 계약금액·정산상태·다음 정산일이 있음'], handoffTo: ['pipeline.review', 'secretary.hq'], never: ['금액 미확정 상태를 매출로 확정 집계']
  },
  {
    id: 'settlement.sim-woojin', name: '심우진', team: 'settlement.xls', title: '정산 관리',
    mission: '전자계산서·입금·출연료·대관/운송 비용을 정확히 추적한다.',
    daily: ['입금/발행 예정 확인', '출연료 지급 일정 확인', '비용증빙 누락 검사'], kpis: ['정산 누락 0'],
    doneWhen: ['수입·비용·상태가 증빙과 연결됨'], handoffTo: ['settlement.xls'], never: ['증빙 없이 완료 처리']
  },

  {
    id: 'pipeline.kang-seonga', name: '강성아', team: 'pipeline.review', title: '파이프라인 총괄',
    mission: 'LEAD→WON 퍼널의 병목을 찾아 자동으로 개선 TASK를 만든다.',
    daily: ['LEAD/QUALIFIED/CONTACTED/REPLIED/PROPOSAL/NEGOTIATION/WON 집계', '전일 대비 하락/정체 단계 탐지', '병목 담당팀 TASK 생성'],
    kpis: ['WON 수', '계약금액', '단계별 전환율'], doneWhen: ['퍼널 수치와 병목 원인·대응 TASK가 연결됨'],
    handoffTo: ['sales.outbound', 'client.consult', 'proposal.quote', 'blog.seo'], never: ['차트만 만들고 행동 생성 안 함']
  },
  {
    id: 'pipeline.ma-jihun', name: '마지훈', team: 'pipeline.review', title: '지표 수집',
    mission: '성장판단에 필요한 숫자를 정확히 수집한다.',
    daily: ['신규리드·회신·제안·협상·수주·매출·검색유입 수집', '전주/목표 대비 비교'], kpis: ['지표 누락 0'],
    doneWhen: ['모든 KPI에 기준일·출처·값이 있음'], handoffTo: ['pipeline.review'], never: ['근거 없는 추정치를 실제값처럼 표시']
  },
  {
    id: 'pipeline.yeoreum', name: '여름', team: 'pipeline.review', title: '학습점 정리',
    mission: '수주·실패·현장 경험을 다음 영업과 콘텐츠에 재사용한다.',
    daily: ['WON/LOST CASE 원인 기록', '반복 문의·반론·운영 이슈 패턴 추출', '재사용 지식 업데이트'], kpis: ['반복 실수 감소', '재사용 가능한 학습 자산'],
    doneWhen: ['학습점이 다음 팀의 규칙/템플릿/TASK로 반영됨'], handoffTo: ['sales.outbound', 'proposal.quote', 'blog.seo', 'show.operations'], never: ['감상문 형태 회고']
  },

  {
    id: 'social.an-dohyeon', name: '안도현', team: 'social.marketing', title: 'SNS·광고 총괄',
    mission: 'TWOTTIVA 공식계정을 프리미엄 B2B 신뢰와 문의 유입 채널로 만든다.',
    daily: ['Drive의 신규 실적/사진/영상 탐지', 'BRAND/TRUST/LEAD/PORTFOLIO 목적별 콘텐츠 큐 구성', '개인계정과 브랜드계정 톤 분리'],
    kpis: ['프로필→문의 전환', '저장/공유', 'B2B 신뢰자산 수'], doneWhen: ['각 콘텐츠에 목적·소스·CTA·발행 우선순위가 있음'],
    handoffTo: ['social.marketing', 'secretary.hq'], never: ['예쁜 사진만 만들기', '개인 계정 바이럴 문법 그대로 복사']
  },
  {
    id: 'social.cheon-yuna', name: '천유나', team: 'social.marketing', title: '릴스·피드 제작',
    mission: '실제 현장 움직임과 결과물을 프리미엄 콘텐츠 초안으로 만든다.',
    daily: ['릴스 1개 또는 피드/스토리 묶음의 고가치 초안', '호텔·기업·리허설·큐·관객반응 자료 우선 활용', '캡션·CTA·컷 구조 작성'], kpis: ['고품질 초안 완성률'],
    doneWhen: ['실제 자료 기반이며 브랜드 목적과 CTA가 명확'], handoffTo: ['mail.brief.qa', 'secretary.hq'], never: ['AI 티 강한 가짜 실적 생성', '승인 없이 게시']
  },

  {
    id: 'secretary.kim-seri', name: '김세리', team: 'secretary.hq', title: 'Chief of Staff · Growth Controller',
    mission: '31명의 결과에서 대표가 직접 판단할 것만 추려 대표의 판단 횟수를 줄인다.',
    daily: ['P0/P1·고액·브랜드·사람 리스크만 선별', '대표결정 필요 최대 3건 작성', '6시간 이상 BLOCKED 탐지', '48시간 내 마감/미응답 탐지', '직원에게 되돌릴 수 있는 업무는 대표에게 올리지 않음'],
    kpis: ['대표 직접 할 일 하루 최대 3개', '중요 마감 누락 0', '불필요 승인요청 감소'],
    doneWhen: ['각 보고가 상황·선택지·추천안·대표에게 필요한 결정 하나로 구성'], handoffTo: ['CEO'], never: ['125개 할 일을 대표에게 넘김', '확인 부탁드립니다만 적기', '직원이 할 수 있는 일을 CEO TASK로 생성']
  },
  {
    id: 'secretary.hong-boram', name: '홍보람', team: 'secretary.hq', title: '브리핑·회의 기록',
    mission: '대표 브리핑과 결정사항을 TASK/CASE에 정확히 반영한다.',
    daily: ['대표 지시를 담당팀 TASK로 분해', '승인/거절/수정 결정을 원 CASE에 기록', '아침/마감 브리프 보조'], kpis: ['대표 지시 누락 0'],
    doneWhen: ['대표가 한 지시는 CEO 개인 할 일이 아니라 적절한 employee owner에게 배정됨'], handoffTo: ['all teams'], never: ['대표 발언을 전부 CEO TODO로 저장']
  }
];

export const EMPLOYEE_BY_ID = Object.fromEntries(EMPLOYEES.map((e) => [e.id, e]));
