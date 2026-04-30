"""
식빵영어 14일 AL 부트캠프 — 릴스 대본 PDF 빌더
- Pretendard 토스 디자인
- 가독성 최우선: 카드 기반 대본 레이아웃
"""
import sys
sys.path.insert(0, "/sessions/awesome-dreamy-cori/mnt/outputs/pdf_work")
from sikbang_pdf import TOKENS, FONT_FACE_CSS
from weasyprint import HTML, CSS

OUT = "/sessions/awesome-dreamy-cori/mnt/sikbang-eng-web/marketing/sikbang_reels_scripts.pdf"
t = TOKENS

# ---------- CSS ----------
PAGE_CSS = FONT_FACE_CSS + f"""
@page {{
  size: A4;
  margin: 18mm 16mm 18mm 16mm;
  @top-left {{
    content: "식빵영어 · 릴스 대본";
    font-family: "Pretendard"; font-weight: 500;
    color: {t['text_tertiary']}; font-size: 9pt;
    margin-top: 8mm;
    width: 80mm;
    white-space: nowrap;
  }}
  @top-right {{
    content: "14일 AL 완성 부트캠프";
    font-family: "Pretendard"; font-weight: 500;
    color: {t['text_tertiary']}; font-size: 9pt;
    margin-top: 8mm;
    width: 80mm;
    white-space: nowrap;
    text-align: right;
  }}
  @bottom-right {{
    content: counter(page);
    font-family: "Pretendard"; font-weight: 600;
    color: {t['text_secondary']}; font-size: 10pt;
    margin-bottom: 8mm;
  }}
}}
@page :first {{
  margin: 0;
  @top-left {{ content: ""; }}
  @top-right {{ content: ""; }}
  @bottom-right {{ content: ""; }}
}}

* {{ box-sizing: border-box; }}
html, body {{
  font-family: "Pretendard", -apple-system, sans-serif;
  color: {t['text_primary']};
  font-size: 10.5pt;
  line-height: 1.65;
  margin: 0; padding: 0;
  letter-spacing: -0.01em;
}}
.lat {{ font-family: "Lato", "Pretendard", sans-serif; }}

/* === COVER === */
.cover {{
  page-break-after: always;
  height: 297mm;
  display: flex; flex-direction: column;
  justify-content: center;
  padding: 40mm 24mm;
  background: linear-gradient(135deg, {t['blue']} 0%, {t['blue_dark']} 100%);
  color: white;
}}
.cover-tag {{
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 11pt;
  font-weight: 600;
  margin-bottom: 18px;
  width: fit-content;
}}
.cover h1 {{
  font-size: 36pt;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 18px 0;
  letter-spacing: -0.03em;
}}
.cover-sub {{
  font-size: 14pt;
  opacity: 0.92;
  margin-bottom: 32px;
  line-height: 1.5;
  font-weight: 500;
}}
.cover-meta {{
  display: flex; gap: 32px;
  font-size: 10.5pt;
  opacity: 0.9;
  border-top: 1px solid rgba(255,255,255,0.3);
  padding-top: 18px;
  white-space: nowrap;
}}

/* === SECTION === */
.section-wrap {{
  page-break-before: always;
}}
.section-num {{
  font-size: 12pt;
  font-weight: 700;
  color: {t['blue']};
  margin-bottom: 6px;
  letter-spacing: 0.05em;
}}
.section-title {{
  font-size: 22pt;
  font-weight: 800;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}}
.section-desc {{
  font-size: 11pt;
  color: {t['text_secondary']};
  margin-bottom: 28px;
  line-height: 1.6;
}}

/* === LIST CARDS === */
.list-card {{
  background: {t['bg_card']};
  border: 1px solid {t['border']};
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
}}
.list-card-num {{
  display: inline-block;
  width: 24px; height: 24px;
  line-height: 24px;
  background: {t['blue']};
  color: white;
  border-radius: 50%;
  text-align: center;
  font-size: 10pt;
  font-weight: 700;
  margin-right: 8px;
  vertical-align: middle;
}}
.list-card-title {{
  display: inline-block;
  font-size: 12pt;
  font-weight: 700;
  margin-bottom: 6px;
  vertical-align: middle;
}}
.list-card-body {{
  font-size: 10pt;
  color: {t['text_secondary']};
  line-height: 1.65;
  padding-left: 32px;
}}
.list-card-body ul {{
  margin: 4px 0 0 0;
  padding-left: 16px;
}}
.list-card-body li {{
  margin-bottom: 2px;
}}

/* === HOOK PATTERNS TABLE === */
.hook-table {{
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 12px;
}}
.hook-table th {{
  background: {t['bg_gray']};
  padding: 10px 14px;
  font-size: 10pt;
  font-weight: 700;
  text-align: left;
  border-bottom: 2px solid {t['border']};
}}
.hook-table td {{
  padding: 10px 14px;
  font-size: 10pt;
  border-bottom: 1px solid {t['border']};
  vertical-align: top;
}}
.hook-table .num {{ font-weight: 700; color: {t['blue']}; width: 28px; }}
.hook-table .name {{ font-weight: 700; width: 100px; }}

/* === REEL CARD === */
.reel-card {{
  page-break-inside: avoid;
  margin-bottom: 36px;
}}
.reel-header {{
  background: {t['blue']};
  color: white;
  padding: 18px 22px;
  border-radius: 12px 12px 0 0;
}}
.reel-header.guarantee {{
  background: {t['green']};
}}
.reel-id {{
  font-size: 10pt;
  font-weight: 700;
  letter-spacing: 0.08em;
  opacity: 0.85;
  margin-bottom: 4px;
}}
.reel-title {{
  font-size: 16pt;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.3;
}}
.reel-meta {{
  display: flex;
  gap: 18px;
  margin-top: 10px;
  font-size: 9.5pt;
  opacity: 0.9;
}}
.reel-meta-item {{
  display: flex;
  align-items: center;
  gap: 4px;
}}
.reel-body {{
  background: {t['bg_card']};
  border: 1px solid {t['border']};
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 18px 22px;
}}
.reel-concept {{
  font-size: 10pt;
  color: {t['text_secondary']};
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid {t['border']};
  line-height: 1.6;
}}
.reel-concept b {{ color: {t['text_primary']}; }}
.reel-concept .why-tag {{
  display: inline-block;
  background: {t['blue_tint']};
  color: {t['blue']};
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 9pt;
  margin-right: 6px;
}}

/* Time-coded scenes */
.scene {{
  margin-bottom: 14px;
  padding-left: 14px;
  border-left: 3px solid {t['border']};
}}
.scene.hook {{ border-left-color: {t['red']}; }}
.scene.cta {{ border-left-color: {t['green']}; }}
.scene-time {{
  display: inline-block;
  font-family: "Lato", monospace;
  font-size: 9pt;
  font-weight: 700;
  color: white;
  background: {t['text_secondary']};
  padding: 2px 8px;
  border-radius: 4px;
  margin-right: 8px;
}}
.scene.hook .scene-time {{ background: {t['red']}; }}
.scene.cta .scene-time {{ background: {t['green']}; }}
.scene-label {{
  font-size: 10pt;
  font-weight: 800;
  color: {t['text_primary']};
  letter-spacing: 0.02em;
}}
.scene-detail {{
  margin-top: 6px;
  font-size: 10pt;
  line-height: 1.65;
}}
.scene-detail .row {{
  display: flex;
  margin-bottom: 4px;
}}
.scene-detail .row-label {{
  flex-shrink: 0;
  width: 50px;
  font-weight: 700;
  color: {t['text_tertiary']};
  font-size: 9pt;
  padding-top: 2px;
}}
.scene-detail .row-content {{
  flex: 1;
  color: {t['text_primary']};
}}
.subtitle-text {{
  background: {t['blue_tint']};
  color: {t['blue']};
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  display: inline-block;
}}
.scene.hook .subtitle-text {{
  background: #FFE8E8;
  color: {t['red']};
}}
.scene.cta .subtitle-text {{
  background: #E8F6EE;
  color: {t['green']};
}}

.reel-tech {{
  margin-top: 14px;
  padding: 12px 14px;
  background: white;
  border: 1px solid {t['border']};
  border-radius: 8px;
  font-size: 9.5pt;
  line-height: 1.6;
}}
.reel-tech-row {{ margin-bottom: 4px; }}
.reel-tech-row b {{ color: {t['text_primary']}; }}

/* === CALLOUT (key tip) === */
.callout {{
  background: {t['blue_pale']};
  border-left: 4px solid {t['blue']};
  border-radius: 4px;
  padding: 12px 16px;
  margin: 14px 0;
  font-size: 10pt;
  line-height: 1.65;
}}
.callout.green {{
  background: #F0F9F4;
  border-left-color: {t['green']};
}}
.callout-title {{
  font-weight: 800;
  margin-bottom: 4px;
}}

/* === SCHEDULE TABLE === */
.schedule {{
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 14px;
  font-size: 10pt;
}}
.schedule th {{
  background: {t['blue']};
  color: white;
  padding: 10px 12px;
  text-align: left;
  font-weight: 700;
  font-size: 10pt;
}}
.schedule th:first-child {{ border-radius: 8px 0 0 0; }}
.schedule th:last-child {{ border-radius: 0 8px 0 0; }}
.schedule td {{
  padding: 10px 12px;
  border-bottom: 1px solid {t['border']};
  background: white;
}}
.schedule tr:last-child td {{ border-bottom: none; }}
.schedule .day {{ font-weight: 700; color: {t['blue']}; width: 50px; }}
.schedule .id {{ font-weight: 700; width: 80px; font-family: "Lato", monospace; }}
.schedule .stars {{ color: {t['orange']}; width: 100px; }}

/* === CAPTION BLOCK === */
.caption-block {{
  background: {t['bg_gray']};
  border-radius: 8px;
  padding: 14px 18px;
  font-family: "Lato", "Pretendard", monospace;
  font-size: 9.5pt;
  line-height: 1.7;
  white-space: pre-wrap;
  margin-top: 10px;
}}

/* === CHECKLIST === */
.checklist {{
  list-style: none;
  padding: 0;
  margin: 12px 0;
}}
.checklist li {{
  padding: 8px 0 8px 28px;
  position: relative;
  font-size: 10.5pt;
  line-height: 1.5;
  border-bottom: 1px solid {t['border']};
}}
.checklist li:before {{
  content: "";
  display: inline-block;
  position: absolute;
  left: 0; top: 11px;
  width: 16px; height: 16px;
  border: 2px solid {t['border_strong']};
  border-radius: 4px;
}}

h3 {{
  font-size: 14pt;
  font-weight: 800;
  margin: 28px 0 12px 0;
  letter-spacing: -0.01em;
}}
h4 {{
  font-size: 11pt;
  font-weight: 800;
  margin: 18px 0 8px 0;
  color: {t['text_primary']};
}}
strong {{ font-weight: 700; }}

.tag-pill {{
  display: inline-block;
  background: {t['bg_gray']};
  color: {t['text_secondary']};
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 9pt;
  font-weight: 600;
  margin-right: 4px;
}}
.tag-pill.green {{ background: #E8F6EE; color: {t['green']}; }}
.tag-pill.red {{ background: #FFE8E8; color: {t['red']}; }}
.tag-pill.orange {{ background: #FFF4E0; color: {t['orange']}; }}
"""


