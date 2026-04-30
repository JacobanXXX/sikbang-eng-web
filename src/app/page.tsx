'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showKakaoPopup, setShowKakaoPopup] = useState(false);

  // 추천 퀴즈 상태
  const [quizStep, setQuizStep] = useState(0); // 0=시작 전, 1~3=질문, 4=결과
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);

  useEffect(() => {
    const lastShown = localStorage.getItem('sikbang-kakao-popup');
    const now = Date.now();
    if (!lastShown || now - parseInt(lastShown) > 24 * 60 * 60 * 1000) {
      const timer = setTimeout(() => setShowKakaoPopup(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);
  const closeKakaoPopup = () => {
    setShowKakaoPopup(false);
    localStorage.setItem('sikbang-kakao-popup', Date.now().toString());
  };

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
  // reviewScrollRef removed - now using CSS animation

  // Nav shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavShadow(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll reviews now handled by CSS animation

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (!href || href === '#') return;

      try {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          const nav = document.getElementById('nav');
          const navHeight = nav?.offsetHeight || 64;
          const top = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } catch (err) {}
    };

    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll as any);
    });

    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll as any);
      });
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!marketingConsent) {
      alert('광고성 정보 수신에 동의해주세요.');
      return;
    }
    const email = (e.currentTarget.querySelector('#emailInput') as HTMLInputElement)?.value;
    if (email) {
      // Save email to Stibee via API route
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (err) {
        console.log('Email save attempted:', err);
      }
      // Redirect to Notion free resource page
      window.open('https://www.notion.so/99-AL-c5a518b61907470bab8bc0787901e487', '_blank');
      setNewsletterSuccess(true);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "OPIC을 처음 준비하는데 어디서부터 시작해야 하나요?",
      answer: "현재 레벨에 따라 추천 경로가 달라요. 영어 기초가 부족하다면 전자책으로 프레임워크를 먼저 익히고, 단기간에 결과를 내고 싶다면 14일 부트캠프를 추천합니다. 잘 모르겠다면 SpeakCoach AI에서 무료 테스트를 먼저 해보세요. 현재 예상 등급을 바로 확인할 수 있습니다."
    },
    {
      question: "SpeakCoach AI는 어떻게 사용하나요?",
      answer: "SpeakCoach AI는 웹 앱(PWA)이라 별도 설치 없이 브라우저에서 바로 접속할 수 있어요. 가입 후 답변을 녹음하면 AI가 발음, 문법, 유창성, 어휘 등 7개 카테고리로 분석해서 예상 등급과 구체적인 피드백을 제공합니다. 무료 체험도 가능합니다."
    },
    {
      question: "14일 부트캠프는 어떤 식으로 진행되나요?",
      answer: "3인 1팀으로 구성되며, 14일 동안 매일 스피킹 과제를 제출합니다. 코치의 실시간 피드백 + SpeakCoach AI의 정밀 분석을 함께 받습니다. 카카오톡 그룹에서 소통하며, 1주차는 기본 프레임워크, 2주차는 실전 모의고사에 집중합니다. 자세한 내용은 부트캠프 상세 페이지에서 확인하세요."
    },
    {
      question: "영어를 진짜 못하는데 따라갈 수 있을까요?",
      answer: "네, 가능합니다. 프레임워크 기반 훈련이라 영어를 잘 못하더라도 답변 구조를 따라가며 학습할 수 있어요. 실제로 IL 수준에서 시작해서 IM2, IH를 달성한 분들이 많습니다. 중요한 건 매일 꾸준히 과제를 제출하는 것입니다."
    },
    {
      question: "직장인인데 시간 투자가 많이 필요한가요?",
      answer: "하루 1~2시간이면 충분합니다. 출퇴근 시간에 자료를 보고, 퇴근 후 녹음 과제를 제출하는 패턴으로 진행하시는 직장인분들이 많아요."
    },
    {
      question: "전자책, 인강, 부트캠프 중 무엇을 선택해야 하나요?",
      answer: "단기간 확실한 성과를 원하면 14일 부트캠프, 영상으로 체계적으로 배우고 싶으면 인강, 독학 + 기초 학습이면 전자책을 추천합니다. 가장 효과적인 조합은 인강 + 부트캠프예요."
    }
  ];

  return (
    <>
      {/* NAV */}
      <nav className="nav" id="nav" style={{ boxShadow: navShadow ? '0 1px 12px rgba(0,0,0,0.08)' : 'none' }}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="bread-icon" style={{fontWeight:900, fontSize:'18px', color:'var(--blue-primary)'}}>SB</span> 식빵영어
          </a>
          <div className="nav-links">
            <a href="/free">무료 강의</a>
            <a href="#store">스토어</a>
            <a href="#speakcoach">SpeakCoach AI</a>
            <a href="#reviews">후기</a>
            <a href="/study">14일 부트캠프</a>
            <a href="/conversation">영어 회화</a>
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="nav-cta">무료 체험하기</a>
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="다크모드 전환">
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>
          <button className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <a href="/free" onClick={closeMobileMenu}>무료 강의</a>
        <a href="#store" onClick={closeMobileMenu}>스토어</a>
        <a href="#speakcoach" onClick={closeMobileMenu}>SpeakCoach AI</a>
        <a href="#reviews" onClick={closeMobileMenu}>후기</a>
        <a href="/study" onClick={closeMobileMenu}>14일 부트캠프</a>
        <a href="/conversation" onClick={closeMobileMenu}>1:1 영어 회화</a>
        <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank" onClick={closeMobileMenu}>OPIC 단톡방 참여</a>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" onClick={closeMobileMenu}>카카오톡 1:1 문의</a>
        <a href="https://sikbang-eng.replit.app/" target="_blank" className="mobile-cta" onClick={closeMobileMenu}>무료 스피킹 테스트 →</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge animate">14일 AL 완성 프로그램</div>
          <h1 className="animate delay-1">
            OPIC 점수를 올리는<br />
            <span className="highlight">가장 구조적인 방법</span>
          </h1>
          <p className="animate delay-2">
            사람의 코칭과 AI 피드백의 결합.
            <br />식빵영어의 14일 부트캠프로 목표 점수에 도달하세요.
          </p>
          <div className="hero-buttons animate delay-3">
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">
              AI 스피킹 무료 분석 받기 →
            </a>
            <a href="/free" className="btn-secondary">
              무료 강의 20개 보기
            </a>
          </div>
          <div className="animate delay-3" style={{marginTop:'18px'}}>
            <a
              href="https://open.kakao.com/o/g0jE5t8f"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:'inline-flex',
                alignItems:'center',
                gap:'8px',
                background:'#FEE500',
                color:'#191919',
                padding:'10px 18px',
                borderRadius:'999px',
                fontSize:'14px',
                fontWeight:700,
                textDecoration:'none',
                border:'1px solid rgba(0,0,0,0.05)',
              }}
            >
              <svg viewBox="0 0 256 256" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                <path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919"/>
              </svg>
              OPIC 준비생 단톡방(770+명) 참여하기
            </a>
          </div>
          <div className="hero-stats animate delay-4">
            <div className="hero-stat">
              <div className="number">4,000+</div>
              <div className="label">누적 수강생</div>
            </div>
            <div className="hero-stat">
              <div className="number">1,000+</div>
              <div className="label">수강생 후기</div>
            </div>
            <div className="hero-stat">
              <div className="number">14일</div>
              <div className="label">집중 완성 부트캠프</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE RESOURCE + NEWSLETTER */}
      <section className="newsletter-section" id="free-resource">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
            <h2>OPIC 무료 자료<br /><span className="highlight">지금 바로 받아보세요</span></h2>
            <p style={{fontSize:'13px',color:'var(--blue-primary)',fontWeight:600,marginBottom:'4px'}}>5,200명 구독 중</p>
            <p>이메일 구독하면 OPIC 준비에 필요한 무료 자료를 보내드립니다.<br />매주 꿀팁과 표현 정리도 함께 받아보세요.</p>

            {!newsletterSuccess ? (
              <>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input type="email" id="emailInput" placeholder="이메일 주소를 입력하세요" required />
                  <button type="submit" style={{ opacity: marketingConsent ? 1 : 0.5, cursor: marketingConsent ? 'pointer' : 'not-allowed' }}>무료 자료 받기</button>
                </form>
                <label className="consent-check" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '480px', margin: '14px auto 0', cursor: 'pointer', fontSize: '13px', color: '#666', lineHeight: '1.5', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: 'var(--blue-primary)', flexShrink: 0 }}
                  />
                  <span>[필수] 광고성 정보 수신에 동의합니다. 이메일을 통해 OPIC 학습 자료, 프로모션, 이벤트 등의 마케팅 정보를 받는 것에 동의합니다. 언제든 구독 해지가 가능합니다.</span>
                </label>
              </>
            ) : (
              <div className="newsletter-success show">
                구독 완료! 이메일로 무료 자료 링크를 보내드렸습니다.
              </div>
            )}

            <div className="newsletter-benefits">
              <div className="newsletter-benefit">
                <div className="check">✓</div>
                OPIC 필수 표현 정리
              </div>
              <div className="newsletter-benefit">
                <div className="check">✓</div>
                프레임워크 답변 템플릿
              </div>
              <div className="newsletter-benefit">
                <div className="check">✓</div>
                매주 스피킹 꿀팁 발송
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section" id="problem">
        <div className="container">
          <div className="section-header">
            <div className="overline">Problem</div>
            <h2>OPIC 준비, 이런 경험 있지 않나요?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '64px' }}>
            <div style={{ padding: '32px', background: 'white', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#E5E8EB', marginBottom: '20px' }}>01</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#191F28', marginBottom: '12px' }}>혼자 녹음해도 뭐가 틀린지 모른다</h3>
              <p style={{ fontSize: '15px', color: '#4E5968', lineHeight: 1.7 }}>발음인지 문법인지 구조인지. 혼자서는 판단할 수 없습니다. 뭐가 틀린지 모르면 고칠 수도 없습니다.</p>
            </div>
            <div style={{ padding: '32px', background: 'white', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#E5E8EB', marginBottom: '20px' }}>02</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#191F28', marginBottom: '12px' }}>인강 결제하고 3일 만에 포기한다</h3>
              <p style={{ fontSize: '15px', color: '#4E5968', lineHeight: 1.7 }}>온라인 인강 평균 완강률 12%. 봐주는 사람이 없으면 끝까지 못 갑니다.</p>
            </div>
            <div style={{ padding: '32px', background: 'white', borderRadius: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, color: '#E5E8EB', marginBottom: '20px' }}>03</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#191F28', marginBottom: '12px' }}>학원은 비싸고, 시간도 안 맞는다</h3>
              <p style={{ fontSize: '15px', color: '#4E5968', lineHeight: 1.7 }}>평균 40~80만원. 퇴근 후 이동할 체력도 없고, 주말 몰아하기도 효과가 떨어집니다.</p>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '48px', fontSize: '16px', color: '#8B95A1' }}>그래서 식빵영어는 3가지 방법을 준비했습니다.</p>
        </div>
      </section>

      {/* STORE */}
      <section className="section section-gray" id="store">
        <div className="container">
          <div className="section-header">
            <div className="overline">Store</div>
            <h2>OPIC 준비의 모든 것,<br />여기서 시작하세요</h2>
            <p>전자책부터 인강, 14일 부트캠프까지. 나에게 맞는 학습 방법을 선택하세요.</p>
          </div>
          <div className="products-grid">

            {/* 전자책 */}
            <div className="product-card">
              <div className="product-card-image ebook-bg">
                <span className="product-badge hot">BEST</span>
                <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" style={{ width: 'min(220px, 78%)', height: 'auto', display: 'block' }}>
                  <defs>
                    <filter id="ebookSh" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#3182F6" floodOpacity="0.14"/>
                    </filter>
                  </defs>
                  {/* 뒤쪽 책 */}
                  <g transform="translate(60 30) rotate(-7 50 60)">
                    <rect width="100" height="120" rx="8" fill="#D6E4FF"/>
                    <rect x="0" y="0" width="14" height="120" fill="#A8C4FF"/>
                    <rect x="30" y="28" width="56" height="6" rx="3" fill="#A8C4FF"/>
                    <rect x="30" y="46" width="44" height="6" rx="3" fill="#A8C4FF"/>
                    <rect x="30" y="64" width="52" height="6" rx="3" fill="#A8C4FF"/>
                  </g>
                  {/* 앞쪽 책 */}
                  <g transform="translate(80 30) rotate(7 50 60)" filter="url(#ebookSh)">
                    <rect width="100" height="120" rx="10" fill="#FFFFFF"/>
                    <rect x="0" y="0" width="14" height="120" fill="#3182F6"/>
                    <rect x="30" y="22" width="50" height="6" rx="3" fill="#3182F6"/>
                    <rect x="30" y="34" width="36" height="6" rx="3" fill="#3182F6"/>
                    <rect x="30" y="58" width="58" height="4" rx="2" fill="#E8EEF5"/>
                    <rect x="30" y="70" width="48" height="4" rx="2" fill="#E8EEF5"/>
                    <rect x="30" y="82" width="56" height="4" rx="2" fill="#E8EEF5"/>
                    <rect x="30" y="94" width="36" height="4" rx="2" fill="#E8EEF5"/>
                  </g>
                </svg>
              </div>
              <div className="product-card-body">
                <div className="category">전자책</div>
                <h3>OPIC 전자책 + 기출 번들</h3>
                <div className="desc">기출 문제와 프레임워크 답변 템플릿을 한 번에. 수강생 최애 상품.</div>
                <div className="product-price-row" style={{flexDirection:'column', alignItems:'flex-start', gap:'12px'}}>
                  <div className="product-price">
                    <span className="current">39,900</span>
                    <span className="unit">원</span>
                  </div>
                  <a href="https://blog.naver.com/lulu05/223353024018" target="_blank" className="btn-buy" style={{width:'100%', textAlign:'center', padding:'12px 20px'}}>구매하기</a>
                </div>
              </div>
            </div>

            {/* 인강 */}
            <div className="product-card">
              <div className="product-card-image course-bg">
                <span className="product-badge new">NEW</span>
                <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" style={{ width: 'min(230px, 82%)', height: 'auto', display: 'block' }}>
                  <defs>
                    <filter id="screenSh" x="-10%" y="-10%" width="120%" height="130%">
                      <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#3182F6" floodOpacity="0.14"/>
                    </filter>
                  </defs>
                  {/* 뒤쪽 살짝 보이는 카드 */}
                  <rect x="32" y="40" width="176" height="14" rx="6" fill="#DCE8FF"/>
                  <rect x="44" y="56" width="152" height="12" rx="6" fill="#EEF3FB"/>
                  {/* 메인 비디오 프레임 */}
                  <g filter="url(#screenSh)">
                    <rect x="44" y="42" width="152" height="106" rx="14" fill="#FFFFFF"/>
                    {/* 상단 바 */}
                    <path d="M44 56 a14 14 0 0 1 14 -14 h124 a14 14 0 0 1 14 14 v6 h-152 z" fill="#191F28"/>
                    <circle cx="56" cy="52" r="3" fill="#FF5C5C"/>
                    <circle cx="66" cy="52" r="3" fill="#FFC542"/>
                    <circle cx="76" cy="52" r="3" fill="#3DD68C"/>
                    {/* 플레이 버튼 */}
                    <circle cx="120" cy="98" r="22" fill="#3182F6"/>
                    <path d="M114 88 L114 108 L130 98 Z" fill="white"/>
                    {/* 진행바 */}
                    <rect x="60" y="130" width="120" height="4" rx="2" fill="#E5EBF1"/>
                    <rect x="60" y="130" width="48" height="4" rx="2" fill="#3182F6"/>
                  </g>
                </svg>
              </div>
              <div className="product-card-body">
                <div className="category">인강</div>
                <h3>OPIC 완전정복 인강 패키지</h3>
                <div className="desc">영상으로 구조를 잡고 싶다면. 유형별 답변 전략부터 실전 롤플레이까지.</div>
                <div className="product-price-row" style={{flexDirection:'column', alignItems:'flex-start', gap:'12px'}}>
                  <div className="product-price" style={{flexWrap:'wrap', alignItems:'center', gap:'6px'}}>
                    <span className="original">269,000원</span>
                    <span className="current">169,000</span>
                    <span className="unit">원</span>
                    <span style={{background:'var(--green)',color:'white',fontSize:'11px',fontWeight:700,padding:'2px 6px',borderRadius:'4px'}}>37% 할인</span>
                  </div>
                  <a href="https://sikbang-eng.liveklass.com/" target="_blank" className="btn-buy" style={{width:'100%', textAlign:'center', padding:'12px 20px'}}>수강하기</a>
                </div>
              </div>
            </div>

            {/* 14일 부트캠프 */}
            <div className="product-card">
              <div className="product-card-image study-bg">
                <span className="product-badge" style={{background:'#1A8D48'}}>정원 20명</span>
                <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" style={{ width: 'min(220px, 80%)', height: 'auto', display: 'block' }}>
                  <defs>
                    <filter id="calSh" x="-10%" y="-10%" width="120%" height="130%">
                      <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#1A8D48" floodOpacity="0.14"/>
                    </filter>
                  </defs>
                  <g filter="url(#calSh)">
                    {/* 캘린더 본체 */}
                    <rect x="36" y="26" width="168" height="128" rx="14" fill="#FFFFFF"/>
                    {/* 헤더 */}
                    <path d="M36 40 a14 14 0 0 1 14 -14 h140 a14 14 0 0 1 14 14 v14 h-168 z" fill="#1A8D48"/>
                    {/* 헤더 도트 */}
                    <circle cx="58" cy="22" r="2.5" fill="#1A8D48"/>
                    <circle cx="182" cy="22" r="2.5" fill="#1A8D48"/>
                    <rect x="54" y="14" width="8" height="14" rx="2" fill="#1A8D48"/>
                    <rect x="178" y="14" width="8" height="14" rx="2" fill="#1A8D48"/>
                    {/* 14 라벨 */}
                    <text x="120" y="48" fontFamily="Pretendard, -apple-system, sans-serif" fontSize="14" fontWeight="700" fill="#FFFFFF" textAnchor="middle" letterSpacing="-0.02em">14 DAYS</text>
                  </g>
                  {/* 7×2 그리드 - 14일 */}
                  {Array.from({length: 14}).map((_, i) => {
                    const col = i % 7;
                    const row = Math.floor(i / 7);
                    const x = 50 + col * 20;
                    const y = 76 + row * 32;
                    const completed = i < 9;
                    return (
                      <g key={i}>
                        <rect x={x} y={y} width="14" height="14" rx="4" fill={completed ? '#1A8D48' : '#E5EBE7'}/>
                        {completed && (
                          <path d={`M ${x+3.5} ${y+7.5} L ${x+6} ${y+10} L ${x+10.5} ${y+5}`} stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="product-card-body">
                <div className="category" style={{color:'#1A8D48'}}>14일 부트캠프</div>
                <h3>14일 AL 완성 부트캠프</h3>
                <div className="desc">100% 비대면 · 매일 녹음 → 직접 교정 → AI 분석. 수료생 94%가 목표 달성했습니다.</div>
                <div className="product-price-row" style={{flexDirection:'column', alignItems:'flex-start', gap:'10px'}}>
                  <div style={{fontSize:'13px',color:'#1A8D48',fontWeight:600}}>1차 피드백 후 환불 가능</div>
                  <div className="product-price" style={{flexWrap:'wrap', alignItems:'center', gap:'6px'}}>
                    <span className="original">329,000원</span>
                    <span className="current">199,000</span>
                    <span className="unit">원</span>
                    <span style={{background:'var(--green)',color:'white',fontSize:'11px',fontWeight:700,padding:'2px 6px',borderRadius:'4px'}}>39% 할인</span>
                  </div>
                  <a href="/study" className="btn-buy" style={{width:'100%', textAlign:'center', padding:'12px 20px', background:'#1A8D48'}}>자세히 보기</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SPEAKCOACH AI */}
      <section className="section speakcoach-section" id="speakcoach">
        <div className="container">
          <div className="speakcoach-grid">
            <div className="speakcoach-content">
              <div className="tag">AI-Powered</div>
              <h2>
                나의 스피킹을<br />
                <span className="highlight">AI가 분석</span>합니다
              </h2>
              <p>녹음 한 번으로 예상 등급과 약점을 분석합니다. 단순 점수가 아닌, 구체적인 교정 방향까지 제시합니다.</p>
              <div className="speakcoach-features">
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '16px' }}>STT</div>
                  <div className="feature-text">
                    <h4>답변 녹음 & STT 변환</h4>
                    <p>OpenAI Whisper 기반 정밀 음성 인식</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '16px' }}>AI</div>
                  <div className="feature-text">
                    <h4>7개 카테고리 AI 분석</h4>
                    <p>문법, 어휘, 유창성 등 상세 스킬별 피드백</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '14px' }}>FIX</div>
                  <div className="feature-text">
                    <h4>약점 교정 드릴</h4>
                    <p>가장 약한 영역을 집중 훈련하는 7분 교정 세션</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '14px' }}>TEST</div>
                  <div className="feature-text">
                    <h4>실전 모의고사</h4>
                    <p>35분 / 14문항 실제 OPIC 형식 모의 테스트</p>
                  </div>
                </div>
              </div>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">무료로 내 등급 확인하기 →</a>
            </div>

            {/* MOCKUP */}
            <div className="speakcoach-mockup">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <div className="mockup-screen">
                <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '4px' }}>SpeakCoach AI 분석 결과</div>
                <div className="mockup-grade-row">
                  <div>
                    <div className="mockup-grade">IH</div>
                    <div className="mockup-grade-label">예상 등급</div>
                  </div>
                  <div className="mockup-al-prob">
                    <div className="prob-num">47%</div>
                    <div className="prob-label">AL 확률</div>
                  </div>
                </div>
                <div className="mockup-bars">
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">유창성</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '78%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">문법</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill mid" style={{ width: '62%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">어휘</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '85%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">발음</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '73%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">구성력</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill weak" style={{ width: '45%' }}></div></div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '12px', background: 'var(--red)', opacity: 0.1, borderRadius: '10px', fontSize: '12px', color: 'var(--red)' }}>
                  <strong>구성력</strong>이 가장 약한 영역입니다. 교정 드릴을 시작해보세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section section-gray" id="pricing">
        <div className="container">
          <div className="section-header">
            <div className="overline">Pricing</div>
            <h2>SpeakCoach AI 요금제</h2>
            <p>커피 한 잔 값으로 AI 스피킹 코치를 만나보세요.</p>
          </div>
          <div className="pricing-grid">

            {/* FREE */}
            <div className="pricing-card">
              <div className="plan-name">무료 이용자</div>
              <div className="plan-price">0<span className="won">원</span></div>
              <div className="plan-sub">가입 후 7일간 무료</div>
              <ul className="plan-features">
                <li>7일간 무료 체험</li>
                <li>1일 1회 연습</li>
                <li>AI 피드백 &amp; 점수</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan outline" style={{ display: 'block' }}>무료로 시작하기</a>
            </div>

            {/* PRO */}
            <div className="pricing-card featured">
              <div className="recommend-badge">추천</div>
              <div className="plan-name">프로 패키지</div>
              <div className="plan-original">31,900원</div>
              <div className="plan-price">24,900<span className="won">원</span></div>
              <div className="plan-sub">3개월 구독 시 63,500원 <span style={{color:'var(--red)',fontWeight:700}}>(₩11,200 절약)</span></div>
              <ul className="plan-features">
                <li>무제한 연습</li>
                <li>500개 이상 OPIC 문제</li>
                <li>유형별 맞춤 필터링</li>
                <li>상세 AI 피드백</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan primary" style={{ display: 'block' }}>무료로 시작하기</a>
            </div>

            {/* PREMIUM */}
            <div className="pricing-card">
              <div className="plan-name">프리미엄 패키지</div>
              <div className="plan-original">41,900원</div>
              <div className="plan-price">34,900<span className="won">원</span></div>
              <div className="plan-sub">3개월 구독 시 89,000원 <span style={{color:'var(--red)',fontWeight:700}}>(₩15,700 절약)</span></div>
              <ul className="plan-features">
                <li>프로 모든 기능 포함</li>
                <li>실전 모의고사 10세트</li>
                <li>Native Shadowing</li>
                <li>고급 트래킹 &amp; 인사이트</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan outline" style={{ display: 'block' }}>프리미엄으로 시작하기</a>
            </div>

          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="section-header">
            <div className="overline">Reviews</div>
            <h2>4,000명이 먼저 경험했습니다</h2>
            <p>전자책, 인강, 부트캠프 수강생들의 실제 후기.</p>
            <div style={{
              display:'inline-flex',
              alignItems:'center',
              gap:'12px',
              marginTop:'18px',
              padding:'10px 18px',
              background:'var(--bg-gray)',
              border:'1px solid var(--border)',
              borderRadius:'999px',
              fontSize:'14px',
              fontWeight:700,
              color:'var(--text-primary)',
            }}>
              <span style={{color:'var(--kakao-yellow)',fontSize:'16px',letterSpacing:'2px'}}>★★★★★</span>
              <span>5.0 / 5.0</span>
              <span style={{color:'var(--text-tertiary)',fontWeight:600}}>· 라이브클래스 인강 수강 후기 250+건</span>
            </div>
          </div>
          <div className="reviews-wrapper">
            <div className="reviews-scroll">
              {[...Array(2)].map((_, setIdx) => (
                <React.Fragment key={setIdx}>
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">J</div>
                  <div className="review-meta">
                    <div className="name">정*현</div>
                    <div className="info">건국대 경영 4학년 · 부트캠프</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">삼성 공채 서류 마감 3주 전에 급하게 시작했어요. 프레임워크대로 답변 구조를 잡으니 시험장에서 막힘 없이 말이 나왔어요. 수료 직후 삼성 면접까지 진출했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → IH</span>
                  <span className="grade-text">대기업 공채 서류 통과</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">S</div>
                  <div className="review-meta">
                    <div className="name">서*영</div>
                    <div className="info">취준생 · 부트캠프 + AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">토익 920인데 스피킹은 IM1이었어요. 읽기랑 말하기는 진짜 다르더라고요. 매일 녹음하고 코치 피드백을 받으니 2주 만에 발음·구성력이 올랐고, AL까지 달성했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IH → AL</span>
                  <span className="grade-text">최고 등급 달성</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">K</div>
                  <div className="review-meta">
                    <div className="name">김*수</div>
                    <div className="info">무역회사 3년차 · 전자책 + AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★<span className="empty">★</span></div>
                <div className="review-text">퇴근 후 학원은 불가능했어요. 지하철에서 전자책으로 구조를 외우고, 밤에 AI로 15분씩 녹음했습니다. 한 달 만에 IL에서 IM3까지 올랐어요.</div>
                <div className="review-result">
                  <span className="grade-badge">IL → IM3</span>
                  <span className="grade-text">직장인 독학 성공</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">L</div>
                  <div className="review-meta">
                    <div className="name">이*진</div>
                    <div className="info">이화여대 영문 3학년 · 부트캠프</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">영문과인데 OPIC은 다르더라고요. 팀원 2명이랑 매일 녹음 공유하니 경쟁심이 생겼고, 코치 피드백이 구체적이라 좋았어요.</div>
                <div className="review-result">
                  <span className="grade-badge">IM1 → IH</span>
                  <span className="grade-text">취업 준비 스펙 완성</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">P</div>
                  <div className="review-meta">
                    <div className="name">박*희</div>
                    <div className="info">외국계 이직 준비 · 인강·부트캠프</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">인강으로 롤플레이 패턴을 먼저 잡고 부트캠프에 들어갔어요. 코치 피드백이 AL 수준이라고 하니 목표를 올렸는데, 정말 AL을 달성했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM3 → AL</span>
                  <span className="grade-text">외국계 이직 성공</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">C</div>
                  <div className="review-meta">
                    <div className="name">최*아</div>
                    <div className="info">서울대 대학원 · 전자책</div>
                  </div>
                </div>
                <div className="review-stars">★★★★<span className="empty">★</span></div>
                <div className="review-text">연구실에서 시간을 쪼개 준비했어요. 7개 템플릿을 체화하니 어떤 질문이 나와도 즉시 답변 구조가 떠올랐습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → IH</span>
                  <span className="grade-text">전자책 + 솔직 후기</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">H</div>
                  <div className="review-meta">
                    <div className="name">한*우</div>
                    <div className="info">대기업 과장 5년차 · 부트캠프</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">승진 요건이 OPIC IH인데 3번 시험했어도 IM2였어요. 코치가 시제 전환 시 끊기는 게 문제라고 정확히 지적해주고, 그 한 가지만 고쳤더니 바로 IH가 나왔습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → IH</span>
                  <span className="grade-text">3번 실패 후 성공</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">Y</div>
                  <div className="review-meta">
                    <div className="name">윤*서</div>
                    <div className="info">취준생 · 전자책 + 부트캠프</div>
                  </div>
                </div>
                <div className="review-stars">★★★★<span className="empty">★</span></div>
                <div className="review-text">전자책으로 답변 틀을 만들고 부트캠프에서 실전 연습했어요. 첫 3일은 힘들었지만, 4일째부터 루틴이 잡혔고, 첫 시험에 IH를 받았습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">첫 시험 IH</span>
                  <span className="grade-text">첫 응시 목표 달성</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">M</div>
                  <div className="review-meta">
                    <div className="name">문*경</div>
                    <div className="info">고려대 대학원 · 부트캠프·AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">SpeakCoach AI 분석이 정확해서 놀랐어요. 구체적인 점수(구성력 45점, 유창성 78점)로 무엇을 고쳐야 하는지 명확했고, 2주 집중한 결과 AL을 달성했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → AL</span>
                  <span className="grade-text">2단계 뛰어넘기</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">O</div>
                  <div className="review-meta">
                    <div className="name">오*준</div>
                    <div className="info">공기업 직원 · 전자책</div>
                  </div>
                </div>
                <div className="review-stars">★★★★<span className="empty">★</span></div>
                <div className="review-text">출퇴근 2시간을 전자책으로 활용했어요. 기초 프레임워크를 잡는 데 최고의 가성비입니다. 3주 만에 IL에서 IM3를 달성했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IL → IM3</span>
                  <span className="grade-text">출퇴근 독학 후기</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">N</div>
                  <div className="review-meta">
                    <div className="name">남*은</div>
                    <div className="info">숙명여대 무역 4학년 · 인강·AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">인강으로 구조를 잡고 AI로 매일 연습했어요. 롤플레이 강의가 특히 좋아서 3번 반복했고, 2주 만에 IH를 달성했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM1 → IH</span>
                  <span className="grade-text">공채 지원 조건 충족</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">W</div>
                  <div className="review-meta">
                    <div className="name">우*민</div>
                    <div className="info">스타트업 이직 준비 · 부트캠프</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">이전 회사에서 영어를 쓸 일이 없어서 입이 떨어지지 않았어요. 부트캠프 팀원들의 동기부여가 컸고, 2주 만에 IH를 달성했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → IH</span>
                  <span className="grade-text">외국계 면접 자신감</span>
                </div>
              </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="reviews-count-badge">
            <span>누적 수강생 4,000+ · 실제 후기 1,000+ (라이브클래스 인증)</span>
          </div>
        </div>
      </section>

      {/* RECOMMENDATION QUIZ */}
      <section className="section" id="quiz" style={{background:'linear-gradient(135deg, rgba(49,130,246,0.04) 0%, rgba(26,141,72,0.04) 100%)'}}>
        <div className="container" style={{maxWidth:'640px',textAlign:'center'}}>
          <div className="overline" style={{color:'var(--blue-primary)'}}>Product Match</div>
          <h2 style={{fontSize:'28px',fontWeight:800,color:'var(--text-primary)',marginBottom:'8px'}}>나에게 맞는 학습법은?</h2>
          <p style={{fontSize:'15px',color:'var(--text-secondary)',marginBottom:'32px'}}>3가지 질문으로 최적의 상품을 추천해드려요.</p>

          {quizStep === 0 && (
            <button onClick={() => setQuizStep(1)} style={{background:'var(--blue-primary)',color:'white',border:'none',padding:'14px 32px',borderRadius:'12px',fontSize:'16px',fontWeight:700,cursor:'pointer'}}>
              30초 테스트 시작하기
            </button>
          )}

          {quizStep === 1 && (
            <div>
              <p style={{fontSize:'17px',fontWeight:700,marginBottom:'16px',color:'var(--text-primary)'}}>1/3. OPIC 시험까지 얼마나 남았나요?</p>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {['2주 이내', '1~2개월', '3개월 이상 또는 미정'].map((opt, i) => (
                  <button key={i} onClick={() => { setQuizAnswers([...quizAnswers, i]); setQuizStep(2); }}
                    style={{padding:'14px 20px',borderRadius:'12px',border:'1px solid #e5e7eb',background:'white',fontSize:'15px',fontWeight:600,cursor:'pointer',textAlign:'left',transition:'all 0.2s',color:'var(--text-primary)'}}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 2 && (
            <div>
              <p style={{fontSize:'17px',fontWeight:700,marginBottom:'16px',color:'var(--text-primary)'}}>2/3. 현재 영어 스피킹 수준은?</p>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {['거의 못 함 (NL~IL)', '간단한 문장 가능 (IM1~IM2)', '어느 정도 대화 가능 (IM3~IH)'].map((opt, i) => (
                  <button key={i} onClick={() => { setQuizAnswers([...quizAnswers, i]); setQuizStep(3); }}
                    style={{padding:'14px 20px',borderRadius:'12px',border:'1px solid #e5e7eb',background:'white',fontSize:'15px',fontWeight:600,cursor:'pointer',textAlign:'left',transition:'all 0.2s',color:'var(--text-primary)'}}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 3 && (
            <div>
              <p style={{fontSize:'17px',fontWeight:700,marginBottom:'16px',color:'var(--text-primary)'}}>3/3. 선호하는 학습 방식은?</p>
              <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                {['혼자 독학 (내 페이스대로)', '영상 강의 중심', '코치 + 팀원과 함께 (강제성 필요)'].map((opt, i) => (
                  <button key={i} onClick={() => { setQuizAnswers([...quizAnswers, i]); setQuizStep(4); }}
                    style={{padding:'14px 20px',borderRadius:'12px',border:'1px solid #e5e7eb',background:'white',fontSize:'15px',fontWeight:600,cursor:'pointer',textAlign:'left',transition:'all 0.2s',color:'var(--text-primary)'}}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizStep === 4 && (() => {
            const score = (quizAnswers[0] === 0 ? 3 : quizAnswers[0] === 1 ? 2 : 1)
              + (quizAnswers[2] === 2 ? 3 : quizAnswers[2] === 1 ? 2 : 1);
            const rec = score >= 5 ? 'study' : score >= 3 ? 'course' : 'ebook';
            const info = {
              study: { name: '14일 AL 완성 부트캠프', desc: '시간이 촉박하고 확실한 성과가 필요하다면, 대표가 매일 직접 듣는 14일 부트캠프가 가장 효과적이에요.', link: '/study', btn: '부트캠프 자세히 보기', color: '#1A8D48' },
              course: { name: 'OPIC 완전정복 인강', desc: '체계적인 영상 강의로 내 페이스에 맞게 학습하고 싶다면, 인강 패키지를 추천합니다.', link: 'https://sikbang-eng.liveklass.com/', btn: '인강 자세히 보기', color: '#7C5CFC' },
              ebook: { name: 'OPIC 전자책 + 기출 번들', desc: '기초부터 독학으로 차근차근 준비하고 싶다면, 전자책으로 시작해보세요.', link: 'https://blog.naver.com/lulu05/223353024018', btn: '전자책 보러가기', color: '#3182F6' }
            }[rec];
            return (
              <div style={{background:'var(--bg-white)',borderRadius:'16px',padding:'32px 24px',border:'1px solid var(--border)'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:info.color,marginBottom:'8px'}}>추천 결과</div>
                <h3 style={{fontSize:'22px',fontWeight:800,color:'var(--text-primary)',marginBottom:'12px'}}>{info.name}</h3>
                <p style={{fontSize:'15px',color:'var(--text-secondary)',lineHeight:1.6,marginBottom:'20px'}}>{info.desc}</p>
                <a href={info.link} style={{display:'inline-block',background:info.color,color:'white',padding:'12px 28px',borderRadius:'12px',fontWeight:700,fontSize:'15px',textDecoration:'none'}}>{info.btn} →</a>
                <button onClick={() => { setQuizStep(0); setQuizAnswers([]); }} style={{display:'block',margin:'16px auto 0',background:'none',border:'none',color:'var(--text-tertiary)',fontSize:'13px',cursor:'pointer',textDecoration:'underline'}}>다시 테스트하기</button>
              </div>
            );
          })()}
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-gray" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="overline">FAQ</div>
            <h2>자주 묻는 질문</h2>
            <p>궁금한 점이 있다면 먼저 확인해보세요.</p>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  {item.question}
                  <span className="arrow">{openFaqIndex === index ? '\u25B2' : '\u25BC'}</span>
                </button>
                <div
                  className="faq-answer"
                  style={{
                    maxHeight: openFaqIndex === index ? '500px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease'
                  }}
                >
                  <div className="faq-answer-inner">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KAKAO GROUP CHAT BANNER */}
      <section style={{
        padding: '56px 0',
        background: 'linear-gradient(135deg, var(--kakao-yellow) 0%, #FFD43B 100%)',
        position: 'relative' as const,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute' as const,
          top: '-30px',
          right: '-30px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '50%',
        }}></div>
        <div style={{
          position: 'absolute' as const,
          bottom: '-20px',
          left: '10%',
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
        }}></div>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap' as const,
          position: 'relative' as const,
          zIndex: 1,
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(25,25,25,0.1)',
              borderRadius: '20px',
              padding: '6px 14px',
              marginBottom: '14px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#191919',
            }}>
              <svg viewBox="0 0 256 256" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919"/>
              </svg>
              카카오톡 오픈채팅
            </div>
            <h2 style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#191919',
              lineHeight: 1.4,
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}>
              OPIC 준비생 단톡방에서<br/>함께 준비해요
            </h2>
            <p style={{
              fontSize: '15px',
              color: 'rgba(25,25,25,0.7)',
              lineHeight: 1.6,
              marginBottom: '4px',
            }}>
              부트캠프 정보, 시험 꿀팁, 학습 자료 공유까지. 혼자 준비하지 마세요.
            </p>
            <p style={{
              fontSize: '13px',
              color: 'rgba(25,25,25,0.5)',
            }}>
              누적 수강생 4,000+명 중 770+명이 활동 중
            </p>
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <a
              href="https://open.kakao.com/o/g0jE5t8f"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: '#191919',
                color: 'var(--kakao-yellow)',
                padding: '16px 32px',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                whiteSpace: 'nowrap' as const,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
            >
              <svg viewBox="0 0 256 256" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                <path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="var(--kakao-yellow)"/>
              </svg>
              단톡방 참여하기
            </a>
          </div>
        </div>
      </section>

      {/* CTA BOTTOM */}
      <section style={{ background: 'var(--blue-primary)', padding: '80px 0', textAlign: 'center' as const }}>
        <div className="container">
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>어디서부터 시작할지 모르겠다면</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>SpeakCoach AI에서 무료로 현재 예상 등급을 확인해보세요.</p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>무료 체험 · 7일간 무제한 · 카드 등록 없음</p>
          <a href="https://sikbang-eng.replit.app/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '16px 36px', background: 'white', color: 'var(--blue-primary)', borderRadius: '12px', fontSize: '17px', fontWeight: 700, textDecoration: 'none' }}>무료로 내 등급 확인하기 →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">SB 식빵영어</div>
              <p>14일 안에 OPIC 점수를 올리는<br />가장 구조적인 방법.</p>
            </div>
            <div className="footer-col">
              <h4>제품</h4>
              <a href="https://blog.naver.com/lulu05/223353024018" target="_blank">전자책</a>
              <a href="https://sikbang-eng.liveklass.com/" target="_blank">인강</a>
              <a href="/study">14일 부트캠프</a>
              <a href="https://sikbang-eng.replit.app/" target="_blank">SpeakCoach AI</a>
            </div>
            <div className="footer-col">
              <h4>고객지원</h4>
              <a href="#faq">자주 묻는 질문</a>
              <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank">OPIC 단톡방 참여</a>
              <a href="http://pf.kakao.com/_SJYQn" target="_blank">카카오톡 1:1 문의</a>
              <a href="mailto:lulu066666@gmail.com">이메일 문의</a>
            </div>
            <div className="footer-col">
              <h4>소셜</h4>
              <a href="https://instagram.com/sikbang.eng" target="_blank">Instagram @sikbang.eng</a>
              <a href="https://blog.naver.com/lulu05" target="_blank">네이버 블로그</a>
              <a href="https://sikbang-eng.stibee.com/" target="_blank">뉴스레터 구독</a>
            </div>
          </div>
          <div className="business-info">
            <p>식빵영어 | 대표: 안준영 | 사업자등록번호: 807-29-01639</p>
            <p>소재지: 부산광역시 진구 만리산로98, 2층 | 이메일: lulu066666@gmail.com</p>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2025 식빵영어. All rights reserved.</span>
            <div className="social">
              <a href="/terms">이용약관</a>
              <a href="/privacy">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>

      {/* KAKAOTALK FLOATING BUTTON */}
      <div className="kakao-float">
        <div className="kakao-tooltip">궁금한 점이 있으신가요?</div>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" className="kakao-btn" aria-label="카카오톡 상담">
          <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919" />
            <g fill="#FEE500">
              <path d="M70.5 146.6c-2.3 0-4.2-1.3-4.2-3V113h-9.8c-2.4 0-3.5-1.8-3.5-3.5s1.1-3.5 3.5-3.5h27.5c2.4 0 3.5 1.8 3.5 3.5s-1.1 3.5-3.5 3.5H74.7v30.6c0 1.7-1.9 3-4.2 3z" />
              <path d="M101.3 146.2c-2.2 0-4-1.5-4-3.3V109.8c0-1.8 1.8-3.3 4-3.3s4 1.5 4 3.3v29.8h14.7c2.2 0 3.3 1.5 3.3 3.3s-1.1 3.3-3.3 3.3h-18.7z" />
              <path d="M147.5 146.6c-1 0-2-.4-2.7-1.1l-8.2-9.6-8.2 9.6c-1.4 1.7-4 1.9-5.7.5-1.7-1.4-1.9-4-.5-5.7l9.5-11.2-9-10.6c-1.4-1.7-1.2-4.3.5-5.7 1.7-1.4 4.3-1.2 5.7.5l7.7 9.1 7.7-9.1c1.4-1.7 4-1.9 5.7-.5 1.7 1.4 1.9 4 .5 5.7l-9 10.6 9.5 11.2c1.4 1.7 1.2 4.3-.5 5.7-.8.7-1.8 1-2.8 1z" />
              <path d="M172.7 146.6c-1.6 0-3.1-.8-3.7-2.3l-14.2-33c-.9-2.1.1-4.5 2.2-5.4 2.1-.9 4.5.1 5.4 2.2l8.3 19.3 8.3-19.3c.9-2.1 3.3-3.1 5.4-2.2 2.1.9 3.1 3.3 2.2 5.4l-14.2 33c-.6 1.5-2.1 2.3-3.7 2.3z" />
            </g>
          </svg>
        </a>
      </div>

      {/* KAKAO CHANNEL POPUP */}
      {showKakaoPopup && (
        <div className="kakao-popup-overlay" onClick={closeKakaoPopup}>
          <div className="kakao-popup" onClick={(e) => e.stopPropagation()}>
            <button className="kakao-popup-close" onClick={closeKakaoPopup}>&times;</button>
            <div style={{fontSize:'40px',marginBottom:'12px'}}>💬</div>
            <h3 style={{fontSize:'20px',fontWeight:800,marginBottom:'8px',color:'var(--text-primary)'}}>카카오톡 채널 추가하기</h3>
            <p style={{fontSize:'14px',color:'var(--text-secondary)',lineHeight:1.7,marginBottom:'20px'}}>
              채널 추가하시면 부트캠프 모집 알림,<br/>할인 쿠폰, OPIC 꿀팁을 받으실 수 있어요!
            </p>
            <a href="http://pf.kakao.com/_SJYQn" target="_blank" rel="noopener noreferrer" className="kakao-popup-btn" onClick={closeKakaoPopup}>
              채널 추가하고 혜택 받기
            </a>
            <button className="kakao-popup-skip" onClick={closeKakaoPopup}>다음에 할게요</button>
          </div>
        </div>
      )}
    </>
  );
}
