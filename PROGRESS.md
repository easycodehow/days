# PROGRESS

작업 기록은 이 파일 맨 아래에 누적한다 (기존 기록 삭제 금지).

---

## 2026-07-27

### 현재 상태
- `CLAUDE.md` 작성 완료 (개발가이드·체크리스트 확정).
- 아직 코드 파일 없음 — `css/`, `js/` 폴더는 비어있음.
- `icons/`: PWA 아이콘 준비됨 (icon-192x192.png, icon-512x512.png)
- `reference/`: 디자인 참고 자료 준비됨
  - diary-app-color-chips.png (컬러칩)
  - 메인화면.png / 글하나 선택시 화면.png / 상세보기 화면.png (화면 목업)
  - 데이즈_클로드앰디_초안.txt, 데이즈앱_브리핑.txt (기획 텍스트)
- 체크리스트 진행 상황: **1단계(프로젝트 기본 설정)도 아직 시작 전**

### 다음 작업 제안
- 1단계 "파일 구조 생성" 항목부터 진행:
  - 폴더 구조 생성 (`js/views/`, `js/ui/`, `assets/`)
  - `index.html` 엔트리 포인트 생성
  - `css/variables.css` — 컬러 시스템 CSS 변수 선언
  - `css/base.css` — 리셋·전역 기본 스타일
- 착수 전 "시작"/"go" 승인 필요 (CLAUDE.md 작업 규칙).

---

## 2026-07-27 (2)

### 이번에 완료한 작업
- 1단계 "파일 구조 생성" 완료
  - 폴더 생성: `js/views/`, `js/ui/`, `assets/fonts/`
  - `index.html` 생성 — `css/variables.css`, `css/base.css` 링크 + `js/main.js` 모듈 엔트리 참조 (main.js는 2단계에서 생성 예정, 아직 없음)
  - `css/variables.css` 생성 — 컬러칩 원본 팔레트 변수 + 역할 변수 + 타이포 변수, 다크모드 역할 변수 재정의(제안값) 포함
  - `css/base.css` 생성 — 리셋, 전역 기본 스타일, 포커스 링(`--focus-ring`) 접근성 처리
- `CLAUDE.md` 체크리스트 갱신 (파일 구조 생성 4항목 체크 완료, 2026-07-27)

### 다음 작업 제안
- 1단계 "Git 설정" (별도 기능 단위 — 다음 승인 필요)
  - `git init` 및 `.gitignore` 작성
  - GitHub 원격 저장소 연결
  - 최초 커밋
- 이후 2단계 "메인화면 디자인 초안 잡기"로 진행 가능

---

## 2026-07-27 (3)

### 이번에 완료한 작업
- 1단계 "Git 설정" 완료
  - `.gitignore` 작성 (OS/에디터/배포/로그 파일 제외)
  - `git init` (기본 브랜치 `master` → `main`으로 변경)
  - 전역 git 사용자 설정: `user.name=easycode`, `user.email=easycodehow@gmail.com`
  - 최초 커밋 (`000363f`, 14개 파일)
  - GitHub 원격 저장소 연결: `https://github.com/easycodehow/days.git` (origin)
  - `git push -u origin main` 완료 — GitHub에 초기 푸시 완료
- `CLAUDE.md` 체크리스트 갱신 (Git 설정 3항목 체크, 1단계 전체 완료로 표시, 2026-07-27)
- **1단계(프로젝트 기본 설정) 전체 완료**

### 다음 작업 제안
- 2단계 "메인화면 디자인 초안 잡기"로 진행
  - "한줄 캘린더" 헤더 컴포넌트 (`js/ui/calendarBar.js`)
  - 떠다니는 메모 원(뭉게구름) 레이아웃 (`js/views/mainView.js`)
  - 중요도(size) → 원 크기 매핑
  - 실선/점선(realized) · 회색(지난 날짜) 상태 표현
- 착수 전 "시작"/"go" 승인 필요 (CLAUDE.md 작업 규칙).

