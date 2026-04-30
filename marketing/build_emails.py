"""
식빵영어 14일 AL 부트캠프 — 스티비 뉴스레터 4회차 빌더
- 월/목 발송 패턴 (2주 시리즈)
- 인라인 CSS, 테이블 레이아웃, 모바일 호환
- Stibee 직접 import 가능
"""
import os

OUT = "/sessions/awesome-dreamy-cori/mnt/sikbang-eng-web/marketing/emails"
os.makedirs(OUT, exist_ok=True)

# ---------- 컬러 토큰 ----------
BLUE = "#3182F6"
BLUE_DARK = "#1B64DA"
BLUE_LIGHT = "#E8F3FF"
GREEN = "#1A8D48"
GREEN_LIGHT = "#E9F6EE"
RED = "#dc2626"
TEXT_PRIMARY = "#191F28"
TEXT_SECONDARY = "#4E5968"
TEXT_TERTIARY = "#8B95A1"
BG_GRAY = "#F2F4F6"
BG_CARD = "#F9FAFB"
BORDER = "#E5E8EB"


def base_template(preheader, body_html, cta_text="부트캠프 자세히 보기", cta_url="https://sikbang.co/study", cta_color=GREEN, episode="제 1회"):
    """공통 이메일 레이아웃"""
    return f'''<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>식빵영어 뉴스레터</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background: {BG_GRAY}; color: {TEXT_PRIMARY}; word-break: keep-all;">

<!-- preheader (받은편지함 미리보기) -->
<div style="display: none; max-height: 0; overflow: hidden;">
  {preheader}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {BG_GRAY};">
  <tr>
    <td align="center" style="padding: 24px 12px;">

      <!-- 메인 카드 -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background: #FFFFFF; border-radius: 16px; overflow: hidden;">

        <!-- HEADER -->
        <tr>
          <td style="padding: 28px 32px 0; text-align: left;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align: middle;">
                  <span style="font-size: 18px; font-weight: 800; color: {BLUE}; letter-spacing: -0.02em;">SB</span>
                  <span style="font-size: 16px; font-weight: 700; color: {TEXT_PRIMARY}; margin-left: 6px;">식빵영어</span>
                </td>
                <td align="right" style="vertical-align: middle;">
                  <span style="font-size: 12px; color: {TEXT_TERTIARY}; font-weight: 500;">{episode}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding: 24px 32px 8px;">
            {body_html}
          </td>
        </tr>

        <!-- CTA BUTTON -->
        <tr>
          <td style="padding: 8px 32px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td bgcolor="{cta_color}" style="border-radius: 12px; text-align: center;">
                  <a href="{cta_url}" style="display: block; padding: 16px 24px; color: white; text-decoration: none; font-size: 16px; font-weight: 700; letter-spacing: -0.01em;">
                    {cta_text} →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding: 24px 32px; background: {BG_CARD}; border-top: 1px solid {BORDER};">
            <p style="margin: 0 0 8px; font-size: 12px; color: {TEXT_SECONDARY}; line-height: 1.6;">
              <strong style="color: {TEXT_PRIMARY};">식빵영어</strong> · 대표 안준영<br/>
              부산광역시 진구 만리산로98, 2층 · 사업자등록번호 807-29-01639
            </p>
            <p style="margin: 0 0 12px; font-size: 12px; color: {TEXT_TERTIARY}; line-height: 1.6;">
              본 메일은 광고성 정보이며, <a href="https://sikbang.co" style="color: {BLUE}; text-decoration: none;">sikbang.co</a> 및 식빵영어 뉴스레터를 신청하신 분께 발송됩니다.
            </p>
            <p style="margin: 0; font-size: 11px; color: {TEXT_TERTIARY};">
              <a href="{{$unsubscribed_link}}" style="color: {TEXT_TERTIARY}; text-decoration: underline;">수신 거부</a>
              &nbsp;·&nbsp;
              <a href="https://instagram.com/sikbang.eng" style="color: {TEXT_TERTIARY}; text-decoration: underline;">@sikbang.eng</a>
              &nbsp;·&nbsp;
              <a href="https://sikbang.co" style="color: {TEXT_TERTIARY}; text-decoration: underline;">sikbang.co</a>
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>'''


