import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '성적 보증 청구 - 식빵영어',
  description: '식빵영어 2주 OPIc 스터디 성적 보증 청구 페이지입니다.',
};

export default function GuaranteeClaimLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
