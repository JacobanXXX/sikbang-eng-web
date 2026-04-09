import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const ADMIN_PASSWORD = 'sikbang2025!';

const GITHUB_OWNER = 'JacobanXXX';
const GITHUB_REPO = 'sikbang-eng-web';
const GITHUB_BRANCH = 'main';

async function githubRead(type: string) {
  const token = process.env.GITHUB_TOKEN;
  const path = `public/data/${type}.json`;
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status}`);
  const json = await res.json();
  const content = Buffer.from(json.content, 'base64').toString('utf-8');
  return { data: JSON.parse(content), sha: json.sha as string };
}

async function githubWrite(type: string, data: unknown) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정에 추가해주세요.');
  const path = `public/data/${type}.json`;
  // Get current sha
  const { sha } = await githubRead(type);
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
  const content = Buffer.from(JSON.stringify(data, null, 2), 'utf-8').toString('base64');
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `관리자 페이지에서 ${type}.json 업데이트`,
      content,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${errText}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, action, type, data } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: '비밀번호가 틀렸습니다.' }, { status: 401 });
    }

    if (type !== 'lectures' && type !== 'resources') {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (action === 'read') {
      // GitHub API 우선 시도 (Vercel 환경)
      if (process.env.GITHUB_TOKEN || process.env.VERCEL) {
        try {
          const { data: json } = await githubRead(type);
          return NextResponse.json(json);
        } catch (e) {
          // fallback to filesystem (로컬 개발 환경)
        }
      }
      // 로컬 파일시스템 fallback
      const filePath = join(process.cwd(), 'public', 'data', `${type}.json`);
      const content = readFileSync(filePath, 'utf-8');
      return NextResponse.json(JSON.parse(content));
    }

    if (action === 'write') {
      // Vercel 환경 또는 GITHUB_TOKEN이 있으면 GitHub API 사용
      if (process.env.VERCEL || process.env.GITHUB_TOKEN) {
        await githubWrite(type, data);
        return NextResponse.json({ success: true });
      }
      // 로컬 파일시스템
      const filePath = join(process.cwd(), 'public', 'data', `${type}.json`);
      writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : '서버 오류가 발생했습니다.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