---

## 2026-07-27 (4)

### 이번에 완료한 작업
- 2단계 "메인화면 디자인 초안 잡기" 구현 (코드 작성 + 1차 자동화 확인 완료, 2차 실기기 확인은 대기 중)
  - `js/memo.js` (신규): 중요도(size)→원 지름/제목 폰트 크기 매핑, 지난 날짜 판정 헬퍼
  - `js/ui/calendarBar.js` (신규): 오늘 중심 한줄 캘린더 헤더
  - `js/views/mainView.js` (신규): 떠다니는 메모 원 렌더링 (실선/점선/회색/부유 애니메이션)
  - `js/main.js` (신규): 엔트리, 임시 목업 데이터(`MOCK_MEMOS`)로 렌더링 — 실제 저장 연동은 "메모 저장/불러오기" 단계에서 `store.js`로 교체 예정
  - `css/layout.css`, `css/components.css` (신규)
  - 1차 확인: 로컬 정적 서버(`python -m http.server`) + 헤드리스 Chrome 스크린샷으로 렌더링 확인 — 크기/실선·점선/회색 규칙 정상 동작
- 사용자 요청으로 "배포 후 홈화면 PWA 설치까지 확인"하는 방향으로 결정 → 2단계 "배포하기" + 3단계 "PWA 필수" 중 설치에 필요한 최소 항목을 함께 진행 (기능이 실제로 동작하려면 매니페스트+서비스워커가 필요하기 때문)
  - `manifest.webmanifest` (신규): name/short_name/description/start_url/display:standalone/theme_color(#1F3A54)/background_color(#E8F1FA)/icons(192,512)
  - `service-worker.js` (신규, 루트): 앱 셸 프리캐싱 + 캐시 우선 fetch 핸들러
  - `index.html` (수정): manifest 링크, theme-color meta, apple-touch-icon 등 iOS/Android 설치 관련 태그 추가
  - `js/main.js` (수정): 서비스워커 등록 코드 추가
  - 1차 확인: 로컬 서버에서 manifest.webmanifest/service-worker.js 정상 서빙 + 페이지 렌더링 정상 확인
- **Vercel CLI 미설치 상태** — 배포는 GitHub 연동(Vercel 대시보드에서 이 repo import)으로 진행 예정. 실제 배포·로그인은 사용자 액션 필요.

### 다음 작업 제안
- GitHub에 현재 변경사항 커밋·푸시
- Vercel 대시보드에서 GitHub repo(`easycodehow/days`) 연결 및 배포 (사용자 액션 필요 — 로그인 등)
- 배포 URL로 폰에서 접속 → "홈 화면에 추가"로 PWA 설치 → 실제 화면/설치 여부 2차 확인
- 2차 확인 통과 후 CLAUDE.md 체크리스트(메인화면 디자인 초안, 배포하기, PWA 필수 manifest/service-worker/설치 확인 항목) 체크 예정
- 이후 2단계 "원 드래그" 또는 "메모 저장/불러오기"로 진행 (다음 승인 필요)

---

## 2026-07-27 (5)

### 이번에 완료한 작업
- 사용자가 Vercel 배포(https://days-green.vercel.app/) 완료, 폰 홈화면 PWA 설치까지 확인 완료 → **2차 확인 통과**
  - CLAUDE.md 배포 URL 기입, 관련 체크리스트 전부 체크 완료(2026-07-27):
    - 메인화면 디자인 초안 잡기 4항목
    - 배포하기(Vercel 연결/배포) 2항목
    - PWA 필수(manifest/service-worker/설치 확인) 3항목
- 신규 요청: 헤더 왼쪽 상단에 "days" 로고 배치 (체크리스트에 없던 항목 → "메인화면 디자인 초안 잡기" 아래에 새로 추가 후 진행)
  - `js/main.js`: 헤더에 `.app-header__brand`("days" 텍스트) 추가
  - `css/layout.css`: 로고 스타일 추가
  - **버그 발견 및 수정**: `renderCalendarBar()`가 전달받은 컨테이너의 `innerHTML`을 초기화하는데, 기존 코드가 `header` 엘리먼트를 그대로 넘기고 있어 캘린더 바 렌더링 시 `app-header` 클래스와 로고가 함께 지워지던 문제 발견. 캘린더 바 전용 하위 컨테이너를 분리해서 해결 → 부수적으로 헤더 배경/구분선 스타일도 정상 적용되기 시작함 (이전엔 클래스가 덮어써져 미적용 상태였음)
  - 1차 확인: 헤드리스 Chrome 스크린샷으로 로고·헤더 스타일 정상 렌더링 확인
- `CLAUDE.md` 체크리스트에 "헤더 왼쪽 상단에 days 로고 배치" 항목 추가 후 체크 완료(2026-07-27)

### 다음 작업 제안
- 로고 변경사항 GitHub 푸시 → Vercel 자동 재배포 → 폰에서 최종 확인(2차 확인)
- 이후 2단계 "원 드래그" 또는 "메모 저장/불러오기"로 진행 (다음 승인 필요)

---

## 2026-07-27 (6)

### 이번에 완료한 작업
- 사용자가 로고 반영 2차 확인 완료 (설치 앱 재실행 필요했음 — 서비스워커가 v1에서 안 넘어가고 있었던 것으로 추정)
- 신규 요청: 헤더 + 상태표시줄 색상을 sky-200(`#B2CDE6`)으로 변경
  - `css/layout.css`: `.app-header` 배경색을 `var(--sky-200)`으로 변경 (기존 `--bg-soft`에서 변경)
  - `index.html`: `theme-color` meta `#B2CDE6`으로 변경
  - `manifest.webmanifest`: `theme_color` `#B2CDE6`으로 변경
  - `service-worker.js`: 캐시 버전 `v2` → `v3` (앱 셸 변경 반영을 위해 필수 — 버전 안 올리면 지난번과 동일한 캐시 미갱신 문제 재발)
  - 1차 확인: 헤드리스 Chrome 스크린샷으로 헤더 색상 정상 적용 확인
  - GitHub 푸시 → Vercel 배포 완료(`days-cache-v3` 라이브 확인) → 2차 확인(사용자 실기기) 대기 중
- **참고**: iOS는 상태표시줄에 임의 색상을 직접 못 입히는 구조(`default`/`black`/`black-translucent` 중 선택)라 안드로이드/설치 앱 기준으로만 완전히 반영됨을 사용자에게 안내함

### 다음 작업 제안
- 사용자의 헤더/상태바 색상 2차 확인 대기
- 확인 후 2단계 "원 드래그" 또는 "메모 저장/불러오기"로 진행 (다음 승인 필요)

---

## 2026-07-27 (7)

### 이번에 완료한 작업
- 사용자가 헤더 색상(sky-200) 확인 후, 상태표시줄만 별도로 `sky-500`(`#5A83AC`)으로 지정 요청 (헤더 배경은 sky-200 유지, 상태바만 다른 색)
  - `index.html`: `theme-color` meta `#5A83AC`으로 변경
  - `manifest.webmanifest`: `theme_color` `#5A83AC`으로 변경
  - `service-worker.js`: 캐시 버전 `v3` → `v4`
  - GitHub 푸시 → Vercel 배포 완료(`days-cache-v4` 라이브 확인)
- 사용자 2차 확인(실기기, 앱 재실행) 대기 중

### 다음 작업 제안
- 상태표시줄 색상 2차 확인 대기
- 확인 후 2단계 "원 드래그" 또는 "메모 저장/불러오기"로 진행 (다음 승인 필요)

---

## 2026-07-27 (8)

### 이번에 완료한 작업
- 신규 요청: 선택된(오늘) 날짜 배경색을 pink-100으로 변경, `reference/핑크.png` 참고
  - 사용자 확인: "선택된 날짜" = 현재 앰버색으로 강조되던 "오늘" 셀 맞음
  - `css/variables.css`: 새 핑크칩 팔레트 추가 — `--pink-100(#FCE7EF)`, `--pink-200(#F8D3E1)`, `--pink-300(#F3B4CD)`, `--candy-500(#F2609A)`, `--candy-600(#DE4A85)`
  - `CLAUDE.md`: 컬러 시스템 문서(테이블 + `:root` 예시 코드블록)에 핑크칩 섹션 추가 — 기존 sky/amber와 동일한 문서화 규칙 적용
  - `css/layout.css`: `.calendar-bar__item--today` 배경 `var(--accent)`(amber) → `var(--pink-100)`, 텍스트는 앰버 오버라이드 제거하고 기본 `--ui-text`/`--ui-text-strong` 유지
  - `service-worker.js`: 캐시 버전 `v4` → `v5`
  - 1차 확인: 헤드리스 Chrome 스크린샷으로 pink-100 배경 정상 적용 확인
  - GitHub 푸시 → Vercel 배포 완료(`days-cache-v5` 라이브 확인) → 2차 확인(사용자 실기기) 대기 중

### 다음 작업 제안
- 오늘 셀 pink-100 색상 2차 확인 대기 (앱 완전 종료 후 재실행 필요)
- 확인 후 2단계 "원 드래그" 또는 "메모 저장/불러오기"로 진행 (다음 승인 필요)

---

## 2026-07-27 (9)

### 이번에 완료한 작업
- 사용자가 pink-100 오늘 셀 색상 2차 확인 완료 → 다음 기능 진행 요청
- 2단계 "메모 저장/불러오기" 구현 ("원 드래그"가 `store.save()`에 의존하므로 순서상 먼저 진행)
  - `js/store.js` (신규): `loadMemos()`/`saveMemos()` — `days.memos` 키에 `{version, memos}` 구조로 저장
  - `js/main.js` (수정): 기존 `MOCK_MEMOS`를 `SEED_MEMOS`로 이름 변경, `getInitialMemos()` 추가 — 저장소가 비어있으면(최초 실행) 시드 데이터를 저장 후 사용, 있으면 저장된 데이터를 로드해서 사용
  - `service-worker.js`: `APP_SHELL`에 `/js/store.js` 추가, 캐시 버전 `v5` → `v6`
  - 1차 확인: 헤드리스 Chrome으로 (1) 앱 최초 로드 → localStorage 시드 저장 확인, (2) 별도 디버그 페이지에서 저장된 데이터 정상 로드 확인 (동일 브라우저 프로필 사용, 임시 디버그 파일은 검증 후 삭제·미커밋)
- `CLAUDE.md` 체크리스트 "메모 저장/불러오기" 2항목 체크 완료(2026-07-27)
- **참고**: 이 기능은 화면상 변화가 없어(시드 데이터가 그대로 보임) 실기기에서 육안으로 "저장이 실제로 되는지"까지는 구분하기 어려움 — 자동화 테스트로 localStorage 동작 자체는 검증 완료. 실기기 2차 확인은 배포 후 앱이 이상 없이 뜨는지 정도의 스모크 테스트로 진행

### 다음 작업 제안
- GitHub 푸시 → Vercel 배포 → 사용자 스모크 테스트(2차 확인)
- 확인 후 2단계 "원 드래그" 진행 (다음 승인 필요) — `js/ui/drag.js`, Pointer Events 기반, `store.save()` 연동

---

## 2026-07-27 (10)

### 이번에 완료한 작업
- 사용자가 store.js 스모크 테스트 통과 후 "드래그가 안돼"라고 문의 → 아직 미구현 상태였음을 안내(다음 예정 기능이었음), 승인받아 진행
- 2단계 "원 드래그(위치 이동)" 구현
  - `js/ui/drag.js` (신규): Pointer Events(`pointerdown`/`pointermove`/`pointerup`/`pointercancel`) 기반 드래그, `setPointerCapture`, 6px 임계값으로 탭/드래그 구분, 드래그 종료 시 컨테이너 대비 %(`xPct`/`yPct`) 계산 후 `onDragEnd` 콜백 호출
  - `js/views/mainView.js` (수정): 각 메모 원에 `makeDraggable` 연결, `onMemoMove` 콜백 전달받도록 시그니처 변경
  - `js/main.js` (수정): `onMemoMove`에서 메모 배열 갱신 + `saveMemos()` 호출
  - **버그 발견 및 수정**: `css/components.css`의 `.dragging`이 `animation-play-state: paused`를 쓰고 있었는데, 일시정지된 CSS 애니메이션은 멈춘 시점의 `transform` 값을 계속 우선 적용해서 JS가 드래그 중 바꾸는 인라인 `transform`이 화면에 반영되지 않는 문제 발견 → `animation: none`으로 수정해 해결
  - `service-worker.js`: `APP_SHELL`에 `/js/ui/drag.js` 추가, 캐시 버전 `v6` → `v7`
  - 1차 확인: Chrome DevTools Protocol로 실제 마우스 드래그 이벤트를 시뮬레이션 — 드래그 중 `.dragging` 클래스 적용, 드래그 종료 후 위치 갱신(62%→74%, 38%→43.9%) 및 `localStorage`에 동일 좌표로 저장까지 end-to-end 확인
- `CLAUDE.md` 체크리스트 "원 드래그" 5항목 체크 완료(2026-07-27)
- GitHub 푸시 → Vercel 배포 완료(`days-cache-v7` 라이브 확인) → 2차 확인(사용자 실기기, 터치 드래그) 대기 중

### 다음 작업 제안
- 사용자가 폰에서 실제 터치 드래그로 확인(2차 확인) — 자동화 테스트는 마우스 이벤트 기반이라 터치 특유의 이슈(예: 스크롤 충돌)는 실기기 확인이 특히 중요
- 확인 후 2단계 "CRUD 기능"(메모 추가/미리보기/상세보기/수정/삭제) 또는 "검색 & 필터"로 진행 (다음 승인 필요)

---

## 2026-07-27 (11)

### 이번에 완료한 작업
- 사용자가 드래그 2차 확인 완료 → "CRUD 기능" 중 미리보기/상세보기/수정/삭제 구현 (레퍼런스 `글하나 선택시 화면.png`, `상세보기 화면.png` 참고)
  - **"메모 추가"는 이번 범위에서 제외** — 새 메모 생성 진입점(+ 버튼 위치 등)이 설계에 명시돼 있지 않아 별도 논의 필요, 체크리스트에 메모로 남겨둠
  - `js/views/mainView.js`: 탭하면 원이 커지며 본문 미리보기 + "+" 버튼 표시. 열려 있던 다른 원은 자동으로 닫힘. `container.className`을 매번 완전히 재설정하도록 변경(이전 calendarBar 버그와 동일한 클래스 잔류 문제 예방)
  - `js/views/detailView.js` (신규): 전체 본문 + 수정/삭제/저장하기. 수정 시 제목/본문이 입력 필드로 전환, 삭제는 `window.confirm()` 확인 후 처리, 저장하기는 변경사항 반영 후 목록으로 복귀
  - `js/main.js`: 메인뷰 ↔ 상세뷰 전환(`showMain`/`showDetail`) 로직 추가
  - `css/components.css`, `css/layout.css`: 미리보기(확대된 원)·상세보기·`.btn`(amber/danger) 스타일 추가
  - **버그 발견 및 수정 (1차)**: 상세보기에서 제목/본문이 읽기용+편집용이 동시에 보이는 문제 발견 — `titleInput.hidden = true` 같은 `hidden` 속성 토글이 `layout.css`의 `.detail-view__title-input { display: block }` 규칙에 밀려 무시됨
  - **버그 발견 및 수정 (2차)**: 1차 수정으로 `.is-hidden { display:none }` 클래스를 추가했지만 여전히 재현 — `base.css`가 `layout.css`보다 먼저 로드되기 때문에 동일 우선순위(클래스 1개)에서 나중에 로드된 layout.css가 이김. `.is-hidden`에 `!important` 추가로 최종 해결
  - 1차 확인: Chrome DevTools Protocol로 탭→미리보기→상세보기→수정→저장→(재오픈)삭제 전체 흐름을 실제 이벤트로 시뮬레이션, `localStorage` 반영까지 end-to-end 확인 + 스크린샷으로 미리보기/상세보기/편집 모드 시각 확인
- `CLAUDE.md` 체크리스트: 미리보기/상세보기/수정/삭제 4항목 체크 완료(2026-07-27), "메모 추가"는 진입점 미정 메모 남기고 미체크 유지
- GitHub 푸시 → Vercel 배포 완료(`days-cache-v8` 라이브 확인) → 2차 확인(사용자 실기기) 대기 중

### 다음 작업 제안
- 사용자가 폰에서 탭→미리보기→상세보기→수정/삭제 흐름 실기기 확인(2차 확인)
- "메모 추가" 진입점(예: 헤더의 + 버튼, 빈 배경 탭, 캘린더 날짜 길게 누르기 등) 논의 필요 — 사용자 의견 확인 후 진행
- 확인 후 "메모 추가" 또는 "검색 & 필터"로 진행 (다음 승인 필요)

---

## 2026-07-27 (12)

### 이번에 완료한 작업
- 사용자가 "메모 추가" 진입점으로 헤더 `+` 버튼 방식 선택 → 구현
  - `js/main.js`: 헤더 상단을 브랜드(좌)+`+`버튼(우) 가로 배치로 변경. `+` 클릭 시 빈 메모 초안(오늘 날짜, size 3, 랜덤 위치) 생성 후 상세보기를 편집 모드로 바로 열기. "저장하기"를 눌러야 실제 목록에 추가(취소 시 아무것도 안 남음), 제목 비우면 "제목 없음"으로 저장
  - `js/views/detailView.js`: `startEditing` 옵션 추가(새 메모는 처음부터 편집 상태), `onDelete` 콜백이 없으면 삭제 버튼 자체를 렌더링하지 않도록 변경(저장 전 메모는 삭제할 대상이 없으므로)
  - `css/layout.css`: 헤더 상단 `flex` 배치(`app-header__top`), `.app-header__add` 원형 버튼 스타일
  - `service-worker.js`: 캐시 버전 `v8` → `v9`
  - 1차 확인: CDP로 (1) `+` 클릭 시 삭제버튼 없이 편집모드로 바로 열림, (2) 제목/내용 입력 후 저장 시 `localStorage`에 새 메모 추가 + 화면에 새 원 표시 + 메인뷰로 복귀까지 end-to-end 확인, 스크린샷으로 헤더 버튼·작성 화면 시각 확인
- `CLAUDE.md`: "메모 추가" 체크 완료(2026-07-27, 실제 구현 방식으로 문구 수정), 공통 헤더 규칙에 `+` 버튼 설명 추가
- GitHub 푸시 → Vercel 배포 완료(`days-cache-v9` 라이브 확인) → 2차 확인(사용자 실기기) 대기 중
- **참고**: 이전 세션 "미리보기/상세보기/수정/삭제" 기능(2026-07-27 (11) 기록)에 대한 사용자의 실기기 2차 확인은 아직 별도로 받지 않은 상태 — 이번 "메모 추가" 확인과 함께 한 번에 받을 예정

### 다음 작업 제안
- 사용자가 폰에서 전체 CRUD 흐름(미리보기→상세보기→수정/삭제→헤더 `+`로 추가) 실기기 확인(2차 확인)
- 확인 후 "검색 & 필터" 또는 3단계 항목으로 진행 (다음 승인 필요)
