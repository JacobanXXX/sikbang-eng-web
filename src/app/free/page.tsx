'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lecture {
  id: number;
  title: string;
  description: string;
  tag: string;
  youtubeId: string;
  youtubeUrl: string;
}

interface Resource {
  id: number;
  category: string;
  title: string;
  preview: string;
  url: string;
}

const TAG_COLORS: Record<string, string> = {
  '입문': '#3182F6',
  '중급': '#6B4EFF',
  '실전': '#FF6B35',
  '표현': '#E5533D',
  '인사이트': '#1A8D48',
};

const CATEGORY_COLORS: Record<string, string> = {
  '표현': '#1A8D48',
  '문법': '#E53935',
  '전략': '#3182F6',
  '발음': '#FF6B35',
};

export default function FreePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [lecturePage, setLecturePage] = useState(1);
  const lecturesPerPage = 4;

  // 수강 진행률 (localStorage 기반)
  const [watchedLectures, setWatchedLectures] = useState<Set<number>>(new Set());
  useEffect(() => {
    const saved = localStorage.getItem('sikbang-watched');
    if (saved) {
      try { setWatchedLectures(new Set(JSON.parse(saved))); } catch {}
    }
  }, []);
  const markWatched = (id: number) => {
    setWatchedLectures(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('sikbang-watched', JSON.stringify([...next]));
      return next;
    });
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

  // Fetch data from JSON files
  useEffect(() => {
    fetch('/data/lectures.json')
      .then(res => res.json())
      .then(data => setLectures(data))
      .catch(() => {});
    fetch('/data/resources.json')
      .then(res => res.json())
      .then(data => setResources(data))
      .catch(() => {});
  }, []);

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
        }
        [data-theme="dark"] body { background: #1A1D23; color: #EAEDF0; }
        [data-theme="dark"] .nav { background: rgba(26,29,35,0.95); }
        [data-theme="dark"] .mobile-menu { background: rgba(26,29,35,0.98); }
        [data-theme="dark"] .hero { background: #1A1D23; }
        [data-theme="dark"] .lecture-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .resource-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .product-card { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .newsletter-section { background: #22262E; border-color: #333840; }
        [data-theme="dark"] .newsletter-form input { background: #2A2E36; color: #EAEDF0; border-color: #333840; }
        [data-theme="dark"] .share-btn { background: #22262E; color: #B0B8C1; border-color: #333840; }
        [data-theme="dark"] .mid-cta { background: #22262E; }
        [data-theme="dark"] .ai-trial { background: linear-gradient(135deg, #1A2A40, #22334D); }
        [data-theme="dark"] .tag { background: #1A2A40; }
        [data-theme="dark"] .section-resources { background: #1A1D23; }

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
          position: relative;
          overflow: hidden;
        }
        .play-btn {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          background: rgba(0,0,0,0.6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .lecture-card:hover .play-btn {
          background: rgba(0,0,0,0.8);
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

        /* SHARE ROW */
        .share-row {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 48px;
        }
        .share-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }
        .share-btn.kakao {
          background: #FEE500;
          color: #191919;
        }
        .share-btn.kakao:hover {
          background: #F5DC00;
        }
        .share-btn.link {
          background: #F2F4F6;
          color: #4E5968;
        }
        .share-btn.link:hover {
          background: #E5E8EB;
        }

        /* MID CTA */
        .mid-cta {
          background: #F8F9FA;
          padding: 40px 24px;
          border-top: 1px solid #E5E8EB;
          border-bottom: 1px solid #E5E8EB;
        }
        .mid-cta-text {
          font-size: 18px;
          font-weight: 600;
          color: #191F28;
          margin-bottom: 16px;
        }
        .mid-cta-btn {
          display: inline-block;
          background: #3182F6;
          color: white;
          padding: 14px 32px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s;
        }
        .mid-cta-btn:hover {
          background: #1B64DA;
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
        .business-info {
          max-width: 1080px;
          margin: 0 auto;
          padding: 20px 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          line-height: 1.8;
        }
        .business-info p {
          margin: 0;
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
            <a href="https://sikbang-eng.replit.app/" target="_blank" rel="noopener noreferrer">SpeakCoach AI</a>
            <Link href="/">메인</Link>
            <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'#FEE500',color:'#191919',padding:'6px 12px',borderRadius:'8px',fontWeight:700}}>
              <svg viewBox="0 0 256 256" width="14" height="14" xmlns="http://www.w3.org/2000/svg"><path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919"/></svg>
              단톡방
            </a>
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode} aria-label="다크모드 전환">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <a href="/free" className="active" onClick={closeMobileMenu}>무료 강의</a>
        <Link href="/study" onClick={closeMobileMenu}>2주 스터디</Link>
        <a href="https://sikbang-eng.replit.app/" target="_blank" onClick={closeMobileMenu}>SpeakCoach AI</a>
        <Link href="/" onClick={closeMobileMenu}>메인</Link>
        <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank" onClick={closeMobileMenu}>OPIC 단톡방 참여</a>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" onClick={closeMobileMenu}>카카오톡 1:1 문의</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">무료 공개 · 로그인 불필요</div>
          <h1>OPIC 준비, 여기서부터 시작하세요</h1>
          <p>식빵영어가 무료로 공개하는 강의와 학습 자료. 유료 스터디에서 가르치는 프레임워크의 기초를 먼저 경험해보세요.</p>
          <div style={{marginTop:'24px',display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <a href="#lectures" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'var(--blue-primary)',color:'white',padding:'12px 24px',borderRadius:'12px',fontWeight:700,fontSize:'15px',textDecoration:'none',transition:'all 0.2s'}}>무료 강의 바로 보기 ↓</a>
            <a href="/study" style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'white',color:'var(--text-primary)',padding:'12px 24px',borderRadius:'12px',fontWeight:600,fontSize:'15px',textDecoration:'none',border:'1px solid #e5e7eb',transition:'all 0.2s'}}>2주 스터디 알아보기</a>
          </div>
          <div style={{marginTop:'18px'}}>
            <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',alignItems:'center',gap:'8px',background:'#FEE500',color:'#191919',padding:'10px 18px',borderRadius:'999px',fontSize:'14px',fontWeight:700,textDecoration:'none',border:'1px solid rgba(0,0,0,0.05)'}}>
              <svg viewBox="0 0 256 256" width="16" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919"/></svg>
              OPIC 준비생 단톡방 (770+명) 참여하기
            </a>
          </div>
        </div>
      </section>

      {/* FREE LECTURES */}
      <section className="section" id="lectures">
        <div className="container">
          <div className="section-header">
            <div className="overline">Free Lectures</div>
            <h2>원어민이 배우는 영문법</h2>
            <p>삼성전자 초청 오픽 강사가 알려주는 영문법 시리즈. 무료로 시청하세요.</p>
          </div>
          {lectures.length > 0 && (
            <div style={{maxWidth:'480px',margin:'0 auto 32px',textAlign:'center'}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'13px',color:'var(--text-tertiary)',marginBottom:'6px'}}>
                <span>수강 진행률</span>
                <span><strong style={{color:'var(--blue-primary)'}}>{watchedLectures.size}</strong> / {lectures.length}개 시청</span>
              </div>
              <div style={{height:'8px',borderRadius:'4px',background:'#e5e7eb',overflow:'hidden'}}>
                <div style={{height:'100%',borderRadius:'4px',background:'linear-gradient(90deg, #3182F6, #6B4EFF)',width:`${(watchedLectures.size / lectures.length) * 100}%`,transition:'width 0.5s ease'}}></div>
              </div>
              {watchedLectures.size === lectures.length && lectures.length > 0 && (
                <p style={{fontSize:'13px',color:'#1A8D48',fontWeight:600,marginTop:'8px'}}>🎉 모든 강의를 시청했어요! 이제 2주 스터디로 실전 훈련을 시작해보세요.</p>
              )}
            </div>
          )}
          <div className="lecture-grid">
            {lectures.slice(0, lecturePage * lecturesPerPage).map((lecture) => {
              const isArticle = !lecture.youtubeId && lecture.youtubeUrl && !lecture.youtubeUrl.includes('youtube') && !lecture.youtubeUrl.includes('youtu.be');
              const hasLink = lecture.youtubeId || lecture.youtubeUrl;
              const thumbnailUrl = lecture.youtubeId
                ? `https://img.youtube.com/vi/${lecture.youtubeId}/mqdefault.jpg`
                : '';
              const videoLink = lecture.youtubeUrl || (lecture.youtubeId ? `https://www.youtube.com/watch?v=${lecture.youtubeId}` : '');

              const cardContent = (
                <>
                  <div className="lecture-thumbnail">
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt={lecture.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : isArticle ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'linear-gradient(135deg, #E8F3FF 0%, #F0F7FF 100%)' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3182F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <span style={{ fontSize: '12px', color: '#3182F6', fontWeight: 600, marginTop: '6px' }}>글 읽기</span>
                      </div>
                    ) : (
                      <span>COMING SOON</span>
                    )}
                    {hasLink && !isArticle && (
                      <div className="play-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="lecture-content">
                    <div className="lecture-tag" style={{ backgroundColor: TAG_COLORS[lecture.tag] || '#3182F6' }}>
                      {lecture.tag}
                    </div>
                    <h3>{lecture.title}</h3>
                    <p>{lecture.description}</p>
                  </div>
                </>
              );

              return hasLink ? (
                <a key={lecture.id} href={videoLink} target="_blank" rel="noopener noreferrer" className="lecture-card" style={{ textDecoration: 'none', color: 'inherit', position:'relative' }} onClick={() => markWatched(lecture.id)}>
                  {watchedLectures.has(lecture.id) && <div style={{position:'absolute',top:'8px',right:'8px',background:'#1A8D48',color:'white',fontSize:'11px',fontWeight:700,padding:'2px 8px',borderRadius:'10px',zIndex:2}}>{isArticle ? '✓ 읽기 완료' : '✓ 시청 완료'}</div>}
                  {cardContent}
                </a>
              ) : (
                <div key={lecture.id} className="lecture-card">
                  {cardContent}
                </div>
              );
            })}
          </div>

          {lectures.length > lecturePage * lecturesPerPage && (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                onClick={() => setLecturePage(lecturePage + 1)}
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-white)',
                  color: 'var(--text-secondary)',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3182F6'; e.currentTarget.style.color = '#3182F6'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                더 보기 ({Math.min(lecturePage * lecturesPerPage, lectures.length)}/{lectures.length})
              </button>
            </div>
          )}

          {/* Share + Mid CTA */}
          <div className="share-row">
            <button className="share-btn kakao" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: '식빵영어 무료 OPIC 강의',
                  text: '오픽 준비하는 친구한테 공유해주세요! 무료 영문법 강의 13편 + 학습 자료',
                  url: 'https://sikbang.co/free'
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText('https://sikbang.co/free');
                alert('링크가 복사되었습니다! 카카오톡에 붙여넣기 해주세요.');
              }
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#191919"><path d="M12 3C6.48 3 2 6.58 2 10.89c0 2.79 1.86 5.24 4.66 6.62-.15.53-.96 3.41-1 3.57 0 0-.02.15.06.21.08.06.19.03.19.03.25-.04 2.9-1.91 3.36-2.22.56.08 1.14.13 1.73.13 5.52 0 10-3.58 10-7.89S17.52 3 12 3z"/></svg>
              공유하기
            </button>
            <button className="share-btn link" onClick={() => {
              navigator.clipboard.writeText('https://sikbang.co/free');
              alert('링크가 복사되었습니다!');
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              링크 복사
            </button>
          </div>
        </div>
      </section>

      {/* MID CTA - 유료 전환 유도 */}
      <section className="mid-cta">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="mid-cta-text">영문법 기초를 잡았다면, 다음 단계는 실전 스피킹입니다.</p>
          <p style={{fontSize:'14px',color:'var(--text-tertiary)',marginTop:'4px',marginBottom:'16px'}}>2주 스터디 참여자 평균 2등급 상승 · 수료율 94%</p>
          <a href="/study" className="mid-cta-btn">2주 스터디로 등급 올리기 →</a>
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
            {resources.map((resource) => (
              <div key={resource.id} className="resource-card">
                <div className="resource-category" style={{ backgroundColor: CATEGORY_COLORS[resource.category] || '#3182F6' }}>
                  {resource.category}
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.preview}</p>
                {resource.url ? (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">읽어보기</a>
                ) : (
                  <span className="resource-link" style={{ opacity: 0.4, cursor: 'default' }}>준비 중</span>
                )}
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
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">무료로 내 등급 확인하기</a>
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
            <p style={{fontSize:'13px',color:'#3182F6',fontWeight:600,marginBottom:'4px'}}>5,200명이 구독 중</p>
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
              <a href="https://sikbang-eng.replit.app/" target="_blank">SpeakCoach AI</a>
            </div>
            <div className="footer-col">
              <h4>고객지원</h4>
              <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank">OPIC 단톡방 참여</a>
              <a href="http://pf.kakao.com/_SJYQn" target="_blank">카카오톡 1:1 문의</a>
              <a href="mailto:lulu066666@gmail.com">이메일 문의</a>
            </div>
            <div className="footer-col">
              <h4>소셜</h4>
              <a href="https://instagram.com/sikbang.eng" target="_blank">Instagram</a>
              <a href="https://blog.naver.com/lulu05" target="_blank">Blog</a>
              <a href="https://sikbang-eng.stibee.com/" target="_blank">Newsletter</a>
            </div>
          </div>
          <div className="business-info">
            <p>식빵영어 | 대표: 안준영 | 사업자등록번호: 807-29-01639</p>
            <p>소재지: 부산광역시 진구 만리산로98, 2층 | 이메일: lulu066666@gmail.com</p>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2025 식빵영어 All rights reserved.</span>
            <div className="social">
              <a href="/terms">이용약관</a>
              <a href="/privacy">개인정보처리방침</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
