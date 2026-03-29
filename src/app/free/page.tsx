'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FreePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Nav shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavShadow(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (err) {
        console.log('Email save attempted:', err);
      }
      setNewsletterSuccess(true);
    }
  };

  const lectures = [
    {
      tag: '입문',
      tagColor: '#3182F6',
      title: '오픽 자기소개, 이렇게 시작하세요',
      description: '첫 문장에서 면접관의 인상이 결정됩니다. 3문장 공식.'
    },
    {
      tag: '입문',
      tagColor: '#3182F6',
      title: '오픽 서베이 항목, 이렇게 고르세요',
      description: '잘못 고르면 2주 낭비. 본인 스토리와 맞는 항목 선택법.'
    },
    {
      tag: '입문',
      tagColor: '#3182F6',
      title: '오픽 답변 3단 공식',
      description: '도입-본론-마무리. 이 구조만 익히면 어떤 질문이든 1분 30초 채울 수 있습니다.'
    },
    {
      tag: '중급',
      tagColor: '#6B4EFF',
      title: 'IM vs IH vs AL, 실제 답변 비교',
      description: '같은 질문에 대한 등급별 답변을 들어보세요. 차이가 들립니다.'
    },
    {
      tag: '중급',
      tagColor: '#6B4EFF',
      title: '오픽 롤플레이, 공식으로 풀기',
      description: '롤플레이는 외우는 게 아니라 패턴입니다. 전화/예약/불만 3가지 공식.'
    },
    {
      tag: '실전',
      tagColor: '#FF6B35',
      title: '오픽 돌발 질문 Top 5',
      description: '당황하면 끝. 미리 패턴을 익혀두면 돌발이 돌발이 아닙니다.'
    },
    {
      tag: '실전',
      tagColor: '#FF6B35',
      title: '오픽 시험 당일 루틴 & 꿀팁',
      description: '시험 전날부터 당일까지 컨디션 관리. 수료생 500명이 공유한 팁 모음.'
    },
    {
      tag: '입문',
      tagColor: '#3182F6',
      title: '토익스피킹 vs 오픽, 뭘 볼까?',
      description: '둘 다 스피킹 시험인데 전략이 완전 다릅니다. 나에게 맞는 시험 고르기.'
    }
  ];

  const resources = [
    {
      category: '표현',
      categoryColor: '#1A8D48',
      title: 'OPIC 필수 표현 30선',
      description: 'IH 이상 받으려면 이 표현들은 자동으로 나와야 합니다',
      link: '#'
    },
    {
      category: '문법',
      categoryColor: '#E53935',
      title: '한국인이 자주 틀리는 시제 실수 5가지',
      description: '"I go to school yesterday" — 이러면 IM 못 벗어납니다',
      link: '#'
    },
    {
      category: '전략',
      categoryColor: '#3182F6',
      title: '서베이 항목별 답변 전략 총정리',
      description: '집/음식/여행/운동 — 항목별 킬러 답변 구조',
      link: '#'
    },
    {
      category: '발음',
      categoryColor: '#FF6B35',
      title: 'L과 R 발음, 이것만 고쳐도 등급이 오릅니다',
      description: '한국인 발음 약점 Top 3와 교정 방법',
      link: '#'
    },
    {
      category: '전략',
      categoryColor: '#3182F6',
      title: '돌발 질문 대처법 완전판',
      description: '모르는 주제가 나왔을 때 시간 버는 3가지 기술',
      link: '#'
    },
    {
      category: '표현',
      categoryColor: '#1A8D48',
      title: '비즈니스 상황 영어 표현 20선',
      description: '직장인 서베이 선택 시 필수 표현 모음',
      link: '#'
    }
  ];

  const products = [
    {
      name: '전자책',
      title: '혼자 기초부터 탄탄하게',
      price: '39,900원',
      link: 'https://sikbang.co'
    },
    {
      name: '인강',
      title: '영상으로 구조를 잡고 싶다면',
      price: '169,000원',
      link: 'https://sikbang.co'
    },
    {
      name: '2주 스터디',
      title: '코치와 함께 확실하게',
      price: '179,900원',
      link: '/study'
    }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
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
        }

        .container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* NAV */
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
          max-width: 1080px;
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
          width: 32px;
          height: 32px;
          background: var(--blue-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 900;
        }
        .nav-links {
          display: flex;
          gap: 40px;
          margin: 0 auto;
        }
        .nav-links a {
          font-size: 14px;
          color: var(--text-secondary);
          transition: color 0.2s;
          font-weight: 500;
        }
        .nav-links a.active {
          color: var(--blue-primary);
          font-weight: 700;
        }
        .nav-links a:hover {
          color: var(--text-primary);
        }

        /* HAMBURGER */
        .hamburger {
          display: none;
          width: 40px;
          height: 40px;
          background: none;
          border: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          z-index: 200;
          padding: 8px;
        }
        .hamburger span {
          display: block;
          width: 22px;
          height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }
        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          z-index: 99;
          flex-direction: column;
          padding: 24px;
          gap: 16px;
          overflow-y: auto;
        }
        .mobile-menu.show {
          display: flex;
        }
        .mobile-menu a {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .mobile-menu a:hover {
          background: var(--bg-gray);
          color: var(--text-primary);
        }
        .mobile-menu a.active {
          background: var(--blue-light);
          color: var(--blue-primary);
          font-weight: 700;
        }
        .mobile-cta {
          background: var(--blue-primary);
          color: white !important;
          margin-top: 16px;
          padding: 12px 16px !important;
          text-align: center;
        }

        /* HERO */
        .hero {
          padding: 80px 24px 60px;
          margin-top: 64px;
          background: white;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--blue-light);
          color: var(--blue-primary);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .hero h1 {
          font-size: 44px;
          font-weight: 800;
          line-height: 1.3;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 16px;
        }
        .hero p {
          font-size: 17px;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto 32px;
        }

        /* SECTION */
        .section {
          padding: 80px 24px;
          background: white;
        }
        .section-gray {
          background: var(--bg-gray);
        }
        .section-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .overline {
          font-size: 13px;
          font-weight: 700;
          color: var(--blue-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .section-header h2 {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.3;
          letter-spacing: -0.03em;
          margin-bottom: 12px;
        }
        .section-header p {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* LECTURE GRID */
        .lecture-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }
        .lecture-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
        }
        .lecture-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .lecture-thumbnail {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #EEEFF2;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B8BBBD;
          font-size: 14px;
          font-weight: 600;
        }
        .lecture-content {
          padding: 24px;
        }
        .lecture-tag {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }
        .lecture-card h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .lecture-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* RESOURCE GRID */
        .resource-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .resource-card {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .resource-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .resource-category {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
          width: fit-content;
        }
        .resource-card h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .resource-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .resource-link {
          font-size: 14px;
          font-weight: 600;
          color: var(--blue-primary);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: gap 0.2s;
        }
        .resource-link:hover {
          gap: 10px;
        }

        /* AI TRIAL BANNER */
        .ai-trial {
          background: var(--blue-light);
          padding: 60px 24px;
          border-radius: 20px;
          text-align: center;
          margin-top: 80px;
        }
        .ai-trial h2 {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .ai-trial p {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }
        .ai-trial-sub {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 24px;
        }
        .btn-primary {
          background: var(--blue-primary);
          color: white;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.2s;
          display: inline-block;
          text-decoration: none;
        }
        .btn-primary:hover {
          background: var(--blue-dark);
          transform: translateY(-1px);
        }

        /* PRODUCTS GRID */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: 48px;
        }
        .product-mini {
          background: white;
          padding: 28px 24px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          text-align: center;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .product-mini:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .product-mini-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--blue-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .product-mini h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .product-mini p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 16px;
          flex-grow: 1;
        }
        .product-mini-price {
          font-size: 18px;
          font-weight: 800;
          color: var(--blue-primary);
          margin-bottom: 16px;
        }
        .btn-secondary {
          background: white;
          color: var(--text-primary);
          padding: 12px 24px;
          border: 2px solid var(--border);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-secondary:hover {
          border-color: var(--text-primary);
          background: var(--bg-gray);
        }

        /* NEWSLETTER */
        .newsletter-section {
          padding: 80px 24px;
          background: var(--bg-gray);
        }
        .newsletter-inner {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        .newsletter-inner h2 {
          font-size: 32px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .newsletter-inner p {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .newsletter-form {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .newsletter-form input {
          flex: 1;
          padding: 14px 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .newsletter-form input:focus {
          outline: none;
          border-color: var(--blue-primary);
        }
        .newsletter-form button {
          padding: 14px 32px;
          background: var(--blue-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .newsletter-form button:hover {
          background: var(--blue-dark);
        }
        .consent-check {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          max-width: 480px;
          margin: 0 auto;
        }
        .newsletter-success {
          display: none;
          padding: 20px;
          background: #E8F5E9;
          border-radius: 12px;
          color: #2E7D32;
          font-weight: 600;
          margin-bottom: 24px;
        }
        .newsletter-success.show {
          display: block;
        }

        /* FOOTER */
        .footer {
          background: var(--text-primary);
          color: white;
          padding: 60px 24px 40px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          max-width: 1080px;
          margin: 0 auto 48px;
        }
        .footer-brand h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 12px;
        }
        .footer-brand p {
          font-size: 14px;
          color: #CCCCCC;
          line-height: 1.6;
        }
        .footer-col h4 {
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .footer-col a {
          display: block;
          font-size: 14px;
          color: #CCCCCC;
          margin-bottom: 12px;
          transition: color 0.2s;
        }
        .footer-col a:hover {
          color: white;
        }
        .footer-bottom {
          max-width: 1080px;
          margin: 0 auto;
          padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #CCCCCC;
        }
        .footer-bottom .social {
          display: flex;
          gap: 24px;
        }
        .footer-bottom a {
          color: #CCCCCC;
          transition: color 0.2s;
        }
        .footer-bottom a:hover {
          color: white;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          .hamburger {
            display: flex;
          }
          .hero h1 {
            font-size: 32px;
          }
          .hero p {
            font-size: 15px;
          }
          .section-header h2 {
            font-size: 24px;
          }
          .lecture-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .resource-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .products-grid {
            grid-template-columns: 1fr;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .footer-bottom .social {
            justify-content: center;
          }
          .newsletter-form {
            flex-direction: column;
          }
          .newsletter-form button {
            flex-shrink: 1;
          }
          .ai-trial {
            padding: 40px 24px;
          }
          .ai-trial h2 {
            font-size: 24px;
          }
        }
      `}} />

      {/* NAV */}
      <nav className="nav" id="nav" style={{ boxShadow: navShadow ? '0 1px 12px rgba(0,0,0,0.08)' : 'none' }}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="bread-icon">SB</div> 식빵영어
          </Link>
          <div className="nav-links">
            <a href="/free" className="active">무료 강의</a>
            <Link href="/study">스터디</Link>
            <Link href="/">메인</Link>
          </div>
          <button className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <a href="/free" className="active" onClick={closeMobileMenu}>무료 강의</a>
        <Link href="/study" onClick={closeMobileMenu}>스터디</Link>
        <Link href="/" onClick={closeMobileMenu}>메인</Link>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">무료 공개 · 로그인 불필요</div>
          <h1>OPIC 준비, 여기서부터 시작하세요</h1>
          <p>식빵영어가 무료로 공개하는 강의와 학습 자료. 유료 스터디에서 가르치는 프레임워크의 기초를 먼저 경험해보세요.</p>
        </div>
      </section>

      {/* FREE LECTURES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="overline">Free Lectures</div>
            <h2>무료 강의</h2>
            <p>유튜브에서 가장 많이 본 OPIC 강의를 모았습니다.</p>
          </div>
          <div className="lecture-grid">
            {lectures.map((lecture, idx) => (
              <div key={idx} className="lecture-card">
                <div className="lecture-thumbnail">COMING SOON</div>
                <div className="lecture-content">
                  <div className="lecture-tag" style={{ backgroundColor: lecture.tagColor }}>
                    {lecture.tag}
                  </div>
                  <h3>{lecture.title}</h3>
                  <p>{lecture.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <div className="overline">Resources</div>
            <h2>OPIC 학습 자료</h2>
            <p>매주 발행하는 뉴스레터에서 엄선한 핵심 콘텐츠.</p>
          </div>
          <div className="resource-grid">
            {resources.map((resource, idx) => (
              <div key={idx} className="resource-card">
                <div className="resource-category" style={{ backgroundColor: resource.categoryColor }}>
                  {resource.category}
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <a href={resource.link} className="resource-link">읽어보기</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI TRIAL BANNER */}
      <section className="section">
        <div className="container">
          <div className="ai-trial">
            <h2>내 현재 OPIC 예상 등급은?</h2>
            <p>SpeakCoach AI에서 1분 녹음하면 바로 확인할 수 있어요.</p>
            <div className="ai-trial-sub">무료 체험 · 7일간 무제한 · 카드 등록 없음</div>
            <a href="https://speakcoach.app" target="_blank" className="btn-primary">무료로 내 등급 확인하기</a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2>더 빠른 결과를 원한다면</h2>
            <p>무료 강의로 기초를 잡았다면, 다음 단계를 선택하세요.</p>
          </div>
          <div className="products-grid">
            {products.map((product, idx) => (
              <Link key={idx} href={product.link} target={product.link.startsWith('http') ? '_blank' : '_self'} style={{ textDecoration: 'none' }}>
                <div className="product-mini">
                  <div className="product-mini-label">{product.name}</div>
                  <h3>{product.title}</h3>
                  <p></p>
                  <div className="product-mini-price">{product.price}</div>
                  <button className="btn-secondary" style={{ width: '100%' }}>자세히 보기</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-inner">
            <h2>OPIC 학습 자료, 매주 이메일로 받아보세요</h2>
            <p>구독하면 매주 발행되는 표현·문법·전략 콘텐츠를 받을 수 있습니다.</p>

            {!newsletterSuccess ? (
              <>
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input type="email" id="emailInput" placeholder="이메일 주소를 입력하세요" required />
                  <button type="submit" style={{ opacity: marketingConsent ? 1 : 0.5, cursor: marketingConsent ? 'pointer' : 'not-allowed' }}>무료 구독하기</button>
                </form>
                <label className="consent-check" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', maxWidth: '480px', margin: '14px auto 0', cursor: 'pointer', fontSize: '13px', color: '#666', lineHeight: '1.5', textAlign: 'left' }}>
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#3182F6', flexShrink: 0 }}
                  />
                  <span>광고성 정보 수신에 동의합니다 (필수)</span>
                </label>
              </>
            ) : (
              <div className="newsletter-success show">
                구독 완료! 이메일로 무료 자료 링크를 보내드렸습니다.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>SB 식빵영어</h3>
              <p>2주 안에 OPIC 점수를 올리는 가장 구조적인 방법.</p>
            </div>
            <div className="footer-col">
              <h4>제품</h4>
              <a href="https://blog.naver.com/lulu05/223353024018" target="_blank">전자책</a>
              <a href="https://sikbang-eng.liveklass.com/" target="_blank">인강</a>
              <a href="/study">2주 스터디</a>
              <a href="https://speakcoach.app" target="_blank">SpeakCoach AI</a>
            </div>
            <div className="footer-col">
              <h4>고객지원</h4>
              <a href="http://pf.kakao.com/_SJYQn" target="_blank">카카오톡 문의</a>
              <a href="mailto:lulu066666@gmail.com">이메일 문의</a>
            </div>
            <div className="footer-col">
              <h4>소셜</h4>
              <a href="https://instagram.com/sikbang.eng" target="_blank">Instagram</a>
              <a href="https://blog.naver.com/lulu05" target="_blank">Blog</a>
              <a href="https://sikbang-eng.stibee.com/" target="_blank">Newsletter</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2025 식빵영어 All rights reserved.</span>
            <div className="social">
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
