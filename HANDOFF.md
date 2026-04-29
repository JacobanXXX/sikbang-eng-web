# sikbang-eng-web 프로젝트 핸드오프 문서

## 프로젝트 개요

**사이트**: sikbang.co (식빵영어 OPIc 스터디 프로그램)
**스택**: Next.js App Router + Vercel 자동 배포
**GitHub**: https://github.com/JacobanXXX/sikbang-eng-web (public)
**Vercel**: team_krv37J4vHS0pCUKF3d3McWDJ / prj_G68n86WYO5sMs1yQUq93tEPE7hm1
**폰트**: Pretendard Variable

---

## 디자인 시스템 (토스 기반)

### CSS 변수 체계 (:root)

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
| --card-shadow | 0 1px 3px rgba(0,0,0,0.04)... | 0 2px 8px rgba(0,0,0,0.2)... |

### 다크모드 구현 방식

- `[data-theme="dark"]` 셀렉터로 CSS 변수 오버라이드
- 라이트 모드: 원본 하드코딩 색상 유지 (변경 금지)
- 다크 모드: `[data-theme="dark"] .클래스명 { ... }` 방식으로 별도 오버라이드
- **중요**: 라이트모드 하드코딩 색상을 var()로 바꾸면 안 됨. 다크모드 전용 오버라이드만 추가할 것

### 디자인 원칙 (토스 UX)

- 단일 액센트 컬러: #1A8D48 그린
- 그림자 최소화: var(--card-shadow) 사용
- 배경색 통일: var(--bg-gray) 하나만 사용 (5종 변형 금지)
- 폰트 사이즈: 최소 12px (11px 금지)
- 이모지 사용 금지 (텍스트 아이콘으로 대체)

---

## 파일 구조

```
src/app/
├── page.tsx              # 메인 랜딩 페이지
├── study/page.tsx        # ★ 핵심 파일 (~4200줄) - 스터디 소개 + 신청폼
├── free/page.tsx         # 무료 콘텐츠 페이지
├── conversation/page.tsx # 1:1 회화 클래스 페이지
├── guarantee-claim/page.tsx # 성적 보증 청구 페이지
├── admin/page.tsx        # 관리자 페이지
├── blog/page.tsx         # 블로그
├── privacy/page.tsx      # 개인정보 처리방침
├── terms/page.tsx        # 이용약관
└── api/
    ├── study-apply/route.ts     # 스터디 신청 API (파일 업로드 포함)
    └── guarantee-claim/route.ts # 보증 청구 API
```

### .env.local (웹훅 URL 3개)

```
STUDY_APPLY_WEBHOOK_URL=https://hook.eu2.make.com/...
GUARANTEE_CLAIM_WEBHOOK_URL=https://hook.eu2.make.com/...
FREE_APPLY_WEBHOOK_URL=https://hook.eu2.make.com/...
```

---

## 완료된 작업 이력

### UI/UX 개선
- 배경색 5종 → var(--bg-gray) 통일
- 폰트 11px → 12px, 22px → 24px 정리
- 그린 4종 (#15753c, #22c55e, #16a34a, #1A8D48) → #1A8D48 통일
- 얼리버드 오렌지(#FF6B35) → 그린 통일
- 그림자 무게 경감 (card-shadow 적용)
- 이모지 전면 제거 (✅⏰☀️🎉 → 텍스트 아이콘)

### 다크모드 대응
- CSS 변수 체계 구축 (:root + [data-theme="dark"])
- study/page.tsx: 50줄의 [data-theme="dark"] 오버라이드 추가
  - 비교 테이블, 신청폼, 가격 카드, FAQ 뱃지, 통계 섹션 등
- free/page.tsx: color: #191F28 → var(--text-primary), background: white → var(--bg-white)
- guarantee-claim/page.tsx: input 배경 → var(--bg-white)
- conversation/page.tsx: selected 태그 배경 → var(--bg-white)

### 기능 추가
- 성적 보증 시스템 (보증 섹션 + 청구 페이지 + API)
- 신청폼 파일 업로드 (성적표 첨부)
- 왕초보 → 1:1 회화 클래스 유도 로직
- FAQ에 왕초보/환불 관련 항목 추가

### 콘텐츠 수정
- 환불 규정: 전자책 제외 환불 가능, 카톡 초대 시점 기준 환불 불가
- 섹션 타이틀: "하루 딱 이것만 하세요" → "하루 한 개, 이것만 하면 됩니다"
- 부제: "매일 1개 미션을 수행하면, 분석과 피드백은 코치와 AI가 해줍니다."
- (카드 내용은 변경하지 않음 — 사용자 지시)

---

## 현재 상태 (2025-04-29)

### Git 상태
- **브랜치**: main
- **최신 커밋**: `040bef6 다크모드 전용 오버라이드 추가`
- **미커밋 변경**: 없음
- **미푸시 커밋**: 없음 (모두 push 완료)
- **Vercel 배포**: main push 시 자동 배포

### 알려진 이슈
1. **git index.lock**: Cowork 앱이 백그라운드에서 git을 실행하여 lock 파일이 계속 생성됨. `rm -f .git/index.lock .git/HEAD.lock && git add ... && git commit ...`을 한 줄로 실행하거나, Cowork 종료 후 커밋 필요
2. **다크모드 인라인 스타일**: study/page.tsx의 인라인 style={{}} 속성에 하드코딩된 색상들은 CSS 오버라이드로 덮을 수 없음. 해당 부분은 아직 다크모드 미대응:
   - 환불 규정 FAQ 내 `color: '#ef4444'`, `color: '#6b7280'`
   - 신청폼 내 `borderTop: '1px solid #E5E8EB'`
   - 파일 업로드 `border: '1.5px dashed #E5E8EB'`, `background: 'white'`
   - 교재 할인 `color: '#dc2626'`
   - 커리큘럼 버튼 onMouseOver/Out에 `'white'`, `'#1A8D48'`

---

## 남은 과제 / 개선 포인트

### 다크모드 완성
- [ ] 인라인 스타일 하드코딩 색상 → CSS 클래스로 전환하여 다크모드 대응
- [ ] free/page.tsx, conversation/page.tsx, guarantee-claim/page.tsx 추가 다크모드 점검
- [ ] page.tsx (메인 랜딩) 다크모드 점검

### 코드 품질
- [ ] study/page.tsx가 4200줄 → 컴포넌트 분리 검토
- [ ] CSS-in-JS 또는 Tailwind 마이그레이션 검토
- [ ] 반복되는 다크모드 색상값을 CSS 변수로 더 체계화

### 기능
- [ ] 관리자 대시보드 개선
- [ ] SEO 최적화
- [ ] 모바일 반응형 세부 점검

---

## 새 세션 시작 프롬프트

아래 프롬프트를 새 태스크 첫 메시지로 붙여넣으세요.
Desktop 폴더가 연결된 상태에서 사용해야 합니다.

---

```
내 Desktop 폴더에 있는 sikbang-eng-web 프로젝트 작업을 이어서 해줘.
먼저 프로젝트 루트의 HANDOFF.md를 읽고 현재 상태를 파악한 다음, 내가 요청하는 작업을 진행해.

핵심 규칙:
1. 라이트모드 CSS는 절대 수정하지 마. 다크모드는 [data-theme="dark"] 오버라이드만 추가해.
2. 토스 디자인 원칙을 따라: 단일 액센트(#1A8D48), 이모지 금지, 최소 그림자.
3. 커밋 시 git index.lock 에러가 나면, rm -f .git/index.lock .git/HEAD.lock && git add ... && git commit 을 한 줄로 실행해.
```