# ---------- HTML BUILDERS ----------
def cover():
    return f"""
<div class="cover">
  <span class="cover-tag">INSTAGRAM REELS PLAYBOOK</span>
  <h1>14일 AL 완성<br/>부트캠프 릴스 대본</h1>
  <div class="cover-sub">
    Hormozi 100M Offers 후크 공식 +<br/>
    화제 릴스 공통 패턴으로 설계한 6편
  </div>
  <div class="cover-meta">
    <div>2026.05 시즌</div>
    <div>정원 20명 · 199,000원</div>
    <div>@sikbang.eng</div>
  </div>
</div>
"""


def section_1_patterns():
    items = [
        ("첫 1초가 전부다", [
            "3초 안에 핵심 후크가 안 들어가면 60퍼센트 이탈",
            "화면 + 음성 + 자막 3중 후킹 필수",
            "하단 1/3은 다음 영상 미리보기 영역 — 상단·중단 활용",
        ]),
        ("Pattern Interrupt — 2~3초마다 화면 변화", [
            "같은 앵글 5초 이상 = 이탈",
            "인서트 컷, 줌인/줌아웃, B-roll, 글씨 등장으로 환기",
            "카톡 캡쳐, 점수표, 후기 등 시각적 증거가 강력",
        ]),
        ("자막은 영상 위쪽에 굵게", [
            "무음 시청자 약 70퍼센트 — 자막 없으면 메시지 0",
            "한 줄에 6~8자 이내, 큰 폰트, 굵게",
            "핵심 단어는 컬러 강조 (그린/빨강)",
        ]),
        ("한 컷 = 한 메시지", [
            "정보 욕심 금지. 한 릴스 = 한 메시지",
            "예: '학원 vs 부트캠프' 또는 '94퍼센트 도달' 하나만",
        ]),
        ("마지막 1초 = CTA", [
            "프로필 링크 / DM 신청 / 댓글 '신청'",
            "강한 명령형 (정중함 NO)",
        ]),
        ("알고리즘 잘 받는 길이", [
            "7~22초가 sweet spot (완청률 높음)",
            "30초 넘기면 reach 떨어짐",
            "정보 많으면 차라리 시리즈로 분할",
        ]),
        ("댓글 유도 후크", [
            "'○○이면 댓글 신청'",
            "'이거 안 다 보면 평생 IM'",
            "알고리즘이 댓글·저장을 가장 좋아함",
        ]),
    ]

    cards = ""
    for i, (title, bullets) in enumerate(items, 1):
        body = "<ul>" + "".join(f"<li>{b}</li>" for b in bullets) + "</ul>"
        cards += f'''
<div class="list-card">
  <span class="list-card-num">{i}</span>
  <span class="list-card-title">{title}</span>
  <div class="list-card-body">{body}</div>
</div>
'''

    return f'''
<div class="section-wrap">
  <div class="section-num">PART 1</div>
  <h1 class="section-title">화제가 되는 릴스의 공통 패턴</h1>
  <p class="section-desc">한국 인스타그램 2025년 기준 alg 신호와 사용자 행동을 분석한 7가지 핵심 원칙입니다.</p>
  {cards}
</div>
'''


