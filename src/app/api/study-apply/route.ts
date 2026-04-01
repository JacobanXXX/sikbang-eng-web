import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, targetClass, plan, hasBook, premiumUpgrade, refundAccount, totalPrice } = body;

    // Validation
    if (!name || !email || !phone || !targetClass || !plan || !refundAccount) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    // Phone format validation
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: '전화번호 형식이 올바르지 않습니다. (000-0000-0000)' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    // Build application data
    const applicationData = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone,
      targetClass,
      plan, // 'standard' or 'bundle'
      hasBook, // boolean
      premiumUpgrade, // boolean
      refundAccount,
      totalPrice,
    };

    console.log('[스터디 신청]', JSON.stringify(applicationData, null, 2));

    // === Notification: Send email via webhook or email service ===
    // Option 1: Stibee subscriber registration
    const STIBEE_API_KEY = process.env.STIBEE_API_KEY;
    const STIBEE_LIST_ID = process.env.STIBEE_LIST_ID;

    if (STIBEE_API_KEY && STIBEE_LIST_ID) {
      try {
        await fetch(`https://api.stibee.com/v1/lists/${STIBEE_LIST_ID}/subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'AccessToken': STIBEE_API_KEY,
          },
          body: JSON.stringify({
            eventOccurredBy: 'SUBSCRIBER',
            confirmEmailYN: 'N',
            subscribers: [{
              email,
              name,
            }],
          }),
        });
      } catch (stibeeError) {
        console.error('Stibee registration failed:', stibeeError);
      }
    }

    // Option 2: Discord/Slack webhook notification
    const WEBHOOK_URL = process.env.STUDY_APPLY_WEBHOOK_URL;
    if (WEBHOOK_URL) {
      try {
        const planLabel = plan === 'bundle' ? '번들(스터디+SpeakCoach 3개월)' : '일반 스터디';
        const message = [
          `📋 **새 스터디 신청**`,
          `이름: ${name}`,
          `이메일: ${email}`,
          `전화: ${phone}`,
          `목표반: ${targetClass}`,
          `플랜: ${planLabel}`,
          `교재 보유: ${hasBook ? '예' : '아니오'}`,
          `프리미엄 업그레이드: ${premiumUpgrade ? '예 (+15,000원)' : '아니오'}`,
          `총 금액: ₩${totalPrice?.toLocaleString()}`,
          `환불계좌: ${refundAccount}`,
          `신청시각: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
        ].join('\n');

        // Try Discord webhook format first, fallback to Slack
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: message, // Discord
            text: message,   // Slack
          }),
        });
      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError);
      }
    }

    // Option 3: Google Sheets (if configured)
    const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (GOOGLE_SHEETS_WEBHOOK) {
      try {
        await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(applicationData),
        });
      } catch (sheetsError) {
        console.error('Google Sheets sync failed:', sheetsError);
      }
    }

    return NextResponse.json({
      success: true,
      message: '신청이 완료되었습니다!',
      data: {
        name,
        totalPrice,
        plan,
      }
    });
  } catch (error) {
    console.error('Study application error:', error);
    return NextResponse.json({ error: '신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
