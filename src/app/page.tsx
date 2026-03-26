'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
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
      answer: "현재 레벨에 따라 추천 경로가 달라요. 영어 기초가 부족하다면 전자책으로 프레임워크를 먼저 익히고, 단기간에 결과를 내고 싶다면 2주 스터디를 추천합니다. 잘 모르겠다면 SpeakCoach AI에서 무료 테스트를 먼저 해보세요. 현재 예상 등급을 바로 확인할 수 있습니다."
    },
    {
      question: "SpeakCoach AI는 어떻게 사용하나요?",
      answer: "SpeakCoach AI는 웹 앱(PWA)이라 별도 설치 없이 브라우저에서 바로 접속할 수 있어요. 가입 후 답변을 녹음하면 AI가 발음, 문법, 유창성, 어휘 등 7개 카테고리로 분석해서 예상 등급과 구체적인 피드백을 제공합니다. 무료 체험도 가능합니다."
    },
    {
      question: "2주 스터디는 어떤 식으로 진행되나요?",
      answer: "3인 1팀으로 구성되며, 14일 동안 매일 스피킹 과제를 제출합니다. 코치의 실시간 피드백 + SpeakCoach AI의 정밀 분석을 함께 받습니다. 카카오톡 그룹에서 소통하며, 1주차는 기본 프레임워크, 2주차는 실전 모의고사에 집중합니다. 자세한 내용은 스터디 상세 페이지에서 확인하세요."
    },
    {
      question: "영어를 진짜 못하는데 따라갈 수 있을까요?",
      answer: "네, 가능합니다. 프레임워크 기반 훈련이라 영어를 잘 못하더라도 답변 구조를 따라가며 학습할 수 있어요. 실제로 IL 수준에서 시작해서 IM2, IH를 달성한 분들이 많습니다. 중요한 건 매일 꾸준히 과제를 제출하는 것입니다."
    },
    {
      question: "직장인인데 시간 투자가 많이 필요한가요?",
      answer: "하루 평균 1~2시간이면 충분합니다. 학습 자료 확인 10분, 답변 준비 및 녹음 30~40분, AI 분석 확인 20분, 코치 피드백 반영 20분 정도예요. 출퇴근 시간에 자료를 보고, 퇴근 후 녹음하는 패턴으로 진행하시는 직장인분들이 많습니다."
    },
    {
      question: "환불은 어떻게 되나요?",
      answer: "스터디의 경우 단톡방 초대(조원 편성) 전에는 전액 환불이 가능하며, 편성 이후에는 환불이 불가합니다. SpeakCoach AI 구독은 결제 후 7일 이내 환불 가능합니다. 자세한 사항은 카카오톡으로 문의해주세요."
    },
    {
      question: "전자책, 인강, 스터디 중 무엇을 선택해야 하나요?",
      answer: "목표와 상황에 따라 달라요. 독학 선호 + 기초 학습이면 전자책, 체계적 영상 강의를 원하면 인강, 단기간 확실한 성과를 원하면 2주 스터디를 추천합니다. 가장 효과가 좋은 조합은 인강 + 스터디이고, 예산이 제한적이라면 전자책 + SpeakCoach AI 무료 체험으로 시작해보세요."
    }
  ];

  return (
    <>
      {/* NAV */}
      <nav className="nav" id="nav" style={{ boxShadow: navShadow ? '0 1px 12px rgba(0,0,0,0.08)' : 'none' }}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="bread-icon">🍞</span> 식빵영어
          </a>
          <div className="nav-links">
            <a href="#free-resource">무료 자료</a>
            <a href="#store">스토어</a>
            <a href="#speakcoach">SpeakCoach AI</a>
            <a href="#reviews">후기</a>
            <a href="#faq">FAQ</a>
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="nav-cta">무료 체험하기</a>
          </div>
          <button className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <a href="#free-resource" onClick={closeMobileMenu}>무료 자료</a>
        <a href="#store" onClick={closeMobileMenu}>스토어</a>
        <a href="#speakcoach" onClick={closeMobileMenu}>SpeakCoach AI</a>
        <a href="#reviews" onClick={closeMobileMenu}>후기</a>
        <a href="#faq" onClick={closeMobileMenu}>FAQ</a>
        <a href="/study" onClick={closeMobileMenu}>2주 스터디</a>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" onClick={closeMobileMenu}>카카오톡 문의</a>
        <a href="https://sikbang-eng.replit.app/" target="_blank" className="mobile-cta" onClick={closeMobileMenu}>무료 스피킹 테스트 →</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge animate">2주 완성 OPIC 프로그램</div>
          <h1 className="animate delay-1">
            OPIC 점수를 올리는<br />
            <span className="highlight">가장 구조적인 방법</span>
          </h1>
          <p className="animate delay-2">
            사람의 코칭과 AI 피드백의 결합.<br />
            식빵영어의 2주 스터디로 목표 점수에 도달하세요.
          </p>
          <div className="hero-buttons animate delay-3">
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">
              무료 스피킹 테스트 →
            </a>
            <a href="#free-resource" className="btn-secondary">
              무료 자료 받기
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
              <div className="number">2주</div>
              <div className="label">집중 완성 프로그램</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE RESOURCE + NEWSLETTER */}
      <section className="newsletter-section" id="free-resource">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-icon">✉️</div>
            <h2>OPIC 무료 자료<br /><span className="highlight">지금 바로 받아보세요</span></h2>
            <p>이메일을 구독하면 OPIC 준비에 꼭 필요한 무료 학습 자료를 보내드립니다.<br />매주 OPIC 꿀팁과 표현 정리도 함께 받아보세요.</p>

            {!newsletterSuccess ? (
              <>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input type="email" id="emailInput" placeholder="이메일 주소를 입력하세요" required />
                  <button type="submit">무료 자료 받기</button>
                </form>
                <div className="newsletter-note">스팸 없이, 언제든 구독 해지 가능합니다.</div>
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

      {/* STORE */}
      <section className="section section-gray" id="store">
        <div className="container">
          <div className="section-header">
            <div className="overline">Store</div>
            <h2>OPIC 준비의 모든 것,<br />여기서 시작하세요</h2>
            <p>전자책부터 인강, 2주 스터디까지. 나에게 맞는 학습 방법을 선택하세요.</p>
          </div>
          <div className="products-grid">

            {/* 전자책 */}
            <div className="product-card">
              <div className="product-card-image ebook-bg">
                <span className="product-badge hot">BEST</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--blue-primary)', letterSpacing: '-0.02em' }}>E-BOOK + 기출</span>
              </div>
              <div className="product-card-body">
                <div className="category">전자책</div>
                <h3>OPIC 전자책 + 기출 번들</h3>
                <div className="desc">실전 기출 문제와 프레임워크 답변 템플릿을 한 번에. 가장 많은 수강생이 선택한 베스트셀러.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="current">39,900</span>
                    <span className="unit">원</span>
                  </div>
                  <a href="https://blog.naver.com/lulu05/223353024018" target="_blank" className="btn-buy">구매하기</a>
                </div>
              </div>
            </div>

            {/* 인강 */}
            <div className="product-card">
              <div className="product-card-image course-bg">
                <span className="product-badge new">NEW</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#7C5CFC', letterSpacing: '-0.02em' }}>VIDEO COURSE</span>
              </div>
              <div className="product-card-body">
                <div className="category">인강</div>
                <h3>OPIC 완전정복 인강 패키지</h3>
                <div className="desc">유형별 답변 전략부터 실전 롤플레이까지. 프레임워크 기반 체계적 영상 강의.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="original">269,000원</span>
                    <span className="current">169,000</span>
                    <span className="unit">원</span>
                  </div>
                  <a href="https://sikbang-eng.liveklass.com/" target="_blank" className="btn-buy">수강하기</a>
                </div>
              </div>
            </div>

            {/* 스터디 */}
            <div className="product-card">
              <div className="product-card-image study-bg">
                <span className="product-badge">얼리버드</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1A8D48', letterSpacing: '-0.02em' }}>2-WEEK STUDY</span>
              </div>
              <div className="product-card-body">
                <div className="category">2주 스터디</div>
                <h3>2주 집중 OPIC 스터디</h3>
                <div className="desc">3인 소그룹 코칭 + SpeakCoach AI Pro 제공. 2주 안에 점수를 올리는 가장 확실한 방법.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="original">179,900원</span>
                    <span className="current">149,000</span>
                    <span className="unit">원</span>
                  </div>
                  <a href="/study" className="btn-buy">자세히 보기</a>
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
              <p>SpeakCoach AI는 녹음 한 번으로 당신의 OPIC 예상 등급과 약점을 분석합니다. 단순 점수가 아닌, 구체적인 교정 방향까지.</p>
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
                <div style={{ marginTop: '16px', padding: '12px', background: '#FFF5F5', borderRadius: '10px', fontSize: '12px', color: '#F04452' }}>
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
              <div className="plan-sub">월 단 커피 4~5잔 값 · 3개월 구독 시 63,500원</div>
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
              <div className="plan-sub">하루 약 1,163원으로 AL 달성 · 3개월 89,000원</div>
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
            <h2>실제 수강생들의 이야기</h2>
            <p>1,000개 이상의 실제 후기가 증명합니다.</p>
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
                    <div className="info">대학생 · 2주 스터디</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">2주 만에 IM2에서 IH로 올랐습니다. 프레임워크 답변이 진짜 효과적이에요. 혼자 했으면 절대 못 올렸을 점수입니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → IH</span>
                  <span className="grade-text">2주 만에 등급 상승</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">S</div>
                  <div className="review-meta">
                    <div className="name">서*영</div>
                    <div className="info">취준생 · 스터디 + AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">SpeakCoach AI로 매일 연습하고, 스터디에서 피드백 받으니까 내 약점이 정확히 보였어요. 결국 AL 받았습니다!</div>
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
                    <div className="info">직장인 · 전자책 + AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★<span className="empty">★</span></div>
                <div className="review-text">퇴근 후 시간이 없어서 전자책으로 틀 잡고, AI로 매일 15분씩 연습했어요. 한 달 만에 IM3 받았습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IL → IM3</span>
                  <span className="grade-text">3단계 상승</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">L</div>
                  <div className="review-meta">
                    <div className="name">이*진</div>
                    <div className="info">대학생 · 2주 스터디</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">3명이서 팀으로 하니까 긴장감도 있고, 서로 피드백 주는 게 진짜 도움됐어요. 취업 면접 전에 자신감도 생겼습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM1 → IH</span>
                  <span className="grade-text">목표 등급 달성</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">P</div>
                  <div className="review-meta">
                    <div className="name">박*희</div>
                    <div className="info">이직 준비 · 인강 + 스터디</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">인강으로 기본기 잡고 스터디에서 실전 연습하니까 시너지가 대단했어요. IH 목표였는데 AL이 나왔습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM3 → AL</span>
                  <span className="grade-text">목표 초과 달성</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">C</div>
                  <div className="review-meta">
                    <div className="name">최*아</div>
                    <div className="info">대학원생 · 전자책</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">프레임워크가 진짜 핵심이에요. 답변 구조를 잡으니까 어떤 질문이 나와도 당황하지 않게 됐어요.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → IH</span>
                  <span className="grade-text">전자책만으로 상승</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">H</div>
                  <div className="review-meta">
                    <div className="name">한*우</div>
                    <div className="info">직장인 · 2주 스터디</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">회사 승진 요건 때문에 급하게 시작했는데, 2주 만에 IH 나와서 진짜 감사합니다. 혼자 공부했으면 몇 달 걸렸을 거예요.</div>
                <div className="review-result">
                  <span className="grade-badge">IM1 → IH</span>
                  <span className="grade-text">승진 요건 충족</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">Y</div>
                  <div className="review-meta">
                    <div className="name">윤*서</div>
                    <div className="info">취준생 · 전자책 + 스터디</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">전자책으로 답변 틀 만들고 스터디에서 실전 연습하니까 시험장에서 떨리지 않았어요. 첫 시험에 IH 받았습니다!</div>
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
                    <div className="info">대학원생 · 스터디 + AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">SpeakCoach AI 피드백이 진짜 사람한테 받는 것처럼 구체적이에요. 발음, 문법 다 잡아줘서 자신감이 확 올랐습니다.</div>
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
                    <div className="info">직장인 · 전자책</div>
                  </div>
                </div>
                <div className="review-stars">★★★★<span className="empty">★</span></div>
                <div className="review-text">출퇴근 시간에 전자책 읽으면서 답변 외웠어요. 시간 없는 직장인한테 딱이에요. 3주 만에 IM3 달성했습니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IL → IM3</span>
                  <span className="grade-text">직장인 3주 성공</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">N</div>
                  <div className="review-meta">
                    <div className="name">남*은</div>
                    <div className="info">대학생 · 인강 + AI</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">인강 들으면서 구조 잡고, AI로 매일 연습했더니 2주 만에 점수가 확 올랐어요. 가성비 최고입니다.</div>
                <div className="review-result">
                  <span className="grade-badge">IM1 → IH</span>
                  <span className="grade-text">가성비 최고</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">W</div>
                  <div className="review-meta">
                    <div className="name">우*민</div>
                    <div className="info">이직 준비 · 2주 스터디</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">스터디 팀원들과 매일 연습하니까 혼자 공부할 때보다 효율이 5배는 된 것 같아요. 강력 추천합니다!</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 → IH</span>
                  <span className="grade-text">효율 5배 상승</span>
                </div>
              </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="reviews-count-badge">
            <span>누적 수강생 4,000+ · 실제 후기 1,000+ (liveclass 인증)</span>
          </div>
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

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="container">
          <h2>지금 바로 시작하세요</h2>
          <p>무료 스피킹 테스트로 나의 OPIC 예상 등급을 확인해보세요.</p>
          <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-white">무료 스피킹 테스트 시작 →</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">🍞 식빵영어</div>
              <p>2주 안에 OPIC 점수를 올리는<br />가장 구조적인 방법.</p>
            </div>
            <div className="footer-col">
              <h4>제품</h4>
              <a href="https://blog.naver.com/lulu05/223353024018" target="_blank">전자책</a>
              <a href="https://sikbang-eng.liveklass.com/" target="_blank">인강</a>
              <a href="/study">2주 스터디</a>
              <a href="https://sikbang-eng.replit.app/" target="_blank">SpeakCoach AI</a>
            </div>
            <div className="footer-col">
              <h4>고객지원</h4>
              <a href="#faq">자주 묻는 질문</a>
              <a href="http://pf.kakao.com/_SJYQn" target="_blank">카카오톡 문의</a>
              <a href="mailto:lulu066666@gmail.com">이메일 문의</a>
            </div>
            <div className="footer-col">
              <h4>소셜</h4>
              <a href="https://instagram.com/sikbang.eng" target="_blank">Instagram @sikbang.eng</a>
              <a href="https://blog.naver.com/lulu05" target="_blank">네이버 블로그</a>
              <a href="https://sikbang-eng.stibee.com/" target="_blank">뉴스레터 구독</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2025 식빵영어. All rights reserved.</span>
            <div className="social">
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
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
    </>
  );
}
