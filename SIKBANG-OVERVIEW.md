# sikbang.co 전체 사이트 개요

## 사업 정보

- 서비스명: 식빵영어
- 도메인: sikbang.co
- 대표: 안준영
- 사업자등록번호: 807-29-01639
- 소재지: 부산광역시 진구 만리산로98, 2층
- 이메일: lulu066666@gmail.com
- 카카오톡 채널: http://pf.kakao.com/_SJYQn
- OPIC 준비생 오픈채팅: https://open.kakao.com/o/g0jE5t8f (770+명)
- 인스타그램: @sikbang.eng
- 네이버 블로그: https://blog.naver.com/lulu05

---

## 기술 스택

- Next.js 16.2.1 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4 (설치되어 있으나, 실제 스타일링은 대부분 CSS-in-JS / style jsx 방식)
- Vercel 자동 배포 (main push 시)
- GitHub: https://github.com/JacobanXXX/sikbang-eng-web
- Vercel Team: team_krv37J4vHS0pCUKF3d3McWDJ
- Vercel Project: prj_G68n86WYO5sMs1yQUq93tEPE7hm1

---

## 상품 라인업

### 1. OPIC 전자책 + 기출 번들 (39,900원)
- 네이버 블로그에서 판매: https://blog.naver.com/lulu05/223353024018
- 프레임워크 답변 템플릿 7개, 실전 기출 문제 포함
- 가장 많은 수강생이 선택한 베스트셀러

### 2. OPIC 완전정복 인강 패키지 (169,000원, 원가 269,000원, -37%)
- 라이브클래스에서 판매: https://sikbang-eng.liveklass.com/
- 유형별 답변 전략 + 실전 롤플레이
- 인강 수강 후기 250+건, 평점 5.0/5.0

### 3. 2주 집중 OPIC 스터디
- sikbang.co/study 에서 직접 모집 및 신청
- 3인 1팀 소그룹, 14일간 매일 스피킹 과제 제출
- 코치 실시간 피드백 + SpeakCoach AI 정밀 분석
- 수료생 94% 목표 달성
- 성적 미향상 시 무료 재수강 보증

#### 스터디 가격 체계 (자동 기수 시스템)
- 기수: 매월 1일, 15일 시작 (월 2회)
- 모집 기간: 이전 기수 시작일 ~ 다음 기수 시작 전날
- 얼리버드 (모집 시작 ~ 시작 5일 전): 149,900원 (원가 259,900원, -42%)
- 정가 (시작 5일 전 ~ 마감): 179,900원 (원가 259,900원, -31%)

#### 스터디 플랜
- 일반 스터디: 얼리버드 119,900원 / 정가 149,900원 (교재비 별도 30,000원)
- 번들 (스터디 + SpeakCoach AI Premium 3개월): 얼리버드 199,900원 / 정가 229,900원 (교재비 포함)
- 프리미엄 업그레이드 옵션: +15,000원 (1:1 코치 화상통화 포함)

#### 환불 규정
- 인원 편성 전 (카톡 초대 전): 전자책(교재)을 제외한 나머지 금액 환불 가능
- 인원 편성 후 (카톡 초대 후): 환불 불가 (카카오톡 단체방 초대 시점 기준)
- 팀원 중도 이탈 시: 식빵영어 귀책사유 아님, 잔여 인원으로 정상 운영
- 폐강 시: 최소 인원 미달 시 교재비 제외 전액 환불

#### 성적 보증 시스템
- 조건: 2주 스터디 수료 + 사전/사후 성적표 제출
- 보증: 성적 미향상 시 무료 재수강
- 청구: /guarantee-claim 페이지에서 신청

### 4. SpeakCoach AI (웹앱)
- URL: https://sikbang-eng.replit.app/
- OpenAI Whisper 기반 음성 인식
- 7개 카테고리 AI 분석 (유창성, 문법, 어휘, 발음, 구성력 등)
- 약점 교정 드릴, 실전 모의고사 (35분/14문항)

#### SpeakCoach AI 요금제
- 무료: 7일 무료, 1일 1회 연습
- 프로 (24,900원/월, 원가 31,900원): 무제한 연습, 500+ 문제, 상세 AI 피드백
- 프리미엄 (34,900원/월, 원가 41,900원): 프로 전체 + 모의고사 10세트 + Native Shadowing

