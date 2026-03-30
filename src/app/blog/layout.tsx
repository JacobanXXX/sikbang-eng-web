import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그',
  description: '오픽 학습 전략, 빈출 주제, 독학 가이드 등 OPIC 준비에 필요한 모든 정보를 제공합니다.',
  keywords: '오픽 독학, 오픽 IH, 오픽 빈출 주제, 오픽 공부법, OPIC 팁, 오픽 가이드',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
