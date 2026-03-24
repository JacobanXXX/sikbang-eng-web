'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const NOTION_SIGNUP_URL = 'https://www.notion.so/1-21dc7de0b170808a83bae9009d68a73e?source=copy_link';
const BASE_QUEUE = 47;
const TOAST_INTERVAL = [8000, 15000];

const names = [
  '김*준',
  '이*아',
  '박*현',
  '최*영',
  '정*미',
  '한*수',
  '오*진',
  '서*연',
  '강*호',
  '윤*은',
  '임*석',
  '신*희',
  '조*민',
  '장*우',
  '배*정',
];

const actions = [
  '님이 대기 신청했습니다',
  '님이 얼리버드로 등록했습니다',
  '님이 대기 명단에 합류했습니다',
];

const locations = ['서울', '부산', '대구', '인천', '대전', '광주', '수원', '울산'];

const faqItems = [
  {
    question: '영어를 못해도 따라갈 수 있나요?',
    answer:
      '네, 식빵영어 스터디는 초급자부터 중급자까지 맞춤형 커리큘럼으로 설계되었습니다. AI와 코치의 개별 피드백을 통해 자신의 레벨에서 시작하실 수 있습니다.',
  },
  {
    question: 'SpeakCoach AI는 어떻게 사용하나요?',
    answer:
      'SpeakCoach AI는 매일 스피킹 과제를 제출하면 음성을 분석하여 발음, 문법, 자연스러움을 평가합니다. AI 분석 결과를 통해 객관적인 피드백을 받을 수 있습니다.',
  },
  {
    question: '2주 후에는 어떻게 되나요?',
    answer:
      '스터디 수료 후 6개월간 코치님과의 추가 피드백을 받을 수 있습니다. 또한 식빵영어의 다른 프로그램에 50% 할인 혜택이 주어집니다.',
  },
  {
    question: '환불 규정이 어떻게 되나요?',
    answer:
      '첫 3일 이내 환불 가능하며, 4일 이상 진행 후에는 환불이 어렵습니다. 수강 불가 사유가 있으면 카카오톡으로 문의해주세요.',
  },
  {
    question: '3인 팩 구성은 어떻게 이루어지나요?',
    answer:
      '신청하신 순서대로 3명이 모이면 팩이 구성됩니다. 함께 배울 팀원과는 카카오톡 그룹채팅으로 소통하게 됩니다.',
  },
];

const reviews = [
  {
    name: '박*진',
    rating: 5,
    text: 'OPIC 공부가 이렇게 효과적일 줄 몰랐어요. AI 피드백이 정말 도움됐고, 코치님의 개별 지도 덕분에 자신감이 생겼습니다!',
  },
  {
    name: '김*민',
    rating: 5,
    text: '2주라는 짧은 기간이지만, 프레임워크를 배우니 답변이 체계적으로 정리됐어요. 강력 추천합니다!',
  },
  {
    name: '이*수',
    rating: 5,
    text: '소그룹이라 부끄럽지 않고, 또래 학생들과 함께하니 동기부여가 잘 됐어요.',
  },
  {
    name: '정*희',
    rating: 5,
    text: 'AI 분석으로 내 발음의 약점을 정확히 파악할 수 있었어요. 그걸 바탕으로 집중 교정할 수 있어서 좋았습니다.',
  },
  {
    name: '최*영',
    rating: 5,
    text: '카톡으로 언제든 질문할 수 있고, 코치님이 빠르게 답변해주셔서 막혔던 부분을 쉽게 해결했어요.',
  },
  {
    name: '한*정',
    rating: 5,
    text: '프레임워크 답변 훈련이 정말 실전같았어요. 시험장에서 이 방식이 그대로 도움이 됐습니다!',
  },
];

const curriculumWeek1 = [
  {
    day: 'Day 1',
    title: '마인드셋 & 기본 프레임워크',
    description: 'OPIC 시험 구조 파악 및 답변 패턴 학습',
  },
  {
    day: 'Day 2',
    title: '자기소개 & 일상 주제',
    description: 'Part 1 완벽 공략법',
  },
  {
    day: 'Day 3',
    title: '취미 & 관심사',
    description: '자연스러운 디테일 추가 기법',
  },
  {
    day: 'Day 4',
    title: '경험 & 스토리텔링',
    description: 'Part 2 심화 학습',
  },
  {
    day: 'Day 5',
    title: '직업 & 꿈',
    description: '설득력 있는 답변 구조',
  },
  {
    day: 'Day 6',
    title: '문화 & 사회이슈',
    description: '고급 어휘와 표현법',
  },
  {
    day: 'Day 7',
    title: 'Week 1 총정리',
    description: '모의 시험 & 피드백',
  },
];