def section_2_hormozi():
    return f'''
<div class="section-wrap">
  <div class="section-num">PART 2</div>
  <h1 class="section-title">Hormozi 100M Offers 후크 공식</h1>
  <p class="section-desc">Value Equation 기반 후크 7가지. 각 릴스는 이 중 1~2개를 결합합니다.</p>

  <div class="callout">
    <div class="callout-title">VALUE EQUATION</div>
    Value = (꿈의 결과 × 성공 확률) ÷ (시간 × 노력)<br/>
    분자(결과·확률)는 크게, 분모(시간·노력)는 작게 보여줘야 합니다.
  </div>

  <table class="hook-table">
    <thead>
      <tr>
        <th class="num">#</th>
        <th class="name">패턴</th>
        <th>식빵영어 적용 예시</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="num">1</td><td class="name">Big Claim</td><td>"94퍼센트가 14일 안에 AL"</td></tr>
      <tr><td class="num">2</td><td class="name">Counter-intuitive</td><td>"OPIc은 영어 실력이 아니다"</td></tr>
      <tr><td class="num">3</td><td class="name">Painful Truth</td><td>"학원 4달 다녀봐야 IM에서 못 나온다"</td></tr>
      <tr><td class="num">4</td><td class="name">Specific Number</td><td>"정원 20명, 5월 1일 마감"</td></tr>
      <tr><td class="num">5</td><td class="name">If/Then Promise</td><td>"이 한 가지만 알면 IM 탈출"</td></tr>
      <tr><td class="num">6</td><td class="name">Negative Bias</td><td>"이거 모르면 OPIc 평생 그 등급"</td></tr>
      <tr><td class="num">7</td><td class="name">Risk Reversal</td><td>"1차 피드백 듣고 환불 가능"</td></tr>
    </tbody>
  </table>

  <div class="callout green">
    <div class="callout-title">★ RISK REVERSAL이 가장 강한 레버</div>
    "위험을 판매자 쪽으로 옮기면, 가격은 거의 무관해진다."<br/>
    환불 보장 후크는 시청자의 두뇌에서 즉시 "근데 진짜?"라는 호기심을 만들어 끝까지 보게 만듭니다.
  </div>
</div>
'''


