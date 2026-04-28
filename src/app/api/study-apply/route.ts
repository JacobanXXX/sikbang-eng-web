import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse multipart form data
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const targetClass = formData.get('targetClass') as string;
    const currentLevel = formData.get('currentLevel') as string;
    const plan = formData.get('plan') as string;
    const hasBook = formData.get('hasBook') === 'true';
    const premiumUpgrade = formData.get('premiumUpgrade') === 'true';
    const refundAccount = formData.get('refundAccount') as string;
    const totalPrice = Number(formData.get('totalPrice'));
    const hasScore = formData.get('hasScore') === 'true';
    const scoreGrade = formData.get('scoreGrade') as string || '';
    const scoreFile = formData.get('scoreFile') as File | null;

    // Validation
    if (!name || !email || !phone || !targetClass || !currentLevel || !plan || !refundAccount) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    if (hasScore && !scoreGrade) {
      return NextResponse.json({ error: '사전 OPIc 등급을 선택해주세요.' }, { status: 400 });
    }

    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: '전화번호 형식이 올바르지 않습니다. (000-0000-0000)' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    // Build application data for logging
    const applicationData = {
      timestamp: new Date().toISOString(),
      name, email, phone, targetClass, currentLevel,
      plan, hasBook, premiumUpgrade, refundAccount, totalPrice,
      hasScore, scoreGrade,
      hasScoreFile: !!scoreFile,
    };

    console.log('[스터디 신청]', JSON.stringify(applicationData, null, 2));

    // === Stibee subscriber registration ===
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
            subscribers: [{ email, name }],
          }),
        });
      } catch (stibeeError) {
        console.error('Stibee registration failed:', stibeeError);
      }
    }

    // === Discord webhook notification (with file attachment) ===
    const WEBHOOK_URL = process.env.STUDY_APPLY_WEBHOOK_URL;
    if (WEBHOOK_URL) {
      try {
        const planLabel = plan === 'bundle' ? '번들(스터디+SpeakCoach 3개월)' : '일반 스터디';
        const levelLabels: Record<string, string> = {
          beginner: '왕초보 (시험 경험 없음)',
          NH: 'NH', IL: 'IL', IM1: 'IM1', IM2: 'IM2', IM3_above: 'IM3 이상',
        };

        const embedFields = [
          { name: '이름', value: name, inline: true },
          { name: '이메일', value: email, inline: true },
          { name: '전화', value: phone, inline: true },
          { name: '목표반', value: `${targetClass}목표반`, inline: true },
          { name: '현재 수준', value: levelLabels[currentLevel] || currentLevel, inline: true },
          { name: '플랜', value: planLabel, inline: true },
          { name: '교재 보유', value: hasBook ? '예' : '아니오', inline: true },
          { name: 'Premium', value: premiumUpgrade ? '예 (+₩15,000)' : '아니오', inline: true },
          { name: '총 금액', value: `₩${totalPrice?.toLocaleString()}`, inline: true },
          { name: '환불계좌', value: refundAccount, inline: false },
        ];

        // Add score info if present
        if (hasScore && scoreGrade) {
          embedFields.push({
            name: '사전 OPIc 등급',
            value: `${scoreGrade} (성적표 ${scoreFile ? '첨부됨' : '미첨부'})`,
            inline: true,
          });
        } else {
          embedFields.push({
            name: '사전 성적',
            value: '없음 (보증 미적용)',
            inline: true,
          });
        }

        const payload = {
          embeds: [{
            title: '📋 새 스터디 신청',
            color: 1740104, // #1A8D48 in decimal
            fields: embedFields,
            footer: { text: 'sikbang.co 스터디 신청' },
            timestamp: new Date().toISOString(),
          }],
        };

        // If there's a score file, send as multipart with file attachment
        if (scoreFile && scoreFile.size > 0) {
          const discordForm = new FormData();
          discordForm.append('payload_json', JSON.stringify(payload));

          // Convert File to Blob for Discord
          const fileBuffer = await scoreFile.arrayBuffer();
          const fileBlob = new Blob([fileBuffer], { type: scoreFile.type });
          discordForm.append('files[0]', fileBlob, `성적표_${name}_${scoreGrade}.${scoreFile.name.split('.').pop()}`);

          await fetch(WEBHOOK_URL, {
            method: 'POST',
            body: discordForm,
          });
        } else {
          // No file — send as JSON
          await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }
      } catch (webhookError) {
        console.error('Webhook notification failed:', webhookError);
      }
    }

    // === Google Sheets (if configured) ===
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
      data: { name, totalPrice, plan },
    });
  } catch (error) {
    console.error('Study application error:', error);
    return NextResponse.json({ error: '신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
