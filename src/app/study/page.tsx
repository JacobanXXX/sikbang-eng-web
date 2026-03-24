'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function StudyPage() {
  // Queue counter state
  const [currentQueue, setCurrentQueue] = useState(47);
  const queueRef = useRef<HTMLDivElement>(null);
  const ctaQueueRef = useRef<HTMLSpanElement>(null);
  const floatingQueueRef = useRef<HTMLSpanElement>(null);

  // Toast state
  const [toasts, setToasts] = useState<Array<{ id: number; name: string; action: string; loc: string; mins: number }>>([]);
  const toastIdRef = useRef(0);

  // Floating CTA visibility
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const heroQueueRef = useRef<HTMLDivElement>(null);

  // Reviews auto-scroll state
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [reviewsPaused, setReviewsPaused] = useState(false);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faqAnswerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ===== QUEUE COUNTER LOGIC =====
  useEffect(() => {
    const BASE_QUEUE = 47;
    let queue = BASE_QUEUE + Math.floor(Math.random() * 8);
    setCurrentQueue(queue);

    const queueInterval = setInterval(() => {
      setCurrentQueue((prev) => {
        const change = Math.random();
        let newQueue = prev;
        if (change < 0.6) {
          newQueue += Math.random() < 0.7 ? 1 : 2;
        } else if (change < 0.85) {
          newQueue = prev;
        } else {
          newQueue = Math.max(BASE_QUEUE - 3, prev - 1);
        }
        return newQueue;
      });
    }, 25000 + Math.random() * 20000);

    return () => clearInterval(queueInterval);
  }, []);

  // ===== TOAST NOTIFICATIONS LOGIC =====
  useEffect(() => {
    const names = [
      '김*준', '이*아', '박*현', '최*영', '정*미',
      '한*수', '오*진', '서*연', '강*호', '윤*은',
      '임*석', '신*희', '조*민', '장*우', '배*정'
    ];
    const actions = [
      '님이 대기 신청했습니다',
      '님이 얼리버드로 등록했습니다',
      '님이 대기 명단에 합류했습니다'
    ];
    const locations = ['서울', '부산', '대구', '인천', '대전', '광주', '수원', '울산'];

    const showToast = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const loc = locations[Math.floor(Math.random() * locations.length)];
      const mins = Math.floor(Math.random() * 10) + 1;
      const id = ++toastIdRef.current;

      setToasts((prev) => [...prev, { id, name, action, loc, mins }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4200);
    };

    const toastTimeout = setTimeout(() => {
      showToast();
      const toastInterval = setInterval(showToast, 15000 + Math.random() * 20000);
      return () => clearInterval(toastInterval);
    }, 8000);

    return () => clearTimeout(toastTimeout);
  }, []);

  // ===== FLOATING CTA VISIBILITY =====
  useEffect(() => {
    const handleScroll = () => {
      if (heroQueueRef.current) {
        const rect = heroQueueRef.current.getBoundingClientRect();
        setShowFloatingCta(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ===== AUTO-SCROLL REVIEWS =====
  useEffect(() => {
    if (!reviewScrollRef.current) return;

    let dir = 1;
    const interval = setInterval(() => {
      if (!reviewsPaused && reviewScrollRef.current) {
        const scroll = reviewScrollRef.current;
        const max = scroll.scrollWidth - scroll.clientWidth;
        if (max <= 0) return;
        if (scroll.scrollLeft >= max - 2) dir = -1;
        if (scroll.scrollLeft <= 2) dir = 1;
        scroll.scrollLeft += dir;
      }
    }, 30);

    return () => clearInterval(interval);
  }, [reviewsPaused]);

  // ===== FAQ TOGGLE =====
  const toggleFaq = (index: number) => {
    if (openFaqIndex === index) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(index);
    }
  };

  useEffect(() => {
    faqAnswerRefs.current.forEach((ref, index) => {
      if (ref) {
        if (index === openFaqIndex) {
          ref.style.maxHeight = ref.scrollHeight + 'px';
        } else {
          ref.style.maxHeight = '0px';
        }
      }
    });
  }, [openFaqIndex]);

  // ===== SMOOTH SCROLL =====
  useEffect(() => {
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href || href === '#' || !href.startsWith('#')) return;

      const id = href.slice(1);
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        const nav = document.getElementById('nav');
        const navHeight = nav?.offsetHeight || 64;
        const top = element.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  const faqItems = [
    {
      question: '영어를 진짜 못하는데 따라갈 수 있을까요?',
      answer:
        '네, 가능합니다. 스터디는 프레임워크 기반으로 진행되기 때문에 영어를 잘 못하더라도 구조를 따라가며 답변을 만들 수 있어요. 실제로 IL 수준에서 시작해서 IM2, IH를 달성한 사례가 많습니다.'
    },
    {
      question: 'SpeakCoach AI는 어떻게 사용하나요?',
      answer:
        '스터디 시작 시 SpeakCoach AI Pro 계정이 자동으로 활성화됩니다. 웹 앱(PWA)이라 별도 설치 없이 브라우저에서 바로 사용 가능합니다. 답변을 녹음하면 AI가 발음, 문법, 유창성, 어휘를 분석해서 피드백을 줍니다.'
    },
    {
      question: '스터디는 언제 시작하나요?',
      answer:
        '3인 1팀이 구성되는 즉시 시작합니다. 대기 신청 후 팀이 매칭되면 시작일을 안내해드립니다. 보통 신청 후 1주 이내 시작됩니다.'
    },
    {
      question: '하루에 얼마나 시간을 투자해야 하나요?',
      answer:
        '하루 평균 1~2시간 정도입니다. 학습 자료 확인(10분) + 답변 준비 및 녹음(30~40분) + AI 분석 확인 및 '
    },
    {
      question: '환불은 어떻게 되나요?',
      answer:
        '스터디 시작 전 100% 환불, 시작 후 3일 이내 50% 환불이 가능합니다. 3일 이후에는 환불이 불가합니다. 대기 중 취소는 언제든 가능합니다.'
    },
    {
      question: 'Premium 업그레이드는 꼭 해야 하나요?',
      answer:
        '필수는 아닙니다. 기본 스터디에 Pro 플랜이 포함되어 있어서 충분히 학습 가능합니다. Premium은 끝 모의고사 세트와 고급 분석 기능이 추가되므로, AL을 목표로 하시는 분께 추천드립니다.'
    }
  ];

  const reviews = [
    {
      text: '2주 만에 IM3에서 IH로 올라왔어요. 프레임워크가 진짜 효과 있었습니다. 답변할 때 구조가 잡히니까 자신감이 다릅니다.',
      avatar: '👋',
      name: '김*현',
      grade: 'IH',
      info: '대학생 · 2주 스터디'
    },
    {
      text: 'SpeakCoach AI로 매일 연습하고, 스터디에서 피드백 받으니까 내 약점이 정확히 보였어요. 결국 AL 받았습니다!',
      avatar: '💪',
      name: '이*준',
      grade: 'AL',
      info: '취준생 · 스터디 + AI'
    },
    {
      text: '직장 다니면서 준비하기 힘들었는데 2주라서 집중할 수 있었어요. 매일 과제 내는 게 핵심인 것 같아요.',
      avatar: '💻',
      name: '박*영',
      grade: 'IH',
      info: '직장인 · 승진 준비'
    },
    {
      text: '혼자 했으면 절대 못 했을 거예요. 3명이니까 서로 자극도 되고 포기할 수가 없었어요. IL에서 IM2 올랐습니다.',
      avatar: '🌅',
      name: '정*아',
      grade: 'IM2',
      info: '대학생 · 2주 스터디'
    },
    {
      text: '인강으로 기본기 잡고 스터디에서 실전 연습하니까 시너지가 대단했어요. IH 목표였는데 AL이 나왔습니다.',
      avatar: '🚀',
      name: '최*민',
      grade: 'AL',
      info: '이직 준비 · 인강 + 스터디'
    },
    {
      text: '피드백이 정말 꼼꼼해요. AI 분석이랑 코치 피드백 둘 다 받으니까 어디를 고쳐야 하는지 확실히 알겠더라고요.',
      avatar: '💡',
      name: '한*수',
      grade: 'IH',
      info: '취준생 · 공채 준비'
    }
  ];

  return (
  d50정 연습(30분) + 코치 피드백 반영(20분). 직장인도 충분히 병행 가능한 수준입니다.'
    },
    {
      question: '환불은 어떻게 되나요?',
      answer:
        '스터디 시작 전 100% 환불, 시작 후 3일 이내 50% 환불이 가능합니다. 3일 이후에는 환불이 불가합니다. 대기 중 취소는 언제든 가능합니다.'
    },
    {
      question: 'Premium 업그레이드는 꼭 해야 하나요?',
      answer:
        '필수는 아닙니다. 기본 스터디에 Pro 플랜이 포함되어 있어서 충분히 학습 가능합니다. Premium은 끝 모의고사 세트와 고급 분석 기능이 추가되므로, AL을 목표로 하시는 분께 추천드립니다.'
    }
  ];

  const reviews = [
    {
      text: '2주 만에 IM3에서 IH로 올라왔어요. 프레임워크가 진짜 효과 있었습니다. 답변할 때 구조가 잡히니까 자신감이 다릅니다.',
      avatar: '👋',
      name: '김*현',
      grade: 'IH',
      info: '대학생 · 2주 스터디'
    },
    {
      text: 'SpeakCoach AI로 매일 연습하고, 스터디에서 피드백 받으니까 내 약점이 정확히 보였어요. 결국 AL 받았습니다!',
      avatar: '💪',
      name: '이*준',
      grade: 'AL',
      info: '취준생 · 스터디 + AI'
    },
    {
      text: '직장 다니면서 준비하기 힘들었는데 2주라서 집중할 수 있었어요. 매일 과제 내는 게 핵심인 것 같아요.',
      avatar: '💻',
      name: '박*영',
      grade: 'IH',
      info: '직장인 · 승진 준비'
    },
    {
      text: '혼자 했으면 절대 못 했을 거예요. 3명이니까 서로 자극도 되고 포기할 수가 없었어요. IL에서 IM2 올랐습니다.',
      avatar: '🌅',
      name: '정*아',
      grade: 'IM2',
      info: '대학생 · 2주 스터디'
    },
    {
      text: '인강으로 기본기 잡고 스터디에서 실전 연습하니까 시너지가 대단했어요. IH 목표였는데 AL이 나왔습니다.',
      avatar: '🚀',
      name: '최*민',
      grade: 'AL',
      info: '이직 준비 · 인강 + 스터디'
    },
    {
      text: '피드백이 정말 꼼꼼해요. AI 분석이랑 코치 피드백 둘 다 받으니까 어디를 고쳐야 하는지 확실히 알겠더라고요.',
      avatar: '💡',
      name: '한*수',
      grade: 'IH',
      info: '취준생 · 공채 준비'
    }
  ];

  return (
    <>
      <style>{`
        /* === RESET & BASE === */
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          background: #FFFFFF;
          color: #191F28;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        a { text-decoration: none; color: inherit; }
        button { cursor: pointer; border: none; font-family: inherit; }

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

        .container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }

        /* === NAV === */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
        }
        .nav-inner {
          max-width: 1140px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .nav-logo {
          font-size: 20px; font-weight: 800; color: var(--text-primary);
          display: flex; align-items: center; gap: 8px;
        }
        .nav-logo .bread-icon { font-size: 24px; }
        .nav-links { display: flex; gap: 24px; align-items: center; }
        .nav-links a {
          font-size: 15px; font-weight: 500; color: var(--text-secondary);
          transition: color 0.2s;
        }
        .nav-links a:hover { color: var(--blue-primary); }
        .nav-cta {
          background: var(--blue-primary); color: white;
          padding: 10px 20px; border-radius: 12px;
          font-size: 14px; font-weight: 600;
          transition: background 0.2s;
          display: inline-block;
        }
        .nav-cta:hover { background: var(--blue-dark); }

        /* === HERO === */
        .hero {
          padding: 140px 0 80px;
          background: linear-gradient(180deg, #F0FFF4 0%, #FFFFFF 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-content { text-align: center; position: relative; z-index: 1; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; border: 1px solid var(--border);
          padding: 8px 20px; border-radius: 100px;
          font-size: 14px; font-weight: 600; color: var(--green);
          margin-bottom: 28px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .hero-badge .dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--green);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
        .hero h1 {
          font-size: 52px; font-weight: 800; line-height: 1.2;
          letter-spacing: -0.03em; color: var(--text-primary);
          margin-bottom: 20px;
        }
        .hero h1 .accent { color: var(--green); }
        .hero .subtitle {
          font-size: 20px; color: var(--text-secondary);
          line-height: 1.6; margin-bottom: 40px;
          font-weight: 400;
        }
        .hero .subtitle strong { font-weight: 700; color: var(--text-primary); }

        /* === QUEUE COUNTER (FOMO) === */
        .queue-box {
          display: inline-flex; flex-direction: column; align-items: center;
          background: white;
          border: 2px solid var(--green);
          border-radius: 24px;
          padding: 32px 48px;
          box-shadow: 0 4px 24px rgba(26,141,72,0.12);
          margin-bottom: 36px;
        }
        .queue-label {
          font-size: 14px; font-weight: 600; color: var(--text-secondary);
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .queue-number {
          font-size: 64px; font-weight: 900; color: var(--green);
          line-height: 1;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .queue-unit {
          font-size: 20px; font-weight: 700; color: var(--green);
          margin-top: 4px;
        }
        .queue-sub {
          font-size: 13px; color: var(--text-tertiary);
          margin-top: 12px;
          display: flex; align-items: center; gap: 6px;
        }
        .queue-sub .live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--red);
          animation: pulse 1.5s infinite;
        }

        /* live notification toast */
        .toast-area {
          position: fixed; bottom: 24px; left: 24px; z-index: 200;
          display: flex; flex-direction: column; gap: 8px;
        }
        .toast {
          background: rgba(25,31,40,0.92);
          backdrop-filter: blur(12px);
          color: white;
          padding: 14px 20px;
          border-radius: 16px;
          font-size: 14px; font-weight: 500;
          display: flex; align-items: center; gap: 10px;
          animation: toastIn 0.4s ease, toastOut 0.4s ease 3.6s forwards;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          max-width: 340px;
        }
        .toast .toast-icon {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--green); display: flex; align-items: center;
          justify-content: center; font-size: 16px; flex-shrink: 0;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }

        .hero-cta-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          background: var(--green); color: white;
          padding: 18px 40px; border-radius: 16px;
          font-size: 18px; font-weight: 700;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 16px rgba(26,141,72,0.3);
          text-decoration: none;
        }
        .btn-primary:hover { background: #15753c; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(26,141,72,0.4); }
        .btn-secondary {
          background: white; color: var(--text-primary);
          padding: 18px 40px; border-radius: 16px;
          font-size: 18px; font-weight: 700;
          border: 1.5px solid var(--border);
          transition: all 0.2s;
          text-decoration: none;
        }
        .btn-secondary:hover { border-color: var(--blue-primary); color: var(--blue-primary); }

        /* === SECTION COMMON === */
        .section { padding: 100px 0; }
        .section-gray { background: var(--bg-gray); }
        .section-title {
          font-size: 36px; font-weight: 800; letter-spacing: -0.03em;
          color: var(--text-primary); margin-bottom: 16px;
        }
        .section-desc {
          font-size: 18px; color: var(--text-secondary); margin-bottom: 48px;
          line-height: 1.6;
        }

        /* === WHY THIS STUDY === */
        .why-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
          margin-top: 48px;
        }
        .why-card {
          background: white; border-radius: 20px; padding: 36px 28px;
          box-shadow: var(--card-shadow); transition: transform 0.2s;
        }
        .why-card:hover { transform: translateY(-4px); }
        .why-icon {
          width: 56px; height: 56px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin-bottom: 20px;
        }
        .why-icon.green { background: var(--green-light); }
        .why-icon.blue { background: var(--blue-light); }
        .why-icon.orange { background: #FFF7ED; }
        .why-card h3 {
          font-size: 20px; font-weight: 700; margin-bottom: 10px;
          letter-spacing: -0.02em;
        }
        .why-card p {
          font-size: 15px; color: var(--text-secondary); line-height: 1.6;
        }

        /* === CURRICULUM === */
        .curriculum-timeline { max-width: 720px; margin: 0 auto; }
        .cur-week {
          margin-bottom: 40px; position: relative;
          padding-left: 36px;
        }
        .cur-week::before {
          content: ''; position: absolute; left: 12px; top: 36px; bottom: -40px;
          width: 2px; background: var(--border);
        }
        .cur-week:last-child::before { display: none; }
        .cur-week-dot {
          position: absolute; left: 4px; top: 8px;
          width: 18px; height: 18px; border-radius: 50%;
          border: 3px solid var(--green); background: white;
        }
        .cur-week.active .cur-week-dot { background: var(--green); }
        .cur-week-label {
          font-size: 13px; font-weight: 700; color: var(--green);
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .cur-week h3 {
          font-size: 22px; font-weight: 700; margin-bottom: 12px;
          letter-spacing: -0.02em;
        }
        .cur-week p {
          font-size: 15px; color: var(--text-secondary); line-height: 1.7;
        }
        .cur-day-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 10px; margin-top: 16px;
        }
        .cur-day {
          background: var(--bg-gray); border-radius: 12px; padding: 14px 16px;
          font-size: 14px; font-weight: 500; color: var(--text-secondary);
        }
        .cur-day strong { color: var(--text-primary); font-weight: 700; }

        /* === DAILY FLOW === */
        .flow-steps {
          display: flex; align-items: stretch; gap: 0;
          justify-content: center; flex-wrap: wrap;
          margin-top: 48px;
        }
        .flow-step {
          text-align: center; flex: 1; min-width: 160px; max-width: 220px;
          position: relative; padding: 0 16px;
        }
        .flow-step:not(:last-child)::after {
          content: ''; position: absolute; top: 30px; right: -8px;
          width: 16px; height: 16px;
          border-right: 2.5px solid var(--green);
          border-top: 2.5px solid var(--green);
          transform: rotate(45deg);
        }
        .flow-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: var(--green-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; margin: 0 auto 16px;
        }
        .flow-step h4 {
          font-size: 16px; font-weight: 700; margin-bottom: 6px;
        }
        .flow-step p {
          font-size: 13px; color: var(--text-secondary); line-height: 1.5;
        }

        /* === PRICING === */
        .pricing-area { max-width: 540px; margin: 0 auto; }
        .pricing-card {
          background: white; border-radius: 24px; padding: 48px 40px;
          box-shadow: var(--card-shadow); text-align: center;
          border: 2px solid var(--green);
          position: relative; overflow: hidden;
        }
        .pricing-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 4px; background: linear-gradient(90deg, var(--green), #34D399);
        }
        .pricing-popular {
          position: absolute; top: 16px; right: -32px;
          background: var(--green); color: white;
          font-size: 12px; font-weight: 700; padding: 6px 40px;
          transform: rotate(45deg);
        }
        .pricing-name {
          font-size: 14px; font-weight: 700; color: var(--green);
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .pricing-title {
          font-size: 24px; font-weight: 800; margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .pricing-original {
          font-size: 18px; color: var(--text-tertiary);
          text-decoration: line-through; margin-bottom: 4px;
        }
        .pricing-amount {
          font-size: 48px; font-weight: 900; color: var(--text-primary);
          letter-spacing: -0.03em; margin-bottom: 4px;
        }
        .pricing-amount .won { font-size: 24px; font-weight: 700; }
        .pricing-period {
          font-size: 14px; color: var(--text-tertiary); margin-bottom: 32px;
        }
        .pricing-features {
          text-align: left; margin-bottom: 36px;
          list-style: none;
        }
        .pricing-features li {
          padding: 10px 0;
          font-size: 15px; color: var(--text-secondary);
          display: flex; align-items: flex-start; gap: 12px;
          border-bottom: 1px solid var(--bg-gray);
        }
        .pricing-features li:last-child { border-bottom: none; }
        .pricing-features .check {
          color: var(--green); font-size: 18px; flex-shrink: 0; margin-top: 1px;
        }
        .pricing-btn {
          display: block; width: 100%;
          background: var(--green); color: white;
          padding: 18px; border-radius: 16px;
          font-size: 18px; font-weight: 700;
          transition: all 0.2s; text-align: center;
          box-shadow: 0 4px 16px rgba(26,141,72,0.3);
          text-decoration: none;
          cursor: pointer;
        }
        .pricing-btn:hover { background: #15753c; transform: translateY(-2px); }

        .pricing-addon {
          background: var(--blue-light); border-radius: 16px;
          padding: 24px 28px; margin-top: 20px; text-align: center;
        }
        .pricing-addon h4 {
          font-size: 16px; font-weight: 700; color: var(--blue-primary); margin-bottom: 6px;
        }
        .pricing-addon p { font-size: 14px; color: var(--text-secondary); }
        .pricing-addon .addon-price { font-weight: 800; color: var(--text-primary); font-size: 18px; }

        /* === RULES === */
        .rules-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;
          max-width: 800px; margin: 0 auto;
        }
        .rule-card {
          background: white; border-radius: 16px; padding: 24px;
          display: flex; gap: 16px; align-items: flex-start;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .rule-num {
          width: 36px; height: 36px; border-radius: 10px;
          background: var(--bg-gray); display: flex; align-items: center;
          justify-content: center; font-size: 16px; font-weight: 800;
          color: var(--text-primary); flex-shrink: 0;
        }
        .rule-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
        .rule-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }

        /* === REVIEWS === */
        .review-scroll-wrap { overflow: hidden; margin: 0 -24px; padding: 0 24px; }
        .review-scroll {
          display: flex; gap: 20px; overflow-x: auto; padding: 8px 0 24px;
          scroll-behavior: smooth; -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
        }
        .review-scroll::-webkit-scrollbar { display: none; }
        .review-card {
          flex-shrink: 0; width: 320px;
          background: white; border-radius: 20px; padding: 28px;
          box-shadow: var(--card-shadow);
        }
        .review-stars { color: #FFC107; font-size: 16px; margin-bottom: 12px; letter-spacing: 2px; }
        .review-text {
          font-size: 15px; color: var(--text-secondary); line-height: 1.7;
          margin-bottom: 16px; min-height: 72px;
        }
        .review-author { display: flex; align-items: center; gap: 12px; }
        .review-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--green-light); display: flex; align-items: center;
          justify-content: center; font-size: 18px;
        }
        .review-name { font-size: 14px; font-weight: 700; }
        .review-info { font-size: 12px; color: var(--text-tertiary); }
        .review-grade {
          display: inline-block; background: var(--green-light);
          color: var(--green); font-size: 11px; font-weight: 700;
          padding: 2px 8px; border-radius: 6px; margin-left: 8px;
        }

        /* === FAQ === */
        .faq-list { max-width: 720px; margin: 0 auto; }
        .faq-item {
          border-bottom: 1px solid var(--border);
        }
        .faq-question {
          width: 100%; padding: 24px 0; background: none;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 16px; font-weight: 600; color: var(--text-primary);
          text-align: left;
          cursor: pointer;
        }
        .faq-question .arrow {
          transition: transform 0.3s; font-size: 20px; color: var(--text-tertiary);
        }
        .faq-question.open .arrow { transform: rotate(180deg); }
        .faq-answer {
          max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
        }
        .faq-answer-inner {
          padding: 0 0 24px;
          font-size: 15px; color: var(--text-secondary); line-height: 1.7;
        }

        /* === CTA BANNER === */
        .cta-banner {
          background: linear-gradient(135deg, var(--green) 0%, #34D399 100%);
          padding: 80px 0; text-align: center;
        }
        .cta-banner h2 {
          font-size: 36px; font-weight: 800; color: white;
          margin-bottom: 16px; letter-spacing: -0.03em;
        }
        .cta-banner p {
          font-size: 18px; color: rgba(255,255,255,0.85); margin-bottom: 36px;
        }
        .cta-banner .btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: white; color: var(--green);
          padding: 18px 40px; border-radius: 16px;
          font-size: 18px; font-weight: 700;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          text-decoration: none;
        }
        .cta-banner .btn-white:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.15); }

        /* === FOOTER === */
        .footer {
          background: var(--text-primary); color: rgba(255,255,255,0.6);
          padding: 48px 0;
        }
        .footer-inner {
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 16px;
        }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 14px; transition: color 0.2s; text-decoration: none; }
        .footer-links a:hover { color: white; }
        .footer-copy { font-size: 13px; }

        /* === FLOATING CTA === */
        .floating-cta {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 150;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border);
          padding: 12px 24px;
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        .floating-cta.show { transform: translateY(0); }
        .floating-inner {
          max-width: 1140px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }
        .floating-info { display: flex; align-items: center; gap: 16px; }
        .floating-queue {
          display: flex; align-items: center; gap: 6px;
          font-size: 14px; font-weight: 600; color: var(--green);
        }
        .floating-queue .fq-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--green); animation: pulse 2s infinite;
        }
        .floating-price { font-size: 14px; color: var(--text-secondary); }
        .floating-price strong { font-size: 20px; font-weight: 800; color: var(--text-primary); }
        .floating-btn {
          background: var(--green); color: white;
          padding: 14px 32px; border-radius: 14px;
          font-size: 16px; font-weight: 700;
          transition: all 0.2s; white-space: nowrap;
          box-shadow: 0 4px 12px rgba(26,141,72,0.3);
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
        }
        .floating-btn:hover { background: #15753c; }

        /* === RESPONSIVE === */
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hero { padding: 110px 0 60px; }
          .hero h1 { font-size: 32px; }
          .hero .subtitle { font-size: 16px; }
          .queue-box { padding: 24px 32px; }
          .queue-number { font-size: 48px; }
          .section { padding: 72px 0; }
          .section-title { font-size: 26px; }
          .section-desc { font-size: 16px; }
          .why-grid { grid-template-columns: 1fr; }
          .flow-steps { flex-direction: column; align-items: center; }
          .flow-step:not(:last-child)::after { display: none; }
          .flow-step { max-width: 100%; }
          .rules-grid { grid-template-columns: 1fr; }
          .pricing-card { padding: 36px 24px; }
          .pricing-amount { font-size: 40px; }
          .hero-cta-group { flex-direction: column; align-items: center; }
          .btn-primary, .btn-secondary { width: 100%; max-width: 320px; text-align: center; justify-content: center; }
          .floating-info { display: none; }
          .floating-inner { justify-content: center; }
          .floating-btn { width: 100%; text-align: center; }
          .toast { max-width: calc(100vw - 48px); }
        }

        @import url('https://cdnjs.cloudflare.com/ajax/libs/pretendard/1.3.9/variable/pretendardvariable.min.css');
      `}</style>

      {/* NAV */}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className="bread-icon">🍞</span> 식빵영어
          </Link>
          <div className="nav-links">
            <a href="#curriculum">커리큘럼</a>
            <a href="#daily">하루 흐름</a>
            <a href="#pricing">가격</a>
            <a href="#reviews">후기</a>
            <a href="#faq">FAQ</a>
          </div>
          <a href="#pricing" className="nav-cta">
            대기 신청하기
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="dot"></span>
            현재 모집 중 · 3인 한정
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
          <div className="queue-box" ref={heroQueueRef}>
            <div className="queue-label">현재 대기 중인 수강생</div>
            <div className="queue-number" ref={queueRef}>
              {currentQueue}
            </div>
            <div className="queue-unit">명</div>
            <div className="queue-sub">
              <span className="live-dot"></span>
              실시간 업데이트 · 선착순 마감
            </div>
          </div>

          <div className="hero-cta-group">
            <a href="#pricing" className="btn-primary">
              대기 신청하기 →
            </a>
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
            <div className="section-title">왜 식빵영어 스터디인가요?</div>
            <p className="section-desc">매년 4,000명 이상이 선택한 이유가 있습니다.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon green">⏰</div>
              <h3>2주 집중 설계</h3>
              <p>불필요한 걸 다 빼습니다. 2주 동안 OPIC 점수를 올리는 것에만 집중하는 커리큘럼.</p>
            </div>
            <div className="why-card">
              <div className="why-icon blue">🤖</div>
              <h3>사람 + AI 피드백</h3>
              <p>코치의 실전 피드백과 SpeakCoach AI의 정밀 분석을 동시에. 혼자 연습할 때도 AI가 함께합니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon orange">🏆</div>
              <h3>프레임워크 답변 훈련</h3>
              <p>막연히 말하지 않습니다. OPIC에 최적화된 답변 구조를 익혀서 어떤 질문에도 흔들리지 않는 실력을.</p>
            </div>
            <div className="why-card">
              <div className="why-icon green">🤝</div>
              <h3>3인 소그룹</h3>
              <p>혼자면 포기하고, 많으면 묻혀요. 3인이라 모두가 말하고, 서로 자극도 됩니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon blue">📊</div>
              <h3>검증된 성과</h3>
              <p>1,000건 이상의 수강 후기. IH, AL 등급 달성 사례가 계속 쌓이고 있습니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon orange">🔓</div>
              <h3>SpeakCoach AI 포함</h3>
              <p>스터디 기간 동안 SpeakCoach AI Pro를 무료로 제공. 매일 AI 분석으로 약점을 정밀 교정합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="section section-gray" id="curriculum">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">2주 커리큘럼</div>
            <p className="section-desc">매일 미션을 수행하며 OPIC 답변 구조를 체화합니다.</p>
          </div>
          <div className="curriculum-timeline">
            {/* Week 1 */}
            <div className="cur-week active">
              <div className="cur-week-dot"></div>
              <div className="cur-week-label">WEEK 1</div>
              <h3>기본기 구축 + 프레임워크 체화</h3>
              <p>OPIC 답변의 뼈대를 세우는 주간입니다. 프레임워크를 익히고, 주요 토픽별 답변을 구조화합니다.</p>
              <div className="cur-day-grid">
                <div className="cur-day">
                  <strong>Day 1-2</strong> 자기소개 + 서베이 전략
                </div>
                <div className="cur-day">
                  <strong>Day 3-4</strong> 취미/습관 토픽 훈련
                </div>
                <div className="cur-day">
                  <strong>Day 5-6</strong> 과거 경험 답변 구조화
                </div>
                <div className="cur-day">
                  <strong>Day 7</strong> 1주차 복습 + 모의 테스트
                </div>
              </div>
            </div>
            {/* Week 2 */}
            <div className="cur-week active">
              <div className="cur-week-dot"></div>
              <div className="cur-week-label">WEEK 2</div>
              <h3>실전 감각 완성 + 고득점 전략</h3>
              <p>롤플레이, 돌발 질문 대응, 실전 모의고사로 실제 시험에 대한 자신감을 완성합니다.</p>
              <div className="cur-day-grid">
                <div className="cur-day">
                  <strong>Day 8-9</strong> 롤플레이 집중 훈련
                </div>
                <div className="cur-day">
                  <strong>Day 10-11</strong> 돌발 질문 + 고급 표현
                </div>
                <div className="cur-day">
                  <strong>Day 12-13</strong> 실전 모의고사 2회
                </div>
                <div className="cur-day">
                  <strong>Day 14</strong> 최종 리뷰 + 시험 전략
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DAILY FLOW */}
      <section className="section" id="daily">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">하루는 이렇게 흘러갑니다</div>
            <p className="section-desc">매일 반복되는 구조가 실력을 만듭니다.</p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="flow-icon">🌅</div>
              <h4>오전</h4>
              <p>당일 토픽 공지 + 학습 자료 확인</p>
            </div>
            <div className="flow-step">
              <div className="flow-icon">🎤</div>
              <h4>스피킹 과제</h4>
              <p>프레임워크에 맞춰 답변 녹음 제출</p>
            </div>
            <div className="flow-step">
              <div className="flow-icon">🤖</div>
              <h4>AI 분석</h4>
              <p>SpeakCoach AI가 발음·문법·유창성 분석</p>
            </div>
            <div className="flow-step">
              <div className="flow-icon">💬</div>
              <h4>코치 피드백</h4>
              <p>코치가 핵심 포인트를 찌르며 개인별 피드백</p>
            </div>
            <div className="flow-step">
              <div className="flow-icon">💪</div>
              <h4>교정 연습</h4>
              <p>피드백 기반 재녹음 + 약점 드릴</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section section-gray" id="pricing">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">수강료</div>
            <p className="section-desc">
              SpeakCoach AI Pro 2주 무료 포함. 지금 신청하면 얼리버드 가격이 적용됩니다.
            </p>
          </div>
          <div className="pricing-area">
            <div className="pricing-card">
              <div className="pricing-popular">BEST</div>
              <div className="pricing-name">2주 집중 OPIC 스터디</div>
              <div className="pricing-title">소그룹 3인 1팀 · 14일</div>
              <div className="pricing-original">₩179,900</div>
              <div className="pricing-amount">
                <span className="won">₩</span>149,000
              </div>
              <div className="pricing-period">얼리버드 한정가</div>
              <ul className="pricing-features">
                <li>
                  <span className="check">✓</span> 2주 (14일) 집중 커리큘럼
                </li>
                <li>
                  <span className="check">✓</span> 소그룹 3인 1팀 구성
                </li>
                <li>
                  <span className="check">✓</span> 매일 스피킹 과제 + 코치 피드백
                </li>
                <li>
                  <span className="check">✓</span> SpeakCoach AI Pro 11일 무료 제공
                </li>
                <li>
                  <span className="check">✓</span> SpeakCoach AI Premium 3일 체험
                </li>
                <li>
                  <span className="check">✓</span> 프레임워크 답변 템플릿 제공
                </li>
                <li>
                  <span className="check">✓</span> 카카오톡 그룹 실시간 소통
                </li>
              </ul>
              <a
                href="https://www.notion.so/1-21dc7de0b170808a83bae9009d68a73e?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="pricing-btn"
              >
                대기 신청하기 →
              </a>
            </div>
            <div className="pricing-addon">
              <h4>✨ Premium 업그레이드</h4>
              <p>
                +<span className="addon-price">₩10,000</span>만 추가하면 2주 내내 SpeakCoach AI
                <strong>Premium</strong>을 이용할 수 있어요.
              </p>
            </div>
            <div className="pricing-addon" style={{ marginTop: '12px', background: 'var(--green-light)' }}>
              <h4>🎁 수료 후 특별 혜택</h4>
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
                <p>당일 미션은 당일 자정까지 제출. 꼼꼼함이 실력을 만듭니다.</p>
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
                <p>팀 단위방에서 과제 제출, 피드백 공유, 질문이 진행됩니다.</p>
              </div>
            </div>
            <div className="rule-card">
              <div className="rule-num">04</div>
              <div>
                <h4>환불 규정</h4>
                <p>시작 전 100% 환불. 시작 후 3일 이내 50%. 이후 환불 불가.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-gray" id="reviews">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">수강생 후기</div>
            <p className="section-desc">1,000건 이상의 실제 후기 중 일부입니다.</p>
          </div>
          <div className="review-scroll-wrap">
            <div
              className="review-scroll"
              ref={reviewScrollRef}
              onMouseEnter={() => setReviewsPaused(true)}
              onMouseLeave={() => setReviewsPaused(false)}
              onTouchStart={() => setReviewsPaused(true)}
              onTouchEnd={() => {
                setReviewsPaused(true);
                setTimeout(() => setReviewsPaused(false), 2000);
              }}
            >
              {reviews.map((review, idx) => (
                <div className="review-card" key={idx}>
                  <div className="review-stars">★★★★★</div>
                  <div className="review-text">{review.text}</div>
                  <div className="review-author">
                    <div className="review-avatar">{review.avatar}</div>
                    <div>
                      <div className="review-name">
                        {review.name} <span className="review-grade">{review.grade}</span>
                      </div>
                      <div className="review-info">{review.info}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">자주 묻는 질문</div>
            <p className="section-desc">궁금한 점이 있으시면 언제든 문의해주세요.</p>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div className="faq-item" key={index}>
                <button
                  className={`faq-question ${openFaqIndex === index ? 'open' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  {item.question}
                  <span className="arrow">▼</span>
                </button>
                <div
                  className="faq-answer"
                  ref={(el) => {
                    if (el) faqAnswerRefs.current[index] = el;
                  }}
                >
                  <div className="faq-answer-inner">{item.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <h2>다음 팀에 합류하세요</h2>
          <p>
            3인이 모이면 바로 시작합니다. 지금 <span ref={ctaQueueRef}>{currentQueue}</span>명이 대기 중이에요.
          </p>
          <a href="#pricing" className="btn-white">
            대기 신청하기 →
          </a>
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
      <div className={`floating-cta ${showFloatingCta ? 'show' : ''}`}>
        <div className="floating-inner">
          <div className="floating-info">
            <div className="floating-queue">
              <span className="fq-dot"></span>
              <span ref={floatingQueueRef}>{currentQueue}</span>명 대기 중
            </div>
            <div className="floating-price">
              얼리버드 <strong>₩149,000</strong>
            </div>
          </div>
          <a
            href="https://www.notion.so/1-21dc7de0b170808a83bae9009d68a73e?source=copy_link"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-btn"
          >
            대기 신청하기 →
          </a>
        </div>
      </div>

      {/* TOAST NOTIFICATIONS */}
      <div className="toast-area">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            <div className="toast-icon">👋</div>
            <div>
              <strong>{toast.name}</strong>
              {toast.action}
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                {toast.loc} · {toast.mins}분 전
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