const curriculumWeek2 = [
  {
    day: 'Day 8',
    title: '프레임워크 심화',
    description: 'Part 3 완벽 공략',
  },
  {
    day: 'Day 9',
    title: '어려운 주제 대응법',
    description: '예측 불가능한 질문 처리',
  },
  {
    day: 'Day 10',
    title: '발음 & 자연스러움',
    description: 'AI 피드백 활용법',
  },
  {
    day: 'Day 11',
    title: '시간 관리 전략',
    description: '효율적인 답변 시간 배분',
  },
  {
    day: 'Day 12',
    title: '자신감 부스팅',
    description: '스트레스 관리 & 멘탈 훈련',
  },
  {
    day: 'Day 13',
    title: '코치와의 1:1 세션',
    description: '개별 약점 집중 교정',
  },
  {
    day: 'Day 14',
    title: 'Week 2 최종 마무리',
    description: '최종 모의시험 & 피드백',
  },
];

export default function StudyPage() {
  const [queueCount, setQueueCount] = useState(0);
  const [ctaQueueNum, setCtaQueueNum] = useState(0);
  const [floatingQueueNum, setFloatingQueueNum] = useState(0);
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{ id: string; name: string; action: string; location: string; mins: number }>
  >([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [faqAnswerHeights, setFaqAnswerHeights] = useState<Record<number, number>>({});
  const [reviewScrollPosition, setReviewScrollPosition] = useState(0);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [reviewDirection, setReviewDirection] = useState<'left' | 'right'>('left');

  const queueRef = useRef(BASE_QUEUE + Math.floor(Math.random() * 8));
  const toastCounterRef = useRef(0);
  const reviewContainerRef = useRef<HTMLDivElement>(null);
  const reviewScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const toastIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faqItemsRef = useRef<Record<number, HTMLDivElement | null>>({});

  // Animate queue counter on mount
  useEffect(() => {
    const animationDuration = 2000;
    const steps = 60;
    const increment = queueRef.current / steps;
    let current = 0;

    const animationInterval = setInterval(() => {
      current += increment;
      if (current >= queueRef.current) {
        setQueueCount(queueRef.current);
        setCtaQueueNum(queueRef.current);
        setFloatingQueueNum(queueRef.current);
        clearInterval(animationInterval);
      } else {
        setQueueCount(Math.floor(current));
        setCtaQueueNum(Math.floor(current));
        setFloatingQueueNum(Math.floor(current));
      }
    }, animationDuration / steps);

    return () => clearInterval(animationInterval);
  }, []);

  // Toast notifications
  useEffect(() => {
    const showToast = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      const randomMins = Math.floor(Math.random() * 45) + 5;
      const toastId = `toast-${toastCounterRef.current++}`;

      setToasts((prev) => [
        ...prev,
        { id: toastId, name: randomName, action: randomAction, location: randomLocation, mins: randomMins },
      ]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastId));
      }, 5000);
    };

    const nextToastTime = Math.random() * (TOAST_INTERVAL[1] - TOAST_INTERVAL[0]) + TOAST_INTERVAL[0];
    toastIntervalRef.current = setTimeout(() => {
      showToast();
      const interval = setInterval(() => {
        showToast();
      }, Math.random() * (TOAST_INTERVAL[1] - TOAST_INTERVAL[0]) + TOAST_INTERVAL[0]);
      toastIntervalRef.current = interval;
    }, nextToastTime);

    return () => {
      if (toastIntervalRef.current) clearInterval(toastIntervalRef.current);
    };
  }, []);

  // Floating CTA visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setShowFloatingCta(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll reviews
  useEffect(() => {
    if (!reviewPaused && reviewContainerRef.current) {
      const scroll = () => {
        if (reviewContainerRef.current) {
          const container = reviewContainerRef.current;
          const isAtEnd =
            container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
          const isAtStart = container.scrollLeft <= 10;

          if (isAtEnd) {
            setReviewDirection('right');
          } else if (isAtStart) {
            setReviewDirection('left');
          }

          const scrollAmount = 3;
          if (reviewDirection === 'left') {
            container.scrollLeft += scrollAmount;
          } else {
            container.scrollLeft -= scrollAmount;
          }
        }
      };

      reviewScrollIntervalRef.current = setInterval(scroll, 50);
    }

    return () => {
      if (reviewScrollIntervalRef.current) clearInterval(reviewScrollIntervalRef.current);
    };
  }, [reviewDirection, reviewPaused]);

  // FAQ height animation
  useEffect(() => {
    const newHeights: Record<number, number> = {};
    faqItems.forEach((_, index) => {
      if (faqItemsRef.current[index]) {
        const element = faqItemsRef.current[index];
        if (element) {
          newHeights[index] = openFaqIndex === index ? element.scrollHeight : 0;
        }
      }
    });
    setFaqAnswerHeights(newHeights);
  }, [openFaqIndex]);

  return (
    <>
      <style>{`
        :root {
          --green: #10b981;
          --green-light: #d1fae5;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --border: #e5e7eb;
          --blue-primary: #3b82f6;
          --bg-gray: #f9fafb;
          --white: #ffffff;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
            'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          color: var(--text-primary);
          background: var(--white);
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .section {
          padding: 100px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-gray {
          background: var(--bg-gray);
        }

        .section-title {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .section-desc {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        /* Navigation */
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: var(--white);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid var(--border);
        }

        nav .logo {
          font-size: 20px;
          font-weight: 700;
          color: var(--green);
        }

        nav .links {
          display: flex;
          gap: 40px;
          align-items: center;
        }

        nav a {
          font-size: 14px;
          color: var(--text-secondary);
          transition: color 0.2s;
        }

        nav a:hover {
          color: var(--text-primary);
        }

        .btn-primary {
          background: var(--green);
          color: var(--white);
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.3s;
          font-size: 14px;
        }

        .btn-primary:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .btn-secondary {
          background: var(--white);
          color: var(--text-primary);
          padding: 12px 24px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }

        .btn-secondary:hover {
          border-color: var(--text-primary);
          background: var(--bg-gray);
        }

        /* Hero Section */
        #hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 80px 20px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
        }

        .hero-badge {
          display: inline-block;
          background: var(--green-light);
          color: var(--green);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .hero h1 {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 20px;
          line-height: 1.2;
          color: var(--text-primary);
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          margin-bottom: 40px;
          line-height: 1.6;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .queue-box {
          background: var(--white);
          border: 2px solid var(--green);
          border-radius: 12px;
          padding: 30px;
          margin: 40px 0;
          display: inline-block;
          min-width: 300px;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);
        }

        .queue-box-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 10px;
        }

        .queue-box-count {
          font-size: 48px;
          font-weight: 800;
          color: var(--green);
        }

        /* Cards Grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 30px;
          transition: all 0.3s;
        }

        .card:hover {
          border-color: var(--green);
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.1);
          transform: translateY(-4px);
        }

        .card-icon {
          font-size: 32px;
          margin-bottom: 20px;
        }

        .card-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .card-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Curriculum */
        .curriculum-weeks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-top: 40px;
        }

        .week {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 30px;
          overflow: hidden;
        }

        .week-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--green);
        }

        .curriculum-item {
          padding: 15px 0;
          border-bottom: 1px solid var(--border);
        }

        .curriculum-item:last-child {
          border-bottom: none;
        }

        .curriculum-item-day {
          font-size: 12px;
          color: var(--green);
          font-weight: 700;
          text-transform: uppercase;
        }

        .curriculum-item-title {
          font-size: 14px;
          font-weight: 600;
          margin: 5px 0;
          color: var(--text-primary);
        }

        .curriculum-item-desc {
          font-size: 13px;
          color: var(--text-secondary);
        }

        /* Daily Flow */
        .daily-flow-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .flow-step {
          background: var(--white);
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .flow-step:hover {
          border-color: var(--green);
          background: var(--green-light);
        }

        .flow-step-icon {
          font-size: 32px;
          margin-bottom: 12px;
        }

        .flow-step-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Pricing */
        .pricing-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 40px;
          align-items: start;
        }

        .pricing-card {
          background: var(--white);
          border: 2px solid var(--border);
          border-radius: 12px;
          padding: 30px;
          position: relative;
        }

        .pricing-card.featured {
          border-color: var(--green);
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.15);
          transform: scale(1.02);
        }

        .pricing-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          background: var(--green);
          color: var(--white);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .pricing-title {
          font-size: 18px;
          font-weight: 700;
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .pricing-desc {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .pricing-original {
          font-size: 16px;
          color: var(--text-secondary);
          text-decoration: line-through;
          margin-bottom: 5px;
        }

        .pricing-price {
          font-size: 32px;
          font-weight: 800;
          color: var(--green);
          margin-bottom: 10px;
        }

        .pricing-note {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .pricing-features {
          list-style: none;
          margin-bottom: 20px;
        }

        .pricing-features li {
          padding: 8px 0;
          font-size: 14px;
          color: var(--text-primary);
        }

        .pricing-features li:before {
          content: '✓ ';
          color: var(--green);
          font-weight: 700;
          margin-right: 8px;
        }

        /* Rules */
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .rule-item {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
        }

        .rule-number {
          font-size: 28px;
          font-weight: 800;
          color: var(--green);
          margin-bottom: 10px;
        }

        .rule-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Reviews */
        .reviews-container {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 20px 0;
        }

        .reviews-container::-webkit-scrollbar {
          display: none;
        }

        .review-card {
          flex: 0 0 280px;
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .review-stars {
          margin-bottom: 10px;
          font-size: 14px;
          color: #fbbf24;
        }

        .review-text {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 15px;
          line-height: 1.6;
          flex-grow: 1;
        }

        .review-author {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* FAQ */
        .faq-items {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-top: 40px;
        }

        .faq-item {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        .faq-question {
          padding: 20px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          transition: all 0.3s;
        }

        .faq-question:hover {
          background: var(--bg-gray);
        }

        .faq-toggle {
          font-size: 20px;
          transition: transform 0.3s;
        }

        .faq-toggle.open {
          transform: rotate(180deg);
        }

        .faq-answer {
          padding: 0 20px;
          overflow: hidden;
          transition: max-height 0.3s ease-out;
        }

        .faq-answer-content {
          padding: 20px 0;
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 14px;
        }

        /* CTA Banner */
        .cta-banner {
          background: linear-gradient(135deg, var(--green) 0%, var(--blue-primary) 100%);
          color: var(--white);
          padding: 60px 20px;
          text-align: center;
          border-radius: 12px;
          margin: 0 20px;
        }

        .cta-banner h2 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .cta-banner-queue {
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: 700;
        }

        /* Toast Notifications */
        .toasts-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
          pointer-events: none;
        }

        .toast {
          background: rgba(31, 41, 55, 0.9);
          backdrop-filter: blur(10px);
          color: var(--white);
          padding: 16px 20px;
          border-radius: 8px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideIn 0.3s ease-out;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast-emoji {
          font-size: 16px;
        }

        .toast-text {
          font-weight: 500;
        }

        .toast-location {
          opacity: 0.7;
          font-size: 12px;
        }

        .toast-time {
          opacity: 0.5;
          font-size: 12px;
          margin-left: auto;
        }

        /* Floating CTA */
        .floating-cta {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: var(--white);
          border: 2px solid var(--green);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.3s ease-out;
          z-index: 999;
          max-width: 280px;
        }

        @keyframes slideUp {
          from {
            transform: translateY(400px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .floating-cta-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .floating-cta-queue {
          font-size: 16px;
          font-weight: 700;
          color: var(--green);
          margin-bottom: 10px;
        }

        .floating-cta-price {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 15px;
        }

        /* Footer */
        footer {
          background: var(--text-primary);
          color: var(--white);
          padding: 40px 20px;
          text-align: center;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 30px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: var(--white);
          font-size: 14px;
          transition: opacity 0.2s;
        }

        .footer-links a:hover {
          opacity: 0.7;
        }

        .footer-copyright {
          font-size: 12px;
          opacity: 0.6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          nav .links {
            gap: 20px;
          }

          .hero h1 {
            font-size: 36px;
          }

          .section-title {
            font-size: 28px;
          }

          .curriculum-weeks,
          .pricing-cards {
            grid-template-columns: 1fr;
          }

          .pricing-card.featured {
            transform: scale(1);
          }

          .daily-flow-steps {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer-links {
            gap: 15px;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav>
        <div className="logo">식빵영어</div>
        <div className="links">
          <a href="#curriculum">커리큘럼</a>
          <a href="#daily">일일 흐름</a>
          <a href="#pricing">수강료</a>
          <a href="#reviews">후기</a>
          <a href="#faq">FAQ</a>
          <a href={NOTION_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-primary">대기 신청하기</button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section">
        <div className="hero-badge">현재 모집 중 · 3월 한정</div>
        <h1 className="hero h1">2주 만에 OPIC 목표 등급 달성</h1>
        <p className="hero-subtitle">
          소그룹 3인 1팩으로 집중력 있게 배우고, AI와 코치의 개별 피드백으로 빠르게 성장하세요.
        </p>
        <div className="queue-box">
          <div className="queue-box-label">현재 대기 인원</div>
          <div className="queue-box-count">{queueCount}명</div>
        </div>
        <a href={NOTION_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
          <button className="btn-primary">지금 신청하기</button>
        </a>
      </section>

      {/* Why This Study */}
      <section className="section">
        <h2 className="section-title">왜 식빵영어 스터디인가요?</h2>
        <div className="cards-grid">
          <div className="card">
            <div className="card-icon">⏱️</div>
            <div className="card-title">2주 집중 설계</div>
            <div className="card-desc">
              OPIC의 핵심만 뽑아 체계적인 커리큘럼으로 구성했습니다. 불필요한 것은 빼고, 꼭 필요한 것만 2주에
              완성합니다.
            </div>
          </div>
          <div className="card">
            <div className="card-icon">🤖</div>
            <div className="card-title">사람 + AI 피드백</div>
            <div className="card-desc">
              SpeakCoach AI는 당신의 발음과 표현을 분석하고, 코치님은 전략적인 관점에서 지도합니다. 두 관점이
              만나니 성장이 빠릅니다.
            </div>
          </div>
          <div className="card">
            <div className="card-icon">🏆</div>
            <div className="card-title">프레임워크 답변 훈련</div>
            <div className="card-desc">
              검증된 답변 틀을 배우고 반복하면, 시험장에서도 자동으로 나옵니다. 불안감을 자신감으로 바꾸세요.
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="section section-gray">
        <h2 className="section-title">2주 커리큘럼</h2>
        <div className="curriculum-weeks">
          <div className="week">
            <div className="week-title">Week 1: 기초 다지기</div>
            {curriculumWeek1.map((item, idx) => (
              <div key={idx} className="curriculum-item">
                <div className="curriculum-item-day">{item.day}</div>
                <div className="curriculum-item-title">{item.title}</div>
                <div className="curriculum-item-desc">{item.description}</div>
              </div>
            ))}
          </div>
          <div className="week">
            <div className="week-title">Week 2: 심화 & 실전</div>
            {curriculumWeek2.map((item, idx) => (
              <div key={idx} className="curriculum-item">
                <div className="curriculum-item-day">{item.day}</div>
                <div className="curriculum-item-title">{item.title}</div>
                <div className="curriculum-item-desc">{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Flow */}
      <section id="daily" className="section">
        <h2 className="section-title">하루는 이렇게 흘러갑니다</h2>
        <div className="daily-flow-steps">
          <div className="flow-step">
            <div className="flow-step-icon">☀️</div>
            <div className="flow-step-text">오전 강의</div>
          </div>
          <div className="flow-step">
            <div className="flow-step-icon">🎤</div>
            <div className="flow-step-text">스피킹 과제</div>
          </div>
          <div className="flow-step">
            <div className="flow-step-icon">🤖</div>
            <div className="flow-step-text">AI 분석</div>
          </div>
          <div className="flow-step">
            <div className="flow-step-icon">💬</div>
            <div className="flow-step-text">코치 피드백</div>
          </div>
          <div className="flow-step">
            <div className="flow-step-icon">💪</div>
            <div className="flow-step-text">교정 연습</div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section section-gray">
        <h2 className="section-title">수강료</h2>
        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="pricing-title">기본 패키지</div>
            <div className="pricing-desc">2주 집중 OPIC 스터디</div>
            <div className="pricing-note">소그룹 3인 1팩 · 14일</div>
            <div className="pricing-original">₩179,900</div>
            <div className="pricing-price">₩149,000</div>
            <div className="pricing-note">얼리버드 한정가</div>
            <ul className="pricing-features">
              <li>체계적인 2주 커리큘럼</li>
              <li>AI 스피킹 분석 (매일)</li>
              <li>코치 피드백 (매일)</li>
              <li>카카오톡 소통</li>
              <li>수료 후 6개월 피드백</li>
            </ul>
            <a href={NOTION_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              <button className="btn-primary" style={{ width: '100%' }}>
                신청하기
              </button>
            </a>
          </div>

          <div className="pricing-card featured">
            <div className="pricing-badge">BEST</div>
            <div className="pricing-title">프리미엄 + 업그레이드</div>
            <div className="pricing-desc">맞춤형 레벨 테스트 포함</div>
            <div className="pricing-note">소그룹 3인 1팩 · 14일 + 추가 서비스</div>
            <div className="pricing-original">₩189,900</div>
            <div className="pricing-price">₩159,000</div>
            <div className="pricing-note">얼리버드 한정가</div>
            <ul className="pricing-features">
              <li>기본 패키지 전체</li>
              <li>입장 전 레벨 테스트</li>
              <li>최대 3회 1:1 세션</li>
              <li>맞춤형 콘텐츠 추가</li>
              <li>수료 후 12개월 피드백</li>
            </ul>
            <a href={NOTION_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
              <button className="btn-primary" style={{ width: '100%' }}>
                신청하기
              </button>
            </a>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '20px' }}>수료 후 특별 혜택</h3>
          <p style={{ fontSize: '16px', color: 'var(--green)', fontWeight: '700' }}>
            식빵영어의 모든 프로그램 50% 할인
          </p>
        </div>
      </section>

      {/* Rules */}
      <section className="section">
        <h2 className="section-title">스터디 운영방침</h2>
        <div className="rules-grid">
          <div className="rule-item">
            <div className="rule-number">01</div>
            <div className="rule-text">매일 과제 제출 필수</div>
          </div>
          <div className="rule-item">
            <div className="rule-number">02</div>
            <div className="rule-text">3인 팩 구성 원칙</div>
          </div>
          <div className="rule-item">
            <div className="rule-number">03</div>
            <div className="rule-text">카카오톡으로 소통</div>
          </div>
          <div className="rule-item">
            <div className="rule-number">04</div>
            <div className="rule-text">첫 3일 환불 가능</div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="section section-gray">
        <h2 className="section-title">수강생 후기</h2>
        <div
          ref={reviewContainerRef}
          className="reviews-container"
          onMouseEnter={() => setReviewPaused(true)}
          onMouseLeave={() => setReviewPaused(false)}
        >
          {reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <div className="review-stars">{'⭐'.repeat(review.rating)}</div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-author">- {review.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section">
        <div className="cta-banner">
          <h2>다음 팩에 합류하세요</h2>
          <div className="cta-banner-queue">{ctaQueueNum}명이 대기 중입니다</div>
          <a href={NOTION_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-primary">지금 신청하기</button>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section section-gray">
        <h2 className="section-title">자주 묻는 질문</h2>
        <div className="faq-items">
          {faqItems.map((item, idx) => (
            <div key={idx} className="faq-item">
              <div
                className="faq-question"
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
              >
                <span>{item.question}</span>
                <span className={`faq-toggle ${openFaqIndex === idx ? 'open' : ''}`}>▼</span>
              </div>
              <div
                className="faq-answer"
                style={{ maxHeight: faqAnswerHeights[idx] ?? 0 }}
                ref={(el) => {
                  if (el) faqItemsRef.current[idx] = el;
                }}
              >
                <div className="faq-answer-content">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-links">
          <a href="/">메인 홈</a>
          <a href="https://www.instagram.com/sikbang.eng" target="_blank" rel="noopener noreferrer">
            인스타그램
          </a>
          <a href="https://blog.naver.com/lulu05" target="_blank" rel="noopener noreferrer">
            블로그
          </a>
          <a href="mailto:lulu066666@gmail.com">문의하기</a>
        </div>
        <div className="footer-copyright">© 2025 식빵영어. All rights reserved.</div>
      </footer>

      {/* Toast Notifications */}
      <div className="toasts-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <span className="toast-emoji">👋</span>
            <span className="toast-text">
              {toast.name}
              {toast.action}
            </span>
            <span className="toast-location">{toast.location}</span>
            <span className="toast-time">{toast.mins}분 전</span>
          </div>
        ))}
      </div>

      {/* Floating CTA */}
      {showFloatingCta && (
        <div className="floating-cta">
          <div className="floating-cta-title">다음 팩 모집</div>
          <div className="floating-cta-queue">{floatingQueueNum}명 대기 중</div>
          <div className="floating-cta-price">얼리버드 ₩149,000</div>
          <a href={NOTION_SIGNUP_URL} target="_blank" rel="noopener noreferrer">
            <button className="btn-primary" style={{ width: '100%' }}>
              신청하기
            </button>
          </a>
        </div>
      )}
    </>
  );
}