# ---------- REEL TEMPLATE ----------
def reel(reel_id, title, concept, tags, length, target, why_strong, scenes, music, edit_notes, header_color="blue"):
    head_class = "guarantee" if header_color == "green" else ""
    tag_html = " ".join(f'<span class="tag-pill {c}">{t_}</span>' for t_, c in tags)

    # why_strong is a callout block (only for special reels)
    why_html = ""
    if why_strong:
        why_html = f'''
<div class="callout green">
  <div class="callout-title">★ 왜 이게 가장 강한 후크인가</div>
  {why_strong}
</div>'''

    scenes_html = ""
    for sc in scenes:
        time_, label, sc_class, screen, subtitle, voice = sc
        sub_html = f'<span class="subtitle-text">{subtitle}</span>' if subtitle else "—"
        scenes_html += f'''
<div class="scene {sc_class}">
  <span class="scene-time">{time_}</span>
  <span class="scene-label">{label}</span>
  <div class="scene-detail">
    <div class="row"><div class="row-label">화면</div><div class="row-content">{screen}</div></div>
    <div class="row"><div class="row-label">자막</div><div class="row-content">{sub_html}</div></div>
    <div class="row"><div class="row-label">음성</div><div class="row-content">{voice}</div></div>
  </div>
</div>'''

    return f'''
<div class="reel-card">
  <div class="reel-header {head_class}">
    <div class="reel-id">{reel_id}</div>
    <h2 class="reel-title">{title}</h2>
    <div class="reel-meta">
      <span class="reel-meta-item">길이 {length}</span>
      <span class="reel-meta-item">타겟 {target}</span>
    </div>
  </div>
  <div class="reel-body">
    <div class="reel-concept">
      {tag_html}<br/><br/>
      <b>컨셉:</b> {concept}
    </div>
    {why_html}
    {scenes_html}
    <div class="reel-tech">
      <div class="reel-tech-row"><b>음악:</b> {music}</div>
      <div class="reel-tech-row"><b>편집 노트:</b> {edit_notes}</div>
    </div>
  </div>
</div>
'''


