import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "식빵영어 | 2주 안에 OPIC 점수를 올리는 가장 구조적인 방법",
    template: "%s | 식빵영어",
  },
  description: "식빵영어 - OPIC 시험 준비의 가장 구조적인 방법. 2주 소그룹 스터디 + SpeakCoach AI로 목표 등급을 달성하세요. 4,000+ 수강생, 1,000+ 후기.",
  keywords: "OPIC, 오픽, 영어 스피킹, 오픽 스터디, 식빵영어, SpeakCoach AI, 오픽 준비, 오픽 IH, 오픽 AL, 영어 시험, 오픽 독학, 오픽 인강",
  authors: [{ name: "식빵영어" }],
  metadataBase: new URL("https://sikbang.co"),
  openGraph: {
    type: "website",
    title: "식빵영어 | 2주 안에 OPIC 점수를 올리는 가장 구조적인 방법",
    description: "사람의 코칭 + AI 피드백의 결합. 2주 소그룹 스터디와 SpeakCoach AI로 OPIC 목표 등급을 달성하세요.",
    url: "https://sikbang.co",
    siteName: "식빵영어",
    locale: "ko_KR",
    images: [{ url: "/og-main.svg", width: 1200, height: 630, alt: "식빵영어 - OPIC 준비의 가장 구조적인 방법" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "식빵영어 | 2주 OPIC 점수 올리기",
    description: "사람의 코칭 + AI 피드백. 4,000+ 수강생이 검증한 2주 OPIC 스터디.",
    images: ["/og-main.svg"],
  },
  alternates: {
    canonical: "https://sikbang.co",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/variable/pretendardvariable.min.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
