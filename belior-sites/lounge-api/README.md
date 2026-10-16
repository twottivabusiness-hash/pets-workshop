# BELiOR Lounge API

손님 한 분 한 분을 알아보는 라운지 서버입니다. Cloudflare Worker 하나와 KV 저장소 하나로 돌아갑니다. (무료 플랜으로 충분)

## 올리는 법 (대시보드, 10분)

1. Cloudflare 대시보드 → **Workers & Pages** → **Create** → **Create Worker** → 이름 `belior-lounge` → Deploy.
2. 열린 편집기에 `worker.js` 내용을 전부 붙여 넣고 **Deploy**.
3. **Storage & Databases → KV** → **Create namespace** → 이름 `belior-guests`.
4. Worker `belior-lounge` → **Settings → Bindings → Add → KV namespace** → Variable name `GUESTS`, Namespace `belior-guests` → Save.
5. **Settings → Variables and Secrets → Add** → Type **Secret**, Name `ADMIN_KEY`, Value = 대표만 아는 긴 비밀번호 → Save.
6. Worker 주소 확인: `https://belior-lounge.<계정>.workers.dev`

## 손님 등록

`https://belior-lounge.<계정>.workers.dev/admin` 을 열고 ADMIN_KEY 입력 → 이름·등급·메모 → **초대 링크 만들기**.
만들어진 링크를 그 손님께 보내면, 누르는 순간 라운지가 그분 이름으로 열립니다. 삭제하면 그 링크는 바로 닫힙니다.

## 사이트 연결

Worker 주소를 알려 주시면 사이트의 `LOUNGE_API` 값에 넣어 다시 배포본을 만듭니다. 그 전까지는 등급별 공용 링크로 동작합니다.