def section_3_reels():
    reels_html = ""

    # RE-06 (보증 단독, 가장 먼저 발행)
    reels_html += reel(
        "RE-06 (★ 최우선 발행)",
        "환불받는 OPIc 부트캠프, 들어본 적 있어요?",
        "<b>Risk Reversal</b> — Hormozi의 핵심 후크 공식. 결정 직전 망설임을 없애는 최강의 후크.",
        [("Risk Reversal", "green"), ("보증 단독", "green"), ("최강 후크", "red")],
        "20초", "결제 직전 망설이는 사람",
        'Hormozi 100M Offers 핵심: "위험을 판매자 쪽으로 옮기면, 가격은 거의 무관해진다." "환불 가능"이라는 단어는 시청자 두뇌에서 즉시 "근데 진짜?"라는 호기심을 만들어 끝까지 보게 만듭니다.',
        [
            ("0:00–0:03", "HOOK · 반전 후크", "hook",
             "안준영 대표 정면 클로즈업, 살짝 미소",
             "OPIc 부트캠프 환불 가능, 들어보신 적 있어요?",
             "OPIc 부트캠프 환불 가능한 거 들어보셨어요?"),
            ("0:03–0:08", "CURIOSITY GAP", "",
             "물음표 모션 그래픽 → '정말?' 자막 → 의심 표정 일러스트",
             "정말로요. 두 가지 보증이 있어요",
             "진짜예요. 식빵영어는 두 가지 보증이 있습니다."),
            ("0:08–0:13", "GUARANTEE 1 — 빠른 환불", "",
             "'1차 피드백 → 환불 가능' 인포그래픽",
             "1차 피드백 듣고 환불 가능. 사유 안 물어요.",
             "첫 1대1 피드백 들어보고 마음에 안 들면, 사유 안 묻고 환불해드립니다."),
            ("0:13–0:17", "GUARANTEE 2 — 미향상 시 무료 재수강", "",
             "점수표 → 미향상 시 무료 재수강 표시",
             "등급 안 올라도 다음 기수 무료",
             "조건 다 채웠는데 등급 안 오르면, 다음 기수 무료로 다시 들으실 수 있어요."),
            ("0:17–0:20", "CTA + 강조", "cta",
             "'당신 손해 없는 구조' + 프로필 링크 화살표",
             "손해는 식빵영어가 집니다. 프로필 링크",
             "손해는 식빵영어가 집니다. 프로필 링크에서 신청하세요."),
        ],
        "따뜻한 어쿠스틱 → 후반 임팩트 (안심 + 자신감)",
        "'환불 가능' 단어 등장 시 0.5초 슬로우다운. '사유 안 물어요'에 대표 손바닥 제스처. 마지막 자막은 흰 배경 + 그린 텍스트로 토스 톤.",
        "green"
    )

    # RE-01
    reels_html += reel(
        "RE-01",
        "학원에서 4달 = IM2",
        "<b>Painful Truth + Counter-intuitive</b>. 학원 다녔는데 점수 안 오른 사람의 좌절감을 직격.",
        [("Painful Truth", "red"), ("Counter-intuitive", "orange")],
        "18초", "학원 다녔는데 점수 안 오른 사람",
        "",
        [
            ("0:00–0:03", "HOOK", "hook",
             "100명 강의실 사진/영상 (스톡 가능)",
             "OPIc 학원 4달 다녔는데 IM에서 못 벗어나셨죠?",
             "OPIc 학원 4달 다녀도 점수 안 오른 이유, 알려드릴게요."),
            ("0:03–0:09", "AGITATE", "",
             "강사 1명 + 학생 100명 일러스트 → 빨간 X 표시",
             "강사가 당신 답변, 한 번이라도 들어봤어요?",
             "강사 한 명이 100명을 가르치는데, 당신이 어디서 막히는지 어떻게 알겠어요."),
            ("0:09–0:15", "SOLUTION + PROOF", "",
             "안준영 대표 얼굴 클로즈업 + '수강생 94퍼센트 목표 도달' 자막",
             "식빵영어는 대표가 매일 1대1로 듣습니다",
             "식빵영어 부트캠프는 제가 매일 직접 듣고 분석합니다. 수강생 94퍼센트가 목표 등급 도달했어요."),
            ("0:15–0:18", "CTA", "cta",
             "'5월 1일 모집 시작 / 정원 20명' 자막",
             "5월 모집 정원 20명. 프로필 링크",
             "정원 20명, 5월 1일 모집 마감. 프로필 링크에서 신청하세요."),
        ],
        "Lo-fi serious 또는 도시 배경음 (저작권 free 추천)",
        "학원 ↔ 부트캠프 화면 전환에 화이트 플래시 1프레임",
    )

    # RE-02
    reels_html += reel(
        "RE-02",
        "3년 IM이었던 사람이 14일 만에 AL",
        "<b>Personal Transformation + Specific Number</b>. 감정선 변화 스토리.",
        [("Transformation", "orange"), ("Specific Number", "")],
        "22초", "오래 IM에 머문 직장인",
        "",
        [
            ("0:00–0:03", "HOOK · 자기 고백 톤", "hook",
             "송*환 후기 카드 (실제 후기 캡쳐)",
             "3년째 IH에 막혀 있었는데",
             "OPIc 3번 시험 봤는데 계속 IH였어요."),
            ("0:03–0:08", "PROBLEM", "",
             "IH 등급표 → 빨간 ❌",
             "승진 요건은 IH 그 위",
             "혼자 해봤자 뭐가 틀린지 몰랐어요. 학원도 가봤는데..."),
            ("0:08–0:14", "SHIFT MOMENT", "",
             "코치 피드백 카톡방 캡쳐",
             "코치가 한 마디 했어요",
             "코치가 시제 전환할 때 끊긴다고 정확히 짚어줬어요."),
            ("0:14–0:19", "RESULT", "",
             "점수표 (IH → AL) 줌인",
             "2주 만에 AL 받았습니다",
             "그 한 가지 고치니 2주 만에 AL 나왔어요."),
            ("0:19–0:22", "CTA", "cta",
             "'5월 부트캠프 정원 20명' + 프로필 링크 화살표",
             "5월 1일 모집 시작",
             "5월 1일 모집 시작. 프로필 링크."),
        ],
        "감성적 시작 → 후반 업비트 전환 (변화감)",
        "IH → AL 전환 부분에 슬로우모션 + 임팩트 사운드",
    )

    # RE-03
    reels_html += reel(
        "RE-03",
        "수강생 94퍼센트가 목표 도달",
        "<b>Big Claim + Specific Number</b>. 가장 짧고 강한 데이터 후크.",
        [("Big Claim", "red"), ("짧고 강함", "")],
        "15초", "데이터 신뢰형 직장인·취준생",
        "",
        [
            ("0:00–0:03", "HOOK · 대표 직접", "hook",
             "안준영 대표, 정면 클로즈업",
             "OPIc 수강생 94퍼센트가 목표 등급 도달했어요",
             "수강생 100명 중 94명이 목표 등급에 도달했습니다."),
            ("0:03–0:08", "HOW · Process Reveal", "",
             "'매일 녹음 → 대표 직접 → AI 분석' 3단 인포그래픽",
             "매일 녹음 → 1대1 피드백 → AI 분석",
             "매일 녹음 보내면, 제가 직접 듣고, SpeakCoach AI가 분석합니다."),
            ("0:08–0:12", "OFFER · 수치 후크", "",
             "'14일 / 정원 20명 / 199,000원' 큰 텍스트 슬라이드",
             "14일, 정원 20명, 199,000원",
             "14일, 정원 20명, 가격 199,000원. 1차 피드백 후 환불 가능합니다."),
            ("0:12–0:15", "CTA", "cta",
             "프로필 링크 화살표 + 손가락 가리키는 GIF",
             "5월 1일 마감. 프로필 링크",
             "마감 임박. 프로필 링크."),
        ],
        "Drum-heavy 다큐멘터리 톤 (전문성)",
        "14초 동안 화면 5번 이상 전환. 수치 강조 시 줌인",
    )

    # RE-04
    reels_html += reel(
        "RE-04",
        "OPIc은 영어 실력이 아니에요",
        "<b>Counter-intuitive + Curiosity Gap</b>. 가장 광범위한 타겟.",
        [("Counter-intuitive", "orange"), ("Curiosity Gap", "")],
        "20초", "영어 실력에 자신 없는 사람",
        "",
        [
            ("0:00–0:03", "HOOK · 반전", "hook",
             "영어 책 더미 → 빨간 X",
             "OPIc은 영어 실력이 아니에요",
             "OPIc 점수, 영어 실력으로 안 올라요."),
            ("0:03–0:08", "CURIOSITY GAP", "",
             "물음표 모션 연속 출현",
             "OPIc은 ___입니다",
             "OPIc은 패턴이에요. 7가지 패턴만 알면..."),
            ("0:08–0:14", "REVEAL", "",
             "7개 카드 펼치기 애니메이션",
             "7개 핵심 템플릿",
             "Survey, Role Play, 돌발... 어떤 질문이든 7개 템플릿 안에 들어옵니다."),
            ("0:14–0:18", "PROOF", "",
             "'수강생 94퍼센트 목표 도달' + 안준영 대표 얼굴",
             "이 패턴으로 4,000명을 가르쳤어요",
             "이 7가지로 4,000명 가르쳤고, 94퍼센트가 목표 등급 받았습니다."),
            ("0:18–0:20", "CTA", "cta",
             "프로필 링크 자막",
             "프로필 링크",
             "프로필 링크에서 시작하세요."),
        ],
        "미스터리 → 해결 톤 (호기심 자극)",
        "물음표 출현 시 시퀀스 빠르게, REVEAL에서 슬로우다운",
    )

    # RE-05
    reels_html += reel(
        "RE-05",
        "학원 49만원 vs 부트캠프 19만원",
        "<b>Direct Comparison + Time Saving</b>. 가성비 추구 타겟.",
        [("Comparison", ""), ("가성비", "")],
        "22초", "가성비 추구하는 취준생",
        "",
        [
            ("0:00–0:03", "HOOK", "hook",
             "49만원 vs 19만원 가격 큰 폰트 분할 화면",
             "같은 OPIc, 절반 가격, 절반 시간",
             "OPIc 학원 한 달 49만원, 부트캠프 2주 19만원."),
            ("0:03–0:09", "CONTRAST 1", "",
             "강사 1: 학생 100명 / 대표 1: 수강생 1",
             "강사 1명 → 100명 vs 대표 1명 → 1명",
             "학원은 100명에 강사 1명. 부트캠프는 매일 대표가 직접."),
            ("0:09–0:14", "CONTRAST 2", "",
             "한 달 캘린더 vs 14일 캘린더 + 체크마크 채워짐",
             "한 달 → 14일에 끝",
             "학원 한 달 과정을 부트캠프는 14일에 끝냅니다."),
            ("0:14–0:19", "RISK REVERSAL", "",
             "'1차 피드백 후 환불 가능' 자막 강조",
             "1차 피드백 듣고 환불 가능",
             "심지어 1차 피드백 듣고 마음에 안 들면 환불해드립니다."),
            ("0:19–0:22", "CTA", "cta",
             "'정원 20명. 5월 1일 마감'",
             "정원 20명. 프로필 링크",
             "정원 20명. 프로필 링크."),
        ],
        "비트 강한 EDM (대조감 강조)",
        "가격 비교 시 슬라이드 페이드, 캘린더는 빠른 컷",
    )

    return f'''
<div class="section-wrap">
  <div class="section-num">PART 3</div>
  <h1 class="section-title">릴스 6종 대본</h1>
  <p class="section-desc">각 릴스는 15~22초 분량. 시간대별 화면·자막·음성 가이드를 포함합니다. RE-06 보증 릴스를 가장 먼저 발행하세요.</p>
  {reels_html}
</div>
'''