### 5. 1:1 영어 회화 클래스
- sikbang.co/conversation 에서 모집
- 주 1회, 60분 화상 수업
- 토/일 오전·오후 시간대 선택
- 가격: 40,000원/회 (주 1회 기준 월 160,000원)
- 입금: 카카오뱅크 3333-06-0399628 안준영

### 6. 무료 콘텐츠
- sikbang.co/free 에서 제공
- YouTube 무료 강의 20개+ (입문/중급/실전/표현/인사이트 태그)
- 무료 학습 자료 (표현/문법/전략/발음 카테고리)
- 수강 진행률 추적 (localStorage 기반)
- JSON 데이터: /data/lectures.json, /data/resources.json

---

## 페이지 구조

### / (메인 랜딩, page.tsx, 1107줄)
- Nav: 로고(SB 식빵영어), 무료강의, 스토어, SpeakCoach AI, 후기, 스터디, 영어회화, 무료체험 CTA
- Hero: "OPIC 점수를 올리는 가장 구조적인 방법" + 통계(4,000+ 수강생, 1,000+ 후기)
- Newsletter: 이메일 구독 → 노션 무료 자료 링크 + Stibee 뉴스레터 가입
- Problem 섹션: 혼자 녹음/인강 포기/학원 비용 3가지 문제 제기
- Store: 전자책, 인강, 스터디 3개 상품 카드
- SpeakCoach AI: 기능 소개 + 분석 결과 목업(IH 예상, AL 47%, 바 차트)
- Pricing: SpeakCoach AI 요금제 3종 (무료/프로/프리미엄)
- Reviews: 12개 후기 카드 자동 스크롤 (CSS animation)
- Quiz: 3문항 추천 퀴즈 → 스터디/인강/전자책 추천
- FAQ: 6개 항목 아코디언
- 카카오 단톡방 배너 (770+명 참여)
- Bottom CTA: SpeakCoach AI 무료 체험 유도
- Footer: 제품/고객지원/소셜 링크 + 사업자 정보
- 카카오톡 플로팅 버튼 (1:1 문의)
- 카카오 채널 추가 팝업 (24시간 간격)

### /study (스터디 상세, study/page.tsx, 4203줄) ★핵심 페이지
- 자동 기수 시스템: 매월 1일/15일 기수 자동 계산, 카운트다운 타이머
- 남은 인원 자동 계산: 파워 커브 (40명 → 2명, 일별 시드 변동)
- Hero: 카운트다운 + 남은 인원 + 다음 기수 시작일
- 토스트 알림: 랜덤 신청 알림 (3초 표시, 10~25초 간격)
- Why 섹션: 4개 카드 (코치 1:1 피드백, 3인 소그룹, AI 분석, 성적 보증)
- "하루 한 개, 이것만 하면 됩니다" 섹션: 일일 미션 4단계 카드
- Curriculum: 1주차(기본 프레임워크)/2주차(실전 모의고사) 아코디언
- Compare: 식빵영어 vs 혼자 vs 학원 비교 테이블
- 성적 보증 섹션: 보증 조건 + 보증 내용 + 보증 프로세스 안내
- Pricing: 얼리버드/정가 가격 카드 + 번들 옵션
- Reviews: 사진 후기 슬라이더
- Stats: 누적 수강생 4,000+, 평균 성적 향상 1.8등급, 목표 달성률 94%
- FAQ: 환불 규정, 참여 규정([필독]), 왕초보 관련 등 10+ 항목
- 자체 신청폼 (모달): 3단계 (정보입력 → 플랜선택 → 입금안내)
  - Step1: 이름, 이메일, 전화, 목표등급, 현재레벨
  - Step2: 일반/번들 플랜 선택, 교재 보유 여부, 프리미엄 업그레이드, 사전 OPIc 성적표 업로드
  - Step3: 입금 안내 (카카오뱅크 3333-06-0399628), 환불계좌, 입금확인 체크
- 왕초보 유도: currentLevel이 beginner일 때 1:1 회화 클래스 추천 팝업
- Floating CTA: 스크롤 시 하단 고정 신청 버튼

### /free (무료 콘텐츠, free/page.tsx, 1272줄)
- YouTube 강의 카드 그리드 (4개씩 페이지네이션)
- 강의별 태그(입문/중급/실전/표현/인사이트) + 색상 구분
- 수강 진행률 바 (localStorage 기반, 시청 완료 체크)
- 무료 학습 자료 섹션 (표현/문법/전략/발음 카테고리별)
- 뉴스레터 구독 섹션
- 데이터: /data/lectures.json, /data/resources.json에서 fetch

