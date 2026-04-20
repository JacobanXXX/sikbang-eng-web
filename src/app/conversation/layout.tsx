import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1:1 영어 회화 코칭",
  description: "왕초보부터 고급자까지, 레벨에 맞춘 1:1 영어 회화 수업. 문법, 표현, 스피킹을 한 수업에서 균형 있게 잡아드려요. 주 1회 90분, 월 330,000원.",
  keywords: "영어 회화, 1:1 영어, 영어 과외, 영어 스피킹, 프리토킹, 영어 문법, 영어 회화 수업, 식빵영어",
  openGraph: {
    title: "1:1 영어 회화 코칭 | 식빵영어",
    description: "왕초보부터 고급자까지, 레벨에 맞춘 1:1 영어 회화 수업. 주 1회 90분, 월 4회.",
    url: "https://sikbang.co/conversation",
    images: [{ url: "/og-main.svg", width: 1200, height: 630, alt: "식빵영어 1:1 영어 회화 코칭" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "1:1 영어 회화 코칭 | 식빵영어",
    description: "왕초보부터 고급자까지, 레벨에 맞춘 1:1 영어 회화 수업.",
    images: ["/og-main.svg"],
  },
  alternates: {
    canonical: "https://sikbang.co/conversation",
  },
};

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
