import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "무료 OPIC 강의 & 학습 자료",
  description: "원어민이 배우는 영문법 시리즈 무료 강의 13편 + OPIC 학습 자료 아카이브. 로그인 없이 무료로 시청하세요.",
  keywords: "오픽 무료 강의, OPIC 무료, 오픽 영문법, 오픽 학습 자료, 식빵영어 무료, 오픽 준비 무료",
  openGraph: {
    title: "무료 OPIC 강의 & 학습 자료 | 식빵영어",
    description: "원어민이 배우는 영문법 시리즈 + OPIC 핵심 학습 자료. 무료로 시작하세요.",
    url: "https://sikbang.co/free",
    images: [{ url: "/og-free.svg", width: 1200, height: 630, alt: "식빵영어 무료 OPIC 강의" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "무료 OPIC 강의 | 식빵영어",
    description: "원어민 영문법 시리즈 13편 + 학습 자료 무료 공개.",
    images: ["/og-free.svg"],
  },
  alternates: {
    canonical: "https://sikbang.co/free",
  },
};

export default function FreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
