# BELiOR — Claude handoff

이 ZIP은 Sites 프로젝트의 최신 저장소 소스, AI 오피스, 이미지와 영상 파일을 포함합니다.

## 먼저 읽을 파일
- app/Belior.tsx: 브랜드 사이트 페이지와 한국어·영어 콘텐츠
- app/belior.css: 반응형 스타일
- app/page.tsx: 메인 진입점
- app/[section]/: 페이지 및 컬렉션·제품 상세 라우팅
- app/office/: AI 오피스
- company.config.ts 및 app/game/: 오피스 조직·시뮬레이션
- worker/index.ts: 서버 API
- public/belior/: 이미지와 영상
- .openai/hosting.json: 기존 Sites 프로젝트 ID와 연결 설정

## 실행
Node.js 22.13 이상과 npm이 필요합니다.
```bash
npm ci
npm run dev
```
빌드: npm run build
이 프로젝트는 React/Vinext 및 Cloudflare Worker 기반입니다. HTML 파일 하나를 더블클릭하여 실행하는 구조가 아닙니다. 환경이 지원되는 경우 npm run install:ci로 저장소의 설치 절차를 사용할 수 있습니다.

## 브랜드 규칙
- BELiOR: 소문자 i를 반드시 유지합니다.
- COLLECTION: LION, SWAN, ORCA, LEOPARD, PANTHER, PHOENIX.
- MUSIC: 실제 연주진, 부첼라티 행사, 실제 공연 포트폴리오.
- 동물 컬렉션과 실제 연주진·공연 서비스를 분리합니다. 동물을 듀오·4중주·웨딩 상품에 임의로 배정하지 않습니다.
- 제공된 고정 로고는 임의로 다시 그리거나 변형하지 않습니다. ORCA의 색상도 임의로 블랙·골드로 바꾸지 않습니다.
- 별도의 심볼 로딩 화면을 만들지 않습니다.
- TWOTTIVA 표기가 필요하면 아래를 그대로 사용합니다.
  TWOTTIVA
  string ensemble
  뚜띠바 현악앙상블

## 클로드 작업 지시
먼저 현재 코드를 읽고 기존 기능을 파악하세요. 웹 주소를 열 수 없어도 이 ZIP의 소스로 작업할 수 있습니다. 기존 웹사이트와 오피스를 모두 보존하고 요청된 부분만 수정하세요. 변경 후 빌드·경로·문의 기능을 확인하세요. 지원되지 않는 기능을 작동한다고 보고하지 마세요.

## 포함하지 않은 것
node_modules, Git 인증 토큰, 환경변수 비밀값, 실행 캐시 및 고객 문의 데이터는 포함하지 않았습니다. 기존 서버 데이터와 이메일 알림 등 외부 연동은 별도 접근 권한·설정이 필요합니다. ZIP만으로 배포 권한이 생기지는 않습니다.

기존 사이트: https://twottiva-ai-office.jwjsqckczh.chatgpt.site
오피스: https://twottiva-ai-office.jwjsqckczh.chatgpt.site/office

## 2026-10-13 변경 기록 (Claude)
바뀐 파일: app/Belior.tsx, app/belior.css, app/[section]/page.tsx, app/[section]/[detail]/page.tsx, tests/rendered-html.test.mjs, public/belior/v3/ (새 이미지·영상).
오피스(app/office, app/game, worker, company.config.ts)와 문의 API(/api/inquiries)는 건드리지 않았습니다.

- 메인: 브랜드 필름(앞 8초 NUNRT 구간 제외) → MUSIC → Brand Gala Dinner Show → COLLECTION → 동물 6종 슬라이드 → 원래 메종(챕터 5개, The House·TWOTTIVA, The Evening, 콘텐츠, Objects, Services) → No. 16 → PRIVATE.
- 상단: MENU · 메종 심볼 · EN/KR · PRIVATE ENQUIRIES. MENU는 7개 묶음 하위 메뉴.
- 페이지 전환: 사자-B 모노그램부터 SWAN·ORCA·LEOPARD·PANTHER·PHOENIX 엠블럼이 차례로 나오고, 동물 페이지로 갈 때는 그 동물 엠블럼. 대표 요청으로 넣은 전환 효과이며 '별도 로딩 화면 없음' 규칙과 다르게 바뀌었습니다.
- 새 경로: /maison, /objects, /music/artists, /music/performances, /music/gala, /music/inquiry, /products/no-16.
- 동물 페이지: 세계관 문장 → 엠블럼·키워드·소재·패턴 → 사물 → 향 → 아틀리에 → 다른 세계 → 다음 세계 → 메종.
- 사이트 문구에서 부첼라티 표기를 Brand Gala Dinner Show로 바꿈. 사진 속 간판은 그대로 남아 있음.
- 확인: npm run build 성공, node --test 28개 통과(새 경로 포함), 1280px·390px에서 가로 넘침 없음.

## 2026-10-13 추가 변경
- PRIVATE 페이지 첫 장면과 메인 마지막 장면: 혹등고래가 빛줄기 속을 천천히 헤엄치는 움직이는 장면(public/belior/v3/whale.jpg, CSS 애니메이션). 움직임 줄이기 설정에서는 멈춤.
- 하단의 "제품·공간 이미지는 컬렉션 콘셉트…" 문구와 페이지 곳곳의 "시안 단계/Concept" 표기를 삭제.
- No. 16 이미지: 대표가 보낸 No. 16 화면 2장에서 사진 6장을 잘라 사용(public/belior/v3/no16-*.jpg). 이전의 워터마크 말 사진은 교체됨.

