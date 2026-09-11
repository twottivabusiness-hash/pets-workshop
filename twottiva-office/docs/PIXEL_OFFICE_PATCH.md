# 로컬 픽셀 오피스 병합 패치

대상: 로컬 TWOTTIVA AI Office (`app/game/` + `OfficeWorld.tsx`)
전제: **기존 픽셀 UI·타일맵·스프라이트는 그대로 둔다.** 바꾸는 것은 "누가 어디로 왜 움직이는가"뿐이다.

---

## 0. 파일 배치

```
dist/twottiva-office-engine.js   → 로컬 앱의 public/ 또는 src/vendor/ 에 복사
```

또는 소스 그대로:

```
src/office/employees.ts     (32명 SOP — 정본 로스터)
src/office/daily-engine.ts  (TASK 자동 생성)
src/office/simulation.ts    (TASK → 캐릭터 위치)
src/office/runtime.ts       (오케스트레이션 · 인계 · CEO 상한)
```

---

## 1. dayScript 제거

`app/game/sim.ts`에서 시간표 기반 이동을 전부 삭제한다.

```diff
- // 삭제: 랜덤/시간표 이동
- function dayScript(t) {
-   if (t < 9)  return { status: '출근 전', room: 'entrance' };
-   if (t < 12) return { status: '업무 중', room: pickRandomRoom() };
-   if (t < 13) return { status: '휴식',   room: 'lounge' };
-   ...
- }
- setInterval(() => agents.forEach(a => Object.assign(a, dayScript(hour()))), 1000);
```

```diff
+ import { OfficeRuntime } from '../office/runtime';
+
+ const runtime = new OfficeRuntime(await loadOfficeState());
+
+ // 캐릭터 위치는 파생값이다. 직접 대입하지 않는다.
+ function renderTick() {
+   for (const a of runtime.snapshot()) {
+     const sprite = spriteById[a.employeeId];
+     if (!sprite) continue;
+     sprite.moveTo(ROOM_TILES[a.room], a.station);  // 기존 pathfinding 그대로 사용
+     sprite.setBubble(a.bubble);
+     sprite.setStatusIcon(a.status);                 // 10종 상태
+   }
+ }
```

`snapshot()`은 32명 전원을 항상 반환한다. 활성 TASK가 없는 직원은
`{ status:'idle', room:'home-team-room', station:'own-desk' }` 로 **제자리에 선다.**
가짜로 움직이는 캐릭터는 이제 존재하지 않는다.

## 2. 상태 아이콘 매핑

기존 5종(`출근 전/대기/업무 중/이동 중/휴식`)을 아래 10종으로 교체한다.

| status | 표시 | 방 |
|---|---|---|
| `idle` | 대기 | home-team-room |
| `queued` | 배정됨 | 담당 부서실 |
| `researching` | 조사 중 | 담당 부서실 / research-desk |
| `working` | 업무 중 | 담당 부서실 |
| `collaborating` | 협업 | 담당 부서실 |
| `waiting_external` | 외부 회신 대기 | waiting-zone / mailbox |
| `approval_required` | 대표 승인 대기 | approval-room / approval-door |
| `blocked` | 확인 필요 | blocked-marker |
| `completed` | 완료·인계 중 | handoff-desk |
| `field_operation` | 현장 운영 | entrance / field-exit |

`휴식`은 삭제한다. TASK 없는 상태는 `idle` 하나로 통일한다.

## 3. 부서 상세실 = 드릴다운 전용

`/blog-team`, `/sales-team` 같은 라우트는 **메인이 아니다.**
캐릭터 또는 부서 타일 클릭 시에만 열리는 상세 업무실로 둔다.

```ts
onSpriteClick(employeeId) {
  const team = EMPLOYEE_BY_ID[employeeId].team;
  openDrawer(`/team/${team}`, { tasks: runtime.byEmployee(employeeId) });
}
```

메인 화면은 항상 픽셀 오피스다.

## 4. 동결 객체 버그 수정 (`Cannot add property N, object is not extensible`)

`watchApprovals()` / `todos` 워처. 플랫폼이 돌려주는 doc은 **frozen**이다.

```diff
- const rows = snap.docs.map(d => d.data()).filter(Boolean);
+ const rows = snap.docs.map(d => ({ ...d.data() })).filter(Boolean);

- else this.approvals.push(r);
+ else this.approvals.push({ ...r });

  async hold(id) {
-   a.status = 'held'; a.heldAt = Date.now();
+   const i = this.approvals.findIndex(x => x.id === id);
+   this.approvals[i] = { ...this.approvals[i], status: 'held', heldAt: Date.now() };
  }
```

`todos` 워처도 동일한 형태이므로 같이 고친다.

## 5. CEO 상한

```ts
const brief = runtime.ceoBrief();   // 항상 ceoTodoCount <= 3
```

`buildCEOBrief`가 3건을 넘겨줘도 `OfficeRuntime.ceoBrief()`가 잘라낸다.
화면에서 대표 할 일이 4개 이상 보이면 그것은 엔진을 우회한 코드다.

## 6. 인수 기준

```
npx tsx test/acceptance.ts   # 22개 검증 전체 통과
```

로컬 병합 후에도 같은 시나리오가 화면에서 재현되어야 한다:
데이터 감지 → TASK 자동생성 → 실명 배정 → 캐릭터 이동 → 완료(증빙 포함)
→ 다음 부서 인계 → 인계받은 캐릭터 이동 → 대표 승인 1건.

대표가 행사명·타깃·주제를 직접 타이핑해야 시작된다면 실패다.