# ============================================================
# Email 1 — 사전 예고 + 보증 후크 (월요일 D-10)
# ============================================================
EMAIL_1_SUBJECT = "OPIc 부트캠프, 환불받을 수 있어요"
EMAIL_1_PREHEADER = "1차 피드백 듣고 마음에 안 들면 환불. 사유는 안 묻습니다."
EMAIL_1_BODY = f'''
<!-- HOOK 배지 -->
<div style="display: inline-block; background: {GREEN_LIGHT}; color: {GREEN}; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 16px;">
  PRE-LAUNCH · 5월 부트캠프
</div>

<!-- HERO -->
<h1 style="font-size: 26px; font-weight: 800; line-height: 1.35; color: {TEXT_PRIMARY}; margin: 0 0 14px; letter-spacing: -0.02em;">
  환불받는 OPIc 부트캠프,<br/>들어보신 적 있어요?
</h1>
<p style="font-size: 15px; line-height: 1.7; color: {TEXT_SECONDARY}; margin: 0 0 24px;">
  안녕하세요, 식빵영어 안준영입니다.<br/>
  5월 부트캠프 모집을 앞두고 새 보증 정책을 먼저 알려드리려고 메일 드려요.
</p>

<!-- 보증 카드 1 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {GREEN_LIGHT}; border-radius: 12px; margin-bottom: 12px;">
  <tr>
    <td style="padding: 20px 22px;">
      <p style="margin: 0 0 6px; font-size: 12px; font-weight: 800; color: {GREEN}; letter-spacing: 0.05em;">보증 1</p>
      <h3 style="margin: 0 0 8px; font-size: 17px; font-weight: 800; color: {TEXT_PRIMARY};">
        1차 피드백 듣고 환불 가능
      </h3>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: {TEXT_SECONDARY};">
        개강 후 첫 1대1 피드백(보통 Day 1~3 안에 진행)을 받으신 뒤, 만족스럽지 않으면 코칭 비용을 환불해드립니다. <strong style="color: {TEXT_PRIMARY};">사유는 따로 묻지 않습니다.</strong>
      </p>
    </td>
  </tr>
</table>

<!-- 보증 카드 2 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {GREEN_LIGHT}; border-radius: 12px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 20px 22px;">
      <p style="margin: 0 0 6px; font-size: 12px; font-weight: 800; color: {GREEN}; letter-spacing: 0.05em;">보증 2</p>
      <h3 style="margin: 0 0 8px; font-size: 17px; font-weight: 800; color: {TEXT_PRIMARY};">
        등급 미향상 시 다음 기수 무료
      </h3>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: {TEXT_SECONDARY};">
        조건을 다 채웠는데 등급이 안 올랐다면, 다음 기수를 무료로 다시 들으실 수 있습니다.
      </p>
    </td>
  </tr>
</table>

<!-- 마무리 메시지 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left: 4px solid {GREEN}; padding-left: 16px; margin-bottom: 24px;">
  <tr>
    <td>
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: {TEXT_PRIMARY}; font-weight: 600;">
        손해는 식빵영어가 집니다.<br/>
        여러분은 결과만 가져가세요.
      </p>
    </td>
  </tr>
</table>

<p style="margin: 0 0 8px; font-size: 14px; line-height: 1.7; color: {TEXT_SECONDARY};">
  5월 부트캠프 모집은 곧 시작됩니다. 정원 20명, 자세한 안내는 다음 메일에서 드릴게요.
</p>
'''


