'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  // Nav shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavShadow(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll reviews
  useEffect(() => {
    const scroll = reviewScrollRef.current;
    if (!scroll) return;

    let dir = 1;
    let paused = false;

    const handleMouseEnter = () => { paused = true; };
    const handleMouseLeave = () => { paused = false; };
    const handleTouchStart = () => { paused = true; };
    const handleTouchEnd = () => {
      setTimeout(() => { paused = false; }, 2000);
    };

    scroll.addEventListener('mouseenter', handleMouseEnter);
    scroll.addEventListener('mouseleave', handleMouseLeave);
    scroll.addEventListener('touchstart', handleTouchStart, { passive: true } as any);
    scroll.addEventListener('touchend', handleTouchEnd);

    const interval = setInterval(() => {
      if (paused) return;
      const max = scroll.scrollWidth - scroll.clientWidth;
      if (max <= 0) return;
      if (scroll.scrollLeft >= max - 2) dir = -1;
      if (scroll.scrollLeft <= 2) dir = 1;
      scroll.scrollLeft += dir;
    }, 30);

    return () => {
      clearInterval(interval);
      scroll.removeEventListener('mouseenter', handleMouseEnter);
      scroll.removeEventListener('mouseleave', handleMouseLeave);
      scroll.removeEventListener('touchstart', handleTouchStart);
      scroll.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

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

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.querySelector('#emailInput') as HTMLInputElement)?.value;
    if (email) {
      window.open('https://sikbang-eng.stibee.com/', '_blank');
      setNewsletterSuccess(true);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "OPICì ì²ì ì¤ë¹íëë° ì´ëìë¶í° ììí´ì¼ íëì?",
      answer: "íì¬ ë ë²¨ì ë°ë¼ ì¶ì² ê²½ë¡ê° ë¬ë¼ì. ìì´ ê¸°ì´ê° ë¶ì¡±íë¤ë©´ ì ìì±ì¼ë¡ íë ììí¬ë¥¼ ë¨¼ì  ìµíê³ , ë¨ê¸°ê°ì ê²°ê³¼ë¥¼ ë´ê³  ì¶ë¤ë©´ 2ì£¼ ì¤í°ëë¥¼ ì¶ì²í©ëë¤. ì ëª¨ë¥´ê² ë¤ë©´ SpeakCoach AIìì ë¬´ë  íì¤í¸ë¥¼ ë¨¼ì  í´ë³´ì¸ì. íì¬ ìì ë±ê¸ì ë°ë¡ íì¸í  ì ììµëë¤."
    },
    {
      question: "SpeakCoach AIë ì´ë»ê² ì¬ì©íëì?",
      answer: "SpeakCoach AIë ì¹ ì±(PWA)ì´ë¼ ë³ë ì¤ì¹ ìì´ ë¸ë¼ì°ì ìì ë°ë¡ ì ìí  ì ìì´ì. ê°ì í ëµë³ì ë¹ìíë©´ AIê° ë°ì, ë¬¸ë², ì ì°½ì±, ì´í ë± 7ê° ì¹´íê³ ë¦¬ë¡ ë¶ìí´ì ìì ë±ê¸ê³¼ êµ¬ì²´ì ì¸ í¼ëë°±ì ì ê³µíªkë¤. ë¬´ë£ ì²´íë ê°ë¥í©ëë¤."
    },
    {
      question: "2ì£¼ ì¤í°ëë ì´ë¤ ìì¼ë¡ ì§íëëì?",
      answer: "3ì¸ 1íì¼ë¡ êµ¬ì±ëë©°, 14ì¼ ëì ë§¤ì¼ ì¤í´í¸ ê³¼ì ë¥¼ ì ì¶í©ëë¤. ì½ì¹ì ì¤ìê° í¼ëë°± + SpeakCoach AIì ì ë° ë¶ìì í¨ê» ë°ìµëë¤. ì¹´ì¹´ì¤í¡ ê·¸ë£¹ìì ì íµíë©°, 1ì£¼ì°¨ë ê¸°ë³¸ íë ììí¬, 2ì£¼ì°¨ë ì¤ì  ëª¨ìê³ ì¬ì ì§ì¤í©ëë¤. ìì¸í ë´ì©ì ì¤í°ë ìì¸ íì´ì§ìì íì¸íì¸ì."
    },
    {
      question: "ìì´ë¥¼ ì§ì§ ëª»íëë° ë°ë¼ê° ì ììê¹ì?",
      answer: "ë¤, ê°ë¥í©ëë¤. íë ììí¬ ê¸°ë° íë  ì´ë¼ ìì´ë¥¼ ì ëª»íëë¼ë ëµë³ êµ¬ì¡°ë¥¼ ë°ë¼ê°ë©° íìµí  ì ìì´ì. ì¤ì ë¡ IL ìì¤ìì ììí´ì IM2, IHë¥¼ ë¬ì±í ë¶ë¤ì´ ë§ìµëë¤. ì¤ìí ê±´ ë§¤ì¼ ê¾¸ì¤í ê³¼ì ë¥¼ ì ì¶íë ê²ìëë¤."
    },
    {
      question: "ì§ì¥ì¸ì¸ë° ìê° í¬ìê° ë§ì´ íìíê°ì?",
      answer: "íë£¨ íê·° 1~2ìê°ì´ë©´ ì¶©ë¶í©ëë¤. íìµ ìë£ íì¸ 10ë¶, ëµë³ ì¤ë¹ ë° ë¹ì 30~40ë¶, AI ë¶ì íì¸ 20ë¶, ì½ì¹ í¼ëë°± ë°ì 20ë¶ ì ëìì. ì¶í´ê·¼ ìê°ì ìë£ë¥¼ ë³´ê³ , í´ê·¼ í ë¹ìíë í¨í´ì¼ë¡ ì§ííìë ì§ì¥ì¸ë¶ë¤ì´ ë§ìµëë¤."
    },
    {
      question: "íë¶ì ì´ë»ê² ëëì?",
      answer: "ì¤í°ëì ê²½ì° ìì ì  100% íë¶, ìì í 3ì¼ ì´ë´ 50% íë¶ì´ ê°ë¥í©ëë¤. SpeakCoach AI êµ¬ëì ê²°ì  í 7ì¼ ì´ë´ íë¶ ê°ë¥í©ëë¤. ìì¸í ì¬í­ì ì¹´ì¹´ì¤í¡ì¼ë¡ ë¬¸ìí´ì£¼ì¸ì."
    },
    {
      question: "ì ìì±, ì¸ê°, ì¤í°ë ì¤ ­À ì íí´ì¼ íëì?",
      answer: "ëª©íì ìí©ì ë°ë¼ ë¬ë¼ì. ëí ì í¸ + ê¸°ì´ íìµì´ë©´ ì ìì±, ì²´ê³ì  ìì ê°ìë¥¼ ìíë©´ ì¸ê°, ë¨ê¸°ê° íì¤í ì±ê³¼ë¥¼ ìíë©´ 2ì£¼ ì¤í°ëë¥¼ ì¶ì²í©ëë¤. ê°ì¥ í¨ê³¼ê° ì¢ì ì¡°í©ì ì¸ê° + ì¤í°ëì´ê³ , ìì°ì´ ì íì ì´ë¼ë©´ ì ìì± + SpeakCoach AI ë¬´ë  í´íì¼ë¡ ììí´ë³´ì¸ì."
    }
  ];

  return (
    <>
      {/* NAV */}
      <nav className="nav" id="nav" style={{ boxShadow: navShadow ? '0 1px 12px rgba(0,0,0,0.08)' : 'none' }}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="bread-icon">ð</span> ìë¹µìì´
          </a>
          <div className="nav-links">
            <a href="#free-resource">ë¬´ë£ ìë£</a>
            <a href="#store">ì¤í ì´</a>
            <a href="#speakcoach">SpeakCoach AI</a>
            <a href="#reviews">íê¸°</a>
            <a href="#faq">FAQ</a>
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="nav-cta">ë¬´ë£ ì²´ííê¸°</a>
          </div>
          <button className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <a href="#free-resource" onClick={closeMobileMenu}>ë¬´ë£ ìë£</a>
        <a href="#store" onClick={closeMobileMenu}>ì¤í ì´</a>
        <a href="#speakcoach" onClick={closeMobileMenu}>SpeakCoach AI</a>
        <a href="#reviews" onClick={closeMobileMenu}>íê¸°</a>
        <a href="#faq" onClick={closeMobileMenu}>FAQ</a>
        <a href="/study" onClick={closeMobileMenu}>2ì£¼ ì¤í°ë</a>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" onClick={closeMobileMenu}>ì¹´ì¹´ì¤í¡ ë¬¸ì</a>
        <a href="https://sikbang-eng.replit.app/" target="_blank" className="mobile-cta" onClick={closeMobileMenu}>ë¬´ë£ ì¤í¼í¹ íì¤í¸ â</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge animate">2ì£¼ ìì± OPIC íë¡ê·¸ë¨</div>
          <h1 className="animate delay-1">
            OPIC ì ìë¥¼ ì¬ë¦¬ë<br />
            <span className="highlight">ê°ì¥ êµ¬ì¡°ì ì¸ ë°©ë²</span>
          </h1>
          <p className="animate delay-2">
            ì¬ëì ì½ì¹­ê³¼ AI í¼ëë°±ì ê²°í©.<br />
            ìë¹µìì´ì 2ì£¼ ì¤í°ëë¡ ëª©í ì ìì ëë¬íì¸ì.
          </p>
          <div className="hero-buttons animate delay-3">
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">
              ë¬´ë£ ì¤í´í¹ íì¤í¸ â
            </a>
            <a href="#free-resource" className="btn-secondary">
              ë¬´ë£ ìë£ ë°ê¸°
            </a>
          </div>
          <div className="hero-stats animate delay-4">
            <div className="hero-stat">
              <div className="number">4,000+</div>
              <div className="label">ëì  ìê°ì</div>
            </div>
            <div className="hero-stat">
              <div className="number">1,000+</div>
              <div className="label">ìê°ì íê¸°</div>
            </div>
            <div className="hero-stat">
              <div className="number">2ì£¼</div>
              <div className="label">ì§ì¤ ìì± íë¡ê·¸ë¨</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE RESOURCE + NEWSLETTER */}
      <section className="newsletter-section" id="free-resource">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-icon">âï¸</div>
            <h2>OPIC ë¬´ë£ ìë£<br /><span className="highlight">ì§ê¸ ë°ë¡ ë°ìë³´ì¸ì</span></h2>
            <p>ì´ë©ì¼ì êµ¬ëíë©´ OPIC ì¤ë¹ì ê¼­ íìí ë¬´ë£ íìµ ìë£ë¥¼ ë³´ë´ëë¦½ëë¤.<br />ë§¤ì£¼ OPIC ê¿íê³¼ íí ì ë¦¬ë í¨ê» ë°ìë³´ì¸ì.</p>

            {!newsletterSuccess ? (
              <>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input type="email" id="emailInput" placeholder="ì´ë©ì¼ ì£¼ìë¥¼ ìë ¥íì¸ì" required />
                  <button type="submit">ë¬´ë£ ìë£ ë°ê¸°</button>
                </form>
                <div className="newsletter-note">ì¤í¸ ìì´, ì¸ì ë  êµ¬ë í´ì§ ê°ë¥í©ëë¤.</div>
              </>
            ) : (
              <div className="newsletter-success show">
                êµ¬ë ìë£! ì´ë©ì¼ë¡ ë¬´ë£ ìë£ ë§í¬ë¥¼ ë³´ë´ëë ¸ìµëë¤.
              </div>
            )}

            <div className="newsletter-benefits">
              <div className="newsletter-benefit">
                <div className="check">â</div>
                OPIC íì íí ì ë¦¬
              </div>
              <div className="newsletter-benefit">
                <div className="check">â</div>
                íë ììí¬ ëµë³ ííë¦¿
              </div>
              <div className="newsletter-benefit">
                <div className="check">â</div>
                ë§¤ì£¼ ì¤í¼í¹ ê¿í ë°ì¡
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
            <h2>OPIC ì¤ë¹ì ëª¨ë  ê²,<br />ì¬ê¸°ì ììíì¸ì</h2>
            <p>ì ìì±ë¶í° ì¸ê°, 2ì£¼ ì¤í°ëê¹ì§. ëìê² ë§ë íìµ ë°©ë²ì ì ííì¸ì.</p>
          </div>
          <div className="products-grid">

            {/* ì ìì± */}
            <div className="product-card">
              <div className="product-card-image ebook-bg">
                <span className="product-badge hot">BEST</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--blue-primary)', letterSpacing: '-0.02em' }}>E-BOOK + ê¸°ì¶</span>
              </div>
              <div className="product-card-body">
                <div className="category">ì ìì±</div>
                <h3>OPIC ì ìì± + ê¸°ì¶ ë²ë¤</h3>
                <div className="desc">ì¤ì  ê¸°ì¶ ë¬¸ì ì íë ììí¬ ëµë³ ííë¦¿ì í ë²ì. ê°ì¥ ë§ì ìê°ìì´ ì íí ë² ì¤í¸ìë¬.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="current">39,900</span>
                    <span className="unit">ì</span>
                  </div>
                  <a href="https://blog.naver.com/lulu05/223353024018" target="_blank" className="btn-buy">êµ¬ë§¤íê¸°</a>
                </div>
              </div>
            </div>

            {/* ì¸ê° */}
            <div className="product-card">
              <div className="product-card-image course-bg">
                <span className="product-badge new">NEW</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#7C5CFC', letterSpacing: '-0.02em' }}>VIDEO COURSE</span>
              </div>
              <div className="product-card-body">
                <div className="category">ì¸ê°</div>
                <h3>OPIC ìì ì ë³µ ì¸ê° í¨í¤ì§</h3>
                <div className="desc">ì íë³ ëµë³ ì ëµë¶í° ì¤ì  ë¡¤íë ì´ê¹ì§. íë ììí¬ ê¸°ë° ì²´ê³ì  ìì ê°ì.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="original">269,000ì</span>
                    <span className="current">169,000</span>
                    <span className="unit">ì</span>
                  </div>
                  <a href="https://sikbang-eng.liveklass.com/" target="_blank" className="btn-buy">ìê°íê¸°</a>
                </div>
              </div>
            </div>

            {/* ì¤í°ë */}
            <div className="product-card">
              <div className="product-card-image study-bg">
                <span className="product-badge">ì¼ë¦¬ë²ë</span>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1A8D48', letterSpacing: '-0.02em' }}>2-WEEK STUDY</span>
              </div>
              <div className="product-card-body">
                <div className="category">2ì£¼ ì¤í°ë</div>
                <h3>2ì£¼ ì§ì¤ OPIC ì¤í°ë</h3>
                <div className="desc">3ì¸ ìê·¸ë£¹ ì½ì¹­ + SpeakCoach AI Pro ì ê³µ. 2ì£¼ ìì ì ìë¥¼ ì¬ë¦¬ë ê°ì¥ íì¤í ë°©ë².</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="original">179,900ì</span>
                    <span className="current">149,000</span>
                    <span className="unit">ì</span>
                  </div>
                  <a href="/study" className="btn-buy">ìì¸í ë³´ê¸°</a>
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
                ëì ì¤í¼í¹ì<br />
                <span className="highlight">AIê° ë¶ì</span>í©ëë¤
              </h2>
              <p>SpeakCoach AIë ë¹ì í ë²ì¼ë¡ ë¹ì ì OPIC ìì ë±ê¸ê³¼ ì½ì ì ë¶ìí©ëë¤. ë¨ì ì ìê° ìë, êµ¬ì²´ì ì¸ êµì  ë°©í¥ê¹ì§.</p>
              <div className="speakcoach-features">
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '16px' }}>STT</div>
                  <div className="feature-text">
                    <h4>ëµë³ ë¹ì & STT ë³í</h4>
                    <p>OpenAI Whisper ê¸°ë° ì ë° ìì± ì¸ì</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '16px' }}>AI</div>
                  <div className="feature-text">
                    <h4>7ê° ì¹´íê³ ë¦¬ AI ë¶ì</h4>
                    <p>ë¬¸ë², ì´í, ì ì°½ì± ë± ìì¸ ì¤í¬ë³ í¼ëë°±</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '14px' }}>FIX</div>
                  <div className="feature-text">
                    <h4>ì½ì  êµì  ëë¦¸</h4>
                    <p>ê°ì¥ ì½í ìì­ì ì§ì¤ íë ¨íë 7ë¶ êµì  ì¸ì</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '14px' }}>TEST</div>
                  <div className="feature-text">
                    <h4>ì¤ì  ëª¨ìê³ ì¬</h4>
                    <p>35ë¶ / 14ë¬¸í­ ì¥ì  OPIC íì ëª¨ì íì¤í¸</p>
                  </div>
                </div>
              </div>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">ë¬´ë£ë¡ ë´ ë±ê¸ íì¸íê¸° â</a>
            </div>

            {/* MOCKUP */}
            <div className="speakcoach-mockup">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <div className="mockup-screen">
                <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '4px' }}>SpeakCoach AI ë¶ì ê²°ê³¼</div>
                <div className="mockup-grade-row">
                  <div>
                    <div className="mockup-grade">IH</div>
                    <div className="mockup-grade-label">ìì ë±ê¸</div>
                  </div>
                  <div className="mockup-al-prob">
                    <div className="prob-num">47%</div>
                    <div className="prob-label">AL íì </div>
                  </div>
                </div>
                <div className="mockup-bars">
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">ì ì°½ì±</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '78%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">ë¬¸ë²</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill mid" style={{ width: '62%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">ì´í</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '85%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">ë°ì</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '73%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">êµ¬ì±ë ¥</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill weak" style={{ width: '45%' }}></div></div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '12px', background: '#FFF5F5', borderRadius: '10px', fontSize: '12px', color: '#F04452' }}>
                  <strong>êµ¬ì±ë ¥</strong>ì´ ê°ì¥ ìí ìì­ìëë¤. êµì  ëë¦´ì ììí´ë³´ì¸ì.
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
            <h2>SpeakCoach AI ìê¸ì </h2>
            <p>ì»¤í¼ í ì ê°ì¼ë¡ AI ì¤í¼í¹ ì½ì¹ë¥¼ ë§ëë³´ì¸ì.</p>
          </div>
          <div className="pricing-grid">

            {/* FREE */}
            <div className="pricing-card">
              <div className="plan-name">ë¬´ë£ ì´ì©ì</div>
              <div className="plan-price">0<span className="won">ì</span></div>
              <div className="plan-sub">ê°ì í 7ì¼ê° ë¬´ë£</div>
              <ul className="plan-features">
                <li>7ì¼ê° ë¬´ë£ ì²´í</li>
                <li>1ì¼ 1í ì°ìµ</li>
                <li>AI í¼ëë°± &amp; ì ì</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan outline" style={{ display: 'block' }}>ë¬´ë£ë¡ ììíê¸°</a>
            </div>

            {/* PRO */}
            <div className="pricing-card featured">
              <div className="recommend-badge">ì¶ì²</div>
              <div className="plan-name">íë¡ í¨í¤ì§</div>
              <div className="plan-original">31,900ì</div>
              <div className="plan-price">24,900<span className="won">ì</span></div>
              <div className="plan-sub">ì ë¨ ì»¤í¼ 4~5ì ê° Â· 3ê°ì êµ¬ë ì 63,500ì</div>
              <ul className="plan-features">
                <li>ë¬´ì í ì°ìµ</li>
                <li>500ê° ì´ì OPIC ë¬¸ì </li>
                <li>ì íë³ ë§ì¶¤ íí°ë§</li>
                <li>ìì¸ AI í¼ëë°±</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan primary" style={{ display: 'block' }}>ë¬´ë£ë¡ ììíê¸°</a>
            </div>

            {/* PREMIUM */}
            <div className="pricing-card">
              <div className="plan-name">íë¦¬ë¯¸ì í¨í¤ì§</div>
              <div className="plan-original">41,900ì</div>
              <div className="plan-price">34,900<span className="won">ì</span></div>
              <div className="plan-sub">íë£¨ ì½ 1,163ìì¼ë¡ AL ë¬ì± Â· 3ê°ì 89,000ì</div>
              <ul className="plan-features">
                <li>íë¡ ëª¨ë  ê¸°ë¥ í¬í¨</li>
                <li>ì¥ì  ëª¨ìê³ ì¬ 10ì¸í¸</li>
                <li>Native Shadowing</li>
                <li>ê³ ê¸ í¸ëí¹ &amp; ì¸ì¬ì´í¸</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan outline" style={{ display: 'block' }}>íë¦¬ë¯¸ìì¼ë¡ ììíê¸°</a>
            </div>

          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="section-header">
            <div className="overline">Reviews</div>
            <h2>ì¤ì  ìê°ìë¤ì ì´ì¼ê¸°</h2>
            <p>1,000ê° ì´ìì ì¤ì  íê¸°ê° ì¦ëªí©ëë¤.</p>
          </div>
          <div className="reviews-wrapper">
            <div className="reviews-scroll" ref={reviewScrollRef}>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">J</div>
                  <div className="review-meta">
                    <div className="name">ì *í</div>
                    <div className="info">ëíì Â· 2ì£¼ ì¤í°ë</div>
                  </div>
                </div>
                <div className="review-stars">âââââ</div>
                <div className="review-text">2ì£¼ ë§ì IM2ìì IHë¡ ì¬ëìµëë¤. íë ììí¬ ëµë³ì´ ì§ì§ í¨ê³¼ì ì´ìì. í¼ì íì¼ë©´ ì ë ëª» ì¬ë ´ì ì ììëë¤.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 â IH</span>
                  <span className="grade-text">2ì£¼ ë§ì ë±ê¸ ìì¹</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">S</div>
                  <div className="review-meta">
                    <div className="name">ì*ì</div>
                    <div className="info">ì·¨ì¤ì Â· ì¤í°ë + AI</div>
                  </div>
                </div>
                <div className="review-stars">âââââ</div>
                <div className="review-text">SpeakCoach AIë¡ ë§¤ì¼ ì°ìµíê³ , ì¤í°ëìì í¼ëë°± ë°ì¼ëê¹ ë´ ì½ì ì´ ì íí ë³´ìì´ì. ê²°êµ­ AL ë°ììµëë¤!</div>
                <div className="review-result">
                  <span className="grade-badge">IH â AL</span>
                  <span className="grade-text">ìµê³  ë±ê¸ ë¬ì±</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">K</div>
                  <div className="review-meta">
                    <div className="name">ê¹*ì</div>
                    <div className="info">ì§ì¥ì¸ Â· ì ìì± + AI</div>
                  </div>
                </div>
                <div className="review-stars">ââââ<span className="empty">â</span></div>
                <div className="review-text">í´ê·¼ í ìê°ì´ ìì´ì ì ìì±ì¼ë¡ í ì¡ê³ , AIë¡ ë§¤ì¼ 15ë¶ì© ì°ìµíì´ì. í ë¬ ë§ì IM3 ë°ììµëë¤.</div>
                <div className="review-result">
                  <span className="grade-badge">IL â IM3</span>
                  <span className="grade-text">3ë¨ê³ ìì¹</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">L</div>
                  <div className="review-meta">
                    <div className="name">ì´*ì§</div>
                    <div className="info">ëíì Â· 2ì£¼ ì¤í°ë</div>
                  </div>
                </div>
                <div className="review-stars">âââââ</div>
                <div className="review-text">3ëªì´ì íì¼ë¡ íëê¹ ê¸´ì¥ê°ë ìê³ , ìë¡ í¼ëë°± ì£¼ë ê² ì§ì§ ëìëì´ì. ì·¨ì ë©´ì  ì ì ìì ê°ë ìê²¼ìµëë¤.</div>
                <div className="review-result">
                  <span className="grade-badge">IM1 â IH</span>
                  <span className="grade-text">ëª©í ë±ê¸ ë¬ì±</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">P</div>
                  <div className="review-meta">
                    <div className="name">ë°*í¬</div>
                    <div className="info">ì´ì§ ì¤ë¹ Â· ì¸ê° + ì¤í°ë</div>
                  </div>
                </div>
                <div className="review-stars">âââââ</div>
                <div className="review-text">ì¸ê°ì¼ë¡ ê¸°ë³¸ê¸° ì¡ê³  ì¤í°ëìì ì¤ì  ì°ìµíëê¹ ìëì§ê° ëë¨íì´ì. IH ëª©íìëë° ALì´ ëììµëë¤.</div>
                <div className="review-result">
                  <span className="grade-badge">IM3 â AL</span>
                  <span className="grade-text">ëª©í ì´ê³¼ ë¬ì±</span>
                </div>
              </div>

              <div className="review-card">
                <div className="review-top">
                  <div className="review-avatar">C</div>
                  <div className="review-meta">
                    <div className="name">ìµ*ì</div>
                    <div className="info">ëíìì Â· ì ìì±</div>
                  </div>
                </div>
                <div className="review-stars">âââââ</div>
                <div className="review-text">íë ììí¬ê° ì§ì§ íµì¬ì´ìì´ì. ëµë³ êµ¬ì¡°ë¥¼ ì¡ì¼ëê¹ ì´ë¤ ì§ë¬¸ì´ ëìë ë¹í©íì§ ìê² ëì´ì.</div>
                <div className="review-result">
                  <span className="grade-badge">IM2 â IH</span>
                  <span className="grade-text">ì ìì±ë§ì¼ë¡ ìì¹</span>
                </div>
              </div>

            </div>
          </div>
          <div className="reviews-count-badge">
            <span>ëì  ìê°ì 4,000+ Â· ì¤ì  íê¸° 1,000+ (liveclass ì¸ì¦)</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-gray" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="overline">FAQ</div>
            <h2>ìì£¼ ë¬»ë ì§ë¬¸</h2>
            <p>ê¶ê¸í ì ì´ ìë¤ë©´ ë¨¼ì  íì¸í´ë³´ì¸ì.</p>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${openFaqIndex === index ? 'open' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  {item.question}
                  <span className="arrow">â¼</span>
                </button>
                <div
                  className="faq-answer"
                  style={{
                    maxHeight: openFaqIndex === index ? 'fit-content' : '0'
                  }}
                >
                  <div className="faq-answer-inner">
                    {item.answer.includes('ì¤í°ë ìì¸ íì´ì§') ? (
                      <>
                        {item.answer.split('<a href="sikbang-eng-study.html"')[0]}
                        <a href="/study" style={{ color: 'var(--blue-primary)', fontWeight: '600' }}>ì¤í°ë ìì¸ íì´ì§</a>
                        {item.answer.split('</a>')[1]}
                      </>
                    ) : (
                      item.answer
                    )}
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
          <h2>ì§ê¸ ë°ë¡ ììíì¸ì</h2>
          <p>ë¬´ë£ ì¤í¼í¹ íì¤í¸ë¡ ëì OPIC ìì ë±ê¸ì íì¸í´ë³´ì¸ì.</p>
          <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-white">ë¬´ë£ ì¤í´í¹ íì¤í¸ ìì â</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">ð ìë¹µìì´</div>
              <p>2ì£¼ ìì OPIC ì ìë¥¼ ì¬ë¦¬ë<br />ê°ì¥ êµ¬ì¡°ì ì¸ ë°©ë².</p>
            </div>
            <div className="footer-col">
              <h4>ì í</h4>
              <a href="https://blog.naver.com/lulu05/223353024018" target="_blank">ì ìì±</a>
              <a href="https://sikbang-eng.liveklass.com/" target="_blank">ì¸ê°</a>
              <a href="/study">2ì£¼ ì¤í°ë</a>
              <a href="https://sikbang-eng.replit.app/" target="_blank">SpeakCoach AI</a>
            </div>
            <div className="footer-col">
              <h4>ê³ ê°é¼ì</h4>
              <a href="#faq">ìì£¼ ëª»ë ì§ë¬¸</a>
              <a href="http://pf.kakao.com/_SJYQn" target="_blank">ì¹´ì¹´ì¤í¡ ë¬¸ì</a>
              <a href="mailto:lulu066666@gmail.com">ì´ë©ì¼ ë¬¸ì</a>
            </div>
            <div className="footer-col">
              <h4>ìì</h4>
              <a href="https://instagram.com/sikbang.eng" target="_blank">Instagram @sikbang.eng</a>
              <a href="https://blog.naver.com/lulu05" target="_blank">ë¤ì´ë² ë¸ë¡ê·¸</a>
              <a href="https://sikbang-eng.stibee.com/" target="_blank">ë¹ì¤ë í° êµ¬ë</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2025 ìë¹µìì´. All rights reserved.</span>
            <div className="social">
              <a href="#">ì´ì©ì½ê´</a>
              <a href="#">ê°ì¸ì ë³´ì²ë¦¬ë°©ì¹¨</a>
            </div>
          </div>
        </div>
      </footer>

      {/* KAKAOTALK FLOATING BUTTON */}
      <div className="kakao-float">
        <div className="kakao-tooltip">ê¶ê¸í ì ì´ ìì¼ì ê°ì?</div>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" className="kakao-btn" aria-label="ì¹´ì¹´ì¤í¡ ìë´">
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
