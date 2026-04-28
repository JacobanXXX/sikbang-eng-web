import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Parse text fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const cohort = formData.get('cohort') as string;
    const preGrade = formData.get('preGrade') as string;
    const postGrade = formData.get('postGrade') as string;
    const testType = formData.get('testType') as string;
    const testNumber = formData.get('testNumber') as string;
    const testDate = formData.get('testDate') as string;

    // Parse files
    const preScoreFile = formData.get('preScoreFile') as File | null;
    const postScoreFile = formData.get('postScoreFile') as File | null;
    const idFile = formData.get('idFile') as File | null;

    // Parse checkboxes (comma-separated string of checked items)
    const checkedConditions = formData.get('checkedConditions') as string;

    // Validation
    if (!name || !email || !phone || !cohort || !preGrade || !postGrade || !testType || !testNumber || !testDate) {
      return NextResponse.json({ error: '필수 항목을 모두 입력해주세요.' }, { status: 400 });
    }

    if (!preScoreFile || !postScoreFile || !idFile) {
      return NextResponse.json({ error: '사전 성적표, 사후 성적표, 신분증을 모두 첨부해주세요.' }, { status: 400 });
    }

    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: '전화번호 형식이 올바르지 않습니다. (000-0000-0000)' }, { status: 400 });
    }

    // ACTFL grade order for validation
    const gradeOrder = ['NH', 'IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL', 'AH'];
    const preIndex = gradeOrder.indexOf(preGrade);
    const postIndex = gradeOrder.indexOf(postGrade);

    if (preIndex === -1 || postIndex === -1) {
      return NextResponse.json({ error: '올바른 OPIc 등급을 선택해주세요.' }, { status: 400 });
    }

    // Post grade should be same or lower than pre grade (they're claiming no improvement)
    if (postIndex > preIndex) {
      return NextResponse.json({ error: '사후 등급이 사전 등급보다 높으면 성적이 향상된 것입니다. 보증 청구 대상이 아닙니다.' }, { status: 400 });
    }

    // All conditions must be checked
    const requiredConditions = ['과제 100%', '스터디 100%', '코칭 100%', '2주 내 응시', '30일 내 제출', '동일 유형', '사실 확인'];
    if (!checkedConditions || requiredConditions.some(c => !checkedConditions.includes(c))) {
      return NextResponse.json({ error: '모든 보증 조건을 확인해주세요.' }, { status: 400 });
    }

    console.log('[보증 청구]', JSON.stringify({
      timestamp: new Date().toISOString(),
      name, email, phone, cohort, preGrade, postGrade, testType, testNumber, testDate,
      checkedConditions,
      files: {
        preScore: preScoreFile?.name,
        postScore: postScoreFile?.name,
        id: idFile?.name,
      },
    }, null, 2));

    // === Discord webhook notification (with file attachments) ===
    const WEBHOOK_URL = process.env.GUARANTEE_CLAIM_WEBHOOK_URL;
    if (WEBHOOK_URL) {
      try {
        const payload = {
          embeds: [{
            title: '🛡️ 성적 보증 청구 접수',
            color: 15844367, // #F1C40F (yellow/warning)
            fields: [
              { name: '이름', value: name, inline: true },
              { name: '이메일', value: email, inline: true },
              { name: '전화', value: phone, inline: true },
              { name: '수강 기수', value: cohort, inline: true },
              { name: '시험 유형', value: testType === 'general' ? '일반 (OPIc)' : 'Business (OPIc B)', inline: true },
              { name: '수험번호', value: testNumber, inline: true },
              { name: '사전 등급', value: preGrade, inline: true },
              { name: '사후 등급', value: postGrade, inline: true },
              { name: '등급 변화', value: preIndex === postIndex ? '동일 (미향상)' : `하락 (${preGrade} → ${postGrade})`, inline: true },
              { name: '시험일', value: testDate, inline: true },
              { name: '조건 확인', value: checkedConditions || '미확인', inline: false },
            ],
            footer: { text: 'sikbang.co 보증 청구 | 심사 기한: 14영업일' },
            timestamp: new Date().toISOString(),
          }],
        };

        // Build multipart form for Discord with file attachments
        const discordForm = new FormData();
        discordForm.append('payload_json', JSON.stringify(payload));

        // Attach files
        const attachFile = async (file: File, index: number, label: string) => {
          const buffer = await file.arrayBuffer();
          const blob = new Blob([buffer], { type: file.type });
          const ext = file.name.split('.').pop();
          discordForm.append(`files[${index}]`, blob, `${label}_${name}.${ext}`);
        };

        await attachFile(preScoreFile, 0, '사전성적표');
        await attachFile(postScoreFile, 1, '사후성적표');
        await attachFile(idFile, 2, '신분증');

        await fetch(WEBHOOK_URL, {
          method: 'POST',
          body: discordForm,
        });
      } catch (webhookError) {
        console.error('Guarantee claim webhook failed:', webhookError);
      }
    }

    return NextResponse.json({
      success: true,
      message: '보증 청구가 접수되었습니다. 14영업일 이내에 심사 결과를 안내드립니다.',
      data: { name, preGrade, postGrade },
    });
  } catch (error) {
    console.error('Guarantee claim error:', error);
    return NextResponse.json({ error: '청구 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }, { status: 500 });
  }
}
