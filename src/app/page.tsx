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

      {/* REVIEWS SECTION */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="section-header">
            <div className="overline">Reviews</div>
            <h2>1,000+ 수강생들의 후기</h2>
            <p>식빵영어 프로그램으로 목표 점수를 달성한 수강생들의 생생한 경험담</p>
          </div>

          <div className="reviews-wrapper" style={{ background: 'var(--bg-white)', borderRadius: '20px', padding: '40px 0' }}>
            <div className="reviews-scroll">
              {/* Review 1 */}
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">김</div>
                  <div className="review-meta">
                    <div className="name">김민지</div>
                    <div className="info">2주 스터디 수강생</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">프레임워크를 배우니까 말할 게 정말 많아졌어요. 2주 동안 꾸준히 따라가니 점수가 정말 많이 올랐습니다!</div>
                <div className="review-result">
                  <div className="grade-badge">IH 달성</div>
                  <div className="grade-text">IL → IH (2주)</div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">이</div>
                  <div className="review-meta">
                    <div className="name">이준호</div>
                    <div className="info">인강 수강생</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">AI 분석이 정말 정확해요. 어떤 부분을 집중해야 할지 명확하게 보여줘서 공부하기 좋았습니다.</div>
                <div className="review-result">
                  <div className="grade-badge">IM2 달성</div>
                  <div className="grade-text">IM1 → IM2 (3주)</div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">박</div>
                  <div className="review-meta">
                    <div className="name">박영희</div>
                    <div className="info">전자책 + AI 사용자</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">전자책의 예제들이 정말 실용적이고, 무료 AI로도 충분히 도움이 됐어요. 가성비 최고!</div>
                <div className="review-result">
                  <div className="grade-badge">IM2 달성</div>
                  <div className="grade-text">IM1 → IM2</div>
                </div>
              </div>

              {/* Review 4 */}
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">최</div>
                  <div className="review-meta">
                    <div className="name">최동욱</div>
                    <div className="info">2주 스터디 수강생</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">팀원들과 함께하니까 동기부여가 정말 좋았어요. 코치님 피드백도 실용적이고 좋았습니다.</div>
                <div className="review-result">
                  <div className="grade-badge">AL 달성</div>
                  <div className="grade-text">IH → AL (2주)</div>
                </div>
              </div>

              {/* Review 5 */}
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">정</div>
                  <div className="review-meta">
                    <div className="name">정수진</div>
                    <div className="info">인강 + 스터디 수강생</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">인강으로 기초를 다지고 스터디로 실전을 연습했어요. 완벽한 조합입니다!</div>
                <div className="review-result">
                  <div className="grade-badge">AL 달성</div>
                  <div className="grade-text">IM2 → AL (4주)</div>
                </div>
              </div>

              {/* Review 6 */}
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">홍</div>
                  <div className="review-meta">
                    <div className="name">홍기선</div>
                    <div className="info">AI 무료 체험 후 결제</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">무료로 AI를 체험한 후 유료 구독했어요. 매번 조금씩 점수가 올라가는 게 느껴집니다.</div>
                <div className="review-result">
                  <div className="grade-badge">IH 달성</div>
                  <div className="grade-text">IM1 → IH (5주)</div>
                </div>
              </div>

              {/* Duplicate for seamless loop */}
              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">김</div>
                  <div className="review-meta">
                    <div className="name">김민지</div>
                    <div className="info">2주 스터디 수강생</div>
                  </div>
                </div>
                <div className="review-stars">★★★★★</div>
                <div className="review-text">프레임워크를 배우니까 말할 게 정말 많아졌어요. 2주 동안 꾸준히 따라가니 점수가 정말 많이 올랐습니다!</div>
                <div className="review-result">
                  <div className="grade-badge">IH 달성</div>
                  <div className="grade-text">IL → IH (2주)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="reviews-count-badge">
            <span>🎉 현재까지 1,000+ 명의 학생들이 목표 점수를 달성했습니다</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-gray" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="overline">FAQ</div>
            <h2>자주 묻는 질문</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openFaqIndex === index ? 'open' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  <span>{item.question}</span>
                  <span className="arrow">▼</span>
                </button>
                <div
                  className="faq-answer"
                  style={{
                    maxHeight: openFaqIndex === index ? '200px' : '0',
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
          <h2>지금 바로 시작하세요</h2>
          <p>식빵영어와 함께 OPIC 목표 점수를 달성하세요</p>
          <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-white">
            무료 스피킹 테스트 시작 →
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <span>🍞</span> 식빵영어
              </div>
              <p>OPIC 점수를 올리는 가장 구조적인 방법. 프레임워크 기반의 체계적인 교육과 AI 피드백으로 당신의 목표를 이루세요.</p>
            </div>
            <div className="footer-col">
              <h4>서비스</h4>
              <a href="#store">스토어</a>
              <a href="#speakcoach">SpeakCoach AI</a>
              <a href="/study">2주 스터디</a>
            </div>
            <div className="footer-col">
              <h4>정보</h4>
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
              <a href="#">FAQ</a>
            </div>
            <div className="footer-col">
              <h4>연락</h4>
              <a href="http://pf.kakao.com/_SJYQn">카카오톡 문의</a>
              <a href="mailto:support@sikbang-eng.com">이메일</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2024 식빵영어. All rights reserved.</div>
            <div className="social">
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      {/* KAKAO FLOATING BUTTON */}
      <div className="kakao-float">
        <div className="kakao-tooltip">카카오톡 문의</div>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" className="kakao-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 5.58 2 10c0 2.54 1.51 4.79 3.75 6.16l-.6 2.17 2.5-1.53c.83.16 1.7.24 2.6.24 5.52 0 10-3.58 10-8 0-4.42-4.48-8-10-8zm0 14c-.84 0-1.66-.1-2.46-.28l-1.8 1.09.43-1.57C4.5 13.75 3 12 3 10c0-3.87 3.91-7 8.73-7 4.82 0 8.73 3.13 8.73 7s-3.91 7-8.73 7z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
