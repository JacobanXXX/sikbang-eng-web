'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function StudyPage() {
  // Slots and remaining state
  const [remainingSlots, setRemainingSlots] = useState(4);
  const [ctaRemainingSlots, setCtaRemainingSlots] = useState(4);
  const [floatingRemainingSlots, setFloatingRemainingSlots] = useState(4);

  // Floating CTA state
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  // Google Form modal state
  const [showFormModal, setShowFormModal] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState<Array<{ id: number; name: string; action: string; location: string; mins: number }>>([]);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  // faqAnswerHeights removed - using CSS max-height instead

  // Review scroll state
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [reviewDirection, setReviewDirection] = useState(1);
  const [reviewPaused, setReviewPaused] = useState(false);

  const totalSlots = 40;
  const filledSlots = 36;
  const slotsRef = useRef(remainingSlots);
  const toastCounterRef = useRef(0);

  const names = [
    '김*준', '이*아', '박*현', '최*영', '정*미',
    '한*수', '오*진', '서*연', '강*호', '윤*은',
    '임*석', '신*희', '조*민', '장*우', '배*정'
  ];

  const actions = [
    '님이 신청했습니다',
    '님이 등록했습니다',
    '님이 자리를 확보했습니다'
  ];

  const locations = ['서울', '부산', '대구', '인천', '대전', '광주', '수원', '울산'];

  const faqItems = [
    {
      question: '영어를 진짜 못하는데 따라갈 수 있을까요?',
      answer: '네, 가능합니다. 스터디는 프레임워크 기반으로 진행되기 때문에 영어를 잘 못하더라도 구조를 따라가며 답변을 만들 수 있어요. 실제로 IL 수준에서 시작해서 IM2, IH를 달성한 사례가 많습니다.'
    },
    {
      question: 'SpeakCoach AI는 어떻게 사용하나요?',
      answer: '스터디 시작 시 SpeakCoach AI Pro 계정이 자동으로 활성화됩니다. 웹 앱(PWA)이라 별도 설치 없이 브라우저에서 바로 사용 가능합니다. 답변을 녹음하면 AI가 발음, 문법, 유창성, 어휘를 분석해서 피드백을 줍니다.'
    },
    {
      question: '스터디는 언제 시작하나요?',
      answer: '3인 1팀이 구성되는 즉시 시작합니다. 신청 후 팀이 매칭되면 시작일을 안내해드립니다. 보통 신청 후 1주 이내 시작됩니다.'
    },
    {
      question: '하루에 얼마나 시간을 투자해야 하나요?',
      answer: '하루 평균 1~2시간 정도입니다. 학습 자료 확인(10분) + 답변 준비 및 녹음(30~40분) + AI 분석 확인 및 교정 연습(30분) + 코치 피드백 반영(20분). 직장인도 충분히 병행 가능한 수준입니다.'
    },
    {
      question: '환불은 어떻게 되나요?',
      answer: '인원 편성 이후(단톡방 초대 이후)에는 어떠한 사유로도 환불이 불가합니다. 본 스터디는 소규모 정원 기반으로 운영되며, 그룹 확정과 동시에 맞춤 커리큘럼과 운영 리소스가 즉시 배정되기 때문입니다. 단톡방 초대 전에는 전액 환불 가능합니다. 결제 시 본 환불 정책에 동의한 것으로 간주됩니다.'
    },
    {
      question: 'Premium 업그레이드는 꼭 해야 하나요?',
      answer: '필수는 아닙니다. 기본 스터디에 Pro 플랜이 포함되어 있어서 충분히 학습 가능합니다. Premium은 고급 분석 기능이 추가되므로, AL을 목표로 하시는 분께 추천드립니다.'
    }
  ];

  // Animate number counting up
  const animateNumber = (current: number, target: number, setter: (val: number) => void) => {
    const step = current < target ? 1 : -1;
    const interval = setInterval(() => {
      current += step;
      setter(current);
      if (current === target) clearInterval(interval);
    }, 30);
  };

  // Remaining slots initialization and updates
  useEffect(() => {
    const updateAllSlots = (num: number) => {
      slotsRef.current = num;
      setRemainingSlots(num);
      setCtaRemainingSlots(num);
      setFloatingRemainingSlots(num);
    };

    setTimeout(() => {
      updateAllSlots(slotsRef.current);
    }, 500);

    const slotsInterval = setInterval(() => {
      const change = Math.random();
      let newSlots = slotsRef.current;
      if (change < 0.15) {
        // Occasionally decrease remaining (showing more slots filling)
        newSlots = Math.max(2, newSlots - 1);
      }
      updateAllSlots(newSlots);
    }, 35000 + Math.random() * 25000);

    return () => clearInterval(slotsInterval);
  }, []);

  // Toast notifications
  useEffect(() => {
    const showToast = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const mins = Math.floor(Math.random() * 10) + 1;
      const id = toastCounterRef.current++;

      setToasts((prev) => [...prev, { id, name, action, location, mins }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    };

    setTimeout(() => {
      showToast();
      const toastInterval = setInterval(() => {
        showToast();
      }, 15000 + Math.random() * 20000);

      return () => clearInterval(toastInterval);
    }, 8000);
  }, []);

  // Floating CTA scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const queueBox = document.querySelector('.queue-box');
      if (!queueBox) return;

      const rect = queueBox.getBoundingClientRect();
      setShowFloatingCta(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll reviews
  useEffect(() => {
    if (!reviewScrollRef.current) return;

    const scroll = reviewScrollRef.current;
    let dir = reviewDirection;
    let paused = reviewPaused;

    const handleMouseEnter = () => setReviewPaused(true);
    const handleMouseLeave = () => setReviewPaused(false);
    const handleTouchStart = () => setReviewPaused(true);
    const handleTouchEnd = () => {
      setTimeout(() => setReviewPaused(false), 2000);
    };

    scroll.addEventListener('mouseenter', handleMouseEnter);
    scroll.addEventListener('mouseleave', handleMouseLeave);
    scroll.addEventListener('touchstart', handleTouchStart, { passive: true });
    scroll.addEventListener('touchend', handleTouchEnd);

    const scrollInterval = setInterval(() => {
      if (reviewPaused) return;
      const max = scroll.scrollWidth - scroll.clientWidth;
      if (max <= 0) return;

      let newDir = dir;
      if (scroll.scrollLeft >= max - 2) newDir = -1;
      if (scroll.scrollLeft <= 2) newDir = 1;

      scroll.scrollLeft += newDir;
      setReviewDirection(newDir);
    }, 30);

    return () => {
      clearInterval(scrollInterval);
      scroll.removeEventListener('mouseenter', handleMouseEnter);
      scroll.removeEventListener('mouseleave', handleMouseLeave);
      scroll.removeEventListener('touchstart', handleTouchStart);
      scroll.removeEventListener('touchend', handleTouchEnd);
    };
  }, [reviewPaused, reviewDirection]);

  // FAQ toggle
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // FAQ heights handled via CSS max-height transition

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;

      try {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          const nav = document.getElementById('nav');
          const navHeight = nav?.offsetHeight || 64;
          const top = el.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } catch (err) {}
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* === RESET & BASE === */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          background: #FFFFFF;
          color: #191F28;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
          word-break: keep-all;
          overflow-wrap: break-word;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        button {
          cursor: pointer;
          border: none;
          font-family: inherit;
        }

        /* === TOSS COLOR SYSTEM === */
        :root {
          --blue-primary: #3182F6;
          --blue-dark: #1B64DA;
          --blue-light: #E8F3FF;
          --text-primary: #191F28;
          --text-secondary: #4E5968;
          --text-tertiary: #8B95A1;
          --bg-white: #FFFFFF;
          --bg-gray: #F2F4F6;
          --border: #E5E8EB;
          --card-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
          --green: #1A8D48;
          --green-light: #E8FFF0;
          --red: #E74C3C;
          --orange: #F59E0B;
        }

        .container {
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* === NAV === */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          z-index: 100;
          height: 64px;
          display: flex;
          align-items: center;
        }
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 1140px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .nav-logo {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .bread-icon {
          font-size: 20px;
        }
        .nav-links {
          display: flex;
          gap: 32px;
          margin: 0 auto;
        }
        .nav-links a {
          font-size: 14px;
          color: var(--text-secondary);
          transition: color 0.2s;
        }
        .nav-links a:hover {
          color: var(--text-primary);
        }
        .nav-cta {
          background: var(--green);
          color: white !important;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .nav-cta:hover {
          background: #15753c;
        }

        /* === HERO === */
        .hero {
          padding: 120px 0 80px;
          margin-top: 64px;
          background: linear-gradient(135deg, rgba(26,141,72,0.03) 0%, rgba(51,102,255,0.03) 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--green-light);
          color: var(--green);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .hero-badge .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
        .hero h1 {
          font-size: 56px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 20px;
        }
        .hero h1 .accent {
          color: var(--green);
        }
        .hero .subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 40px;
          font-weight: 400;
        }
        .hero .subtitle strong {
          font-weight: 700;
          color: var(--text-primary);
        }

        /* === QUEUE COUNTER (FOMO) === */
        .queue-box {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          background: white;
          border: 2px solid var(--green);
          border-radius: 24px;
          padding: 32px 48px;
          box-shadow: 0 4px 24px rgba(26, 141, 72, 0.12);
          margin-bottom: 36px;
        }
        .queue-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .queue-progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(51,102,255,0.15);
          border-radius: 4px;
          margin: 12px 0;
          overflow: hidden;
        }
        .queue-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3366FF, #FF3B5C);
          border-radius: 4px;
          transition: width 1s ease;
        }
        .queue-stats {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #666;
          margin-bottom: 8px;
          gap: 24px;
        }
        .queue-stats strong {
          color: #FF3B5C;
        }
        .queue-sub {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .queue-sub .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red);
          animation: pulse 1.5s infinite;
        }

        /* live notification toast */
        .toast-area {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .toast {
          background: rgba(25, 31, 40, 0.92);
          backdrop-filter: blur(12px);
          color: white;
          padding: 14px 20px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: toastIn 0.4s ease, toastOut 0.4s ease 3.6s forwards;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          max-width: 340px;
        }
        .toast .toast-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          flex-shrink: 0;
        }
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes toastOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .hero-cta-group {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-primary {
          background: var(--green);
          color: white;
          padding: 18px 40px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(26, 141, 72, 0.3);
        }
        .btn-primary:hover {
          background: #15753c;
          box-shadow: 0 8px 24px rgba(26, 141, 72, 0.4);
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: white;
          color: var(--text-primary);
          padding: 18px 40px;
          border: 2px solid var(--border);
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-secondary:hover {
          border-color: var(--text-primary);
          background: var(--bg-gray);
        }

        /* === SECTION === */
        .section {
          padding: 80px 0;
        }
        .section-gray {
          background: var(--bg-gray);
        }
        .section-title {
          font-size: 40px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .section-desc {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 48px;
        }

        /* === WHY GRID === */
        .why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 56px;
        }
        .why-card {
          background: white;
          padding: 40px 32px;
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          text-align: center;
          transition: all 0.3s;
        }
        .why-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.1);
        }
        .why-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: inline-block;
        }
        .why-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .why-card p {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* === CURRICULUM === */
        .curriculum-timeline {
          margin-top: 56px;
        }
        .cur-week {
          position: relative;
          padding-left: 60px;
          margin-bottom: 48px;
          opacity: 0.5;
          transition: opacity 0.3s;
        }
        .cur-week.active {
          opacity: 1;
        }
        .cur-week-dot {
          position: absolute;
          left: 16px;
          top: 2px;
          width: 24px;
          height: 24px;
          background: white;
          border: 3px solid var(--border);
          border-radius: 50%;
          z-index: 1;
        }
        .cur-week.active .cur-week-dot {
          background: var(--green);
          border-color: var(--green);
        }
        .cur-week::before {
          content: '';
          position: absolute;
          left: 27px;
          top: 30px;
          width: 2px;
          height: 100%;
          background: var(--border);
        }
        .cur-week.active::before {
          background: var(--green);
        }
        .cur-week-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--green);
          margin-bottom: 8px;
        }
        .cur-week h3 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .cur-week > p {
          font-size: 15px;
          color: var(--text-secondary);
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .cur-day-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .cur-day {
          background: rgba(26,141,72,0.05);
          padding: 16px;
          border-radius: 12px;
          font-size: 14px;
          color: var(--text-primary);
          line-height: 1.5;
        }
        .cur-day strong {
          font-weight: 600;
          color: var(--green);
        }

        /* === PRICING === */
        .pricing-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: var(--card-shadow);
          margin-top: 56px;
        }
        .pricing-badge {
          background: #fee2e2;
          color: #dc2626;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .pricing-original {
          font-size: 22px;
          color: #999;
          text-decoration: line-through;
          font-weight: 500;
          margin-top: 8px;
        }
        .pricing-earlybird {
          margin-top: 12px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 1.5px solid #22c55e;
          border-radius: 10px;
          text-align: center;
          font-size: 14px;
          color: #15803d;
          line-height: 1.6;
        }
        .pricing-header h3 {
          font-size: 28px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .pricing-header .pricing-duration {
          font-size: 15px;
          color: var(--text-secondary);
        }
        .pricing-price-main {
          font-size: 64px;
          font-weight: 900;
          color: var(--green);
          line-height: 1;
          margin: 28px 0;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .pricing-desc {
          font-size: 15px;
          color: var(--text-secondary);
          margin-bottom: 32px;
          text-align: center;
          line-height: 1.6;
        }
        .pricing-features {
          width: 100%;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pricing-feature {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .pricing-feature::before {
          content: '\\2713';
          font-weight: 700;
          color: var(--green);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .pricing-btn {
          width: 100%;
          padding: 18px;
          background: var(--green);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          display: block;
          text-align: center;
          margin-bottom: 12px;
        }
        .pricing-btn:hover {
          background: #15753c;
          box-shadow: 0 8px 24px rgba(26, 141, 72, 0.3);
        }
        .pricing-addon {
          width: 100%;
          background: #f8faf9;
          border: 1.5px solid #e2e8f0;
          padding: 20px;
          border-radius: 12px;
          margin-top: 16px;
        }
        .pricing-addon.green {
          background: #f8faf9;
          border-color: #e2e8f0;
        }
        .pricing-addon h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .pricing-addon p {
          font-size: 14px;
          color: var(--text-secondary);
        }
        .addon-price {
          font-weight: 700;
          color: var(--text-primary);
        }

        /* === RULES === */
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 56px;
        }
        .rule-card {
          display: flex;
          gap: 20px;
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          transition: all 0.3s;
        }
        .rule-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.1);
        }
        .rule-num {
          font-size: 32px;
          font-weight: 900;
          color: var(--green);
          min-width: 50px;
        }
        .rule-card h4 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        .rule-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* === REVIEWS === */
        .review-scroll-wrap {
          overflow-x: auto;
          scroll-behavior: smooth;
          margin-top: 56px;
        }
        .review-scroll {
          display: flex;
          gap: 24px;
          padding-bottom: 12px;
          width: max-content;
        }
        .review-card {
          flex: 0 0 380px;
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          transition: all 0.3s;
        }
        .review-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 40px rgba(0,0,0,0.1);
        }
        .review-stars {
          font-size: 16px;
          color: #FFC107;
          margin-bottom: 16px;
          letter-spacing: 2px;
        }
        .review-text {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .review-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .review-avatar {
          font-size: 32px;
          flex-shrink: 0;
        }
        .review-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* === PHOTO REVIEWS CAROUSEL === */
        .photo-review-section {
          margin-top: 56px;
        }
        .photo-review-label {
          text-align: center;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        .photo-carousel-wrap {
          overflow: hidden;
          position: relative;
          width: 100%;
        }
        .photo-carousel-wrap::before,
        .photo-carousel-wrap::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 2;
          pointer-events: none;
        }
        .photo-carousel-wrap::before {
          left: 0;
          background: linear-gradient(to right, var(--bg-gray), transparent);
        }
        .photo-carousel-wrap::after {
          right: 0;
          background: linear-gradient(to left, var(--bg-gray), transparent);
        }
        .photo-carousel-track {
          display: flex;
          gap: 16px;
          animation: photoScroll 120s linear infinite;
          width: max-content;
        }
        .photo-carousel-track:hover {
          animation-play-state: paused;
        }
        @keyframes photoScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .photo-review-item {
          flex: 0 0 auto;
          width: 270px;
          height: 360px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          background: white;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .photo-review-item:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        }
        .photo-review-item img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }
        .review-grade {
          background: var(--green);
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }
        .review-info {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        /* === FAQ === */
        .faq-list {
          margin-top: 56px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .faq-item {
          background: white;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .faq-item.open {
          border-color: var(--green);
          box-shadow: 0 4px 16px rgba(26, 141, 72, 0.1);
        }
        .faq-question {
          padding: 20px 24px;
          background: white;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          transition: background 0.2s;
        }
        .faq-question:hover {
          background: var(--bg-gray);
        }
        .faq-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--green);
          font-weight: 700;
          flex-shrink: 0;
          transition: transform 0.3s;
        }
        .faq-item.open .faq-icon {
          transform: rotate(180deg);
        }
        .faq-answer {
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: rgba(26, 141, 72, 0.02);
          max-height: 0;
        }
        .faq-item.open .faq-answer {
          max-height: 500px;
        }
        .faq-answer-content {
          padding: 0 24px 20px;
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* === CTA BANNER === */
        .cta-banner {
          background: linear-gradient(135deg, var(--green) 0%, #0e6a38 100%);
          color: white;
          padding: 60px 0;
          text-align: center;
          margin: 80px 0 0;
        }
        .cta-banner h2 {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 16px;
        }
        .cta-banner p {
          font-size: 18px;
          margin-bottom: 32px;
          font-weight: 500;
        }
        .btn-white {
          background: white;
          color: var(--green);
          padding: 18px 40px;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s;
        }
        .btn-white:hover {
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        /* === FOOTER === */
        .footer {
          background: var(--text-primary);
          color: white;
          padding: 40px 0;
          text-align: center;
        }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 20px;
        }
        .footer-links {
          display: flex;
          gap: 24px;
          justify-content: center;
        }
        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: white;
        }
        .footer-copy {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* === FLOATING CTA === */
        .floating-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 1px solid var(--border);
          padding: 16px 24px;
          z-index: 99;
          transform: translateY(100%);
          transition: transform 0.3s;
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
        }
        .floating-cta.show {
          transform: translateY(0);
        }
        .floating-inner {
          max-width: 1140px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .floating-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .floating-queue {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .fq-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--red);
          animation: pulse 1.5s infinite;
        }
        .floating-price {
          font-size: 15px;
          color: var(--text-secondary);
        }
        .floating-price strong {
          color: var(--text-primary);
          font-weight: 700;
        }
        .floating-btn {
          background: var(--green);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s;
        }
        .floating-btn:hover {
          background: #15753c;
        }

        /* === GOOGLE FORM MODAL === */
        .form-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .form-modal-content {
          background: #fff;
          border-radius: 20px;
          max-width: 420px;
          width: 100%;
          position: relative;
          overflow: hidden;
          animation: modalSlideUp 0.3s ease;
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #999;
          z-index: 1;
        }
        .form-modal-body {
          padding: 40px 32px;
          text-align: center;
        }
        .form-modal-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .form-modal-body h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #191F28;
        }
        .form-modal-body > p {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .form-modal-info {
          background: #F8F9FA;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-around;
          font-size: 14px;
          color: #333;
          gap: 16px;
        }
        .form-modal-btn {
          display: block;
          width: 100%;
          padding: 16px;
          background: #3366FF;
          color: #fff;
          text-align: center;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .form-modal-btn:hover {
          background: #2952CC;
        }
        .form-modal-note {
          font-size: 12px;
          color: #999;
          margin-top: 12px;
        }

        /* === STATS SECTION === */
        .stats-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .stats-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 50%, rgba(34,197,94,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 70% 50%, rgba(59,130,246,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .stat-number {
          font-size: 52px;
          font-weight: 800;
          color: #22c55e;
          line-height: 1.1;
          letter-spacing: -2px;
        }
        .stat-label {
          font-size: 15px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        .stat-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
        }
        .stats-trust {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 32px;
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.1);
          position: relative;
          z-index: 1;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
        }
        .trust-item span:first-child {
          font-size: 20px;
        }

        /* === COMPARE TABLE === */
        .compare-section {
          padding: 80px 0;
        }
        .compare-table-wrap {
          overflow-x: auto;
          margin-top: 48px;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          background: white;
        }
        .compare-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }
        .compare-table thead th {
          padding: 20px 16px;
          font-size: 15px;
          font-weight: 700;
          text-align: center;
          border-bottom: 2px solid #e5e7eb;
          background: #f9fafb;
        }
        .compare-table thead th:first-child {
          text-align: left;
          padding-left: 24px;
          width: 180px;
        }
        .compare-table thead th.highlight-col {
          background: #22c55e;
          color: white;
          border-radius: 12px 12px 0 0;
          position: relative;
        }
        .compare-table tbody td {
          padding: 16px;
          text-align: center;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
          color: #4b5563;
        }
        .compare-table tbody td:first-child {
          text-align: left;
          padding-left: 24px;
          font-weight: 600;
          color: #1f2937;
        }
        .compare-table tbody td.highlight-col {
          background: #f0fdf4;
          font-weight: 600;
          color: #166534;
        }
        .compare-table tbody tr:last-child td {
          border-bottom: none;
        }
        .compare-check {
          color: #22c55e;
          font-weight: 700;
          font-size: 18px;
        }
        .compare-x {
          color: #d1d5db;
          font-size: 18px;
        }
        .compare-tag {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }

        /* === RESPONSIVE === */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hero {
            padding: 80px 0 40px;
          }
          .hero h1 {
            font-size: 36px;
          }
          .hero .subtitle {
            font-size: 16px;
            margin-bottom: 32px;
          }
          .queue-box {
            padding: 24px 32px;
            margin-bottom: 28px;
          }
          .section-title {
            font-size: 32px;
          }
          .section-desc {
            font-size: 16px;
          }
          .why-grid {
            grid-template-columns: 1fr;
          }
          .cur-day-grid {
            grid-template-columns: 1fr;
          }
          .rules-grid {
            grid-template-columns: 1fr;
          }
          .review-card {
            flex: 0 0 300px;
          }
          .photo-review-item {
            width: 210px;
            height: 280px;
          }
          .photo-carousel-track {
            gap: 12px;
          }
          .faq-question {
            padding: 16px 20px;
            font-size: 14px;
          }
          .faq-answer-content {
            padding: 0 20px 16px;
          }
          .cta-banner h2 {
            font-size: 24px;
          }
          .cta-banner p {
            font-size: 14px;
          }
          .floating-inner {
            flex-direction: column;
            gap: 12px;
            align-items: stretch;
          }
          .floating-info {
            flex-direction: column;
            gap: 12px;
          }
          .floating-queue, .floating-price {
            justify-content: space-between;
            width: 100%;
          }
          .floating-btn {
            width: 100%;
            text-align: center;
          }
          .toast {
            max-width: calc(100vw - 48px);
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 24px;
          }
          .stat-number {
            font-size: 36px;
          }
          .stats-trust {
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
          }
          .compare-table-wrap {
            margin-top: 32px;
          }
          .pricing-price-main {
            font-size: 44px !important;
          }
          .pricing-original {
            font-size: 18px;
          }
          .pricing-section {
            padding: 28px 20px !important;
          }
          .form-modal-info {
            flex-direction: column;
            gap: 8px;
            text-align: left;
          }
          .form-modal-content {
            margin: 16px;
          }
        }
      `}} />

      {/* NAV */}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className="bread-icon" style={{fontWeight:900, fontSize:'18px', color:'var(--green)'}}>SB</span> 식빵영어
          </Link>
          <div className="nav-links">
            <a href="/free">무료 강의</a>
            <a href="#curriculum">커리큘럼</a>
            <a href="#pricing">가격</a>
            <a href="#reviews">후기</a>
            <a href="#faq">FAQ</a>
          </div>
          <button onClick={() => setShowFormModal(true)} className="nav-cta">
            지금 신청하기
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            4월 1일 시작 · 선착순 40명 한정
          </div>
          <h1>
            2주 만에<br />
            <span className="accent">OPIC 목표 등급</span> 달성
          </h1>
          <p className="subtitle">
            소그룹 3인 1팀. 매일 스피킹 과제 + AI 피드백 + 코칭.<br />
            <strong>프레임워크 기반 답변 훈련</strong>으로 가장 구조적으로 준비하세요.
          </p>

          {/* QUEUE COUNTER */}
          <div className="queue-box">
            <div className="queue-label">🔥 선착순 40명 한정</div>
            <div className="queue-progress-bar">
              <div className="queue-progress-fill" style={{ width: `${((totalSlots - remainingSlots) / totalSlots) * 100}%` }}></div>
            </div>
            <div className="queue-stats">
              <span>✅ 현재 신청: {totalSlots - remainingSlots}명</span>
              <span>⏰ 남은 자리: <strong>{remainingSlots}명</strong></span>
            </div>
            <div className="queue-sub">
              <span className="live-dot"></span>
              실시간 업데이트 · 마감 임박
            </div>
          </div>

          <div className="hero-cta-group">
            <button onClick={() => setShowFormModal(true)} className="btn-primary">
              지금 신청하기 →
            </button>
            <Link href="/" className="btn-secondary">
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </section>

      {/* WHY THIS STUDY */}
      <section className="section" id="why">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">왜 4,000명이 이 스터디를 선택했을까요?</div>
            <p className="section-desc">혼자 준비와는 결과가 다릅니다.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon green">2W</div>
              <h3>2주 집중 설계</h3>
              <p>불필요한 걸 다 뺐습니다. 2주 동안 OPIC 점수를 올리는 것에만 집중하는 커리큘럼.</p>
            </div>
            <div className="why-card">
              <div className="why-icon blue">AI</div>
              <h3>사람 + AI 피드백</h3>
              <p>코치가 매일 발음·문법·스크립트를 직접 교정하고, AI가 7개 영역을 실시간 분석. 2주간 총 180분 피드백.</p>
            </div>
            <div className="why-card">
              <div className="why-icon orange">FW</div>
              <h3>프레임워크 답변 훈련</h3>
              <p>막연히 말하지 않습니다. OPIC에 최적화된 답변 구조를 익혀서 어떤 질문에도 흔들리지 않는 실력을.</p>
            </div>
            <div className="why-card">
              <div className="why-icon green">3P</div>
              <h3>3인 소그룹</h3>
              <p>인강 완강률 12% vs 식빵영어 수료율 94%. 3명이라 모두가 매일 말하고, 서로 자극이 됩니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon blue">94</div>
              <h3>검증된 성과</h3>
              <p>1,000건 이상의 수강 후기. IH, AL 등급 달성 사례가 계속 쌓이고 있습니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon orange">SC</div>
              <h3>SpeakCoach AI 포함</h3>
              <p>스터디 기간 동안 SpeakCoach AI Pro를 무료로 제공. 매일 AI 분석으로 약점을 정밀 교정합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">94%</div>
              <div className="stat-label">목표 등급 달성률</div>
              <div className="stat-sub">2주 스터디 수료생 기준</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1.5↑</div>
              <div className="stat-label">평균 등급 상승</div>
              <div className="stat-sub">IM2→IH, IM3→AL 등</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4,000+</div>
              <div className="stat-label">누적 수강생</div>
              <div className="stat-sub">2024~2026년 기준</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1,000+</div>
              <div className="stat-label">실제 인증 후기</div>
              <div className="stat-sub">liveclass 인증 포함</div>
            </div>
          </div>
          <div className="stats-trust">
            <div className="trust-item">
              <span style={{fontWeight:700}}>B2B</span>
              <span>삼성전자 초청 OPIc 세미나 진행</span>
            </div>
            <div className="trust-item">
              <span style={{fontWeight:700}}>No.1</span>
              <span>OPIc 전자책 베스트셀러</span>
            </div>
            <div className="trust-item">
              <span style={{fontWeight:700}}>AI</span>
              <span>자체 AI 스피킹 분석 시스템 운영</span>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="section section-gray" id="curriculum">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">14일 완성 커리큘럼</div>
            <p className="section-desc">3단계 Phase로 설계된 체계적인 OPIc 정복 로드맵</p>
          </div>
          <div className="curriculum-timeline">
            {/* Phase 1 */}
            <div className="cur-week active">
              <div className="cur-week-dot"></div>
              <div className="cur-week-label">PHASE 1 - Survey Master</div>
              <h3>Day 1-7 : 7개 핵심 템플릿 체화 + Survey 즉답 루틴 완성</h3>
              <p>템플릿을 외우는 것이 아니라 자동으로 튀어나오게 만드는 구간입니다. Survey 문제에서 첫 문장이 3초 안에 나오는 상태를 목표로 합니다.</p>
              <div className="cur-day-grid">
                <div className="cur-day">
                  <strong>Day 1</strong> OPIc 채점 기준(Fluency/Structure/Coherence) 분석 + Template #1~3 구조 입력. SpeakCoach AI 주거 카테고리 학습 + 묘사 표현 암기 시작.
                </div>
                <div className="cur-day">
                  <strong>Day 2</strong> Template #4~6 학습 + 질문 키워드 보고 자동 매칭 훈련. 1문제 1분 30초 녹음 + SpeakCoach AI 구조 체크. 취미/여가 Survey 집중 분석.
                </div>
                <div className="cur-day">
                  <strong>Day 3</strong> Template #1~7 전체 복습. 문장 단위가 아닌 답변 덩어리(문단)로 말하는 패턴 체득. 빈출 문제 즉답 연습(3초 이상 침묵 금지).
                </div>
                <div className="cur-day">
                  <strong>Day 4</strong> 전체 Survey 예상 질문 돌려보기 + 막히는 질문 체크. 개인 약점 영역 명확화. Conjunction/Transition 연결어 집중 암기.
                </div>
                <div className="cur-day">
                  <strong>Day 5</strong> 시제 중심 Grammar 영상 시청 + 댓글 영작 과제. 약점 질문 집중 재학습 + 암기 완료. Adverbs/비교 유형 표현 암기.
                </div>
                <div className="cur-day">
                  <strong>Day 6</strong> 7 Core Templates 완전 암기 최종 점검. 복합 템플릿 2개 이상 자연스럽게 조합 연습. 스터디원 상호 Q&amp;A 즉답 훈련. SpeakCoach AI 발음/흐름 진단.
                </div>
                <div className="cur-day">
                  <strong>Day 7</strong> 비공개 모의고사 영상 1차 풀이(녹음) + SpeakCoach AI 전체 분석. 구조/속도/발음 교정 시작. 유형별 표현 완벽 암기(2차 피드백 세션 테스트 대비).
                </div>
              </div>
            </div>
            {/* Phase 2 */}
            <div className="cur-week active">
              <div className="cur-week-dot"></div>
              <div className="cur-week-label">PHASE 2 - Role Play &amp; 돌발</div>
              <h3>Day 8-10 : RP 상황 처리 공식 + 돌발 질문 대응력 완성</h3>
              <p>Role Play와 돌발 질문을 무서운 파트에서 공식으로 해결하는 파트로 바꿉니다. RP가 나오면 이건 이 공식이구나 하고 자동 반응하는 상태를 목표로 합니다.</p>
              <div className="cur-day-grid">
                <div className="cur-day">
                  <strong>Day 8</strong> RP 핵심 13개 시나리오 완전 분석(전화 문의/예약 변경/불만 제기). Q11 질문 능력 + Q12 대안 제시 구조 파악. Reusable Sentences 암기 + 타이머 즉답 훈련.
                </div>
                <div className="cur-day">
                  <strong>Day 9</strong> 돌발 질문 대응 훈련. 답변 확장 전략(관계사/접속사/이유 추가). 짧은 답변을 부드럽게 확장하고 끊김 없이 연결하는 기술 체득. 필러(Filler) 표현 암기.
                </div>
                <div className="cur-day">
                  <strong>Day 10</strong> RP 추가 시나리오 3종(길 안내/문제 설명/문제 보고). RP Part 1+2 전체 복습. Fluency Challenge: 모든 RP 질문을 끊김 없이 + 자연스러운 감정 표현으로 답변.
                </div>
              </div>
            </div>
            {/* Phase 3 */}
            <div className="cur-week active">
              <div className="cur-week-dot"></div>
              <div className="cur-week-label">PHASE 3 - 실전 몰입</div>
              <h3>Day 11-14 : 비공개 모의고사 영상 풀이 + 시험 당일 컨디션 세팅</h3>
              <p>말을 더 잘하게 만드는 구간이 아닙니다. 시험장에서 흔들리지 않게 만드는 구간입니다. 퍼징 없는 말하기 유지력과 당황하지 않는 센스를 키웁니다.</p>
              <div className="cur-day-grid">
                <div className="cur-day">
                  <strong>Day 11</strong> 최종 템플릿 전체 복습 + 문단(Paragraph) 형태 답변 연습. Speaking Marathon: Survey + RP 랜덤 혼합, 20문제 이상 연속 답변으로 유지력 훈련.
                </div>
                <div className="cur-day">
                  <strong>Day 12</strong> Speed Drill: 질문 듣고 5초 내 답변 시작(침묵 시간 완전 제거). 팀원과 3분 자유 발화 녹음. SpeakCoach AI로 발음/유창성/문법 최종 점검.
                </div>
                <div className="cur-day">
                  <strong>Day 13</strong> 비공개 모의고사 영상 풀이(실제 시험과 동일 형식). 40분 실전 연습 + SpeakCoach AI 피드백 확인. 약점 유형 최종 보완.
                </div>
                <div className="cur-day">
                  <strong>Day 14</strong> 오전: 비공개 모의고사 영상 최종 풀이(실전 환경 시뮬레이션). 오후: 어려웠던 질문/표현 최종 복습 + 자신감 향상. 저녁: 가볍게 복습 후 충분한 수면과 휴식. 막판 무리한 암기 금지.
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <a
              href="https://stibee.com/api/v1.0/emails/share/Lr1WERPFWH_d-6HiiXB2MZ5_063PB1Y"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 36px',
                background: 'white',
                color: '#16a34a',
                border: '2px solid #16a34a',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = '#16a34a'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#16a34a'; }}
            >
              📋 상세 커리큘럼 보기
            </a>
          </div>
        </div>
      </section>

      {/* DAILY FLOW */}
      <section className="section" id="daily">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">하루 흐름</div>
            <p className="section-desc">매일 반복되는 루틴으로 OPIC 성적을 빠르게 올립니다.</p>
          </div>
          <div className="why-grid" style={{ marginTop: '56px' }}>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: '#E5E8EB' }}>1</div>
              <h3>학습 자료 공개</h3>
              <p>오전 8시에 그날의 토픽과 질문, 답변 프레임을 공개합니다. 구조를 파악하고 준비를 시작하세요.</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: '#E5E8EB' }}>2</div>
              <h3>답변 녹음 및 제출</h3>
              <p>당일 자정까지 SpeakCoach AI에서 답변을 녹음하고 제출합니다. 1~2분 길이의 자연스러운 답변을 목표로 합니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: '#E5E8EB' }}>3</div>
              <h3>AI 분석 리포트</h3>
              <p>SpeakCoach AI가 자동으로 발음, 문법, 유창성, 어휘를 분석해서 피드백을 제공합니다. 약점을 한눈에 파악하세요.</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: '#E5E8EB' }}>4</div>
              <h3>코치 피드백</h3>
              <p>담당 코치가 팀별로 모여 각자의 답변을 청취하고, 개선점과 칭찬을 카톡방에 공유합니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: '#E5E8EB' }}>5</div>
              <h3>재교정 연습</h3>
              <p>AI 분석과 코치 피드백을 바탕으로 즉시 재교정 연습을 합니다. 같은 질문을 2~3회 다시 녹음해보세요.</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: '#E5E8EB' }}>6</div>
              <h3>팀 공유 및 자극</h3>
              <p>팀원들의 답변과 피드백도 공유되니, 서로의 성장을 보며 자극받고 내일의 준비로 이어집니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="compare-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">왜 스터디가 가장 빠를까?</div>
            <p className="section-desc">같은 2주, 어떤 방법을 선택하느냐에 따라 결과가 달라집니다.</p>
          </div>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>독학</th>
                  <th>인강</th>
                  <th>학원</th>
                  <th className="highlight-col">식빵영어 스터디</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>학습 구조</td>
                  <td>스스로 계획</td>
                  <td>영상 시청 위주</td>
                  <td>강사 커리큘럼</td>
                  <td className="highlight-col">14일 프레임워크 시스템</td>
                </tr>
                <tr>
                  <td>스피킹 연습</td>
                  <td className="compare-x">✕</td>
                  <td className="compare-x">✕</td>
                  <td>수업 시간만</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 매일 녹음 + AI 분석</td>
                </tr>
                <tr>
                  <td>코치 피드백</td>
                  <td className="compare-x">✕</td>
                  <td className="compare-x">✕</td>
                  <td>제한적</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 매일 녹음 교정 + 1:3 피드백</td>
                </tr>
                <tr>
                  <td>AI 발음/문법 분석</td>
                  <td className="compare-x">✕</td>
                  <td className="compare-x">✕</td>
                  <td className="compare-x">✕</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> SpeakCoach AI 제공</td>
                </tr>
                <tr>
                  <td>동기부여</td>
                  <td>혼자 → 흐지부지</td>
                  <td>혼자 → 완강률 낮음</td>
                  <td>출석만 하면 됨</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 3인 팀 + 매일 과제</td>
                </tr>
                <tr>
                  <td>모의고사</td>
                  <td className="compare-x">✕</td>
                  <td>별도 구매</td>
                  <td>포함</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 비공개 모의고사 영상 7개</td>
                </tr>
                <tr>
                  <td>비용</td>
                  <td>교재비만</td>
                  <td>10~30만원</td>
                  <td>40~80만원</td>
                  <td className="highlight-col"><span style={{textDecoration:'line-through',color:'#999',fontSize:'13px'}}>259,900원</span> → <strong>179,900원</strong> (올인원)</td>
                </tr>
                <tr>
                  <td>평균 소요 기간</td>
                  <td>2~3개월</td>
                  <td>1~2개월</td>
                  <td>1개월</td>
                  <td className="highlight-col"><strong>2주</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section section-gray" id="pricing">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">가격</div>
            <p className="section-desc">SpeakCoach AI Pro 2주 무료 포함</p>
          </div>
          <div className="pricing-section">
            <div className="pricing-badge">31% 할인 중</div>
            <div className="pricing-header">
              <h3>2주 집중 스터디</h3>
              <div className="pricing-duration">14일 커리큘럼 · 교재비 포함</div>
            </div>
            <div className="pricing-original">₩259,900</div>
            <div className="pricing-price-main" style={{marginTop:'8px'}}>₩179,900</div>
            <div className="pricing-desc">
              교재비 포함 · SpeakCoach AI · 1:3 피드백 총 180분 · 매일 녹음과제 피드백 · 비공개 모의고사 영상 포함
            </div>
            <div className="pricing-features">
              <div className="pricing-feature">14일 체계적 커리큘럼 (교재 포함)</div>
              <div className="pricing-feature">1:3 소그룹 피드백 2주간 총 180분 진행</div>
              <div className="pricing-feature">매일(월-금) 녹음과제 → 코치가 AL 스크립트·문법·발음 직접 교정</div>
              <div className="pricing-feature">SpeakCoach AI Pro 2주 무료 제공</div>
              <div className="pricing-feature">7개 핵심 템플릿 + 즉답 루틴 훈련</div>
              <div className="pricing-feature">비공개 모의고사 영상 7개 제공 (2주차 실전 대비)</div>
              <div className="pricing-feature">스터디 전용 노션 자료 + YouTube 강의</div>
              <div className="pricing-feature">졸업 후 코칭 채팅 3개월 지원</div>
            </div>
            <button onClick={() => setShowFormModal(true)} className="pricing-btn">
              지금 신청하기 →
            </button>
            <div className="pricing-earlybird">
              <strong>얼리버드 특가 ₩149,900</strong>은 기간 한정 할인가입니다.<br/>
              259,900원에서 할인가 ₩179,900으로 제공 중입니다.
            </div>
            <div className="pricing-addon">
              <h4>Premium 업그레이드</h4>
              <p>
                +<span className="addon-price">₩10,000</span>만 추가하면 2주 내내 SpeakCoach AI{' '}
                <strong>Premium</strong>을 이용할 수 있어요.
              </p>
            </div>
            <div className="pricing-addon green">
              <h4>수료 후 특별 혜택</h4>
              <p>
                수료 후 SpeakCoach AI Premium 1개월을{' '}
                <span className="addon-price">50% 할인</span>된 가격에 이어서 이용할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="section" id="rules">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">스터디 운영 방식</div>
            <p className="section-desc">모두의 결과를 위한 약속입니다.</p>
          </div>
          <div className="rules-grid">
            <div className="rule-card">
              <div className="rule-num">01</div>
              <div>
                <h4>매일 과제 제출</h4>
                <p>당일 미션은 당일 자정까지 제출. 꾸준함이 실력을 만듭니다.</p>
              </div>
            </div>
            <div className="rule-card">
              <div className="rule-num">02</div>
              <div>
                <h4>3인 팀 구성</h4>
                <p>시작 후 팀 변경은 불가합니다. 서로의 성장을 응원해주세요.</p>
              </div>
            </div>
            <div className="rule-card">
              <div className="rule-num">03</div>
              <div>
                <h4>카카오톡 소통</h4>
                <p>팀 단체방에서 과제 제출, 피드백 공유, 질문이 진행됩니다.</p>
              </div>
            </div>
            <div className="rule-card" style={{ flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div className="rule-num">04</div>
                <h4 style={{ margin: 0 }}>환불 규정</h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', lineHeight: '1.7', color: '#444' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span><strong>스터디 시작 전 (단톡방 초대 전)</strong> — 전액 환불 가능. 별도 수수료 없이 100% 환불됩니다.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>✕</span>
                  <span><strong>스터디 시작 후 (단톡방 초대 후)</strong> — 환불 불가. 소규모 정원제로 운영되며, 팀 편성과 동시에 맞춤 커리큘럼 및 운영 리소스가 배정되기 때문입니다.</span>
                </div>
                <div style={{ marginTop: '4px', padding: '12px 16px', background: '#f8f9fa', borderRadius: '8px', fontSize: '13px', color: '#666' }}>
                  💡 결제 시 본 환불 정책에 동의한 것으로 간주됩니다. 환불 관련 문의는 카카오톡 채널로 연락주세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-gray" id="reviews">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">2주 후, 이런 결과가 나왔습니다</div>
            <p className="section-desc">IM2→IH, IM3→AL. 실제 수료생들의 등급 변화.</p>
          </div>
          <div className="review-scroll-wrap">
            <div className="review-scroll" ref={reviewScrollRef}>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-text">
                  2주 만에 IM3에서 IH로 올랐어요. 프레임워크가 진짜 효과 있었습니다. 답변할 때 구조가
                  잡히니까 자신감이 다릅니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">👋</div>
                  <div>
                    <div className="review-name">
                      김*현 <span className="review-grade">IH</span>
                    </div>
                    <div className="review-info">대학생 · 2주 스터디</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-text">
                  SpeakCoach AI로 매일 연습하고, 스터디에서 피드백 받으니까 내 약점이 정확히 보였어요.
                  결국 AL 받았습니다!
                </div>
                <div className="review-author">
                  <div className="review-avatar">💪</div>
                  <div>
                    <div className="review-name">
                      이*준 <span className="review-grade">AL</span>
                    </div>
                    <div className="review-info">취준생 · 스터디 + AI</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-text">
                  직장 다니면서 준비하기 힘들었는데 2주라서 집중할 수 있었어요. 매일 과제 내는 게 핵심인
                  것 같아요.
                </div>
                <div className="review-author">
                  <div className="review-avatar">💻</div>
                  <div>
                    <div className="review-name">
                      박*영 <span className="review-grade">IH</span>
                    </div>
                    <div className="review-info">직장인 · 승진 준비</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-text">
                  혼자 했으면 절대 못 했을 거예요. 3명이니까 서로 자극도 되고 포기할 수가 없었어요. IL에서
                  IM2 찍었습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">☀️</div>
                  <div>
                    <div className="review-name">
                      정*아 <span className="review-grade">IM2</span>
                    </div>
                    <div className="review-info">대학생 · 2주 스터디</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-text">
                  인강으로 기본기 잡고 스터디에서 실전 연습하니까 시너지가 대단했어요. IH 목표였는데 AL이
                  나왔습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">🚀</div>
                  <div>
                    <div className="review-name">
                      이*민 <span className="review-grade">AL</span>
                    </div>
                    <div className="review-info">직장인 · 실전 준비</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-text">
                  AI 피드백이 이렇게 정확할 줄 몰랐어요. 매일 내 발음과 문법 실수를 바로 지적해주니까
                  빠르게 개선됐습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">✨</div>
                  <div>
                    <div className="review-name">
                      최*리 <span className="review-grade">IM2</span>
                    </div>
                    <div className="review-info">대학원생 · 유학 준비</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-stars">★★★★★</div>
                <div className="review-text">
                  온라인이라고 걱정했는데 카톡 채팅과 공유로 충분했어요. 팀원들이 열심히 하니까 저도
                  자연스럽게 열심히 하게 됐습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">📱</div>
                  <div>
                    <div className="review-name">
                      한*수 <span className="review-grade">IH</span>
                    </div>
                    <div className="review-info">직장인 · 온라인 진행</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Reviews Carousel */}
          <div className="photo-review-section">
            <div className="photo-review-label">실제 수강생 인증 후기</div>
            <div className="photo-carousel-wrap">
              <div className="photo-carousel-track">
                {[...Array(2)].map((_, setIndex) =>
                  [1,2,3,4,5,6,7,8,9,10,11,12,13].map((n) => (
                    <div className="photo-review-item" key={`png-${setIndex}-${n}`}>
                      <img src={`/reviews/review-${n}.png`} alt={`수강생 후기 ${n}`} loading="lazy" />
                    </div>
                  )).concat(
                    [14,15,16,17,18,19,20,21,22,23,24,25,26].map((n) => (
                      <div className="photo-review-item" key={`jpg-${setIndex}-${n}`}>
                        <img src={`/reviews/review-${n}.jpeg`} alt={`수강생 후기 ${n}`} loading="lazy" />
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">자주 묻는 질문</div>
            <p className="section-desc">더 궁금한 점은 문의하기를 통해 연락주세요.</p>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{item.question}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer" style={{ maxHeight: openFaqIndex === index ? '500px' : '0' }}>
                  <div className="faq-answer-content">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <h2>다음 기수 대기 접수 중</h2>
          <p style={{fontSize:'18px',marginBottom:'8px'}}>다음 기수: <strong>4월 15일 ~ 4월 29일</strong></p>
          <p>현재 기수(4/1)가 마감되었습니다. 다음 기수에 참여를 원하시면 대기 접수해주세요.</p>
          <button onClick={() => setShowFormModal(true)} className="btn-white">
            대기 접수하기 →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-links">
              <Link href="/">메인 홈</Link>
              <a href="https://instagram.com/sikbang.eng" target="_blank" rel="noopener noreferrer">
                인스타그램
              </a>
              <a href="https://blog.naver.com/lulu05" target="_blank" rel="noopener noreferrer">
                블로그
              </a>
              <a href="mailto:lulu066666@gmail.com">문의하기</a>
            </div>
            <div className="footer-copy">&copy; 2025 식빵영어. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* FLOATING CTA */}
      <div className={`floating-cta ${showFloatingCta ? 'show' : ''}`} id="floatingCta">
        <div className="floating-inner">
          <div className="floating-info">
            <div className="floating-queue">
              <span className="fq-dot"></span>
              {floatingRemainingSlots}자리 남음
            </div>
            <div className="floating-price">
              <span style={{textDecoration:'line-through',color:'#999',fontSize:'13px',marginRight:'6px'}}>₩259,900</span>
              <strong>₩179,900</strong>
            </div>
          </div>
          <button
            onClick={() => setShowFormModal(true)}
            className="floating-btn"
          >
            지금 신청하기 →
          </button>
        </div>
      </div>

      {/* TOAST NOTIFICATIONS */}
      <div className="toast-area">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast">
            <div className="toast-icon" style={{background:'rgba(255,255,255,0.3)',fontSize:'10px'}}>·</div>
            <div>
              <strong>{toast.name}</strong>
              {toast.action}
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                {toast.location} · {toast.mins}분 전
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GOOGLE FORM MODAL */}
      {showFormModal && (
        <div className="form-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="form-modal-close" onClick={() => setShowFormModal(false)}>✕</button>
            <div className="form-modal-body">
              <div className="form-modal-icon"></div>
              <h3>스터디 신청서 작성</h3>
              <p>구글 폼에서 신청서를 작성해주세요.<br/>선착순 마감이니 서둘러주세요!</p>
              <div className="form-modal-info">
                <div>수강료: <span style={{textDecoration:'line-through',color:'#999',fontSize:'14px',marginRight:'4px'}}>₩259,900</span> → <strong>₩179,900</strong> <span style={{color:'#dc2626',fontSize:'13px',fontWeight:700}}>31% 할인</span></div>
                <div>남은 자리: <strong style={{color:'#FF3B5C'}}>{floatingRemainingSlots}명</strong></div>
              </div>
              <a href="https://forms.gle/dvCkYs8jSZZVyyFo7" target="_blank" rel="noopener noreferrer" className="form-modal-btn" onClick={() => setShowFormModal(false)}>
                신청서 작성하기 →
              </a>
              <p className="form-modal-note">* 신청서 작성 후 0~2일 이내 확인 연락드립니다.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
