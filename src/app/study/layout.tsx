import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "14일 AL 완성 부트캠프",
  description: "코치 직접 피드백 + SpeakCoach AI 분석. 14일 커리큘럼으로 수료생 94%가 목표 등급 달성. 3인 소그룹 부트캠프.",
  keywords: "오픽 부트캠프, OPIC 부트캠프, 오픽 14일, 오픽 코치, 소그룹 부트캠프, 오픽 IH, 오픽 AL, 식빵영어 부트캠프",
  openGraph: {
    title: "14일 AL 완성 부트캠프 | 식빵영어",
    description: "코치 피드백 + AI 분석 · 수료생 94% 목표 달성. 14일 집중 부트캠프로 OPIC 점수를 올리세요.",
    url: "https://sikbang.co/study",
    images: [{ url: "/og-study.svg", width: 1200, height: 630, alt: "식빵영어 14일 AL 완성 부트캠프" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "14일 AL 완성 부트캠프 | 식빵영어",
    description: "코치 피드백 + AI 분석. 수료생 94% 목표 달성.",
    images: ["/og-study.svg"],
  },
  alternates: {
    canonical: "https://sikbang.co/study",
  },
};

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
