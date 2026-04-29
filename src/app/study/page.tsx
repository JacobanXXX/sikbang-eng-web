'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// === 자동 기수 운영 시스템 (컴포넌트 외부) ===
// 부트캠프: 매월 1일, 15일 시작 (월 2회)
// 모집: 이전 기수 시작일 ~ 다음 기수 시작 전날 23:59:59
// 얼리버드: 모집 시작 ~ 시작 5일 전 (199,000원, 원가 329,000원)
// 정가: 시작 5일 전 ~ 마감 (229,000원, 원가 329,000원)
// 부트캠프 정원: 20명, 1차 피드백 후 환불 가능

interface StudyCycle {
  studyStart: Date;
  recruitStart: Date;
  recruitEnd: Date;
  earlyBirdEnd: Date;
  studyDateStr: string;
  label: string;
}

function getStudyCycles(now: Date): StudyCycle[] {
  const year = now.getFullYear();
  const month = now.getMonth();
  const cycles: StudyCycle[] = [];

  for (let offset = -1; offset <= 2; offset++) {
    // JavaScript Date 생성자가 월 오버플로우를 자동 보정
    const baseMonth = month + offset;

    // 1일 기수: 모집 = 전월 15일 ~ 전월 말일
    const start1 = new Date(year, baseMonth, 1, 0, 0, 0);
    const recruit1Start = new Date(year, baseMonth - 1, 15, 0, 0, 0);
    const recruit1End = new Date(year, baseMonth, 0, 23, 59, 59); // day 0 = 전월 말일
    const earlyBird1End = new Date(year, baseMonth, -4, 23, 59, 59); // 1일 - 5일 = 전월 26~27일
    const displayMonth1 = start1.getMonth() + 1;
    cycles.push({
      studyStart: start1,
      recruitStart: recruit1Start,
      recruitEnd: recruit1End,
      earlyBirdEnd: earlyBird1End,
      studyDateStr: `${displayMonth1}월 1일`,
      label: `${displayMonth1}월 1일 기수`
    });

    // 15일 기수: 모집 = 같은달 1일 ~ 14일
    const start15 = new Date(year, baseMonth, 15, 0, 0, 0);
    const recruit15Start = new Date(year, baseMonth, 1, 0, 0, 0);
    const recruit15End = new Date(year, baseMonth, 14, 23, 59, 59);
    const earlyBird15End = new Date(year, baseMonth, 10, 23, 59, 59); // 15일 - 5일 = 10일
    const displayMonth15 = start15.getMonth() + 1;
    cycles.push({
      studyStart: start15,
      recruitStart: recruit15Start,
      recruitEnd: recruit15End,
      earlyBirdEnd: earlyBird15End,
      studyDateStr: `${displayMonth15}월 15일`,
      label: `${displayMonth15}월 15일 기수`
    });
  }

  return cycles.sort((a, b) => a.studyStart.getTime() - b.studyStart.getTime());
}

function getCurrentCycle(now: Date): StudyCycle | null {
  const cycles = getStudyCycles(now);
  // 현재 모집 중인 기수 찾기: recruitStart <= now <= recruitEnd
  const active = cycles.find(c => now >= c.recruitStart && now <= c.recruitEnd);
  if (active) return active;
  // 없으면 다음 모집 시작될 기수
  return cycles.find(c => c.recruitStart > now) || null;
}

function checkIsEarlyBird(now: Date, cycle: StudyCycle): boolean {
  return now <= cycle.earlyBirdEnd;
}

function getCurrentPrice(now: Date, cycle: StudyCycle): number {
  return checkIsEarlyBird(now, cycle) ? 199000 : 229000;
}

function getDiscountPercent(price: number): number {
  return Math.round((1 - price / 329000) * 100);
}

