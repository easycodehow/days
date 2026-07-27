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