def section_4_strategy():
    return f'''
<div class="section-wrap">
  <div class="section-num">PART 4</div>
  <h1 class="section-title">시리즈 운영 전략</h1>
  <p class="section-desc">9일 발행 스케줄 + 보증 후크 활용 + 캡션·DM 응대 가이드</p>

  <h3>9일 발행 스케줄</h3>
  <table class="schedule">
    <thead>
      <tr><th>Day</th><th>릴스</th><th>컨셉</th><th>후크 강도</th><th>단계</th></tr>
    </thead>
    <tbody>
      <tr><td class="day">1</td><td class="id">RE-06</td><td><b>환불받는 부트캠프</b></td><td class="stars">★★★★★★</td><td>인지+호기심</td></tr>
      <tr><td class="day">2</td><td class="id">RE-03</td><td>94퍼센트 도달</td><td class="stars">★★★★★</td><td>신뢰</td></tr>
      <tr><td class="day">4</td><td class="id">RE-04</td><td>OPIc은 패턴</td><td class="stars">★★★★★</td><td>호기심+가치</td></tr>
      <tr><td class="day">5</td><td class="id">RE-01</td><td>학원 vs 부트캠프</td><td class="stars">★★★★</td><td>차별화</td></tr>
      <tr><td class="day">7</td><td class="id">RE-02</td><td>3년 IM → AL</td><td class="stars">★★★★</td><td>감정+결과</td></tr>
      <tr><td class="day">9</td><td class="id">RE-05</td><td>가격 비교 + 보증</td><td class="stars">★★★★</td><td>결정 유도</td></tr>
    </tbody>
  </table>

  <div class="callout green">
    <div class="callout-title">★ 왜 RE-06을 먼저 발행하는가</div>
    Hormozi 원칙 — "위험을 제거하면 가격은 거의 무관해진다." 보증 후크로 시작하면 이후 모든 릴스에서 시청자가 "어 환불 가능했지?" 라는 안전감을 가지고 봅니다. 결정 마찰 자동 감소.
  </div>

  <h3>보증 후크 활용 가이드 (Hormozi 핵심 레버)</h3>
  <p style="font-size:10pt; color:{t['text_secondary']}; margin-bottom: 8px;">
    모든 릴스의 마지막 CTA에 보증 한 줄을 추가하면 전환율이 즉시 올라갑니다. 시청자가 "신청 버튼" 누르기 직전의 마지막 망설임을 없애주는 게 핵심.
  </p>

  <h4>CTA 마무리 한 줄 옵션 (어느 릴스든 자연스러움)</h4>
  <ul style="font-size:10pt; padding-left: 20px;">
    <li>"1차 피드백 듣고 마음에 안 들면 환불해드립니다."</li>
    <li>"조건 다 채웠는데 등급 안 오르면 다음 기수 무료."</li>
    <li>"여러분은 결과만 가져가세요. 손해는 식빵영어가 집니다."</li>
  </ul>

  <h4>DM/댓글 응대에도 보증 활용</h4>
  <ul style="font-size:10pt; padding-left: 20px;">
    <li><b>가격 문의</b> → "199,000원이고, 1차 피드백 듣고 마음에 안 들면 환불 가능해요"</li>
    <li><b>효과 의심</b> → "수강생 94퍼센트가 목표 등급 도달했고, 못 오르면 무료 재수강이에요"</li>
    <li><b>망설임</b> → "일단 1차 피드백까지 들어보고 결정하셔도 돼요"</li>
  </ul>

  <h3>캡션 공식</h3>
  <div class="caption-block">[감정 hook 한 줄]
.
[문제 제기 1~2줄]
.
[솔루션 짧게]
.
프로필 링크에서 신청하세요.
@sikbang.eng
.
#OPIc #오픽AL #오픽부트캠프 #식빵영어 #영어회화 #직장인영어 #토익말고오픽</div>

  <h3>댓글 응대 템플릿</h3>
  <ul style="font-size:10pt; padding-left: 20px;">
    <li>"신청 완료했어요!" → "감사합니다 :) 카톡으로 안내드릴게요!"</li>
    <li>"가격 어떻게 돼요?" → "현재 얼리버드 199,000원, 5월 1일까지! 프로필 링크 확인해주세요"</li>
    <li>부정적 댓글 → 진심으로 응대 ("어떤 점이 우려되세요?" 류)</li>
  </ul>
</div>
'''