# ============================================================
# Email 2 — 모집 시작 알림 + 가치 스택 (목요일 D-7)
# ============================================================
EMAIL_2_SUBJECT = "5월 부트캠프 모집 시작 — 정원 20명"
EMAIL_2_PREHEADER = "수강생 94%가 목표 등급에 도달했습니다. 199,000원 얼리버드 진행 중"
EMAIL_2_BODY = f'''
<!-- HOOK 배지 -->
<div style="display: inline-block; background: #FFE5E5; color: {RED}; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 16px;">
  RECRUITMENT OPEN · 정원 20명
</div>

<!-- HERO -->
<h1 style="font-size: 26px; font-weight: 800; line-height: 1.35; color: {TEXT_PRIMARY}; margin: 0 0 14px; letter-spacing: -0.02em;">
  수강생 94%가 목표 등급에<br/>도달한 부트캠프
</h1>
<p style="font-size: 15px; line-height: 1.7; color: {TEXT_SECONDARY}; margin: 0 0 24px;">
  5월 14일 기수 모집이 오늘 시작됐습니다.<br/>
  학원 한 달 과정을 14일에 끝내는 1대3 부트캠프, 핵심만 짚어드릴게요.
</p>

<!-- 통계 박스 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {BG_CARD}; border-radius: 12px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" style="padding: 8px;">
            <div style="font-size: 22px; font-weight: 800; color: {GREEN};">94%</div>
            <div style="font-size: 11px; color: {TEXT_TERTIARY}; margin-top: 4px;">수료율</div>
          </td>
          <td align="center" style="padding: 8px;">
            <div style="font-size: 22px; font-weight: 800; color: {GREEN};">2단계</div>
            <div style="font-size: 11px; color: {TEXT_TERTIARY}; margin-top: 4px;">평균 등급 상승</div>
          </td>
          <td align="center" style="padding: 8px;">
            <div style="font-size: 22px; font-weight: 800; color: {GREEN};">4,000명</div>
            <div style="font-size: 11px; color: {TEXT_TERTIARY}; margin-top: 4px;">누적 수강생</div>
          </td>
          <td align="center" style="padding: 8px;">
            <div style="font-size: 22px; font-weight: 800; color: {GREEN};">20명</div>
            <div style="font-size: 11px; color: {TEXT_TERTIARY}; margin-top: 4px;">기수당 정원</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<h3 style="margin: 0 0 14px; font-size: 17px; font-weight: 800; color: {TEXT_PRIMARY};">
  부트캠프에 포함된 가치
</h3>

<!-- 가치 스택 리스트 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
  <tr>
    <td style="padding: 12px 0; border-bottom: 1px solid {BORDER}; font-size: 14px; color: {TEXT_PRIMARY};">
      <strong>안준영 대표 1대1 매일 음성 피드백</strong><br/>
      <span style="color: {TEXT_TERTIARY}; font-size: 13px;">14일간 매일 녹음 → 직접 듣고 분석</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 12px 0; border-bottom: 1px solid {BORDER}; font-size: 14px; color: {TEXT_PRIMARY};">
      <strong>1대3 라이브 코칭 총 180분</strong><br/>
      <span style="color: {TEXT_TERTIARY}; font-size: 13px;">3인 소그룹, 2주간 집중 진행</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 12px 0; border-bottom: 1px solid {BORDER}; font-size: 14px; color: {TEXT_PRIMARY};">
      <strong>SpeakCoach AI Pro 2주 무료</strong><br/>
      <span style="color: {TEXT_TERTIARY}; font-size: 13px;">발음·문법·유창성 7개 영역 자동 분석</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 12px 0; border-bottom: 1px solid {BORDER}; font-size: 14px; color: {TEXT_PRIMARY};">
      <strong>보너스 4종 (별도 구매가 227,000원)</strong><br/>
      <span style="color: {TEXT_TERTIARY}; font-size: 13px;">즉답 프레임워크, AL 답변 50선 등 무료 포함</span>
    </td>
  </tr>
  <tr>
    <td style="padding: 12px 0; font-size: 14px; color: {TEXT_PRIMARY};">
      <strong>1차 피드백 후 환불 보증</strong><br/>
      <span style="color: {TEXT_TERTIARY}; font-size: 13px;">사유 안 묻고 환불, 미향상 시 무료 재수강</span>
    </td>
  </tr>
</table>

<!-- 가격 박스 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {GREEN_LIGHT}; border-radius: 12px; margin-bottom: 12px;">
  <tr>
    <td style="padding: 22px;">
      <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: {GREEN}; letter-spacing: 0.05em;">얼리버드 39% 할인</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <span style="font-size: 14px; color: {TEXT_TERTIARY}; text-decoration: line-through;">329,000원</span>
            &nbsp;
            <span style="font-size: 28px; font-weight: 800; color: {TEXT_PRIMARY};">199,000원</span>
          </td>
        </tr>
      </table>
      <p style="margin: 8px 0 0; font-size: 12px; color: {TEXT_SECONDARY};">
        5월 9일까지. 이후 정가 229,000원으로 변경됩니다.
      </p>
    </td>
  </tr>
</table>
'''