## 2026-10-13 추가 변경 (2)
- /products/no-16: 대표가 보낸 화면 2장 그대로 재구성한 아이보리 페이지(No.16 · A memory, held. → The moments that stay. → Before it was a scent, it was a memory. → 01 The Forest · 02 The Warmth · 03 The Presence → 어린 시절).
- 메인: 동물 슬라이드 다음에 원래 메종 첫 화면(음악에서 시작된 하나의 하우스. / A heritage for a brighter tomorrow / Art · People · Places and beauty / 컬렉션 살펴보기 · 연주 보기 · DISCOVER BELiOR)을 넣음.
- 메종 소개 아래 BELiOR Gallery · Chapter 02 SWAN LAKE(Tchaikovsky — Swan Lake, Op. 20) 챕터를 넣음. 메인과 /maison에 모두 나옴.

## 2026-10-13 추가 변경 (3)
- 페이지 전환: 페라리처럼 가운데 작은 문양(44~60px) 하나만 표시. 동물 이름·선·페이지 이름 글자는 숨김.

## 2026-10-13 추가 변경 (4)
- The Evening: "프라이빗 갈라·콘셉트 필름" 영상 삭제. 그 자리에 야외 4중주 가로 사진(v3/eve-quartet.jpg)을 원본 비율 그대로(잘림 없음) 넣음.
- 문의 페이지에서 동물(고래) 연출 삭제. /private는 초대 시안(BELiOR Atelier · Invitation Only) 기반, /music/inquiry는 촛불 연회장 사진(v3/gala-hall.jpg)과 정돈된 폼으로 다시 구성. 문의 API는 그대로.
- Swan Lake 리허설 사운드: v3/swan-lake.m4a. 메인 영상 왼쪽 아래와 Swan Lake 챕터에 "듣기" 버튼(누르면 서서히 커지며 반복 재생). SWAN 페이지에는 소리 있는 Swan Lake 필름(v3/swan-lake-film.mp4).
- 확인 필요: /private 시안 문구 "Three Cities. One Vision."과 SEOUL·PARIS·NEW YORK 이미지는 대표 제공 시안 그대로임.

## (5) v7 — 주소 삭제 · 애플 기본서체 · 비주얼 팀 · 원본 화질 필름
- 푸터 사업장 주소 삭제, 메일 contact@belior.co.kr 로 통일.
- 한글은 Apple 시스템 서체(-apple-system / Apple SD Gothic Neo) 우선, 작은 크기(.ko 클래스). Noto Serif KR 제거.
- 연주자 포스터 이미지·문구 전부 삭제. "Silk & Textile" 도어 삭제.
- The Art of a Living Moment: eve-quartet.jpg 위치 86% 55% — 대표가 잘리지 않음(데스크톱·모바일 확인).
- 브랜드 필름 1080p H.264(belior-film-1080.mp4, 2-pass 1400k).
- 신규 섹션: TwoHouses, VisualTeam(피아노 사진), Founder, Artists, OfficialStage, GuestJourney, SymphonicAtelier, BeyondLogo, Operation.
- AstonHouse 제안서에서는 일반 BELiOR 내용만 사용. 고객명·금액은 넣지 않음.

## (6) v8 — ORCA · PHOENIX 화질 복구
- orca.jpg: 새 원본(84)에서 2560px 고화질로 교체(기존 43KB 저화질). 틸 색감 그대로.
- phoenix-scene.jpg 신규(85, 2560px). PHOENIX도 다른 동물처럼 풀 화면 장면 사용(기존 232px 이미지 확대 → 깨짐 해결).
- posOf(): ORCA 36% 45%(모바일에서 머리 보이게), PHOENIX 74% 45%.

## (7) v9 — 움직임 · 필름 자막 삭제 · 메일 2개
- 브랜드 필름: 원본에서 "BEYOND FORM / 관습을 벗어난 아름다움, NUNRT." 자막 구간(원본 32.6–39.5s) 삭제 → belior-film-v9.mp4 (1080p, 2-pass 1600k).
- ZoomStage: 사자 눈에서 시작해 스크롤하면 전체로 물러나는 카메라(홈 One Symbol, 모든 컬렉션 상세). FOCAL 표에서 눈 위치 조정.
- 텍스트 등장(.rv, JS가 있을 때만), 장면 제목 순차 등장, 필름 Scroll 표시, 컬렉션 슬라이드 6초 자동 넘김 + 진행 점 + 일시정지(페라리 방식).
- 신규: No. 01 The Tchaikovsky Edition(tchaikovsky.mp4), 피날레 "The music ends. The moonlight stays. / One team, one enquiry."
- 문구: "무대가 아닌 곳에서도, 무대처럼" → "바람이 지나간 자리에 선율이 남습니다". '콘셉트' 표현 삭제.
- 푸터·문의: contact@belior.co.kr + twottiva.business@gmail.com. 주소·면책 문구 없음.
- 참고 이미지: public/belior/refs/ (REF 상수). 저해상도라 화면에는 쓰지 않음, 고해상도 원본 오면 교체.
- .belior overflow-x: clip (sticky 동작 위해).
