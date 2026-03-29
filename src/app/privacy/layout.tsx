import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '식빵영어 개인정보처리방침',
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