# ============================================================
# Email 3 — 후기 + 사회적 증거 (월요일 D-3)
# ============================================================
EMAIL_3_SUBJECT = "3년 IH였던 분이 14일 만에 AL을 받았습니다"
EMAIL_3_PREHEADER = "혼자 해봤자 뭐가 틀린지 모르겠던 분의 후기"
EMAIL_3_BODY = f'''
<!-- HOOK 배지 -->
<div style="display: inline-block; background: {BLUE_LIGHT}; color: {BLUE}; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 16px;">
  REAL STORY · 5월 부트캠프 모집 중
</div>

<!-- HERO -->
<h1 style="font-size: 26px; font-weight: 800; line-height: 1.35; color: {TEXT_PRIMARY}; margin: 0 0 14px; letter-spacing: -0.02em;">
  3년 IH에 막혀 있던 분이<br/>2주 만에 AL을 받았어요
</h1>
<p style="font-size: 15px; line-height: 1.7; color: {TEXT_SECONDARY}; margin: 0 0 24px;">
  지난 기수 수강생 송*환 님(승진 준비 직장인)의 후기를 그대로 옮깁니다.
</p>

<!-- 후기 카드 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {BG_CARD}; border: 1px solid {BORDER}; border-radius: 12px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 24px;">
      <!-- 등급 변화 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
        <tr>
          <td>
            <span style="display: inline-block; background: #F2F4F6; color: {TEXT_SECONDARY}; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 700; font-family: 'Lato', monospace;">IH</span>
            <span style="color: {GREEN}; margin: 0 8px; font-size: 14px;">▶</span>
            <span style="display: inline-block; background: {GREEN_LIGHT}; color: {GREEN}; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: 700; font-family: 'Lato', monospace;">AL</span>
          </td>
        </tr>
      </table>

      <p style="margin: 0 0 14px; font-size: 14.5px; line-height: 1.75; color: {TEXT_PRIMARY};">
        승진 요건에 OPIc IH가 있는데 3번 시험 봤는데 계속 IM2였어요. 혼자 해봤자 <strong>뭐가 틀린지 모르겠더라고요.</strong>
      </p>
      <p style="margin: 0 0 14px; font-size: 14.5px; line-height: 1.75; color: {TEXT_PRIMARY};">
        부트캠프에서 코치가 시제 전환할 때 끊기는 게 IM 원인이라고 딱 짚어줬어요. <strong>그거 하나 고쳤더니 바로 IH 나왔습니다.</strong>
      </p>

      <!-- 정보 -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top: 16px; padding-top: 14px; border-top: 1px solid {BORDER};">
        <tr>
          <td style="vertical-align: middle;">
            <div style="display: inline-block; width: 32px; height: 32px; line-height: 32px; background: {BLUE_LIGHT}; color: {BLUE}; border-radius: 50%; text-align: center; font-weight: 700; font-size: 13px;">송</div>
          </td>
          <td style="padding-left: 10px; vertical-align: middle;">
            <div style="font-size: 13px; font-weight: 700; color: {TEXT_PRIMARY};">송*환 님</div>
            <div style="font-size: 11px; color: {TEXT_TERTIARY};">대기업 과장 5년차 · 승진 준비</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- 핵심 메시지 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left: 4px solid {BLUE}; padding-left: 16px; margin-bottom: 24px;">
  <tr>
    <td>
      <p style="margin: 0; font-size: 15px; line-height: 1.7; color: {TEXT_PRIMARY};">
        혼자 풀던 문제도, <strong>매일 듣는 사람이 있으면 다릅니다.</strong><br/>
        식빵영어는 안준영 대표가 매일 직접 답변을 듣고 분석합니다.
      </p>
    </td>
  </tr>
</table>

<p style="margin: 0 0 16px; font-size: 14px; line-height: 1.7; color: {TEXT_SECONDARY};">
  5월 14일 기수 정원은 20명. 현재 일부 자리가 남아 있습니다. 자세한 커리큘럼과 신청은 아래에서 확인해주세요.
</p>
'''


