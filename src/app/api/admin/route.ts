import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ADMIN_PASSWORD = 'sikbang2025!';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, action, type, data } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: '비밀번호가 틀렸습니다.' }, { status: 401 });
    }

    const filePath = join(process.cwd(), 'public', 'data', `${type}.json`);

    if (action === 'read') {
      const content = readFileSync(filePath, 'utf-8');
      return NextResponse.json(JSON.parse(content));
    }

    if (action === 'write') {
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
