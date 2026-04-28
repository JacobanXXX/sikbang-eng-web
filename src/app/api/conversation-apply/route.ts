import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, time, level } = body;

    // Validation
    if (!name || !phone || !email || !time || !level) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    const levelText = level === 'beginner' ? '기초 (처음부터 시작)' : '실력 향상 (회화/문법/작문)';

    // Discord Webhook 알림
    const WEBHOOK_URL = process.env.CONVERSATION_APPLY_WEBHOOK_URL;

    if (WEBHOOK_URL) {
      const payload = {
        embeds: [{
          title: '🎓 1:1 영어 회화 수업 신청',
          color: 3244790,
          fields: [
            { name: '이름', value: name, inline: true },
            { name: '연락처', value: phone, inline: true },
            { name: '이메일', value: email, inline: false },
            { name: '희망 시간', value: time, inline: true },
            { name: '수업 유형', value: levelText, inline: true },
            { name: '수강료', value: '330,000원', inline: true }
          ],
          footer: { text: 'sikbang.co 영어 회화 신청' },
          timestamp: new Date().toISOString()
        }]
      };

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (webhookError) {
        console.error('Discord webhook failed:', webhookError);
      }
    }

    console.log('[영어 회화 신청]', JSON.stringify({ name, phone, email, time, level: levelText, timestamp: new Date().toISOString() }, null, 2));

    return NextResponse.json({
      success: true,
      message: '신청이 완료되었습니다!',
      data: { name, level: levelText, time }
    });
  } catch (error) {
    console.error('Conversation apply error:', error);
    return NextResponse.json({ error: '신청 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