# ============================================================
# Email 4 — 마감 임박 (목요일 D-1 또는 마지막 발송)
# ============================================================
EMAIL_4_SUBJECT = "오늘 자정 얼리버드 마감 — 마지막 자리"
EMAIL_4_PREHEADER = "내일부터 정가 229,000원. 지금 신청하면 30,000원 절약."
EMAIL_4_BODY = f'''
<!-- HOOK 배지 -->
<div style="display: inline-block; background: #FFE5E5; color: {RED}; padding: 6px 12px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 16px;">
  마감 임박 · 오늘 자정까지
</div>

<!-- HERO -->
<h1 style="font-size: 26px; font-weight: 800; line-height: 1.35; color: {TEXT_PRIMARY}; margin: 0 0 14px; letter-spacing: -0.02em;">
  오늘 자정,<br/>얼리버드 가격이 사라집니다
</h1>
<p style="font-size: 15px; line-height: 1.7; color: {TEXT_SECONDARY}; margin: 0 0 24px;">
  5월 14일 기수 얼리버드 가격 199,000원은 오늘 23:59까지입니다.<br/>
  내일부터 정가 229,000원으로 자동 변경돼요.
</p>

<!-- 가격 비교 박스 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {BG_CARD}; border: 2px solid {GREEN}; border-radius: 12px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            <p style="margin: 0 0 4px; font-size: 12px; color: {TEXT_TERTIARY}; font-weight: 600;">오늘까지</p>
            <p style="margin: 0; font-size: 22px; font-weight: 800; color: {GREEN};">199,000원</p>
          </td>
          <td align="right">
            <p style="margin: 0 0 4px; font-size: 12px; color: {TEXT_TERTIARY}; font-weight: 600;">내일부터</p>
            <p style="margin: 0; font-size: 22px; font-weight: 800; color: {TEXT_TERTIARY}; text-decoration: line-through;">229,000원</p>
          </td>
        </tr>
      </table>
      <p style="margin: 12px 0 0; padding-top: 12px; border-top: 1px solid {BORDER}; font-size: 13px; color: {TEXT_SECONDARY}; text-align: center;">
        지금 신청하면 <strong style="color: {GREEN};">30,000원 절약</strong>
      </p>
    </td>
  </tr>
</table>

<!-- 핵심 요약 3개 -->
<h3 style="margin: 0 0 14px; font-size: 17px; font-weight: 800; color: {TEXT_PRIMARY};">
  마지막으로 한 번만 정리할게요
</h3>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
  <tr>
    <td style="padding: 14px 0; border-bottom: 1px solid {BORDER};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="40" style="vertical-align: top;">
            <div style="width: 28px; height: 28px; line-height: 28px; background: {GREEN}; color: white; border-radius: 50%; text-align: center; font-weight: 800; font-size: 13px;">1</div>
          </td>
          <td style="padding-left: 4px;">
            <p style="margin: 0 0 4px; font-size: 14.5px; font-weight: 700; color: {TEXT_PRIMARY};">14일이면 끝납니다</p>
            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: {TEXT_SECONDARY};">학원 한 달 과정을 2주에. 매일 녹음·분석·교정 사이클.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding: 14px 0; border-bottom: 1px solid {BORDER};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="40" style="vertical-align: top;">
            <div style="width: 28px; height: 28px; line-height: 28px; background: {GREEN}; color: white; border-radius: 50%; text-align: center; font-weight: 800; font-size: 13px;">2</div>
          </td>
          <td style="padding-left: 4px;">
            <p style="margin: 0 0 4px; font-size: 14.5px; font-weight: 700; color: {TEXT_PRIMARY};">대표가 매일 직접 듣습니다</p>
            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: {TEXT_SECONDARY};">강사 1명이 100명을 가르치는 학원과 다릅니다. 1대1 음성 피드백.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding: 14px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="40" style="vertical-align: top;">
            <div style="width: 28px; height: 28px; line-height: 28px; background: {GREEN}; color: white; border-radius: 50%; text-align: center; font-weight: 800; font-size: 13px;">3</div>
          </td>
          <td style="padding-left: 4px;">
            <p style="margin: 0 0 4px; font-size: 14.5px; font-weight: 700; color: {TEXT_PRIMARY};">위험은 식빵영어가 집니다</p>
            <p style="margin: 0; font-size: 13px; line-height: 1.6; color: {TEXT_SECONDARY};">1차 피드백 듣고 환불 가능. 등급 안 오르면 다음 기수 무료.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- 마지막 한 줄 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: {GREEN_LIGHT}; border-radius: 12px; margin-bottom: 24px;">
  <tr>
    <td style="padding: 18px 22px; text-align: center;">
      <p style="margin: 0; font-size: 15px; font-weight: 700; color: {GREEN}; line-height: 1.6;">
        공기업도, 대기업도, 외국계도.<br/>
        OPIc AL 하나면 다 뚫립니다.
      </p>
    </td>
  </tr>
</table>

<p style="margin: 0; font-size: 13px; line-height: 1.7; color: {TEXT_TERTIARY}; text-align: center;">
  망설이는 동안 이번 자리는 다른 분이 가져가요.
</p>
'''