### /conversation (1:1 영어 회화, conversation/page.tsx, 646줄)
- 모바일 퍼스트 디자인 (max-width: 480px)
- 토스 스타일 UI (자체 CSS 변수 체계)
- Hero: "영어 회화, 지금 시작하세요"
- Urgency: 이번 주 3자리 남음
- Stats: 주 1회/60분/1:1
- Curriculum: 3단계 (자기소개→주제대화→역할극→피드백)
- 대상: 기초/실력향상
- 시간대: 토/일 오전·오후 (모집/마감 뱃지)
- 가격: 40,000원/회
- 강사 소개
- Bottom Sheet 신청폼: 3단계 (레벨→정보→입금)
- 입금: 카카오뱅크 3333-06-0399628 안준영

### /guarantee-claim (성적 보증 청구, guarantee-claim/page.tsx, 467줄)
- 보증 청구 폼: 이름, 이메일, 전화, 수강 기수(동적 생성), 사전/사후 등급, 수험번호, 시험일
- 파일 업로드: 사전 성적표, 사후 성적표, 신분증 (각 5MB 이하)
- 보증 조건 체크리스트 6개: 과제 100%, 출석 100%, 코칭 반영, 시험 시기, 청구 시기, 진실성
- 보증 안내 사항 + 프로세스 설명

### /blog (블로그, blog/page.tsx, 169줄)
- 블로그 포스트 카드 그리드
- 카테고리 필터 (전략/가이드/표현/문법)
- 데이터: /data/posts.json에서 fetch
- CTA: 스터디 알아보기 유도

### /admin (관리자, admin/page.tsx, 270줄)
- 비밀번호 로그인
- 강의(lectures) / 자료(resources) CRUD
- JSON 데이터 직접 편집 및 저장

### /privacy (개인정보처리방침, privacy/page.tsx, 269줄)
### /terms (이용약관, terms/page.tsx, 288줄)

---

## API 엔드포인트

### POST /api/study-apply (스터디 신청)
- FormData 수신 (이름, 이메일, 전화, 목표등급, 현재레벨, 플랜, 교재여부, 프리미엄, 환불계좌, 가격, 성적표 파일)
- Make.com 웹훅으로 전송: STUDY_APPLY_WEBHOOK_URL

### POST /api/guarantee-claim (보증 청구)
- FormData 수신 (이름, 이메일, 전화, 기수, 사전/사후 등급, 수험번호, 시험일, 성적표/신분증 파일)
- Make.com 웹훅으로 전송: GUARANTEE_CLAIM_WEBHOOK_URL

### POST /api/conversation-apply (회화 신청)
- JSON 수신 (이름, 전화, 이메일, 시간대, 레벨)
- 웹훅 또는 내부 처리

### POST /api/subscribe (뉴스레터 구독)
- Stibee API를 통해 이메일 구독 처리

### POST /api/admin (관리자)
- 비밀번호 인증 + 강의/자료 데이터 읽기/쓰기

---

## 정적 데이터 파일

- /public/data/lectures.json — 무료 강의 목록 (id, title, description, tag, youtubeId, youtubeUrl)
- /public/data/resources.json — 무료 학습 자료 (id, category, title, preview, url)
- /public/data/posts.json — 블로그 포스트 (id, slug, title, excerpt, category, date, readTime)

---

## 디자인 시스템

### CSS 변수 (토스 기반)

| 변수 | 라이트 | 다크 |
|------|--------|------|
| --text-primary | #191F28 | #EAEDF0 |
| --text-secondary | #4E5968 | #B0B8C1 |
| --text-tertiary | #8B95A1 | #6B7684 |
| --bg-white | #FFFFFF | #1A1D23 |
| --bg-gray | #F2F4F6 | #22262E |
| --border | #E5E8EB | #333840 |
| --green | #1A8D48 | #22C55E |
| --green-light | #E8FFF0 | #1A3A2A |
| --red | #E74C3C | #F87171 |
| --orange | #F59E0B | #FBBF24 |
| --blue-primary | #3182F6 | #4A9AFF |
| --card-shadow | 0 1px 3px ... | 0 2px 8px ... |