// 남은 인원 자동 계산 (파워 커브 - 초반 급감, 후반 완만)
// 공식: remaining = 1 + 19 * (1 - progress)^2.5
// 오픈 직후 20명 → 마감 시 1명 (최소 1명 보장)
function getAutoRemainingSlots(now: Date, cycle: StudyCycle): number {
  const totalDuration = cycle.recruitEnd.getTime() - cycle.recruitStart.getTime();
  if (totalDuration <= 0) return 20;
  const elapsed = now.getTime() - cycle.recruitStart.getTime();
  const progress = Math.max(0, Math.min(1, elapsed / totalDuration));

  // 시드 기반 일별 변동 (같은 날 같은 값)
  const dayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${cycle.studyDateStr}`;
  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) {
    hash = ((hash << 5) - hash) + dayKey.charCodeAt(i);
    hash |= 0;
  }
  const dailyVariation = (Math.abs(hash) % 2); // 0, 1

  // 파워 커브: 초반 빠르게, 후반 완만하게 감소
  const curveFactor = Math.pow(1 - progress, 2.5);
  const baseRemaining = Math.round(1 + 19 * curveFactor);

  // 최소 1명 보장
  return Math.max(1, Math.min(20, baseRemaining + dailyVariation));
}

export default function StudyPage() {
  // Slots and remaining state (정원 20명 — 코치 1대1 음성 분석을 위한 의도된 소수)
  const [remainingSlots, setRemainingSlots] = useState(20);
  const [ctaRemainingSlots, setCtaRemainingSlots] = useState(20);
  const [floatingRemainingSlots, setFloatingRemainingSlots] = useState(20);

  // Floating CTA state
  const [showFloatingCta, setShowFloatingCta] = useState(false);

  // Application form modal state
  const [showFormModal, setShowFormModal] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1: 정보입력, 2: 플랜선택, 3: 입금안내
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    targetClass: '' as '' | 'IH' | 'AL',
    currentLevel: '' as '' | 'beginner' | 'NH' | 'IL' | 'IM1' | 'IM2' | 'IM3_above',
    plan: 'standard' as 'standard' | 'bundle',
    hasBook: false,
    premiumUpgrade: false,
    refundAccount: '',
    depositConfirm: false,
    hasScore: false,
    scoreGrade: '',
  });
  const [scoreFile, setScoreFile] = useState<File | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [bundleStock, setBundleStock] = useState(5);

  // Toast notifications state
  const [toasts, setToasts] = useState<Array<{ id: number; name: string; action: string; location: string; mins: number }>>([]);

  // Countdown + cycle state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0, label: '', nextDate: '' });
  const [currentCycleState, setCurrentCycleState] = useState<{ isEarlyBird: boolean; price: number; discount: number; autoSlots: number; earlyBirdEndStr: string }>({
    isEarlyBird: true, price: 199000, discount: 39, autoSlots: 20, earlyBirdEndStr: ''
  });

  useEffect(() => {
    const calcCountdown = () => {
      const now = new Date();
      const cycle = getCurrentCycle(now);
      if (!cycle) return;

      const earlyBird = checkIsEarlyBird(now, cycle);
      const price = getCurrentPrice(now, cycle);
      const discount = getDiscountPercent(price);
      const autoSlots = getAutoRemainingSlots(now, cycle);

      const ebEnd = cycle.earlyBirdEnd;
      const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
      const earlyBirdEndStr = `${ebEnd.getMonth() + 1}월 ${ebEnd.getDate()}일(${dayNames[ebEnd.getDay()]})`;
      setCurrentCycleState({ isEarlyBird: earlyBird, price, discount, autoSlots, earlyBirdEndStr });

      const diff = cycle.recruitEnd.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0, label: '다음 기수 접수 중', nextDate: cycle.studyDateStr });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, mins, secs, label: `${cycle.label} 마감까지`, nextDate: cycle.studyDateStr });
    };

    calcCountdown();
    const timer = setInterval(calcCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [openGuaranteeFaq, setOpenGuaranteeFaq] = useState<number | null>(null);
  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('sikbang-theme');
    if (saved === 'dark') { setDarkMode(true); document.documentElement.setAttribute('data-theme', 'dark'); }
  }, []);
  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('sikbang-theme', next ? 'dark' : 'light');
  };
  // === 자체 신청폼 가격 계산 ===
  const calcFormPrice = () => {
    const isEarly = currentCycleState.isEarlyBird;
    const bookFee = formData.hasBook ? 0 : 30000;

    let base: number;
    if (formData.plan === 'bundle') {
      // 번들: 부트캠프 + SpeakCoach AI Premium 3개월
      base = isEarly ? 249000 : 279000;
      // 번들은 교재비 포함 가격이므로, 교재 있으면 3만원 차감
      return base - (formData.hasBook ? 30000 : 0) + (formData.premiumUpgrade ? 15000 : 0);
    } else {
      // 일반 부트캠프 (교재비 별도 30,000원 추가)
      // 얼리버드: 219,000 + 30,000 = 249,000 / 정가: 249,000 + 30,000 = 279,000
      base = isEarly ? 169000 : 199000;
      return base + bookFee + (formData.premiumUpgrade ? 15000 : 0);
    }
  };

  const bundleStockRef = useRef(5);
  const bundleTimerRef = useRef<NodeJS.Timeout | null>(null);

  const openFormModal = () => {
    setShowFormModal(true);
    setFormStep(1);
    setFormSubmitted(false);
    setFormError('');
    // 번들 수량 초기화 (3~5 사이 랜덤)
    const initStock = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
    setBundleStock(initStock);
    bundleStockRef.current = initStock;
    // 기존 타이머 정리
    if (bundleTimerRef.current) clearTimeout(bundleTimerRef.current);
    // 랜덤 간격으로 수량 감소 (25~50초 간격)
    const scheduleDecrease = () => {
      const delay = 25000 + Math.random() * 25000;
      bundleTimerRef.current = setTimeout(() => {
        if (bundleStockRef.current > 1) {
          bundleStockRef.current -= 1;
          setBundleStock(bundleStockRef.current);
          if (bundleStockRef.current > 1) scheduleDecrease();
        }
      }, delay);
    };
    scheduleDecrease();
  };

  const handleFormSubmit = async () => {
    // Validate step 3
    if (!formData.refundAccount.trim()) {
      setFormError('환불계좌를 입력해주세요.');
      return;
    }
    if (!formData.depositConfirm) {
      setFormError('입금 완료 후 체크해주세요.');
      return;
    }

    setFormSubmitting(true);
    setFormError('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('targetClass', formData.targetClass);
      submitData.append('currentLevel', formData.currentLevel);
      submitData.append('plan', formData.plan);
      submitData.append('hasBook', String(formData.hasBook));
      submitData.append('premiumUpgrade', String(formData.premiumUpgrade));
      submitData.append('refundAccount', formData.refundAccount);
      submitData.append('totalPrice', String(calcFormPrice()));
      submitData.append('hasScore', String(formData.hasScore));
      submitData.append('scoreGrade', formData.scoreGrade);
      if (scoreFile) {
        submitData.append('scoreFile', scoreFile);
      }

      const res = await fetch('/api/study-apply', {
        method: 'POST',
        body: submitData,
      });

      const data = await res.json();

      if (res.ok) {
        setFormSubmitted(true);
      } else {
        setFormError(data.error || '신청 중 오류가 발생했습니다.');
      }
    } catch {
      setFormError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Review scroll state
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [reviewDirection, setReviewDirection] = useState(1);
  const [reviewPaused, setReviewPaused] = useState(false);

  const totalSlots = 20;
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
      answer: 'IL 이상이라면 충분히 따라갈 수 있습니다. 부트캠프는 프레임워크 기반으로 진행되기 때문에 구조를 따라가며 답변을 만들 수 있어요. 다만, OPIc 경험이 전혀 없거나 NH 이하 수준이라면 1:1 영어 회화 클래스에서 1~2개월 기초를 먼저 다진 뒤 부트캠프에 합류하시는 걸 추천드립니다. 기초 없이 바로 참여하시면 따라가기 어렵고, 팀원들에게도 영향이 갈 수 있습니다. 회화 클래스에서 기본 감각을 잡고 오시면 부트캠프 효과가 2배 이상 올라갑니다.'
    },
    {
      question: '왕초보인데 어떤 과정부터 시작해야 하나요?',
      answer: '영어 왕초보(NH 이하 또는 시험 경험 없음)라면 1:1 영어 회화 클래스부터 시작하시는 걸 권장합니다. 주 1회 90분씩 맞춤 수업으로 문법·어휘·스피킹 기초를 잡을 수 있어요. 보통 1~2개월 후 IL 이상 수준이 되면 OPIc 부트캠프에 참여하시는 게 가장 효과적입니다. 신청 시 수준을 선택하면 자동으로 안내해드려요.'
    },
    {
      question: 'SpeakCoach AI는 어떻게 사용하나요?',
      answer: '부트캠프 시작 시 SpeakCoach AI Pro 계정이 자동으로 활성화됩니다. 웹 앱(PWA)이라 별도 설치 없이 브라우저에서 바로 사용 가능합니다. 답변을 녹음하면 AI가 발음·문법·유창성·어휘 등 7개 영역을 분석해서 피드백을 줍니다.'
    },
    {
      question: '부트캠프는 언제 시작하나요?',
      answer: '3인 1팀이 구성되는 즉시 시작합니다. 신청 후 팀이 매칭되면 시작일을 안내해드립니다. 보통 신청 후 1주 이내 시작됩니다.'
    },
    {
      question: '하루에 얼마나 시간을 투자해야 하나요?',
      answer: '하루 평균 1~2시간 정도입니다. 학습 자료 확인(10분) + 답변 준비 및 녹음(30~40분) + AI 분석 확인 및 교정 연습(30분) + 코치 피드백 반영(20분). 직장인도 충분히 병행 가능한 수준입니다.'
    },
    {
      question: '환불은 어떻게 되나요?',
      answer: '카톡방 입장 전까지 교재비를 뺀 금액 환불 가능합니다. 입장 후엔 환불 불가. 자세한 규정은 아래 [필독] 항목을 확인해주세요.'
    },
    {
      question: '[필독] 참여 규정 및 환불 제한 안내',
      answer: '본 부트캠프는 소규모 그룹(3인 1팀)으로 운영되며, 인원 편성 이후에는 부트캠프 시작 여부와 관계없이 환불이 불가합니다. 한 명의 불참이나 비협조가 팀 전체에 직접적인 피해를 줍니다. 아래 사항에 해당할 경우 부트캠프 참여가 제한될 수 있습니다.\n\n• 인원 편성 후 지속적인 미응답 또는 무시\n• 부트캠프 시간 조율 시 연락 두절 또는 비협조\n• 사전 고지 없는 무단 불참 (2회 이상)\n• 과제 미제출이 3일 이상 연속될 경우\n• 다른 팀원의 학습을 방해하는 행위\n• 운영진의 안내 및 공지에 대한 지속적 무응답\n\n위 규정은 함께 참여하는 다른 수강생의 학습권을 보호하기 위한 것입니다.\n\n[환불 안내]\n인원 편성 전(카카오톡 단체방 초대 전)에는 전자책(교재)을 제외한 나머지 금액의 환불이 가능합니다. 카카오톡 단체방에 초대된 시점부터 인원 편성이 완료된 것으로 간주되며, 이후에는 환불이 불가합니다.\n\n[팀원 이탈에 대한 면책]\n부트캠프 진행 중 같은 팀의 다른 수강생이 중도 포기·불참·연락 두절 등으로 이탈하는 경우, 이는 해당 수강생 개인의 사유이며 식빵영어의 귀책사유에 해당하지 않습니다. 팀원 이탈을 사유로 한 환불 요청, 수강료 감액, 서비스 불이행 주장은 인정되지 않으며, 잔여 인원으로 부트캠프가 정상 진행됩니다.\n\n신청 및 결제 시 본 참여 규정과 면책 조항에 동의한 것으로 간주되며, 카카오톡 단체방 초대 이후 환불 요청은 불가합니다.',
      important: true
    },
    {
      question: 'Premium 업그레이드는 꼭 해야 하나요?',
      answer: '필수는 아닙니다. 기본 부트캠프에 Pro 플랜이 포함되어 충분히 학습 가능합니다. Premium은 고급 분석 기능이 추가되므로, AL을 목표로 하시는 분께 추천드립니다.'
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

  // 남은 인원을 자동 계산값과 동기화
  useEffect(() => {
    const updateAllSlots = (num: number) => {
      slotsRef.current = num;
      setRemainingSlots(num);
      setCtaRemainingSlots(num);
      setFloatingRemainingSlots(num);
    };

    // 자동 계산된 인원으로 초기화
    updateAllSlots(currentCycleState.autoSlots);
  }, [currentCycleState.autoSlots]);

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
          color: var(--text-primary);
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
          --card-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06);
          --green: #1A8D48;
          --green-light: #E8FFF0;
          --red: #E74C3C;
          --orange: #F59E0B;
        }
        [data-theme="dark"] {
          --blue-primary: #4A9AFF;
          --blue-dark: #3182F6;
          --blue-light: #1A2A40;
          --text-primary: #EAEDF0;
          --text-secondary: #B0B8C1;
          --text-tertiary: #6B7684;
          --bg-white: #1A1D23;
          --bg-gray: #22262E;
          --border: #333840;
          --card-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 8px 32px rgba(0,0,0,0.3);
          --green: #22C55E;
          --green-light: #1A3A2A;
          --red: #F87171;
          --orange: #FBBF24;
        }
        [data-theme="dark"] body { background: #1A1D23; color: #EAEDF0; }
        [data-theme="dark"] .nav { background: rgba(26,29,35,0.95); border-bottom-color: #333840; }
        [data-theme="dark"] .hero { background: linear-gradient(180deg, #1E2E22 0%, #1A1D23 100%); }
        [data-theme="dark"] .section-gray { background: #22262E; }
        [data-theme="dark"] .curriculum-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .pricing-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .vs-col { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .vs-col-highlight { background: #22262E; border-color: #22C55E; }
        [data-theme="dark"] .vs-tag { color: #6B7684; }
        [data-theme="dark"] .vs-tag-highlight { color: #22C55E; }
        [data-theme="dark"] .vs-fact { color: #EAEDF0; }
        [data-theme="dark"] .vs-fact-highlight { color: #22C55E; }
        [data-theme="dark"] .vs-issue { color: #B0B8C1; }
        [data-theme="dark"] .vs-issue-strong { color: #EAEDF0; }
        [data-theme="dark"] .vs-issue-strong b { color: #22C55E; }
        [data-theme="dark"] .vs-stat { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .vs-stat-num,
        [data-theme="dark"] .vs-stat-plus,
        [data-theme="dark"] .vs-stat-unit { color: #22C55E; }
        [data-theme="dark"] .vs-stat-label { color: #B0B8C1; }
        [data-theme="dark"] .vs-conclusion { color: #22C55E; }
        [data-theme="dark"] .guarantee-headline-card { background: #22262E; border-color: #22C55E; }
        [data-theme="dark"] .guarantee-tag { background: #1A3A2A; color: #22C55E; }
        [data-theme="dark"] .guarantee-headline { color: #EAEDF0; }
        [data-theme="dark"] .guarantee-body { color: #B0B8C1; }
        [data-theme="dark"] .guarantee-body b { color: #EAEDF0; }
        [data-theme="dark"] .guarantee-refund-row { background: #1A1D23; }
        [data-theme="dark"] .guarantee-refund-label { color: #6B7684; }
        [data-theme="dark"] .guarantee-refund-value { color: #EAEDF0; }
        [data-theme="dark"] .guarantee-note { background: #22262E; color: #B0B8C1; }
        [data-theme="dark"] .bonus-problem { color: #8B95A1; }
        [data-theme="dark"] .bonus-solution { color: #EAEDF0; }
        [data-theme="dark"] .bonus-proof { color: #B0B8C1; }
        [data-theme="dark"] .bonus-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .bonus-card:hover { border-color: #22C55E; }
        [data-theme="dark"] .bonus-no { color: #22C55E; }
        [data-theme="dark"] .bonus-tag { background: #1A3A2A; color: #22C55E; }
        [data-theme="dark"] .bonus-title { color: #EAEDF0; }
        [data-theme="dark"] .bonus-desc { color: #B0B8C1; }
        [data-theme="dark"] .bonus-meta { border-top-color: #333840; }
        [data-theme="dark"] .bonus-pages { color: #6B7684; }
        [data-theme="dark"] .bonus-value { color: #22C55E; }
        [data-theme="dark"] .bonus-total { background: #1A1D23; border-color: #333840; }
        [data-theme="dark"] .bonus-total-label { color: #6B7684; }
        [data-theme="dark"] .bonus-total-strike { color: #6B7684; }
        [data-theme="dark"] .bonus-total-final { color: #22C55E; }
        [data-theme="dark"] .bonus-total-sub { color: #B0B8C1; }
        [data-theme="dark"] .review-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .review-stat-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .review-stat-num,
        [data-theme="dark"] .review-stat-plus,
        [data-theme="dark"] .review-stat-unit { color: #22C55E; }
        [data-theme="dark"] .review-stat-label { color: #B0B8C1; }
        [data-theme="dark"] .review-grade-shift { background: #22262E; }
        [data-theme="dark"] .grade-before { color: #6B7684; }
        [data-theme="dark"] .grade-arrow,
        [data-theme="dark"] .grade-after { color: #22C55E; }
        [data-theme="dark"] .review-text b { color: #EAEDF0; }
        [data-theme="dark"] .faq-item { border-color: #333840; }
        [data-theme="dark"] .toast { background: rgba(26,29,35,0.95); }
        [data-theme="dark"] .theme-toggle { color: #8B95A1; }
        [data-theme="dark"] .theme-toggle:hover { color: #EAEDF0; }
        [data-theme="dark"] .countdown-box { background: rgba(26,29,35,0.8); border-color: #333840; }
        [data-theme="dark"] .countdown-num { background: #22262E; color: #EAEDF0; }

        /* Dark mode: borders, backgrounds, text colors */
        [data-theme="dark"] .queue-stats strong { color: #22C55E; }
        [data-theme="dark"] .pricing-badge { background: #1A3A2A; color: #22C55E; }
        [data-theme="dark"] .pricing-addon { border-color: #333840; }
        [data-theme="dark"] .pricing-addon.green { border-color: #333840; }
        [data-theme="dark"] .faq-badge { background: #F87171; }
        [data-theme="dark"] .form-cycle-badge { background: #22262E; }
        [data-theme="dark"] .form-step-dot { background: #333840; }
        [data-theme="dark"] .form-step-line { background: #333840; }
        [data-theme="dark"] .form-field label .req { color: #F87171; }
        [data-theme="dark"] .form-field input[type="text"],
        [data-theme="dark"] .form-field input[type="email"],
        [data-theme="dark"] .form-field input[type="tel"],
        [data-theme="dark"] .form-field select,
        [data-theme="dark"] .form-field textarea { border-color: #333840; }
        [data-theme="dark"] .form-radio-card { border-color: #333840; }
        [data-theme="dark"] .form-plan-card { border-color: #333840; }
        [data-theme="dark"] .form-plan-card.bundle { border-color: #333840; }
        [data-theme="dark"] .form-bundle-stock { background: #3A1A1A; color: #F87171; }
        [data-theme="dark"] .form-bundle-stock.urgent { background: #F87171; }
        [data-theme="dark"] .form-plan-save { color: #22C55E; }
        [data-theme="dark"] .form-value-stack { border-color: #333840; }
        [data-theme="dark"] .form-value-total { border-top-color: #333840; }
        [data-theme="dark"] .form-bundle-why p { color: #22C55E; }
        [data-theme="dark"] .form-bonus-box { border-color: #FBBF24; }
        [data-theme="dark"] .form-bonus-title { color: #FBBF24; }
        [data-theme="dark"] .form-bonus-item { color: #EAEDF0; }
        [data-theme="dark"] .form-target-guide { border-color: #333840; }
        [data-theme="dark"] .form-target-guide-note { border-top-color: #333840; }
        [data-theme="dark"] .form-option-box { border-color: #333840; }
        [data-theme="dark"] .form-option-box.highlight { border-color: #FBBF24; }
        [data-theme="dark"] .form-price-row.discount { color: #22C55E; }
        [data-theme="dark"] .form-price-total { border-top-color: #333840; }
        [data-theme="dark"] .form-deposit-box { border-color: #22C55E; }
        [data-theme="dark"] .form-deposit-row { border-bottom-color: #333840; }
        [data-theme="dark"] .form-summary-row { border-bottom-color: #333840; }
        [data-theme="dark"] .form-btn-primary:disabled { background: #333840; }
        [data-theme="dark"] .form-btn-secondary { background: #22262E; }
        [data-theme="dark"] .form-btn-secondary:hover { background: #333840; }
        [data-theme="dark"] .form-error { background: #3A1A1A; color: #F87171; }
        [data-theme="dark"] .stats-section { background: #22262E; color: #EAEDF0; }

        /* Dark mode: compare table */
        [data-theme="dark"] .compare-table-wrap { border-color: #333840; }
        [data-theme="dark"] .compare-table thead th { border-bottom-color: #333840; background: #22262E; }
        [data-theme="dark"] .compare-table tbody td { border-bottom-color: #333840; color: #B0B8C1; }
        [data-theme="dark"] .compare-table tbody td:first-child { color: #EAEDF0; }
        [data-theme="dark"] .compare-table tbody td.highlight-col { background: #1A3A2A; color: #22C55E; }
        [data-theme="dark"] .compare-x { color: #6B7684; }

        /* === COUNTDOWN === */
        .countdown-box {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(26,141,72,0.15);
          border-radius: 16px;
          padding: 20px 28px;
          margin-bottom: 0;
          display: inline-block;
        }
        .countdown-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--green);
          margin-bottom: 12px;
        }
        .countdown-timer {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
        }
        .countdown-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .countdown-num {
          background: var(--bg-white);
          border-radius: 10px;
          padding: 8px 12px;
          min-width: 48px;
          font-size: 24px;
          font-weight: 800;
          color: var(--text-primary);
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }
        .countdown-unit-label {
          font-size: 12px;
          color: var(--text-tertiary);
          font-weight: 600;
        }
        .countdown-sep {
          font-size: 24px;
          font-weight: 800;
          color: var(--text-tertiary);
          padding-bottom: 18px;
        }
        .countdown-closed {
          font-size: 16px;
          font-weight: 700;
          color: var(--green);
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
          background: #1A8D48;
        }

        /* === HERO === */
        .hero {
          padding: 120px 0 80px;
          margin-top: 64px;
          background: linear-gradient(180deg, rgba(26,141,72,0.04) 0%, rgba(26,141,72,0) 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          text-align: center;
        }
        .hero-top-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
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
          margin-bottom: 0;
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
        .hero .hero-tagline-strong {
          font-size: 24px;
          font-weight: 700;
          color: var(--green);
          letter-spacing: -0.025em;
          line-height: 1.4;
          margin-top: 12px;
          margin-bottom: 20px;
        }
        .hero .subtitle {
          font-size: 17px;
          color: var(--text-secondary);
          line-height: 1.65;
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
          background: var(--bg-white);
          border: 2px solid var(--green);
          border-radius: 24px;
          padding: 32px 48px;
          box-shadow: var(--card-shadow);
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
          background: var(--green);
          border-radius: 4px;
          transition: width 1s ease;
        }
        .queue-stats {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-tertiary);
          margin-bottom: 8px;
          gap: 24px;
        }
        .queue-stats strong {
          color: #1A8D48;
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
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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
          box-shadow: 0 2px 8px rgba(26, 141, 72, 0.15);
        }
        .btn-primary:hover {
          background: #1A8D48;
          box-shadow: 0 4px 12px rgba(26, 141, 72, 0.2);
          transform: translateY(-2px);
        }
        .btn-secondary {
          background: var(--bg-white);
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
          background: var(--bg-white);
          padding: 40px 32px;
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          text-align: center;
          transition: all 0.3s;
        }
        .why-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .why-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: inline-block;
          font-weight: 800;
          color: var(--green);
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
          background: var(--bg-white);
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

        /* === VS-GRID (비교 불가능한 오퍼) === */
        .vs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          max-width: 1080px;
          margin: 48px auto 0 auto;
        }
        .vs-col {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 32px;
          display: flex;
          flex-direction: column;
        }
        .vs-col-highlight {
          background: var(--bg-white);
          border: 2px solid var(--green);
          position: relative;
        }
        .vs-tag {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-tertiary);
          letter-spacing: 0.06em;
          margin-bottom: 12px;
        }
        .vs-tag-highlight {
          color: var(--green);
        }
        .vs-fact {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin-bottom: 14px;
        }
        .vs-fact-highlight {
          color: var(--green);
          font-size: 17px;
        }
        .vs-issue {
          font-size: 13.5px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
          flex: 1;
        }
        .vs-issue-strong {
          color: var(--text-primary);
          font-size: 13.5px;
          font-weight: 500;
        }
        .vs-issue-strong b {
          font-weight: 700;
          color: var(--green);
        }
        .vs-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          max-width: 1080px;
          margin: 32px auto 0 auto;
        }
        .vs-stat {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px 18px;
          text-align: center;
        }
        .vs-stat-num {
          font-size: 30px;
          font-weight: 700;
          color: var(--green);
          letter-spacing: -0.025em;
          line-height: 1;
        }
        .vs-stat-plus, .vs-stat-unit {
          font-size: 17px;
          font-weight: 700;
          color: var(--green);
          margin-left: 2px;
        }
        .vs-stat-label {
          font-size: 12.5px;
          color: var(--text-secondary);
          font-weight: 500;
          margin-top: 9px;
          letter-spacing: -0.005em;
        }
        .vs-conclusion {
          max-width: 1080px;
          margin: 36px auto 0 auto;
          text-align: center;
          font-size: 18px;
          font-weight: 700;
          color: var(--green);
          letter-spacing: -0.02em;
        }
        @media (max-width: 720px) {
          .vs-grid { grid-template-columns: 1fr 1fr; }
          .vs-stats { grid-template-columns: 1fr 1fr; }
          .vs-fact { font-size: 15px; }
          .vs-stat-num { font-size: 24px; }
        }

        /* === GUARANTEE HEADLINE === */
        .guarantee-headline-card {
          max-width: 880px;
          margin: 56px auto 0 auto;
          background: var(--bg-white);
          border: 2px solid var(--green);
          border-radius: 20px;
          padding: 40px;
          position: relative;
        }
        .guarantee-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--green);
          background: #E8FFF0;
          padding: 6px 14px;
          border-radius: 999px;
          width: fit-content;
        }
        .guarantee-headline {
          font-size: 26px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin: 16px 0 12px 0;
        }
        .guarantee-body {
          font-size: 15.5px;
          color: var(--text-secondary);
          line-height: 1.65;
          margin: 0 0 28px 0;
        }
        .guarantee-body b {
          color: var(--text-primary);
          font-weight: 700;
        }
        .guarantee-refund-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 20px;
          background: #F9FBFD;
          border-radius: 14px;
          margin-bottom: 16px;
        }
        .guarantee-refund-cell {
          text-align: center;
        }
        .guarantee-refund-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-tertiary);
          letter-spacing: 0.04em;
          margin-bottom: 6px;
        }
        .guarantee-refund-value {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.005em;
          line-height: 1.4;
        }
        .guarantee-note {
          font-size: 12.5px;
          color: var(--text-tertiary);
          line-height: 1.5;
          padding: 10px 14px;
          background: var(--bg-gray);
          border-radius: 8px;
        }
        @media (max-width: 720px) {
          .guarantee-headline-card { padding: 28px 22px; }
          .guarantee-headline { font-size: 22px; }
          .guarantee-refund-row { grid-template-columns: 1fr; gap: 16px; padding: 18px; }
        }

        /* === BONUSES === */
        .bonus-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          max-width: 880px;
          margin: 0 auto;
        }
        .bonus-card {
          background: #FFFFFF;
          border: 1px solid #E5E8EB;
          border-radius: 16px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          transition: all 0.15s ease;
        }
        .bonus-card:hover {
          border-color: #1A8D48;
          transform: translateY(-2px);
        }
        .bonus-card-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .bonus-no {
          font-size: 28px;
          font-weight: 700;
          color: #1A8D48;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        .bonus-tag {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: #1A8D48;
          background: #E8FFF0;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .bonus-title {
          font-size: 17px;
          font-weight: 700;
          color: #191F28;
          letter-spacing: -0.015em;
          line-height: 1.35;
          margin: 0 0 8px 0;
        }
        .bonus-desc {
          font-size: 13.5px;
          color: #4E5968;
          line-height: 1.55;
          margin: 0 0 18px 0;
          flex: 1;
        }
        .bonus-problem {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0 0 6px 0;
          letter-spacing: -0.01em;
        }
        .bonus-problem::before {
          content: '';
          display: none;
        }
        .bonus-solution {
          font-size: 15px;
          font-weight: 600;
          color: #191F28;
          line-height: 1.6;
          margin: 12px 0 0 0;
          letter-spacing: -0.01em;
        }
        .bonus-solution::before {
          content: '';
          display: none;
        }
        .bonus-proof {
          font-size: 12.5px;
          color: #4E5968;
          line-height: 1.55;
          margin: 0;
          flex: 1;
          display: none;
        }
        .bonus-proof::before {
          content: '';
          display: none;
        }
        .bonus-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 14px;
          border-top: 1px solid #F2F4F6;
        }
        .bonus-pages {
          font-size: 12px;
          font-weight: 600;
          color: #8B95A1;
          letter-spacing: 0.02em;
        }
        .bonus-value {
          font-size: 15px;
          font-weight: 700;
          color: var(--green);
        }
        .bonus-total {
          margin: 32px auto 0 auto;
          max-width: 880px;
          background: #F9FBFD;
          border: 1px solid #E5E8EB;
          border-radius: 16px;
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }
        .bonus-total-label {
          font-size: 12px;
          font-weight: 700;
          color: #8B95A1;
          letter-spacing: 0.06em;
        }
        .bonus-total-price {
          display: flex;
          align-items: baseline;
          gap: 14px;
        }
        .bonus-total-strike {
          font-size: 17px;
          color: #8B95A1;
          text-decoration: line-through;
          font-weight: 500;
        }
        .bonus-total-final {
          font-size: 32px;
          font-weight: 700;
          color: #1A8D48;
          letter-spacing: -0.025em;
          line-height: 1;
        }
        .bonus-total-sub {
          font-size: 13px;
          color: #4E5968;
          font-weight: 500;
        }

        @media (max-width: 720px) {
          .bonus-grid {
            grid-template-columns: 1fr;
          }
          .bonus-card {
            padding: 20px;
          }
          .bonus-title {
            font-size: 16px;
          }
          .bonus-total {
            padding: 22px 20px;
          }
          .bonus-total-final {
            font-size: 26px;
          }
        }

        /* 다크모드는 별도 [data-theme="dark"] 오버라이드에서 처리 */

        /* === PRICING === */
        .pricing-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--bg-white);
          padding: 40px;
          border-radius: 20px;
          box-shadow: var(--card-shadow);
          margin-top: 56px;
        }
        .pricing-badge {
          background: var(--green-light);
          color: var(--green);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .pricing-original {
          font-size: 24px;
          color: var(--text-tertiary);
          text-decoration: line-through;
          font-weight: 500;
          margin-top: 8px;
        }
        .pricing-earlybird {
          margin-top: 16px;
          padding: 12px 20px;
          background: var(--bg-gray);
          border-radius: 8px;
          text-align: center;
          font-size: 13px;
          color: var(--text-secondary);
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
          background: #1A8D48;
          box-shadow: 0 4px 12px rgba(26, 141, 72, 0.2);
        }
        .pricing-addon {
          width: 100%;
          background: var(--bg-gray);
          border: 1.5px solid #e2e8f0;
          padding: 20px;
          border-radius: 12px;
          margin-top: 16px;
        }
        .pricing-addon.green {
          background: var(--bg-gray);
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
          background: var(--bg-white);
          padding: 32px;
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          transition: all 0.3s;
        }
        .rule-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
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
          background: var(--bg-white);
          padding: 28px;
          border-radius: 16px;
          box-shadow: var(--card-shadow);
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }
        .review-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        }
        .review-stars {
          font-size: 14px;
          color: #FFC107;
          margin-bottom: 16px;
          font-weight: 600;
          letter-spacing: 0;
        }

        /* === REVIEW STATS === */
        .review-stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          max-width: 880px;
          margin: 32px auto 48px auto;
        }
        .review-stat-card {
          background: var(--bg-white);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 24px 20px;
          text-align: center;
        }
        .review-stat-num {
          font-size: 30px;
          font-weight: 700;
          color: var(--green);
          letter-spacing: -0.025em;
          line-height: 1;
        }
        .review-stat-plus, .review-stat-unit {
          font-size: 18px;
          font-weight: 700;
          color: var(--green);
          margin-left: 2px;
        }
        .review-stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
          margin-top: 10px;
          letter-spacing: -0.005em;
        }
        @media (max-width: 720px) {
          .review-stats-row {
            grid-template-columns: 1fr 1fr;
          }
          .review-stat-card { padding: 18px 14px; }
          .review-stat-num { font-size: 24px; }
        }

        /* === REVIEW GRADE SHIFT === */
        .review-grade-shift {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          padding: 8px 14px;
          background: #F2F4F6;
          border-radius: 999px;
          width: fit-content;
        }
        .grade-before {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-tertiary);
          letter-spacing: 0.02em;
        }
        .grade-arrow {
          font-size: 13px;
          color: var(--green);
          font-weight: 700;
          line-height: 1;
        }
        .grade-after {
          font-size: 14px;
          font-weight: 800;
          color: var(--green);
          letter-spacing: 0.02em;
        }
        .review-text {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 22px;
          flex: 1;
        }
        .review-text b {
          color: var(--text-primary);
          font-weight: 700;
        }
        .review-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .review-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          color: var(--text-secondary);
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
          box-shadow: var(--card-shadow);
          background: var(--bg-white);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .photo-review-item:hover {
          transform: scale(1.03);
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
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
          font-size: 12px;
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
          background: var(--bg-white);
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
          background: var(--bg-white);
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

        /* FAQ important */
        .faq-important {
          border: 1px solid var(--border);
          background: var(--bg-white);
        }
        .faq-important .faq-question {
          background: var(--bg-white);
        }
        .faq-important .faq-question:hover {
          background: var(--bg-gray);
        }
        .faq-important.open {
          border-color: var(--border);
          box-shadow: var(--card-shadow);
        }
        .faq-important .faq-icon {
          color: var(--text-tertiary);
        }
        .faq-important .faq-answer {
          background: var(--bg-white);
        }
        .faq-badge {
          display: inline-block;
          background: #1A8D48;
          color: white;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          margin-right: 8px;
          vertical-align: middle;
        }

        /* === CTA BANNER === */
        .cta-banner {
          background: var(--green);
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
          background: var(--bg-white);
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
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
          background: var(--bg-white);
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
          background: #1A8D48;
        }

        /* === APPLICATION FORM MODAL === */
        .form-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6);
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 24px 20px;
          backdrop-filter: blur(4px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .form-modal-content {
          background: var(--bg-white);
          border-radius: 20px;
          max-width: 420px;
          width: 100%;
          position: relative;
          animation: modalSlideUp 0.3s ease;
          margin: auto 0;
        }
        .form-modal-wide {
          max-width: 560px;
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-modal-close {
          position: absolute;
          top: 16px; right: 16px;
          background: none; border: none;
          font-size: 20px; cursor: pointer;
          color: var(--text-tertiary); z-index: 1;
        }
        .form-modal-body {
          padding: 32px 28px;
        }
        .form-modal-body h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        /* Header badge (cycle + earlybird) */
        .form-header-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .form-cycle-badge {
          background: #F1F3F5;
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
        }
        .form-earlybird-badge {
          background: var(--green);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
        }
        .form-regular-badge {
          background: var(--green);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
        }

        /* Steps indicator */
        .form-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 8px;
        }
        .form-step-dot {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #E5E8EB;
          color: var(--text-tertiary);
          font-size: 13px; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s;
        }
        .form-step-dot.active {
          background: var(--green);
          color: #fff;
        }
        .form-step-line {
          width: 48px; height: 2px;
          background: #E5E8EB;
          transition: background 0.3s;
        }
        .form-step-line.active {
          background: var(--green);
        }
        .form-step-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-tertiary);
          margin-bottom: 24px;
          padding: 0 20px;
        }
        .form-step-labels span.active {
          color: var(--green);
          font-weight: 600;
        }
        .form-step-content h3 {
          text-align: center;
        }

        /* Form fields */
        .form-field {
          margin-bottom: 16px;
          text-align: left;
        }
        .form-field label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .form-field label .req {
          color: var(--red);
        }
        .form-field input[type="text"],
        .form-field input[type="email"],
        .form-field input[type="tel"],
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #E5E8EB;
          border-radius: 10px;
          font-size: 15px;
          transition: border-color 0.2s;
          outline: none;
          color: var(--text-primary);
          background: var(--bg-gray);
          box-sizing: border-box;
          font-family: inherit;
        }
        .form-field select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23222' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }
        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: var(--green);
          background: var(--bg-white);
        }
        .form-field textarea {
          resize: vertical;
          font-family: inherit;
        }

        /* Radio cards */
        .form-radio-group {
          display: flex;
          gap: 10px;
        }
        .form-radio-card {
          flex: 1;
          border: 1.5px solid #E5E8EB;
          border-radius: 12px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .form-radio-card.selected {
          border-color: var(--green);
          background: rgba(26,141,72,0.04);
        }
        .form-radio-card input { display: none; }
        .form-radio-inner strong {
          display: block;
          font-size: 15px;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .form-radio-inner span {
          font-size: 12px;
          color: var(--text-tertiary);
        }

        /* Plan cards */
        .form-plan-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }
        .form-plan-card {
          border: 2px solid #E5E8EB;
          border-radius: 14px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .form-plan-card.selected {
          border-color: var(--green);
          box-shadow: 0 0 0 1px var(--green);
        }
        .form-plan-card.bundle {
          border-color: #dbeafe;
          background: var(--bg-gray);
        }
        .form-plan-card.bundle.selected {
          border-color: var(--green);
          background: rgba(26,141,72,0.04);
        }
        .form-plan-card input { display: none; }
        .form-plan-badge {
          position: absolute;
          top: 0; right: 0;
          background: var(--green);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: 0 12px 0 10px;
        }
        .form-plan-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .form-plan-price {
          font-size: 24px;
          font-weight: 800;
          color: var(--green);
          margin-bottom: 4px;
        }
        .form-plan-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .form-bundle-stock {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #FEF2F2;
          color: var(--red);
          font-size: 12px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 12px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .form-bundle-stock.urgent {
          background: var(--red);
          color: #fff;
        }
        .form-stock-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .form-plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 4px;
        }
        .form-plan-original {
          font-size: 14px;
          color: var(--text-tertiary);
          text-decoration: line-through;
        }
        .form-plan-earlybird-tag {
          display: inline-block;
          background: var(--green);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .form-plan-save {
          font-size: 13px;
          color: var(--green);
          font-weight: 600;
          margin-bottom: 4px;
        }

        /* Value Stack (Hormozi) */
        .form-value-stack {
          background: var(--bg-gray);
          border: 1px solid #E5E8EB;
          border-radius: 10px;
          padding: 14px;
          margin: 10px 0;
        }
        .form-value-stack-title {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .form-value-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: var(--text-primary);
          padding: 5px 0;
        }
        .form-value-item.bonus {
          color: var(--green);
          font-weight: 600;
        }
        .form-value-price {
          text-decoration: line-through;
          color: var(--text-tertiary);
          font-size: 12px;
          white-space: nowrap;
          margin-left: 8px;
        }
        .form-value-item.bonus .form-value-price {
          text-decoration: none;
          color: var(--green);
        }
        .form-value-total {
          display: flex;
          justify-content: space-between;
          padding-top: 8px;
          margin-top: 6px;
          border-top: 1.5px dashed #ccc;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-tertiary);
        }
        .form-value-total span:last-child {
          text-decoration: line-through;
        }

        /* Bundle offer section */
        .form-bundle-offer {
          text-align: center;
          padding: 12px 0 8px;
        }
        .form-bundle-offer-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .form-bundle-offer .form-plan-price {
          font-size: 28px;
        }

        /* Bundle why */
        .form-bundle-why {
          background: var(--bg-gray);
          border-radius: 8px;
          padding: 10px 12px;
          margin-top: 8px;
        }
        .form-bundle-why p {
          font-size: 12px;
          color: #15803d;
          margin: 0;
          line-height: 1.5;
          font-weight: 500;
        }

        /* Bonus box */
        .form-bonus-box {
          background: var(--bg-gray);
          border: 1.5px solid #FCD34D;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .form-bonus-title {
          font-size: 13px;
          font-weight: 700;
          color: #92400E;
          margin-bottom: 8px;
        }
        .form-bonus-item {
          font-size: 12px;
          color: #78350F;
          padding: 3px 0 3px 18px;
          position: relative;
          line-height: 1.5;
        }
        .form-bonus-item::before {
          content: '🎁';
          position: absolute;
          left: 0;
          font-size: 12px;
        }
        .form-plan-desc {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 10px;
        }
        .form-plan-features {
          list-style: none;
          padding: 0; margin: 0;
        }
        .form-plan-features li {
          font-size: 13px;
          color: var(--text-secondary);
          padding: 3px 0 3px 20px;
          position: relative;
        }
        .form-plan-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--green);
          font-weight: 700;
        }

        /* Target class guide */
        .form-target-guide {
          background: var(--bg-gray);
          border: 1px solid #E5E8EB;
          border-radius: 10px;
          padding: 14px 16px;
          margin-top: 10px;
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
        }
        .form-target-guide p {
          margin: 0 0 6px;
        }
        .form-target-guide p:last-of-type {
          margin-bottom: 8px;
        }
        .form-target-guide strong {
          color: var(--text-primary);
        }
        .form-target-tip {
          color: var(--green) !important;
          font-weight: 600;
          font-size: 12px !important;
          margin: 0 !important;
          padding-top: 8px;
          border-top: 1px solid #E5E8EB;
        }

        /* Upgrade detail */
        .form-upgrade-detail {
          margin-top: 8px;
          margin-left: 28px;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .form-upgrade-detail p {
          margin: 4px 0 0;
        }
        .form-upgrade-value {
          display: inline-block;
          background: var(--green);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Option boxes */
        .form-option-box {
          background: var(--bg-gray);
          border: 1px solid #E5E8EB;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .form-option-box.highlight {
          background: var(--bg-gray);
          border-color: #FBBF24;
        }
        .form-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          font-size: 14px;
          color: var(--text-primary);
        }
        .form-checkbox-label input[type="checkbox"] {
          margin-top: 2px;
          width: 18px; height: 18px;
          accent-color: var(--green);
          flex-shrink: 0;
        }

        /* Price summary */
        .form-price-summary {
          background: var(--bg-gray);
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
        }
        .form-price-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: var(--text-secondary);
          padding: 6px 0;
        }
        .form-price-row.discount {
          color: var(--green);
        }
        .form-price-total {
          display: flex;
          justify-content: space-between;
          padding-top: 12px;
          margin-top: 8px;
          border-top: 1.5px solid #E5E8EB;
          font-size: 16px;
        }
        .form-price-total strong {
          color: var(--green);
          font-size: 20px;
        }

        /* Deposit box */
        .form-deposit-box {
          background: var(--bg-gray);
          border: 1.5px solid #BBF7D0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 16px;
          text-align: center;
        }
        .form-deposit-amount {
          margin-bottom: 16px;
        }
        .form-deposit-amount span {
          display: block;
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }
        .form-deposit-amount strong {
          font-size: 28px;
          font-weight: 800;
          color: var(--green);
        }
        .form-deposit-info {
          text-align: left;
          margin-bottom: 12px;
        }
        .form-deposit-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #E5E8EB;
          font-size: 14px;
        }
        .form-deposit-row span { color: var(--text-tertiary); }
        .form-deposit-row strong { color: var(--text-primary); }
        .form-copy-btn {
          width: 100%;
          padding: 10px;
          background: var(--green);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .form-copy-btn:hover {
          background: #1A8D48;
        }

        /* Card payment box */
        .form-card-payment-box {
          margin-top: 14px;
          padding: 18px 20px;
          background: #F5FBF7;
          border: 1px solid #D6E9DC;
          border-radius: 12px;
        }
        .form-card-payment-title {
          font-size: 14px;
          font-weight: 700;
          color: #1A8D48;
          margin-bottom: 6px;
          letter-spacing: -0.01em;
        }
        .form-card-payment-desc {
          font-size: 13px;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 12px 0;
        }
        .form-card-payment-prices {
          background: #FFFFFF;
          border: 1px solid #E5EBE7;
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 12px;
        }
        .form-card-price-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding: 4px 0;
        }
        .form-card-price-row span {
          color: var(--text-secondary);
        }
        .form-card-price-row strong {
          color: var(--text-primary);
          font-weight: 700;
          font-feature-settings: "tnum";
        }
        .form-card-payment-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #1A8D48;
          text-decoration: none;
          padding: 6px 0;
        }
        .form-card-payment-cta:hover {
          text-decoration: underline;
        }
        [data-theme="dark"] .form-card-payment-box { background: #15201A; border-color: #1F3A2A; }
        [data-theme="dark"] .form-card-payment-title { color: #22C55E; }
        [data-theme="dark"] .form-card-payment-prices { background: #1A1F26; border-color: #2A3340; }
        [data-theme="dark"] .form-card-payment-cta { color: #22C55E; }

        /* Summary box (success) */
        .form-summary-box {
          background: var(--bg-gray);
          border-radius: 12px;
          padding: 16px;
          margin: 20px 0 0;
          text-align: left;
        }
        .form-summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
          border-bottom: 1px solid #eee;
        }
        .form-summary-row:last-child { border: none; }
        .form-summary-row span { color: var(--text-tertiary); }

        /* Buttons */
        .form-btn-primary {
          width: 100%;
          padding: 14px;
          background: var(--green);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .form-btn-primary:hover {
          background: #1A8D48;
        }
        .form-btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        .form-btn-secondary {
          flex: 1;
          padding: 14px;
          background: #F1F3F5;
          color: var(--text-primary);
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .form-btn-secondary:hover {
          background: #E5E8EB;
        }
        .form-btn-row {
          display: flex;
          gap: 10px;
          margin-top: 16px;
        }
        .form-btn-row .form-btn-primary {
          flex: 2;
        }

        /* Selected summary (step 3) */
        .form-selected-summary {
          background: var(--bg-gray);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }
        .form-selected-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          padding: 4px 0;
          color: var(--text-tertiary);
        }
        .form-selected-row strong {
          color: var(--text-primary);
        }

        /* Earlybird notice */
        .form-earlybird-notice {
          text-align: center;
          font-size: 12px;
          color: var(--green);
          font-weight: 500;
          margin: 8px 0 0;
          padding: 8px;
          background: var(--green-light);
          border-radius: 8px;
        }

        /* Error & note */
        .form-error {
          background: #FEF2F2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          margin: 12px 0;
          text-align: center;
        }
        .form-note {
          font-size: 12px;
          color: var(--text-tertiary);
          line-height: 1.5;
          margin: 12px 0 0;
        }

        /* === STATS SECTION === */
        .stats-section {
          padding: 80px 0;
          background: #191F28;
          color: white;
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
          color: var(--green);
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
          background: var(--bg-white);
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
          background: var(--green);
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
          color: var(--green);
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
            font-size: 28px;
          }
          .countdown-num {
            font-size: 20px;
            min-width: 40px;
            padding: 6px 10px;
          }
          .countdown-sep {
            font-size: 20px;
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
          .compare-scroll-hint {
            display: block !important;
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
          .form-modal-overlay {
            padding: 12px 10px;
          }
          .form-modal-content.form-modal-wide {
            max-width: 100%;
          }
          .form-modal-body {
            padding: 24px 20px;
          }
          .form-radio-group {
            flex-direction: column;
          }
          .form-plan-price {
            font-size: 20px;
          }
          .form-deposit-amount strong {
            font-size: 24px;
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
            <a href="#bonuses">보너스</a>
            <a href="#pricing">가격</a>
            <a href="#guarantee">성적 보증</a>
            <a href="#reviews">후기</a>
            <a href="#faq">FAQ</a>
            <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#FEE500',color:'#191919',padding:'6px 12px',borderRadius:'8px',fontWeight:700}}>
              <svg viewBox="0 0 256 256" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919"/></svg>
              단톡방
            </a>
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="다크모드 전환" style={{marginRight:'8px'}}>
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button onClick={() => openFormModal()} className="nav-cta">
            지금 신청하기
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-top-group">
          <div className="hero-badge">
            <span className="dot"></span>
            {countdown.nextDate} 시작 · {currentCycleState.isEarlyBird ? `얼리버드 모집 중 (${currentCycleState.earlyBirdEndStr}까지)` : '선착순 모집 중'}
          </div>
          <div className="countdown-box">
            <div className="countdown-label">{countdown.label}</div>
            {countdown.days === 0 && countdown.hours === 0 && countdown.mins === 0 && countdown.secs === 0 ? (
              <div className="countdown-closed">모집 마감 — 다음 기수를 기다려주세요!</div>
            ) : (
              <div className="countdown-timer">
                <div className="countdown-unit">
                  <div className="countdown-num">{String(countdown.days).padStart(2, '0')}</div>
                  <div className="countdown-unit-label">일</div>
                </div>
                <span className="countdown-sep">:</span>
                <div className="countdown-unit">
                  <div className="countdown-num">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="countdown-unit-label">시간</div>
                </div>
                <span className="countdown-sep">:</span>
                <div className="countdown-unit">
                  <div className="countdown-num">{String(countdown.mins).padStart(2, '0')}</div>
                  <div className="countdown-unit-label">분</div>
                </div>
                <span className="countdown-sep">:</span>
                <div className="countdown-unit">
                  <div className="countdown-num">{String(countdown.secs).padStart(2, '0')}</div>
                  <div className="countdown-unit-label">초</div>
                </div>
              </div>
            )}
          </div>
          </div>
          <h1>
            <span className="accent">14일 AL 완성</span><br />
            부트캠프
          </h1>
          <p className="hero-tagline-strong">
            2주가 당신의 연봉을 바꿀 수도 있습니다.
          </p>
          <p className="subtitle">
            OPIc AL은 4대 공기업 합격선, 대기업 영어 가산점, 외국계 첫 면접 통과 — 누구에게나 같은 한 줄짜리 자격증입니다.<br />
            <strong>14일 동안 코치와 AI가 매일 당신의 답변을 직접 분석합니다.</strong>
          </p>

          {/* QUEUE COUNTER */}
          <div className="queue-box">
            <div className="queue-label">한 기수 단 20명 {currentCycleState.isEarlyBird && <span style={{color:'var(--green)',fontWeight:700}}>· 얼리버드 {currentCycleState.earlyBirdEndStr}까지</span>}</div>
            <div className="queue-progress-bar">
              <div className="queue-progress-fill" style={{ width: `${((totalSlots - remainingSlots) / totalSlots) * 100}%` }}></div>
            </div>
            <div className="queue-stats">
              <span>현재 신청: {totalSlots - remainingSlots}명</span>
              <span>남은 자리: <strong>{remainingSlots}명</strong></span>
            </div>
            <div className="queue-sub">
              <span className="live-dot"></span>
              실시간 업데이트 · 마감 임박
            </div>
          </div>

          <div className="hero-cta-group">
            <button onClick={() => openFormModal()} className="btn-primary">
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
            <div className="section-title">왜 4,000명이 식빵영어를 선택했을까요?</div>
            <p className="section-desc">2주 만에 등급이 바뀌는 데는 이유가 있습니다.</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">2주</div>
              <h3>학원 4주 → 우리는 2주</h3>
              <p>학원에서 1달 걸리는 과정을 구조화된 시스템으로 2주에 끝냅니다. 출제되지 않는 건 다루지 않고, 기출 패턴만 역설계한 커리큘럼이니까요. 시간을 절반으로 아껴드립니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">코칭</div>
              <h3>전문 코치 + AI 이중 분석</h3>
              <p>삼성·LG 초청 OPIc 전문 강사가 매일 1:1 음성 피드백을 주고, AI가 발음·유창성·문법 등 7개 영역을 수치로 분석해 약점을 정확히 짚어줍니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">공식</div>
              <h3>즉답 프레임워크</h3>
              <p>어떤 돌발 질문이 나와도 바로 답변을 시작하는 구조화된 스피킹 공식. 암기가 아닌 반복 체화 훈련으로, 시험장에서 머릿속이 백지가 되는 일을 없앱니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">3인</div>
              <h3>3인 1팀, 수료율 94%</h3>
              <p>일반 인강 완강률 12%. 식빵영어는 매일 팀원과 실전 롤플레이를 하기 때문에 중도 포기가 구조적으로 불가능합니다. 결과는 수료율 94%로 증명됩니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">성과</div>
              <h3>평균 2등급 상승</h3>
              <p>누적 수강생 4,000명, 실제 후기 1,000건 이상. 매 기수 평균 2등급 상승이라는 결과가 반복되고 있습니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">보증</div>
              <h3>성적 보증제</h3>
              <p>조건을 100% 이행했는데 등급이 안 올랐다면 다음 기수를 무료로 재수강할 수 있습니다. 그만큼 결과에 자신 있습니다. <a href="#guarantee" style={{color:'var(--green)',fontWeight:600,textDecoration:'underline',textUnderlineOffset:'3px'}}>자세히 보기</a></p>
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
              <div className="stat-sub">14일 부트캠프 수료생 기준</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2↑</div>
              <div className="stat-label">평균 등급 상승</div>
              <div className="stat-sub">IM2→IH, IL→IM 등</div>
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
                  <strong>Day 6</strong> 7 Core Templates 완전 암기 최종 점검. 복합 템플릿 2개 이상 자연스럽게 조합 연습. 팀원 상호 QA 즉답 훈련. SpeakCoach AI 발음/흐름 진단.
                </div>
                <div className="cur-day">
                  <strong>Day 7</strong> 비공개 모의고사 영상 1차 풀이(녹음) + SpeakCoach AI 전체 분석. 구조/속도/발음 교정 시작. 유형별 표현 완벽 암기(2차 피드백 세션 테스트 대비).
                </div>
              </div>
            </div>
            {/* Phase 2 */}
            <div className="cur-week active">
              <div className="cur-week-dot"></div>
              <div className="cur-week-label">PHASE 2 - 롤플레이와 돌발</div>
              <h3>Day 8-10 : RP 상황 처리 공식 + 돌발 질문 대응력 완성</h3>
              <p>롤플레이와 돌발 질문을 무서운 파트에서 공식으로 해결하는 파트로 바꿉니다. 롤플레이가 나오면 이건 이 공식이구나 하고 자동 반응하는 상태를 목표로 합니다.</p>
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
                color: 'var(--green)',
                border: '2px solid var(--green)',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseOver={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = '#1A8D48'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#1A8D48'; }}
            >
              📋 상세 커리큘럼 보기
            </a>
          </div>
        </div>
      </section>

      {/* DAILY FLOW */}
      <section className="section" id="daily" style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title" style={{ fontSize: '32px' }}>하루 한 개, 이것만 하면 됩니다</div>
            <p className="section-desc">매일 1개 미션을 수행하면, 분석과 피드백은 코치와 AI가 담당합니다.</p>
          </div>
          <div className="why-grid" style={{ marginTop: '56px' }}>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: 'var(--border)' }}>1</div>
              <h3>학습 + 녹음</h3>
              <p>오전 8시에 그날의 토픽이 공개됩니다. 프레임에 맞춰 답변을 구성해서 SpeakCoach AI에 녹음 제출.</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: 'var(--border)' }}>2</div>
              <h3>AI 분석 + 코치 교정</h3>
              <p>AI가 발음·문법·유창성을 수치로 분석하고, 담당 코치가 직접 들으며 개선점을 카톡에 공유합니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon" style={{ fontSize: '32px', marginBottom: '20px', fontWeight: 800, color: 'var(--border)' }}>3</div>
              <h3>재연습 + 팀 자극</h3>
              <p>피드백을 바탕으로 같은 질문을 2~3회 재녹음. 팀원들의 답변도 공유되어 자연스럽게 자극받게 됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY-SIKBANG — 비교 불가능한 오퍼 */}
      <section className="section section-gray" id="why-sikbang" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title" style={{ fontSize: '32px' }}>학원도, 인강도, 그룹 스터디도 아닙니다.</div>
            <p className="section-desc">한국에서 단 하나뿐인 14일 AL 완성 부트캠프.</p>
          </div>

          <div className="vs-grid">
            <div className="vs-col">
              <div className="vs-tag">학원</div>
              <div className="vs-fact">강사 한 명이 100명을 가르칩니다</div>
              <p className="vs-issue">그래서 내 약점이 무엇인지 강사는 알 수 없습니다.</p>
            </div>
            <div className="vs-col">
              <div className="vs-tag">인강</div>
              <div className="vs-fact">녹화된 영상을 혼자 봅니다</div>
              <p className="vs-issue">그래서 내가 어디서 막혔는지 영상은 알려주지 않습니다.</p>
            </div>
            <div className="vs-col">
              <div className="vs-tag">그룹 스터디</div>
              <div className="vs-fact">함께 모여 응원을 나눕니다</div>
              <p className="vs-issue">그런데 정작 어떻게 해야 AL이 나오는지는 아무도 모릅니다.</p>
            </div>
            <div className="vs-col vs-col-highlight">
              <div className="vs-tag vs-tag-highlight">14일 AL 완성 부트캠프</div>
              <div className="vs-fact vs-fact-highlight">대표가 매일 당신의 답변을 직접 듣고 분석합니다</div>
              <p className="vs-issue vs-issue-strong">
                그래서 <b>수강생 94퍼센트를 목표 성적에 도달시킨 안준영 대표</b>가 매일 당신의 녹음을 직접 듣고, 그가 OPIc 채점 기준으로 만든 <b>SpeakCoach AI</b>가 동시에 분석합니다.
              </p>
            </div>
          </div>

          <div className="vs-stats">
            <div className="vs-stat">
              <div className="vs-stat-num">4,000<span className="vs-stat-plus">명</span></div>
              <div className="vs-stat-label">OPIc 부트캠프 누적 수강생</div>
            </div>
            <div className="vs-stat">
              <div className="vs-stat-num">2<span className="vs-stat-unit">등급</span></div>
              <div className="vs-stat-label">2주 후 평균 등급 상승</div>
            </div>
            <div className="vs-stat">
              <div className="vs-stat-num">94<span className="vs-stat-unit">퍼센트</span></div>
              <div className="vs-stat-label">수료율</div>
            </div>
            <div className="vs-stat">
              <div className="vs-stat-num">20<span className="vs-stat-unit">명</span></div>
              <div className="vs-stat-label">한 기수 정원</div>
            </div>
          </div>

          <div className="vs-conclusion">
            한국에 없는 조합. 식빵영어가 만들었습니다.
          </div>
        </div>
      </section>

      {/* COMPARE — 기존 비교 테이블 */}
      <section className="compare-section" style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title" style={{ fontSize: '32px' }}>같은 2주, 다른 결과</div>
            <p className="section-desc">한 줄씩 비교해보세요.</p>
          </div>
          <div className="compare-scroll-hint" style={{display:'none',textAlign:'center',fontSize:'13px',color:'var(--text-tertiary)',marginBottom:'8px'}}>👆 좌우로 스크롤해서 비교하세요</div>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th></th>
                  <th>인강</th>
                  <th>학원</th>
                  <th className="highlight-col">식빵영어 부트캠프</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>학습 구조</td>
                  <td>영상 시청 위주</td>
                  <td>강사 커리큘럼</td>
                  <td className="highlight-col">14일 프레임워크 시스템</td>
                </tr>
                <tr>
                  <td>스피킹 연습</td>
                  <td className="compare-x">✕</td>
                  <td>수업 시간만</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 매일 녹음 + AI 분석</td>
                </tr>
                <tr>
                  <td>코치 피드백</td>
                  <td className="compare-x">✕</td>
                  <td>제한적</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 매일 녹음 교정 + 1:3 피드백</td>
                </tr>
                <tr>
                  <td>AI 발음/문법 분석</td>
                  <td className="compare-x">✕</td>
                  <td className="compare-x">✕</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> SpeakCoach AI 제공</td>
                </tr>
                <tr>
                  <td>동기부여</td>
                  <td>혼자 → 완강률 낮음</td>
                  <td>출석만 하면 됨</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 3인 팀 + 매일 과제</td>
                </tr>
                <tr>
                  <td>모의고사</td>
                  <td>별도 구매</td>
                  <td>포함</td>
                  <td className="highlight-col"><span className="compare-check">✓</span> 비공개 모의고사 영상 7개</td>
                </tr>
                <tr>
                  <td>비용</td>
                  <td>10~30만원</td>
                  <td>40~80만원</td>
                  <td className="highlight-col"><span style={{textDecoration:'line-through',color:'var(--text-tertiary)',fontSize:'13px'}}>329,000원</span> → <strong>{currentCycleState.price.toLocaleString()}원</strong> {currentCycleState.isEarlyBird && <span style={{color:'var(--green)',fontSize:'12px'}}>(얼리버드)</span>}</td>
                </tr>
                <tr>
                  <td>평균 소요 기간</td>
                  <td>1~2개월</td>
                  <td>1개월</td>
                  <td className="highlight-col"><strong>2주</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>


      {/* REVIEWS */}
      <section className="section section-gray" id="reviews">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">2주 후, 이런 결과가 나왔습니다</div>
            <p className="section-desc">실제 수료생 등급 변화 데이터입니다.</p>
          </div>

          {/* Review Stats */}
          <div className="review-stats-row">
            <div className="review-stat-card">
              <div className="review-stat-num">4,000<span className="review-stat-plus">+</span></div>
              <div className="review-stat-label">누적 수강생</div>
            </div>
            <div className="review-stat-card">
              <div className="review-stat-num">2<span className="review-stat-unit">등급</span></div>
              <div className="review-stat-label">평균 등급 상승</div>
            </div>
            <div className="review-stat-card">
              <div className="review-stat-num">94<span className="review-stat-unit">%</span></div>
              <div className="review-stat-label">목표 등급 달성률</div>
            </div>
            <div className="review-stat-card">
              <div className="review-stat-num">5.0<span className="review-stat-unit">/5</span></div>
              <div className="review-stat-label">수료생 만족도</div>
            </div>
          </div>

          <div className="review-scroll-wrap">
            <div className="review-scroll" ref={reviewScrollRef}>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IM3</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">IH</span>
                </div>
                <div className="review-text">
                  2주 만에 IM3에서 IH로 올랐어요. <b>프레임워크가 진짜 효과 있었습니다.</b> 답변할 때 구조가 잡히니까 자신감이 다릅니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">K</div>
                  <div>
                    <div className="review-name">김*현</div>
                    <div className="review-info">대학생 · 14일 부트캠프</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IM3</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">AL</span>
                </div>
                <div className="review-text">
                  AI로 매일 연습하고, 부트캠프에서 피드백 받으니까 <b>내 약점이 정확히 보였어요.</b> 결국 AL 받았습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">L</div>
                  <div>
                    <div className="review-name">이*준</div>
                    <div className="review-info">취준생 · 부트캠프와 AI</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IM2</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">IH</span>
                </div>
                <div className="review-text">
                  직장 다니면서 준비하기 힘들었는데 <b>2주라서 집중할 수 있었어요.</b> 매일 과제 내는 게 핵심인 것 같아요.
                </div>
                <div className="review-author">
                  <div className="review-avatar">P</div>
                  <div>
                    <div className="review-name">박*영</div>
                    <div className="review-info">직장인 · 승진 준비</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IL</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">IM2</span>
                </div>
                <div className="review-text">
                  혼자 했으면 절대 못 했을 거예요. <b>3명이니까 서로 자극도 되고 포기할 수가 없었어요.</b> IL에서 IM2 찍었습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">J</div>
                  <div>
                    <div className="review-name">정*아</div>
                    <div className="review-info">대학생 · 14일 부트캠프</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IH</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">AL</span>
                </div>
                <div className="review-text">
                  인강으로 기본기 잡고 부트캠프에서 실전 연습하니까 <b>시너지가 대단했어요.</b> IH 목표였는데 AL이 나왔습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">L</div>
                  <div>
                    <div className="review-name">이*민</div>
                    <div className="review-info">직장인 · 실전 준비</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IM1</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">IM2</span>
                </div>
                <div className="review-text">
                  AI 피드백이 이렇게 정확할 줄 몰랐어요. <b>매일 내 발음과 문법 실수를 바로 지적</b>해주니까 빠르게 개선됐습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">C</div>
                  <div>
                    <div className="review-name">최*리</div>
                    <div className="review-info">대학원생 · 유학 준비</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IM2</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">IH</span>
                </div>
                <div className="review-text">
                  온라인이라고 걱정했는데 <b>카톡 채팅과 공유로 충분</b>했어요. 팀원들이 열심히 하니까 저도 자연스럽게 따라갔습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">H</div>
                  <div>
                    <div className="review-name">한*수</div>
                    <div className="review-info">직장인 · 온라인 진행</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IH</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">AL</span>
                </div>
                <div className="review-text">
                  3년째 IH에 막혀 있었는데 <b>2주 만에 AL을 받았습니다.</b> 코치가 제 답변의 문제점을 정확히 짚어줘서 충격이었어요.
                </div>
                <div className="review-author">
                  <div className="review-avatar">S</div>
                  <div>
                    <div className="review-name">송*환</div>
                    <div className="review-info">직장인 · 재시험</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">NL</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">IM1</span>
                </div>
                <div className="review-text">
                  영어 왕초보였는데 <b>한 줄도 못 하던 제가 1분을 채울 수 있게 됐어요.</b> 1대1 회화 클래스도 같이 들었더니 효과가 컸습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">Y</div>
                  <div>
                    <div className="review-name">윤*지</div>
                    <div className="review-info">취준생 · 왕초보 출발</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IM2</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">AL</span>
                </div>
                <div className="review-text">
                  공기업 합격 마지노선이 IH였는데 <b>AL을 받았어요.</b> 즉답 프레임워크 9선이 시험장에서 진짜 큰 도움이 됐습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">N</div>
                  <div>
                    <div className="review-name">남*우</div>
                    <div className="review-info">취준생 · 공기업 준비</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IH</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">AL</span>
                </div>
                <div className="review-text">
                  롤플 3콤보가 항상 약점이었는데 <b>Plan A·B·C 구조로 풀이</b>하니까 답변이 자연스러워졌어요. 처음 받은 AL입니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">B</div>
                  <div>
                    <div className="review-name">백*경</div>
                    <div className="review-info">대학생 · 롤플 약점</div>
                  </div>
                </div>
              </div>
              <div className="review-card">
                <div className="review-grade-shift">
                  <span className="grade-before">IM2</span>
                  <span className="grade-arrow">▶</span>
                  <span className="grade-after">IH</span>
                </div>
                <div className="review-text">
                  매일 미션 100% 채우면서 <b>제가 영어를 좋아한다는 걸 다시 깨달았어요.</b> 점수보다 그게 더 큰 수확이었습니다.
                </div>
                <div className="review-author">
                  <div className="review-avatar">G</div>
                  <div>
                    <div className="review-name">고*은</div>
                    <div className="review-info">직장인 · 자기계발</div>
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
      {/* GUARANTEE */}
      <section className="section" id="guarantee">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">두 가지 보증, 한 가지 약속</div>
            <p className="section-desc">대표님이 손해 볼 구조가 아닙니다. 손해는 식빵영어가 부담합니다.</p>
          </div>

          {/* 무조건 보증 — 1차 피드백 환불 (NEW) */}
          <div className="guarantee-headline-card">
            <div className="guarantee-tag">무조건 보증</div>
            <h3 className="guarantee-headline">1차 피드백 듣고 환불 가능</h3>
            <p className="guarantee-body">
              개강 후 첫 1대1 피드백 (보통 Day 1부터 Day 3 안에 진행)을 받으신 뒤, 만족스럽지 않으면 환불해드립니다. <b>이유는 묻지 않습니다.</b>
            </p>
            <div className="guarantee-refund-row">
              <div className="guarantee-refund-cell">
                <div className="guarantee-refund-label">환불 가능 금액</div>
                <div className="guarantee-refund-value">코칭 비용 전액</div>
              </div>
              <div className="guarantee-refund-cell">
                <div className="guarantee-refund-label">차감 항목</div>
                <div className="guarantee-refund-value">교재비 30,000원 + AI 41,900원</div>
              </div>
              <div className="guarantee-refund-cell">
                <div className="guarantee-refund-label">신청 기간</div>
                <div className="guarantee-refund-value">1차 피드백 일정 이전까지</div>
              </div>
            </div>
            <div className="guarantee-note">1차 피드백 일정은 카톡방 입장 시 안내됩니다. 일정 이후에는 환불이 불가합니다.</div>
          </div>

          {/* 조건부 보증 — 등급 미향상 시 무료 재수강 */}
          <div style={{ textAlign: 'center', marginTop: '56px' }}>
            <div className="guarantee-tag" style={{ display: 'inline-block', marginBottom: '12px' }}>조건부 보증</div>
            <div className="section-title" style={{ fontSize: '28px' }}>14일 미션 100% 완료 후 등급 미향상 시</div>
            <p className="section-desc">다음 기수를 무료로 다시 수강하세요.</p>
          </div>

          {/* 보증 내용 카드 2개 - why-card 재사용 */}
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginTop: '48px' }}>
            <div className="why-card">
              <div className="why-icon">무료</div>
              <h3>다음 기수 무료 재수강</h3>
              <p>교재비 면제, AI 이용비만 별도 결제. 승인 후 직후 기수에 사용해야 합니다.</p>
            </div>
            <div className="why-card">
              <div className="why-icon">분석</div>
              <h3>1:1 약점 분석 리포트</h3>
              <p>1차 수강 데이터 기반으로 코치가 작성. 재수강 시 약점만 집중 공략합니다.</p>
            </div>
          </div>

          {/* 보증 조건 - rules-grid 재사용 */}
          <div style={{ marginTop: '64px' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="section-title" style={{ fontSize: '24px' }}>보증 조건</div>
              <p className="section-desc">아래 5가지를 전부 충족해야 합니다.</p>
            </div>
            <div className="rules-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="rule-card">
                <div className="rule-num">01</div>
                <div>
                  <h4>과제 100% 제출 + 암기 확인 통과</h4>
                  <p>매 피드백 시 랜덤 3문장 구술 테스트. 1회라도 미통과 시 보증 미적용.</p>
                </div>
              </div>
              <div className="rule-card">
                <div className="rule-num">02</div>
                <div>
                  <h4>부트캠프 100% 참석</h4>
                  <p>10분 초과 지각, 조기 퇴장, 무단 불참은 미참석 처리.</p>
                </div>
              </div>
              <div className="rule-card">
                <div className="rule-num">03</div>
                <div>
                  <h4>1:3 코치 피드백 100% 참석</h4>
                  <p>사전 통보 없는 불참은 미참석 처리.</p>
                </div>
              </div>
              <div className="rule-card">
                <div className="rule-num">04</div>
                <div>
                  <h4>종료 후 2주 내 OPIc 응시</h4>
                  <p>미응시 시 보증 자격 자동 소멸.</p>
                </div>
              </div>
              <div className="rule-card">
                <div className="rule-num">05</div>
                <div>
                  <h4>공식 성적표 + 수험번호 제출</h4>
                  <p>응시일로부터 30일 이내. 진위 확인 검증이 진행될 수 있습니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 적용 기준 테이블 - compare-table 재사용 */}
          <div style={{ marginTop: '64px' }}>
            <table className="compare-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th className="highlight-col">기준</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>적용 대상</td>
                  <td className="highlight-col">6개월 내 OPIc 성적표 보유자 (수강 전 제출 필수)</td>
                </tr>
                <tr>
                  <td>시행 시기</td>
                  <td className="highlight-col"><strong>2025년 5월 15일 기수</strong>부터 (소급 불가)</td>
                </tr>
                <tr>
                  <td>향상 기준</td>
                  <td className="highlight-col">ACTFL 1단계 이상 상승 (NH→IL→IM1→IM2→IM3→IH→AL→AH)</td>
                </tr>
                <tr>
                  <td>시험 유형</td>
                  <td className="highlight-col">사전·사후 동일 유형(일반/Business) 필수</td>
                </tr>
                <tr>
                  <td>보증 횟수</td>
                  <td className="highlight-col">1인 1회, 직후 기수 필수 사용, 양도 불가</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 청구 절차 - why-card 재사용 */}
          <div style={{ marginTop: '64px' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="section-title" style={{ fontSize: '24px' }}>청구 절차</div>
              <p className="section-desc">심사는 접수일로부터 14영업일 이내에 완료됩니다.</p>
            </div>
            <div className="why-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '0' }}>
              <div className="why-card">
                <div className="why-icon" style={{ fontSize: '28px' }}>1</div>
                <h3>청구 신청</h3>
                <p>온라인 청구 폼 작성</p>
              </div>
              <div className="why-card">
                <div className="why-icon" style={{ fontSize: '28px' }}>2</div>
                <h3>서류 제출</h3>
                <p>사전·사후 성적표, 수험번호, 신분증</p>
              </div>
              <div className="why-card">
                <div className="why-icon" style={{ fontSize: '28px' }}>3</div>
                <h3>심사</h3>
                <p>성적표 진위 및 조건 충족 검토</p>
              </div>
              <div className="why-card">
                <div className="why-icon" style={{ fontSize: '28px' }}>4</div>
                <h3>재수강 배정</h3>
                <p>직후 기수 자동 배정</p>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <a href="/guarantee-claim" style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'var(--green, #1A8D48)',
                color: 'white',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
              }}>
                보증 청구하기 →
              </a>
            </div>
          </div>

          {/* 부정행위 경고 + 전문 - faq-item 재사용 */}
          <div className="faq-list" style={{ marginTop: '64px' }}>
            <div className={`faq-item faq-important ${openGuaranteeFaq === 0 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenGuaranteeFaq(openGuaranteeFaq === 0 ? null : 0)}>
                <span><span className="faq-badge">필독</span>부정행위 및 허위 서류 제출 경고</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: openGuaranteeFaq === 0 ? '800px' : '0' }}>
                <div className="faq-answer-content" style={{ whiteSpace: 'pre-line' }}>
                  성적표 위조·변조, 타인 성적표 제출, 허위 기재, 대리 응시 등은 부정행위로 간주됩니다.{'\n\n'}
                  <strong>적발 시:</strong> 보증 영구 박탈, 전 프로그램 이용 제한, 민사 손해배상, 형법 제231조(사문서위조)·제234조(위조사문서행사)에 따른 형사 고발.{'\n\n'}
                  부정행위 의심 시 추가 증빙(성적 조회 사이트 화면 녹화 등)을 요청할 수 있으며, 정당한 사유 없이 거부 시 부정행위로 간주합니다.
                </div>
              </div>
            </div>

            <div className={`faq-item ${openGuaranteeFaq === 1 ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => setOpenGuaranteeFaq(openGuaranteeFaq === 1 ? null : 1)}>
                <span>보증 정책 전문 보기</span>
                <span className="faq-icon">+</span>
              </button>
              <div className="faq-answer" style={{ maxHeight: openGuaranteeFaq === 1 ? '3000px' : '0' }}>
                <div className="faq-answer-content" style={{ whiteSpace: 'pre-line' }}>
                  <strong>제1조 (목적)</strong>{'\n'}
                  본 정책은 식빵영어(이하 &quot;회사&quot;)가 운영하는 &quot;14일 AL 완성 부트캠프&quot; 수강생에게 제공하는 성적 보증 제도의 적용 조건, 보증 내용, 청구 절차 및 제한 사항을 규정합니다.{'\n\n'}
                  <strong>제2조 (적용 대상)</strong>{'\n'}
                  1. 최근 6개월 이내 OPIc 공식 성적표 보유 및 부트캠프 시작 전 제출자{'\n'}
                  2. 2025년 5월 15일 기수 이후 등록자{'\n'}
                  3. 수강 등록 시 본 정책 동의자{'\n\n'}
                  <strong>제3조 (보증 조건)</strong>{'\n'}
                  1. 14일간 과제 100% 제출 및 매 피드백 시 암기 확인 통과{'\n'}
                  2. 정규 부트캠프 세션 100% 참석 (10분 초과 지각·조기 퇴장·무단 불참 = 미참석){'\n'}
                  3. 1:3 코치 피드백 세션 100% 참석{'\n'}
                  4. 종료 후 2주 이내 OPIc 응시{'\n'}
                  5. 시험 응시일로부터 30일 이내 공식 성적표 및 수험번호 제출{'\n\n'}
                  <strong>제4조 (성적 향상 판단 기준)</strong>{'\n'}
                  1. 수강 전 대비 1단계 이상 등급 상승 = &quot;성적 향상&quot;{'\n'}
                  2. ACTFL 공식 기준 (NH → IL → IM1 → IM2 → IM3 → IH → AL → AH){'\n'}
                  3. 동일 등급 유지 또는 하락 = &quot;미향상&quot;{'\n'}
                  4. 사전·사후 시험 유형 동일 필수{'\n\n'}
                  <strong>제5조 (보증 내용)</strong>{'\n'}
                  1. 승인일 기준 모집 중이거나 모집 예정인 직후 기수에서 1회 무료 재수강{'\n'}
                  2. 해당 기수에 재수강하지 않을 경우 보증 자격 자동 소멸{'\n'}
                  3. 교재비 면제, AI 이용비(SpeakCoach Pro) 별도 결제{'\n'}
                  4. 1:1 약점 분석 리포트 재수강 시작 전 제공{'\n'}
                  5. 1인 1회 한정, 재수강 후 추가 보증 불가{'\n'}
                  6. 양도 불가{'\n\n'}
                  <strong>제6조 (보증 청구 절차)</strong>{'\n'}
                  1. 카카오톡 채널 또는 지정 이메일로 청구{'\n'}
                  2. 제출: 사전·사후 성적표(PDF), 수험번호, 본인 확인 서류{'\n'}
                  3. 심사: 접수일로부터 14영업일 이내{'\n'}
                  4. ACTFL 공식 채널 통한 검증 가능{'\n'}
                  5. 승인 시 직후 기수 재수강 배정 안내 (배정 기수 미참여 시 보증 소멸){'\n\n'}
                  <strong>제7조 (보증 적용 제외 사유)</strong>{'\n'}
                  1. 사전 성적표 응시일이 6개월 초과{'\n'}
                  2. 2주 이내 미응시 또는 30일 이내 미제출{'\n'}
                  3. 사전·사후 시험 유형 상이{'\n'}
                  4. 보증 조건(제3조) 미충족{'\n'}
                  5. 승인 후 배정된 직후 기수에 재수강하지 않은 경우{'\n'}
                  6. 대리 참석·제출 확인{'\n'}
                  7. 부정행위 해당{'\n\n'}
                  <strong>제8조 (부정행위)</strong>{'\n'}
                  허위·변조 서류 제출 시 형법 제231조(사문서위조), 제234조(위조사문서행사) 해당. 적발 시 보증 영구 박탈, 전 프로그램 이용 제한, 민·형사 조치.{'\n\n'}
                  <strong>제9조 (정책 변경)</strong>{'\n'}
                  변경 시 7일 전 공지. 신규 등록자부터 적용, 기존 수강생은 등록 시점 정책 적용.{'\n\n'}
                  <strong>제10조 (분쟁 해결)</strong>{'\n'}
                  대한민국 법률 준거, 회사 소재지 관할 법원 전속 관할.{'\n\n'}
                  <strong>부칙</strong>{'\n'}
                  1. 2025년 5월 15일 기수부터 시행{'\n'}
                  2. 시행 이전 등록자 소급 적용 불가{'\n'}
                  3. 미규정 사항은 관련 법령 및 상관례에 따름
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* BONUSES */}
      <section className="section" id="bonuses" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.06em', marginBottom: '8px' }}>BONUS</div>
            <div className="section-title">신청자에게만 드리는 4종 보너스</div>
            <p className="section-desc">부트캠프에 함께 포함된 4가지 학습 자료. 따로 사면 227,000원어치입니다.</p>
          </div>

          <div className="bonus-grid">
            <div className="bonus-card">
              <div className="bonus-card-head">
                <span className="bonus-no">01</span>
                <span className="bonus-tag">FRAMEWORK</span>
              </div>
              <h3 className="bonus-title">OPIc AL 즉답 프레임워크 9선</h3>
              <p className="bonus-problem">시험장에서 머리가 하얘지는 그 7초.</p>
              <p className="bonus-solution">어떤 질문이 와도 첫 문장이 자동으로 튀어나오는 9가지 패턴.</p>
              <p className="bonus-proof">4,000명을 가르치며 발견한, AL 등급자들의 공통 표현 9개.</p>
              <div className="bonus-meta">
                <span className="bonus-pages">PDF · 15p</span>
                <span className="bonus-value">29,000원</span>
              </div>
            </div>

            <div className="bonus-card">
              <div className="bonus-card-head">
                <span className="bonus-no">02</span>
                <span className="bonus-tag">ANSWER BANK</span>
              </div>
              <h3 className="bonus-title">AL 답변 50선 모범 답안집</h3>
              <p className="bonus-problem">내 답변이 AL인지 IH인지 본인이 판단하기 어려움.</p>
              <p className="bonus-solution">50개 실제 OPIc 문제의 AL 모범 답안집.</p>
              <p className="bonus-proof">매일 1개씩 따라 말하면 50일 안에 AL 톤과 구조가 몸에 배입니다.</p>
              <div className="bonus-meta">
                <span className="bonus-pages">PDF · 54p</span>
                <span className="bonus-value">79,000원</span>
              </div>
            </div>

            <div className="bonus-card">
              <div className="bonus-card-head">
                <span className="bonus-no">03</span>
                <span className="bonus-tag">DAILY DRILL</span>
              </div>
              <h3 className="bonus-title">30일 표현 암기 루틴</h3>
              <p className="bonus-problem">답변마다 같은 단어 반복. 채점관에게 들킴.</p>
              <p className="bonus-solution">매일 5개씩 30일, 출퇴근 10분으로 자연스럽게 익히는 AL 표현 150개.</p>
              <p className="bonus-proof">지하철에서 5분 반복하면 14일 후 답변 톤이 달라집니다.</p>
              <div className="bonus-meta">
                <span className="bonus-pages">PDF · 33p</span>
                <span className="bonus-value">39,000원</span>
              </div>
            </div>

            <div className="bonus-card">
              <div className="bonus-card-head">
                <span className="bonus-no">04</span>
                <span className="bonus-tag">1:1 COACHING</span>
              </div>
              <h3 className="bonus-title">재시험 1:1 코칭 30분</h3>
              <p className="bonus-problem">첫 시험에서 떨어진 후 어디부터 시작해야 할지 막막함.</p>
              <p className="bonus-solution">대표 코치가 직접 30분 상담으로 약점 진단 후 액션 플랜 제시.</p>
              <p className="bonus-proof">통화 후 24시간 안에 PDF 처방전이 카톡으로 도착합니다.</p>
              <div className="bonus-meta">
                <span className="bonus-pages">화상 · 30분</span>
                <span className="bonus-value">80,000원</span>
              </div>
            </div>
          </div>

          <div className="bonus-total">
            <div className="bonus-total-label">보너스 총 가치</div>
            <div className="bonus-total-price">
              <span className="bonus-total-strike">227,000원</span>
              <span className="bonus-total-final">0원</span>
            </div>
            <div className="bonus-total-sub">부트캠프 신청자에게 무료로 함께 제공됩니다.</div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section section-gray" id="pricing">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title">가격</div>
            <p className="section-desc">보너스 4종 + SpeakCoach AI Pro 2주 무료 포함</p>
          </div>
          <div className="pricing-section">
            <div className="pricing-badge">{currentCycleState.isEarlyBird ? `얼리버드 ${currentCycleState.discount}% 할인` : `${currentCycleState.discount}% 할인 중`}</div>
            <div className="pricing-header">
              <h3>14일 AL 완성 부트캠프</h3>
              <div className="pricing-duration">14일 커리큘럼 · 교재비 포함</div>
            </div>
            <div className="pricing-original">329,000원</div>
            <div className="pricing-price-main" style={{marginTop:'8px'}}>{currentCycleState.price.toLocaleString()}원</div>
            {currentCycleState.isEarlyBird && <div style={{fontSize:'13px',color:'var(--green)',fontWeight:600,marginTop:'4px'}}>{currentCycleState.earlyBirdEndStr} 이후 229,000원</div>}
            <div className="pricing-desc">
              교재 포함 · SpeakCoach AI Pro · 1:3 피드백 180분 · 매일 녹음과제 피드백 · 모의고사 영상 포함
            </div>
            <div className="pricing-features">
              <div className="pricing-feature">14일 체계적 커리큘럼 + 교재</div>
              <div className="pricing-feature">1:3 소그룹 피드백 총 180분</div>
              <div className="pricing-feature">매일(월-금) 녹음 → 코치가 직접 음성 피드백</div>
              <div className="pricing-feature">SpeakCoach AI Pro 2주 무료</div>
              <div className="pricing-feature">7개 핵심 템플릿 체화 훈련</div>
              <div className="pricing-feature">모의고사 영상 7개 (2주차 실전 대비)</div>
              <div className="pricing-feature">노션 자료 + YouTube 강의</div>
              <div className="pricing-feature">졸업 후 3개월 코칭 채팅</div>
            </div>
            <button onClick={() => openFormModal()} className="pricing-btn">
              지금 신청하기 →
            </button>
            <div className="pricing-earlybird">
              {currentCycleState.isEarlyBird ? (
                <>
                  얼리버드 마감: <strong>{currentCycleState.earlyBirdEndStr} 23:59</strong>까지 — 이후 229,000원으로 변경됩니다.
                </>
              ) : (
                <>
                  {countdown.nextDate} 기수 마감 임박 — 지금 신청하면 <strong>{currentCycleState.discount}% 할인</strong>이 적용됩니다.
                </>
              )}
            </div>
            <div className="pricing-addon">
              <h4>Premium 업그레이드</h4>
              <p>
                +<span className="addon-price">15,000원</span>만 추가하면 2주 내내 SpeakCoach AI{' '}
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
      <section className="section" id="rules" style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title" style={{ fontSize: '32px' }}>부트캠프 운영 방식</div>
            <p className="section-desc">함께 성장하기 위한 약속입니다.</p>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '15px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  <span><strong>카톡방 입장 전</strong>까지 교재비를 뺀 금액을 돌려드립니다. 수수료 없습니다.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, flexShrink: 0 }}>✕</span>
                  <span><strong>카톡방 입장 후</strong>에는 환불이 어렵습니다.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#6b7280', fontWeight: 700, flexShrink: 0 }}>※</span>
                  <span>팀원 이탈 — 남은 인원으로 정상 진행됩니다. 이 사유로는 환불되지 않습니다.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#6b7280', fontWeight: 700, flexShrink: 0 }}>※</span>
                  <span><strong>폐강 시</strong> — 최소 인원 미달로 부트캠프가 개설되지 않는 경우, 개별 안내 후 교재비를 제외한 전액을 환불 처리합니다.</span>
                </div>
                <div style={{ marginTop: '4px', padding: '12px 16px', background: 'var(--bg-gray)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  결제 시 본 환불 정책 및 면책 조항에 동의한 것으로 간주됩니다. 환불 관련 문의는 카카오톡 채널로 연락주세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq" style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-title" style={{ fontSize: '32px' }}>자주 묻는 질문</div>
            <p className="section-desc">더 궁금한 점은 카톡으로 문의해주세요.</p>
          </div>
          <div className="faq-list">
            {faqItems.map((item: { question: string; answer: string; important?: boolean }, index: number) => (
              <div key={index} className={`faq-item ${openFaqIndex === index ? 'open' : ''} ${item.important ? 'faq-important' : ''}`}>
                <button className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{item.important && <span className="faq-badge">필독</span>}{item.question}</span>
                  <span className="faq-icon">+</span>
                </button>
                <div className="faq-answer" style={{ maxHeight: openFaqIndex === index ? '800px' : '0' }}>
                  <div className="faq-answer-content" style={{ whiteSpace: 'pre-line' }}>
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
          <h2>지금 신청하고 시작하세요</h2>
          <p style={{fontSize:'18px',marginBottom:'8px'}}>다음 기수: <strong>4월 15일 시작</strong></p>
          <p>14일 동안 당신의 영어는 달라집니다.</p>
          <button onClick={() => openFormModal()} className="btn-white">
            지금 신청하기 →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-links">
              <Link href="/">메인 홈</Link>
              <Link href="/free">무료 강의</Link>
              <a href="https://blog.naver.com/lulu05/223353024018" target="_blank" rel="noopener noreferrer">전자책</a>
              <a href="https://sikbang-eng.liveklass.com/" target="_blank" rel="noopener noreferrer">인강</a>
              <a href="https://sikbang-eng.replit.app/" target="_blank" rel="noopener noreferrer">SpeakCoach AI</a>
              <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank" rel="noopener noreferrer">OPIc 단톡방</a>
              <a href="http://pf.kakao.com/_SJYQn" target="_blank" rel="noopener noreferrer">카카오톡 1:1 문의</a>
              <a href="https://instagram.com/sikbang.eng" target="_blank" rel="noopener noreferrer">인스타그램</a>
              <a href="https://blog.naver.com/lulu05" target="_blank" rel="noopener noreferrer">블로그</a>
              <Link href="/terms">이용약관</Link>
              <Link href="/privacy">개인정보처리방침</Link>
            </div>
            <div className="business-info" style={{fontSize:'12px',color:'rgba(255,255,255,0.4)',textAlign:'center',lineHeight:'1.8'}}>
              <p style={{margin:0}}>식빵영어 | 대표: 안준영 | 사업자등록번호: 807-29-01639</p>
              <p style={{margin:0}}>소재지: 부산광역시 진구 만리산로98, 2층 | 이메일: lulu066666@gmail.com</p>
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
              <span style={{textDecoration:'line-through',color:'var(--text-tertiary)',fontSize:'13px',marginRight:'6px'}}>329,000원</span>
              <strong>{currentCycleState.price.toLocaleString()}원</strong>
              {currentCycleState.isEarlyBird && <span style={{color:'var(--green)',fontSize:'12px',fontWeight:700,marginLeft:'4px'}}>얼리버드</span>}
            </div>
          </div>
          <button
            onClick={() => openFormModal()}
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
            <div className="toast-icon" style={{background:'rgba(255,255,255,0.15)',fontSize:'14px',fontWeight:700}}>NEW</div>
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

      {/* SELF-HOSTED APPLICATION FORM MODAL */}
      {showFormModal && (
        <div className="form-modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="form-modal-content form-modal-wide" onClick={(e) => e.stopPropagation()}>
            <button className="form-modal-close" onClick={() => setShowFormModal(false)}>✕</button>

            {formSubmitted ? (
              /* === 신청 완료 화면 === */
              <div className="form-modal-body" style={{textAlign:'center'}}>
                <div style={{
                  width:'72px',
                  height:'72px',
                  borderRadius:'50%',
                  background:'rgba(26,141,72,0.12)',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  margin:'0 auto 20px',
                }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1A8D48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{textAlign:'center'}}>신청이 완료되었습니다</h3>
                <p style={{color:'var(--text-tertiary)',lineHeight:1.6,textAlign:'center'}}>
                  <strong>{formData.name}</strong>님, 부트캠프 신청 감사합니다.<br/>
                  입금 확인 후 영업일 기준 1~2일 이내에<br/>카카오톡으로 연락드리겠습니다.
                </p>
                <div className="form-summary-box">
                  <div className="form-summary-row"><span>플랜</span><strong>{formData.plan === 'bundle' ? '번들 (부트캠프 + SpeakCoach 3개월)' : '일반 부트캠프'}</strong></div>
                  <div className="form-summary-row"><span>목표반</span><strong>{formData.targetClass}목표반</strong></div>
                  <div className="form-summary-row"><span>결제 금액</span><strong style={{color:'#1A8D48'}}>{calcFormPrice().toLocaleString()}원</strong></div>
                </div>
                <a
                  href="https://open.kakao.com/o/g0jE5t8f"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:'flex',
                    alignItems:'center',
                    justifyContent:'center',
                    gap:'8px',
                    marginTop:'20px',
                    background:'#FEE500',
                    color:'#191919',
                    padding:'14px 20px',
                    borderRadius:'12px',
                    fontWeight:700,
                    fontSize:'15px',
                    textDecoration:'none',
                  }}
                >
                  <svg viewBox="0 0 256 256" width="18" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919"/></svg>
                  OPIc 준비생 단톡방 참여하기
                </a>
                <button className="form-btn-secondary" onClick={() => setShowFormModal(false)} style={{marginTop:'10px',width:'100%'}}>
                  확인
                </button>
              </div>
            ) : (
              /* === 신청 폼 === */
              <div className="form-modal-body">
                {/* 상단 모집 기수 + 얼리버드 배지 */}
                <div className="form-header-badge">
                  <span className="form-cycle-badge">{countdown.nextDate} 기수 모집 중</span>
                  {currentCycleState.isEarlyBird ? (
                    <span className="form-earlybird-badge">얼리버드 {currentCycleState.discount}% 할인</span>
                  ) : (
                    <span className="form-regular-badge">{currentCycleState.discount}% 할인 중</span>
                  )}
                </div>

                {/* 상단 진행 표시 */}
                <div className="form-steps">
                  <div className={`form-step-dot ${formStep >= 1 ? 'active' : ''}`}>1</div>
                  <div className={`form-step-line ${formStep >= 2 ? 'active' : ''}`}></div>
                  <div className={`form-step-dot ${formStep >= 2 ? 'active' : ''}`}>2</div>
                  <div className={`form-step-line ${formStep >= 3 ? 'active' : ''}`}></div>
                  <div className={`form-step-dot ${formStep >= 3 ? 'active' : ''}`}>3</div>
                </div>
                <div className="form-step-labels">
                  <span className={formStep === 1 ? 'active' : ''}>기본정보</span>
                  <span className={formStep === 2 ? 'active' : ''}>플랜 선택</span>
                  <span className={formStep === 3 ? 'active' : ''}>입금 안내</span>
                </div>

                {/* STEP 1: 기본정보 */}
                {formStep === 1 && (
                  <div className="form-step-content">
                    <h3 style={{textAlign:'center'}}>기본정보 입력</h3>
                    <div className="form-field">
                      <label>성함 <span className="req">*</span></label>
                      <input
                        type="text"
                        placeholder="홍길동"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-field">
                      <label>이메일 <span className="req">*</span></label>
                      <input
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div className="form-field">
                      <label>전화번호 <span className="req">*</span> <span style={{fontSize:'12px',fontWeight:500,color:'var(--text-tertiary)'}}>(숫자만 입력하면 자동 입력됩니다)</span></label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        placeholder="01012345678"
                        value={formData.phone}
                        onChange={(e) => {
                          const nums = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                          let formatted = nums;
                          if (nums.length > 3 && nums.length <= 7) {
                            formatted = nums.slice(0, 3) + '-' + nums.slice(3);
                          } else if (nums.length > 7) {
                            formatted = nums.slice(0, 3) + '-' + nums.slice(3, 7) + '-' + nums.slice(7);
                          }
                          setFormData({...formData, phone: formatted});
                        }}
                      />
                    </div>
                    <div className="form-field">
                      <label>목표반 <span className="req">*</span></label>
                      <div className="form-radio-group">
                        <label className={`form-radio-card ${formData.targetClass === 'IH' ? 'selected' : ''}`}>
                          <input type="radio" name="targetClass" value="IH" checked={formData.targetClass === 'IH'} onChange={() => setFormData({...formData, targetClass: 'IH'})} />
                          <div className="form-radio-inner">
                            <strong>IH 목표반</strong>
                            <span>OPIc 첫 도전 · 기초부터 탄탄히</span>
                          </div>
                        </label>
                        <label className={`form-radio-card ${formData.targetClass === 'AL' ? 'selected' : ''}`}>
                          <input type="radio" name="targetClass" value="AL" checked={formData.targetClass === 'AL'} onChange={() => setFormData({...formData, targetClass: 'AL'})} />
                          <div className="form-radio-inner">
                            <strong>AL 목표반</strong>
                            <span>현재 IM3 이상 · AL 집중 공략</span>
                          </div>
                        </label>
                      </div>
                      <div className="form-target-guide">
                        <p><strong>IH 목표반</strong> — OPIc이 처음이거나, 영어 스피킹이 아직 어려운 분에게 추천합니다. 기초 템플릿부터 체계적으로 잡아드려요.</p>
                        <p><strong>AL 목표반</strong> — 현재 IM3 이상이거나, 영어로 어느 정도 말할 수 있는 분에게 추천합니다. AL 전략에 집중해요.</p>
                        <p className="form-target-tip">IH반을 선택해도 AL 취득이 충분히 가능합니다. 본인 현재 수준에 맞춰 선택해주세요!</p>
                      </div>
                    </div>

                    {/* 현재 영어 수준 */}
                    <div className="form-field">
                      <label>현재 영어 수준 <span className="req">*</span></label>
                      <select
                        value={formData.currentLevel}
                        onChange={(e) => setFormData({...formData, currentLevel: e.target.value as typeof formData.currentLevel})}
                      >
                        <option value="">선택해주세요</option>
                        <option value="beginner">시험 경험 없음 / 영어 왕초보</option>
                        <option value="NH">NH (Novice High)</option>
                        <option value="IL">IL (Intermediate Low)</option>
                        <option value="IM1">IM1 (Intermediate Mid 1)</option>
                        <option value="IM2">IM2 (Intermediate Mid 2)</option>
                        <option value="IM3_above">IM3 이상</option>
                      </select>
                    </div>

                    {/* 왕초보 → 1:1 회화 클래스 유도 */}
                    {(formData.currentLevel === 'beginner' || formData.currentLevel === 'NH') && (
                      <div style={{
                        marginTop: '16px',
                        padding: '24px',
                        background: 'rgba(26,141,72,0.04)',
                        border: '1px solid rgba(26,141,72,0.15)',
                        borderRadius: '12px',
                      }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                          1:1 영어 회화 클래스를 먼저 추천드려요
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary, #666)', lineHeight: 1.7, margin: '0 0 16px 0' }}>
                          현재 수준에서 바로 부트캠프에 참여하면 진도를 따라가기 어려울 수 있어요.
                          1:1 영어 회화 클래스에서 1~2개월 기초를 다진 뒤 부트캠프에 합류하시면 훨씬 효과적입니다.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <a
                            href="/conversation"
                            style={{
                              display: 'block',
                              padding: '14px',
                              background: 'var(--green)',
                              color: '#fff',
                              borderRadius: '8px',
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: '14px',
                              textDecoration: 'none',
                            }}
                          >
                            1:1 영어 회화 클래스 알아보기
                          </a>
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, currentLevel: formData.currentLevel === 'beginner' ? 'beginner' : 'NH'})}
                            style={{
                              padding: '10px',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-tertiary)',
                              fontSize: '12px',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            그래도 부트캠프 신청하기
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 사전 OPIc 성적 (성적 보증용) */}
                    <div className="form-field" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E5E8EB' }}>
                      <label>사전 OPIc 성적 <span style={{fontSize:'12px',fontWeight:500,color:'var(--text-tertiary)'}}>(성적 보증 적용 시 필요)</span></label>
                      <div className="form-radio-group" style={{ marginBottom: '12px' }}>
                        <label className={`form-radio-card ${formData.hasScore ? 'selected' : ''}`} style={{ padding: '12px' }}>
                          <input type="radio" name="hasScore" checked={formData.hasScore} onChange={() => setFormData({...formData, hasScore: true})} />
                          <div className="form-radio-inner">
                            <strong style={{fontSize:'14px'}}>성적표 있음</strong>
                            <span style={{fontSize:'12px'}}>6개월 이내 응시</span>
                          </div>
                        </label>
                        <label className={`form-radio-card ${!formData.hasScore ? 'selected' : ''}`} style={{ padding: '12px' }}>
                          <input type="radio" name="hasScore" checked={!formData.hasScore} onChange={() => setFormData({...formData, hasScore: false, scoreGrade: ''})} />
                          <div className="form-radio-inner">
                            <strong style={{fontSize:'14px'}}>성적표 없음</strong>
                            <span style={{fontSize:'12px'}}>첫 응시 / 6개월 초과</span>
                          </div>
                        </label>
                      </div>

                      {formData.hasScore && (
                        <div style={{ background: 'var(--bg-gray, #F2F4F6)', borderRadius: '12px', padding: '16px' }}>
                          <div className="form-field" style={{ marginBottom: '12px' }}>
                            <label style={{fontSize:'13px'}}>현재 OPIc 등급</label>
                            <select
                              value={formData.scoreGrade}
                              onChange={(e) => setFormData({...formData, scoreGrade: e.target.value})}
                            >
                              <option value="">선택해주세요</option>
                              <option value="NH">NH</option>
                              <option value="IL">IL</option>
                              <option value="IM1">IM1</option>
                              <option value="IM2">IM2</option>
                              <option value="IM3">IM3</option>
                              <option value="IH">IH</option>
                              <option value="AL">AL</option>
                            </select>
                          </div>
                          <div className="form-field" style={{ marginBottom: '0' }}>
                            <label style={{fontSize:'13px'}}>성적표 첨부</label>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => setScoreFile(e.target.files?.[0] || null)}
                              style={{
                                width: '100%', padding: '10px', fontSize: '13px',
                                border: '1.5px dashed #E5E8EB', borderRadius: '8px', background: 'white',
                                cursor: 'pointer',
                              }}
                            />
                            {scoreFile && (
                              <p style={{fontSize:'12px',color:'var(--green)',marginTop:'4px',fontWeight:500}}>
                                {scoreFile.name} ({(scoreFile.size / 1024).toFixed(0)}KB)
                              </p>
                            )}
                          </div>
                          <div style={{marginTop:'12px',padding:'12px',background:'white',borderRadius:'8px',border:'1px solid #E5E8EB'}}>
                            <p style={{fontSize:'12px',fontWeight:600,color:'var(--text-primary, #191F28)',marginBottom:'6px'}}>성적표 제출 시 유의사항</p>
                            <p style={{fontSize:'12px',color:'var(--text-secondary, #4E5968)',lineHeight:1.6,margin:0}}>
                              성적표에 수험번호, 등급, 응시일이 모두 보이도록 촬영 또는 캡처해 주세요. OPIc 공식 사이트(opic.or.kr) 성적 조회 화면을 캡처하는 것이 가장 정확합니다. 진위 확인을 위해 ACTFL 공식 채널을 통한 검증이 진행될 수 있으며, 위·변조된 성적표 제출 시 보증이 영구 박탈됩니다.
                            </p>
                          </div>
                        </div>
                      )}

                      <p style={{fontSize:'12px',color:'var(--text-tertiary)',marginTop:'8px',lineHeight:1.5}}>
                        성적표가 없어도 부트캠프 참여는 가능합니다. 성적 보증 제도 적용 대상에서만 제외됩니다.
                      </p>
                    </div>

                    {formError && <div className="form-error">{formError}</div>}
                    <button
                      className="form-btn-primary"
                      onClick={() => {
                        if (!formData.name || !formData.email || !formData.phone || !formData.targetClass || !formData.currentLevel) {
                          setFormError('모든 항목을 입력해주세요.');
                          return;
                        }
                        if (!/^\d{3}-\d{3,4}-\d{4}$/.test(formData.phone)) {
                          setFormError('전화번호를 000-0000-0000 형식으로 입력해주세요.');
                          return;
                        }
                        if (formData.hasScore && !formData.scoreGrade) {
                          setFormError('사전 OPIc 등급을 선택해주세요.');
                          return;
                        }
                        setFormError('');
                        setFormStep(2);
                      }}
                    >
                      다음 →
                    </button>
                  </div>
                )}

                {/* STEP 2: 플랜 선택 (Hormozi-style Value Stack) */}
                {formStep === 2 && (
                  <div className="form-step-content">
                    <h3 style={{textAlign:'center'}}>어떤 플랜이 맞으실까요?</h3>

                    {/* 플랜 카드 */}
                    <div className="form-plan-cards">
                      <label className={`form-plan-card ${formData.plan === 'standard' ? 'selected' : ''}`}>
                        <input type="radio" name="plan" value="standard" checked={formData.plan === 'standard'} onChange={() => setFormData({...formData, plan: 'standard'})} />
                        <div className="form-plan-inner">
                          <div className="form-plan-name">일반 부트캠프</div>
                          <div className="form-plan-price-row">
                            <span className="form-plan-original">329,000원</span>
                            <span className="form-plan-price">{(currentCycleState.isEarlyBird ? 199000 : 229000).toLocaleString()}원</span>
                          </div>
                          {currentCycleState.isEarlyBird && (
                            <div className="form-plan-earlybird-tag">얼리버드 특가</div>
                          )}
                          <div className="form-plan-desc">14일 AL 완성 부트캠프 · 교재 포함</div>
                          <ul className="form-plan-features">
                            <li>14일 커리큘럼 + 교재</li>
                            <li>1:3 소그룹 피드백 총 180분</li>
                            <li>SpeakCoach AI Pro 11일 + Premium 3일</li>
                            <li>매일 녹음과제 피드백</li>
                          </ul>
                        </div>
                      </label>
                      <label className={`form-plan-card bundle ${formData.plan === 'bundle' ? 'selected' : ''}`}>
                        <input type="radio" name="plan" value="bundle" checked={formData.plan === 'bundle'} onChange={() => setFormData({...formData, plan: 'bundle'})} />
                        <div className="form-plan-badge">가장 많이 선택</div>
                        <div className="form-plan-inner">
                          <div className="form-plan-name-row">
                            <div className="form-plan-name">번들 (부트캠프 + AI 3개월)</div>
                            <div className={`form-bundle-stock ${bundleStock <= 2 ? 'urgent' : ''}`}>
                              <span className="form-stock-dot"></span>
                              <span key={bundleStock} className="form-stock-num">{bundleStock}개 남음</span>
                            </div>
                          </div>

                          {/* Value Stack */}
                          <div className="form-value-stack">
                            <div className="form-value-stack-title">이 번들에 포함된 가치</div>
                            <div className="form-value-item">
                              <span>14일 AL 완성 부트캠프 (교재와 피드백, 모의고사 포함)</span>
                              <span className="form-value-price">{(currentCycleState.isEarlyBird ? 199000 : 229000).toLocaleString()}원</span>
                            </div>
                            <div className="form-value-item">
                              <span>SpeakCoach AI Premium 3개월</span>
                              <span className="form-value-price">89,000원</span>
                            </div>
                            <div className="form-value-item bonus">
                              <span>졸업 후 코칭 채팅 3개월 지원</span>
                              <span className="form-value-price">무료</span>
                            </div>
                            <div className="form-value-total">
                              <span>개별 구매 시 총합</span>
                              <span>{(currentCycleState.isEarlyBird ? 288000 : 318000).toLocaleString()}원</span>
                            </div>
                          </div>

                          <div className="form-bundle-offer">
                            <div className="form-bundle-offer-label">번들 특별가</div>
                            <div className="form-plan-price-row" style={{justifyContent:'center'}}>
                              <span className="form-plan-original">{(currentCycleState.isEarlyBird ? 288000 : 318000).toLocaleString()}원</span>
                              <span className="form-plan-price">{(currentCycleState.isEarlyBird ? 249000 : 279000).toLocaleString()}원</span>
                            </div>
                            <div className="form-plan-save">
                              39,000원 절약 — 하루 커피 한 잔 값으로 3개월 AI 코치
                            </div>
                            {currentCycleState.isEarlyBird && (
                              <div className="form-plan-earlybird-tag">얼리버드 특가</div>
                            )}
                          </div>

                          <div className="form-bundle-why">
                            <p>부트캠프 2주는 습관을 만들고, AI 3개월이 실력을 완성합니다. 2주만으로 끝내기엔 OPIc은 꾸준한 연습이 필요합니다.</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* 번들 선택 시 보너스 표시 */}
                    {formData.plan === 'bundle' && (
                      <div className="form-bonus-box">
                        <div className="form-bonus-title">번들 선택 시 추가 혜택</div>
                        <div className="form-bonus-item">부트캠프 종료 직후 바로 Premium 연결 — 학습 공백 0일</div>
                        <div className="form-bonus-item">3개월간 매일 AI 스피킹 연습 — 학원비 월 30만원 이상 절약</div>
                        <div className="form-bonus-item">부트캠프에서 배운 템플릿을 AI로 반복 훈련 — 체화 완성</div>
                      </div>
                    )}

                    {/* 교재 보유 여부 */}
                    <div className="form-option-box">
                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.hasBook}
                          onChange={(e) => setFormData({...formData, hasBook: e.target.checked})}
                        />
                        <span>이미 교재를 구매했어요 <span style={{color:'#1A8D48',fontSize:'13px',fontWeight:600}}>(-30,000원)</span></span>
                      </label>
                    </div>

                    {/* Premium 업그레이드 */}
                    <div className="form-option-box highlight">
                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.premiumUpgrade}
                          onChange={(e) => setFormData({...formData, premiumUpgrade: e.target.checked})}
                        />
                        <span>
                          <strong>Premium 업그레이드</strong> <span style={{color:'var(--green)',fontWeight:600}}>(+15,000원)</span>
                        </span>
                      </label>
                      <div className="form-upgrade-detail">
                        <span className="form-upgrade-value">64% 할인 — 41,900원 → 15,000원</span>
                        <p>기본: Pro 11일 + Premium 3일 → <strong>14일 전체 Premium</strong>으로 업그레이드. 발음 교정, AI 모의고사, 무제한 피드백을 부트캠프 내내 쓰면 연습량이 2배로 늘어납니다.</p>
                      </div>
                    </div>

                    {/* 실시간 가격 계산 */}
                    <div className="form-price-summary">
                      <div className="form-price-row">
                        <span>{formData.plan === 'bundle' ? '번들 (부트캠프 + AI 3개월)' : '부트캠프 수강료'}{currentCycleState.isEarlyBird ? ' (얼리버드)' : ''}</span>
                        <span>{formData.plan === 'bundle'
                          ? (currentCycleState.isEarlyBird ? 249000 : 279000).toLocaleString()
                          : (currentCycleState.isEarlyBird ? 199000 : 229000).toLocaleString()
                        }원</span>
                      </div>
                      {formData.hasBook && (
                        <div className="form-price-row discount">
                          <span>교재 보유 할인</span>
                          <span>-30,000원</span>
                        </div>
                      )}
                      {formData.premiumUpgrade && (
                        <div className="form-price-row">
                          <span>Premium 업그레이드</span>
                          <span>+15,000원</span>
                        </div>
                      )}
                      <div className="form-price-total">
                        <span>총 결제 금액</span>
                        <strong>{calcFormPrice().toLocaleString()}원</strong>
                      </div>
                    </div>

                    {currentCycleState.isEarlyBird && (
                      <p className="form-earlybird-notice">
                        얼리버드 할인이 적용된 가격입니다. {currentCycleState.earlyBirdEndStr} 23:59 이후 정상가로 변경됩니다.
                      </p>
                    )}

                    {formError && <div className="form-error">{formError}</div>}
                    <div className="form-btn-row">
                      <button className="form-btn-secondary" onClick={() => { setFormError(''); setFormStep(1); }}>← 이전</button>
                      <button className="form-btn-primary" onClick={() => { setFormError(''); setFormStep(3); }}>다음 →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3: 입금안내 */}
                {formStep === 3 && (
                  <div className="form-step-content">
                    <h3 style={{textAlign:'center'}}>입금 안내</h3>

                    {/* 선택 요약 */}
                    <div className="form-selected-summary">
                      <div className="form-selected-row">
                        <span>선택 플랜</span>
                        <strong>{formData.plan === 'bundle' ? '번들 (부트캠프 + AI 3개월)' : '일반 부트캠프'}</strong>
                      </div>
                      <div className="form-selected-row">
                        <span>목표반</span>
                        <strong>{formData.targetClass}목표반</strong>
                      </div>
                      {formData.premiumUpgrade && (
                        <div className="form-selected-row">
                          <span>Premium 업그레이드</span>
                          <strong>포함</strong>
                        </div>
                      )}
                    </div>

                    <div className="form-deposit-box">
                      <div className="form-deposit-amount">
                        <span>입금하실 금액</span>
                        <strong>{calcFormPrice().toLocaleString()}원</strong>
                      </div>
                      <div className="form-deposit-info">
                        <div className="form-deposit-row">
                          <span>은행</span><strong>카카오뱅크</strong>
                        </div>
                        <div className="form-deposit-row">
                          <span>계좌번호</span><strong>3333-06-0399628</strong>
                        </div>
                        <div className="form-deposit-row">
                          <span>예금주</span><strong>안*영</strong>
                        </div>
                      </div>
                      <button
                        className="form-copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText('3333060399628');
                          const btn = document.querySelector('.form-copy-btn');
                          if (btn) { btn.textContent = '복사 완료!'; setTimeout(() => { btn.textContent = '계좌번호 복사하기'; }, 2000); }
                        }}
                      >
                        계좌번호 복사하기
                      </button>
                    </div>

                    {/* 카드 결제 안내 */}
                    <div className="form-card-payment-box">
                      <div className="form-card-payment-title">카드 결제도 가능합니다</div>
                      <p className="form-card-payment-desc">
                        카드 결제 시 부가세 10퍼센트가 가산됩니다. 인스타그램 DM으로 연락 주시면 결제 링크를 안내드려요.
                      </p>
                      <div className="form-card-payment-prices">
                        <div className="form-card-price-row">
                          <span>일반 (얼리버드)</span>
                          <strong>218,900원</strong>
                        </div>
                        <div className="form-card-price-row">
                          <span>일반 (정가)</span>
                          <strong>251,900원</strong>
                        </div>
                        <div className="form-card-price-row">
                          <span>번들 (얼리버드)</span>
                          <strong>273,900원</strong>
                        </div>
                        <div className="form-card-price-row">
                          <span>번들 (정가)</span>
                          <strong>306,900원</strong>
                        </div>
                      </div>
                      <a
                        href="https://instagram.com/sikbang.eng"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="form-card-payment-cta"
                      >
                        인스타그램 DM 보내기 →
                      </a>
                    </div>

                    <div className="form-option-box">
                      <label className="form-checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.depositConfirm}
                          onChange={(e) => setFormData({...formData, depositConfirm: e.target.checked})}
                        />
                        <strong>입금을 완료했습니다</strong>
                      </label>
                      <p style={{fontSize:'12px',color:'var(--text-tertiary)',marginTop:'4px',marginLeft:'28px'}}>입금 반드시 먼저 하시고 체크해주세요!</p>
                    </div>

                    <div className="form-field">
                      <label>환불계좌 <span className="req">*</span></label>
                      <textarea
                        placeholder="예금주 성함, 은행명, 계좌번호를&#10;정확하게 작성해주세요."
                        value={formData.refundAccount}
                        onChange={(e) => setFormData({...formData, refundAccount: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="form-note" style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                      <p style={{margin:0}}>* 카톡방 입장 전까지는 교재비를 뺀 금액 환불.</p>
                      <p style={{margin:0}}>* 카톡방 입장 후에는 환불 불가.</p>
                      <p style={{margin:0}}>* 최소 인원 미달로 폐강될 경우, 교재비를 제외한 전액을 환불해 드립니다.</p>
                      <p style={{margin:0}}>* 같은 팀원의 중도 이탈은 환불 사유에 해당하지 않습니다.</p>
                      <p style={{margin:0}}>* 신청·결제 시 위 환불 정책에 동의한 것으로 간주됩니다.</p>
                    </div>

                    {formError && <div className="form-error">{formError}</div>}
                    <div className="form-btn-row">
                      <button className="form-btn-secondary" onClick={() => { setFormError(''); setFormStep(2); }}>← 이전</button>
                      <button
                        className="form-btn-primary"
                        disabled={formSubmitting}
                        onClick={handleFormSubmit}
                      >
                        {formSubmitting ? '신청 중...' : '신청 완료하기'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