# ---------- BUILD ----------
emails = [
    ("01_teaser_guarantee.html", EMAIL_1_SUBJECT, EMAIL_1_PREHEADER, EMAIL_1_BODY,
     "보증 자세히 보기", "https://sikbang.co/study", GREEN, "제 1회 · 사전 예고"),
    ("02_recruitment_open.html", EMAIL_2_SUBJECT, EMAIL_2_PREHEADER, EMAIL_2_BODY,
     "지금 신청하기", "https://sikbang.co/study#pricing", GREEN, "제 2회 · 모집 시작"),
    ("03_real_story.html", EMAIL_3_SUBJECT, EMAIL_3_PREHEADER, EMAIL_3_BODY,
     "5월 부트캠프 신청", "https://sikbang.co/study", GREEN, "제 3회 · 실제 후기"),
    ("04_closing_soon.html", EMAIL_4_SUBJECT, EMAIL_4_PREHEADER, EMAIL_4_BODY,
     "마감 전 신청하기", "https://sikbang.co/study", RED, "제 4회 · 마감 임박"),
]

for filename, subject, preheader, body, cta_text, cta_url, cta_color, episode in emails:
    html = base_template(preheader, body, cta_text, cta_url, cta_color, episode)
    path = os.path.join(OUT, filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"✅ {filename} ({len(html):,} bytes)")
    print(f"   제목: {subject}")
    print(f"   미리보기: {preheader}")
    print()

print(f"\n📂 저장 위치: {OUT}")