### 다크모드 구현
- [data-theme="dark"] 셀렉터로 CSS 변수 오버라이드
- 라이트 모드: 원본 하드코딩 색상 유지 (변경 금지)
- 다크 모드: [data-theme="dark"] .클래스명 { ... } 방식으로 별도 오버라이드만 추가
- localStorage('sikbang-theme')로 테마 상태 저장

### 디자인 원칙 (토스 UX)
- 단일 액센트 컬러: 스터디 = #1A8D48 그린, 메인/AI = #3182F6 블루
- 그림자 최소화 (var(--card-shadow))
- 배경색 통일 (var(--bg-gray))
- 최소 폰트 사이즈 12px
- 이모지 사용 금지 (텍스트 아이콘으로 대체)
- Pretendard Variable 폰트

---

## 외부 서비스 연동

- Make.com: 신청폼/보증청구 웹훅 자동화
- Stibee: 이메일 뉴스레터 구독 관리
- 카카오톡 채널/오픈채팅: 고객 소통
- 라이브클래스 (sikbang-eng.liveklass.com): 인강 판매 플랫폼
- Replit (sikbang-eng.replit.app): SpeakCoach AI 웹앱 호스팅
- 네이버 블로그: 전자책 판매 + 콘텐츠
- Vercel: 웹사이트 호스팅 및 자동 배포

---

## 환경 변수 (.env.local)

```
STUDY_APPLY_WEBHOOK_URL=https://hook.eu2.make.com/...
GUARANTEE_CLAIM_WEBHOOK_URL=https://hook.eu2.make.com/...
FREE_APPLY_WEBHOOK_URL=https://hook.eu2.make.com/...
```

---

## 핵심 비즈니스 로직

### 자동 기수 시스템 (study/page.tsx)
- 매월 1일 기수: 모집 = 전월 15일~전월 말일, 얼리버드 = ~전월 26일
- 매월 15일 기수: 모집 = 같은달 1일~14일, 얼리버드 = ~같은달 10일
- getCurrentCycle(now)로 현재 모집 중인 기수 자동 판별
- 카운트다운 타이머 1초 간격 업데이트

### 남은 인원 시뮬레이션
- 파워 커브: remaining = 2 + 38 * (1 - progress)^2.5
- 오픈 직후 40명 → 마감 시 2명
- 일별 시드 해시로 같은 날 같은 값 보장, ±1 변동

### 번들 재고 긴급성
- 폼 열 때 3~5개 랜덤 초기화
- 25~50초 간격으로 1개씩 감소 (최소 1개)

### 토스트 알림
- 랜덤 이름/지역/시간 조합
- 10~25초 간격으로 자동 표시, 3초 후 사라짐

### 추천 퀴즈 (메인 페이지)
- 3문항: 시험까지 기간 / 스피킹 수준 / 선호 학습 방식
- 점수 합산 → 스터디(5+) / 인강(3~4) / 전자책(1~2) 추천

---

## 파일 구조

```
sikbang-eng-web/
├── src/app/
│   ├── page.tsx                    # 메인 랜딩 (1107줄)
│   ├── study/page.tsx              # 스터디 상세 + 신청폼 (4203줄) ★
│   ├── free/page.tsx               # 무료 콘텐츠 (1272줄)
│   ├── conversation/page.tsx       # 1:1 회화 (646줄)
│   ├── guarantee-claim/page.tsx    # 보증 청구 (467줄)
│   ├── blog/page.tsx               # 블로그 (169줄)
│   ├── admin/page.tsx              # 관리자 (270줄)
│   ├── privacy/page.tsx            # 개인정보처리방침 (269줄)
│   ├── terms/page.tsx              # 이용약관 (288줄)
│   └── api/
│       ├── study-apply/route.ts
│       ├── guarantee-claim/route.ts
│       ├── conversation-apply/route.ts
│       ├── subscribe/route.ts
│       └── admin/route.ts
├── public/data/
│   ├── lectures.json
│   ├── resources.json
│   └── posts.json
├── .env.local
├── HANDOFF.md
├── package.json
└── tsconfig.json
```

---

## 주요 수치 (사이트에 표시된 것)

- 누적 수강생: 4,000+
- 수강생 후기: 1,000+
- 이메일 구독자: 5,200명
- 카카오 단톡방: 770+명
- 목표 달성률: 94%
- 평균 성적 향상: 1.8등급
- 라이브클래스 인강 후기: 250+건, 평점 5.0/5.0