def section_5_checklist():
    return f'''
<div class="section-wrap">
  <div class="section-num">PART 5</div>
  <h1 class="section-title">촬영 체크리스트</h1>
  <p class="section-desc">릴스 제작 전 준비 사항과 후작업·업로드 체크포인트</p>

  <h3>영상 준비</h3>
  <ul class="checklist">
    <li>안준영 대표 정면 촬영 (자연광 또는 조명)</li>
    <li>학원 vs 부트캠프 비교용 B-roll (스톡 또는 자체)</li>
    <li>후기 캡쳐 이미지 (송*환, 이*준 등 — 본인 동의 후 사용)</li>
    <li>점수표 mockup (IH → AL 전환 영상)</li>
    <li>화면 캘린더 (체크마크 채워지는 애니메이션)</li>
    <li>SpeakCoach AI 분석 화면 캡쳐</li>
    <li>OPIc 채점 기준 인포그래픽</li>
  </ul>

  <h3>후작업</h3>
  <ul class="checklist">
    <li>자막은 영상 상단~중앙에 큰 폰트로 배치</li>
    <li>핵심 단어는 그린(#1A8D48) 또는 빨강 강조</li>
    <li>BGM 저작권 확인 (Inshot, CapCut 무료 라이브러리 OK)</li>
    <li>마지막 프레임에 프로필 링크 이미지 가이드</li>
    <li>화이트 플래시·임팩트 사운드 등 변화 cues 삽입</li>
    <li>720p 이상 / 9:16 비율 / 30fps 이상</li>
  </ul>

  <h3>인스타 업로드 시</h3>
  <ul class="checklist">
    <li>커버 이미지: 후크 자막이 박힌 정지 컷</li>
    <li>위치 태그: "Seoul, South Korea"</li>
    <li>협업 게시물: 안준영 대표 개인 계정과 협업</li>
    <li>첫 1시간 댓글 적극 응대 (알고리즘 신호)</li>
    <li>스토리에도 동시 공유</li>
    <li>해시태그 7~10개 적정</li>
  </ul>

  <div class="callout">
    <div class="callout-title">★ 마지막 한마디</div>
    가장 중요한 건 <b>"첫 1초"</b>입니다. 3초 안에 시청자의 감정을 흔드는 첫 자막 한 줄이 릴스 성패의 70퍼센트를 결정합니다.<br/><br/>
    각 대본의 HOOK 부분만 따로 모아 5개 버전을 A/B 테스트하는 것도 추천합니다.
  </div>
</div>
'''


# ---------- BUILD ----------
html = f'''<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"/><title>식빵영어 릴스 대본</title></head>
<body>
{cover()}
{section_1_patterns()}
{section_2_hormozi()}
{section_3_reels()}
{section_4_strategy()}
{section_5_checklist()}
</body></html>'''

print("Building PDF...")
HTML(string=html).write_pdf(OUT, stylesheets=[CSS(string=PAGE_CSS)])
print(f"✅ Saved: {OUT}")
