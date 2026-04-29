'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ConversationPage() {
  const [navShadow, setNavShadow] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Bottom sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', time: '' });
  const [copySuccess, setCopySuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavShadow(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : '';
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Sheet functions
  const openSheet = () => {
    setSheetOpen(true);
    setCurrentStep(1);
    setSelectedLevel('');
    setFormData({ name: '', phone: '', email: '', time: '' });
    document.body.style.overflow = 'hidden';
  };
  const closeSheet = () => {
    setSheetOpen(false);
    document.body.style.overflow = '';
  };

  const goStep = async (n: number) => {
    setCurrentStep(n);
    if (n === 4) {
      setSubmitting(true);
      const timeLabels: Record<string, string> = {
        'sat-am': '토요일 오전', 'sat-pm': '토요일 오후',
        'sun-am': '일요일 오전', 'sun-pm': '일요일 오후'
      };
      try {
        await fetch('/api/conversation-apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            time: timeLabels[formData.time] || formData.time,
            level: selectedLevel,
          }),
        });
      } catch (e) {
        console.error('Submit error:', e);
      }
      setSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.phone.trim() && formData.email.trim() && formData.time;

  const copyAccount = () => {
    const account = '3333-06-0399628';
    const onSuccess = () => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(account).then(onSuccess).catch(() => fallbackCopy(account, onSuccess));
    } else {
      fallbackCopy(account, onSuccess);
    }
  };
  const fallbackCopy = (text: string, cb: () => void) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb(); } catch { alert('계좌번호: ' + text); }
    document.body.removeChild(ta);
  };

  const timeLabels: Record<string, string> = {
    'sat-am': '토요일 오전', 'sat-pm': '토요일 오후',
    'sun-am': '일요일 오전', 'sun-pm': '일요일 오후'
  };
  const levelLabels: Record<string, string> = {
    'beginner': '기초 (처음부터 시작)',
    'advanced': '실력 향상 (회화/문법/작문)'
  };

  return (
    <>
      <style>{`
        /* ─── Conversation page specific styles ─── */
        .conv-page {
          --black: #191F28;
          --gray1: #4E5968;
          --gray2: #8B95A1;
          --gray3: #B0B8C1;
          --gray4: #D1D6DB;
          --line: #F2F4F6;
          --bg: #F8F9FA;
          --white: #FFFFFF;
          --blue: #3182F6;
          --blue-light: #EFF6FF;
          --blue-dark: #1B64DA;
          --red: #F04452;
          --red-light: #FFF0F0;
          --green: #00B894;
          --green-light: #EAFAF5;
        }
        .conv-page { background: var(--white); min-height: 100vh; padding-bottom: 110px; }
        .conv-container { max-width: 480px; margin: 0 auto; padding: 0 24px; }

        /* Hero */
        .conv-hero { padding: 52px 0 40px; }
        .conv-hero .eyebrow { font-size: 15px; font-weight: 500; color: var(--blue); margin-bottom: 10px; letter-spacing: -0.3px; }
        .conv-hero h1 { font-size: 26px; font-weight: 700; color: var(--black); letter-spacing: -0.8px; line-height: 1.38; }
        .conv-hero .sub { font-size: 15px; font-weight: 400; color: var(--gray2); margin-top: 10px; letter-spacing: -0.3px; line-height: 1.55; }

        /* Urgency */
        .conv-urgency { display: flex; align-items: center; gap: 8px; padding: 14px 16px; background: var(--red-light); border-radius: 12px; margin-bottom: 32px; }
        .conv-urgency .dot { width: 8px; height: 8px; min-width: 8px; background: var(--red); border-radius: 50%; animation: convPulse 1.5s ease infinite; }
        @keyframes convPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .conv-urgency .text { font-size: 14px; font-weight: 500; color: var(--red); letter-spacing: -0.2px; }
        .conv-urgency .text strong { font-weight: 700; }

        /* Stat row */
        .conv-stats { display: flex; padding: 24px 0; border-top: 1px solid var(--line); }
        .conv-stat { flex: 1; text-align: center; position: relative; }
        .conv-stat + .conv-stat::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); width:1px; height:28px; background:var(--line); }
        .conv-stat .val { font-size: 22px; font-weight: 700; color: var(--black); letter-spacing: -0.8px; font-variant-numeric: tabular-nums; line-height: 1; }
        .conv-stat .val.blue { color: var(--blue); }
        .conv-stat .lbl { font-size: 12px; font-weight: 400; color: var(--gray3); margin-top: 6px; }

        /* Divider */
        .conv-divider { height: 8px; background: var(--bg); margin: 0 -24px; }

        /* Section */
        .conv-section { padding: 32px 0; }
        .conv-section-head { font-size: 17px; font-weight: 600; color: var(--black); letter-spacing: -0.5px; margin-bottom: 4px; }
        .conv-section-desc { font-size: 13px; font-weight: 400; color: var(--gray2); letter-spacing: -0.1px; margin-bottom: 20px; }

        /* Curriculum */
        .conv-curr { display: flex; align-items: flex-start; gap: 14px; padding: 16px 0; border-bottom: 1px solid var(--line); }
        .conv-curr:last-child { border-bottom: none; }
        .conv-curr .time { font-size: 14px; font-weight: 600; color: var(--blue); min-width: 42px; font-variant-numeric: tabular-nums; padding-top: 1px; }
        .conv-curr .body h3 { font-size: 15px; font-weight: 500; color: var(--black); letter-spacing: -0.2px; margin-bottom: 3px; }
        .conv-curr .body p { font-size: 13px; font-weight: 400; color: var(--gray2); line-height: 1.5; }

        /* Topic tags */
        .conv-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .conv-tag { font-size: 13px; font-weight: 500; color: var(--gray1); background: var(--bg); padding: 7px 14px; border-radius: 20px; }

        /* Target */
        .conv-target { padding: 14px 0; border-bottom: 1px solid var(--line); display: flex; align-items: flex-start; gap: 12px; }
        .conv-target:last-child { border-bottom: none; }
        .conv-target .tdot { width: 6px; height: 6px; min-width: 6px; background: var(--blue); border-radius: 50%; margin-top: 7px; }
        .conv-target .ttext { font-size: 15px; font-weight: 400; color: var(--black); letter-spacing: -0.2px; line-height: 1.5; }

        /* Slots */
        .conv-slot { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--line); }
        .conv-slot:last-child { border-bottom: none; }
        .conv-slot .day { font-size: 15px; font-weight: 500; color: var(--black); }
        .conv-slot .stime { font-size: 13px; font-weight: 400; color: var(--gray2); font-variant-numeric: tabular-nums; }
        .conv-slot .badge { font-size: 13px; font-weight: 600; padding: 5px 12px; border-radius: 8px; }
        .conv-slot .badge.closed { background: var(--bg); color: var(--gray3); }
        .conv-slot .badge.open { background: var(--blue-light); color: var(--blue); }

        /* Price */
        .conv-price-area { text-align: center; padding: 8px 0; }
        .conv-price-label { font-size: 14px; font-weight: 400; color: var(--gray2); margin-bottom: 8px; }
        .conv-price-amount { font-size: 36px; font-weight: 700; color: var(--black); letter-spacing: -1.5px; font-variant-numeric: tabular-nums; line-height: 1.1; }
        .conv-price-amount .unit { font-size: 16px; font-weight: 500; color: var(--gray1); }
        .conv-price-per { font-size: 14px; font-weight: 400; color: var(--gray2); margin-top: 6px; }
        .conv-price-detail { margin-top: 24px; }
        .conv-price-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--line); }
        .conv-price-row:last-child { border-bottom: none; }
        .conv-price-key { font-size: 14px; font-weight: 400; color: var(--gray2); }
        .conv-price-value { font-size: 14px; font-weight: 600; color: var(--black); }

        /* Instructor */
        .conv-inst { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
        .conv-inst:last-child { margin-bottom: 0; }
        .conv-inst .idot { width: 5px; height: 5px; min-width: 5px; background: var(--gray3); border-radius: 50%; margin-top: 7px; }
        .conv-inst .itext { font-size: 14px; font-weight: 400; color: var(--gray1); line-height: 1.5; }
        .conv-inst .itext strong { font-weight: 600; color: var(--black); }

        /* Notice */
        .conv-notice { font-size: 12px; font-weight: 400; color: var(--gray3); line-height: 1.65; padding: 0 0 32px; }

        /* Bottom CTA */
        .conv-bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--white); z-index: 100; border-top: 1px solid var(--line); }
        .conv-bottom-bar .inner { max-width: 480px; margin: 0 auto; padding: 12px 24px; padding-bottom: max(16px, env(safe-area-inset-bottom)); }
        .conv-bottom-row { display: flex; align-items: center; gap: 10px; }
        .conv-bottom-info { display: flex; flex-direction: column; min-width: 0; }
        .conv-bottom-price { font-size: 17px; font-weight: 700; color: var(--black); letter-spacing: -0.5px; }
        .conv-bottom-seats { font-size: 12px; font-weight: 500; color: var(--red); }
        .conv-btn-apply { flex: 1; height: 56px; background: var(--blue); color: white; border: none; border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer; font-family: inherit; letter-spacing: -0.3px; transition: background 0.15s; }
        .conv-btn-apply:active { background: var(--blue-dark); }

        /* ═══ Bottom Sheet ═══ */
        .conv-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0); z-index: 200; align-items: flex-end; justify-content: center; }
        .conv-overlay.active { display: flex; animation: convDimIn 0.3s ease forwards; }
        @keyframes convDimIn { to { background: rgba(0,0,0,0.4); } }

        .conv-sheet { background: var(--white); border-radius: 24px 24px 0 0; width: 100%; max-width: 480px; max-height: 88vh; overflow-y: auto; transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.32,0.72,0,1); }
        .conv-overlay.active .conv-sheet { transform: translateY(0); }

        .conv-handle { display: flex; justify-content: center; padding: 12px 0 4px; }
        .conv-handle-bar { width: 36px; height: 4px; background: var(--line); border-radius: 2px; }

        .conv-sheet-content { padding: 20px 24px 0; }
        .conv-sheet-cta { padding: 16px 24px 24px; }

        /* Progress bar */
        .conv-progress { display: flex; gap: 6px; margin-bottom: 24px; }
        .conv-progress .dot { flex: 1; height: 3px; background: var(--line); border-radius: 2px; transition: background 0.3s; }
        .conv-progress .dot.active, .conv-progress .dot.done { background: var(--blue); }

        /* Sheet header */
        .conv-sheet-header { text-align: center; margin-bottom: 24px; }
        .conv-sheet-header h2 { font-size: 20px; font-weight: 700; color: var(--black); letter-spacing: -0.5px; margin-bottom: 6px; }
        .conv-sheet-header p { font-size: 14px; font-weight: 400; color: var(--gray2); }

        /* Level option */
        .conv-level-option {
          width: 100%; border: 1.5px solid var(--line); border-radius: 16px; padding: 20px;
          background: var(--white); cursor: pointer; text-align: left; font-family: inherit;
          transition: all 0.2s; margin-bottom: 10px;
        }
        .conv-level-option:hover { border-color: var(--blue); background: var(--blue-light); }
        .conv-level-option.selected { border-color: var(--blue); background: var(--blue-light); }
        .conv-level-option h3 { font-size: 16px; font-weight: 600; color: var(--black); letter-spacing: -0.3px; margin-bottom: 4px; }
        .conv-level-option p { font-size: 13px; font-weight: 400; color: var(--gray2); line-height: 1.45; }
        .conv-level-tag { display: inline-block; font-size: 11px; font-weight: 600; color: var(--blue); background: var(--blue-light); padding: 3px 8px; border-radius: 6px; margin-bottom: 8px; }
        .conv-level-option.selected .conv-level-tag { background: var(--bg-white); }

        /* Form */
        .conv-form-group { margin-bottom: 20px; }
        .conv-form-label { font-size: 13px; font-weight: 500; color: var(--gray1); margin-bottom: 8px; display: block; letter-spacing: -0.1px; }
        .conv-form-input {
          width: 100%; height: 48px; border: 1.5px solid var(--line); border-radius: 12px;
          padding: 0 16px; font-size: 15px; font-family: inherit; color: var(--black);
          background: var(--white); outline: none; transition: border-color 0.2s; letter-spacing: -0.2px;
        }
        .conv-form-input:focus { border-color: var(--blue); }
        .conv-form-input::placeholder { color: var(--gray3); }

        .conv-form-select {
          width: 100%; height: 48px; border: 1.5px solid var(--line); border-radius: 12px;
          padding: 0 16px; font-size: 15px; font-family: inherit; color: var(--black);
          background: var(--white); outline: none; appearance: none; cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23B0B8C1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 16px center;
        }
        .conv-form-select:focus { border-color: var(--blue); }

        /* Payment bank card */
        .conv-bank-card { background: var(--bg); border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 20px; }
        .conv-bank-label { font-size: 13px; font-weight: 400; color: var(--gray2); margin-bottom: 8px; }
        .conv-bank-name { font-size: 16px; font-weight: 600; color: var(--black); letter-spacing: -0.2px; margin-bottom: 4px; }
        .conv-bank-account { font-size: 22px; font-weight: 700; color: var(--black); letter-spacing: -0.5px; font-variant-numeric: tabular-nums; margin-bottom: 4px; }
        .conv-bank-holder { font-size: 14px; font-weight: 400; color: var(--gray2); }
        .conv-bank-amount { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--line); }
        .conv-bank-amount .amt-label { font-size: 13px; font-weight: 400; color: var(--gray2); }
        .conv-bank-amount .amt-value { font-size: 20px; font-weight: 700; color: var(--blue); letter-spacing: -0.5px; margin-top: 4px; }
        .conv-copy-btn {
          display: inline-flex; align-items: center; gap: 4px; background: none; border: none;
          font-family: inherit; font-size: 13px; font-weight: 500; color: var(--blue);
          cursor: pointer; padding: 4px 0; margin-top: 8px;
        }
        .conv-payment-notice { font-size: 12px; font-weight: 400; color: var(--gray3); line-height: 1.6; text-align: center; }

        /* Complete */
        .conv-complete { text-align: center; padding: 20px 0; }
        .conv-complete-icon { width: 64px; height: 64px; background: var(--green-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .conv-complete h2 { font-size: 22px; font-weight: 700; color: var(--black); letter-spacing: -0.5px; margin-bottom: 8px; }
        .conv-complete p { font-size: 15px; font-weight: 400; color: var(--gray2); line-height: 1.55; }
        .conv-complete-info { background: var(--bg); border-radius: 14px; padding: 20px; margin-top: 24px; text-align: left; }
        .conv-complete-row { display: flex; justify-content: space-between; padding: 8px 0; }
        .conv-complete-row .ck { font-size: 13px; color: var(--gray2); }
        .conv-complete-row .cv { font-size: 13px; font-weight: 600; color: var(--black); }

        /* Buttons */
        .conv-btn-full {
          width: 100%; height: 56px; background: var(--blue); color: white; border: none;
          border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer;
          font-family: inherit; letter-spacing: -0.3px; transition: background 0.15s;
        }
        .conv-btn-full:active { background: var(--blue-dark); }
        .conv-btn-full:disabled { background: var(--gray4); cursor: not-allowed; }
        .conv-btn-ghost {
          width: 100%; height: 48px; background: var(--bg); color: var(--gray2); border: none;
          border-radius: 14px; font-size: 14px; font-weight: 600; cursor: pointer;
          font-family: inherit; margin-top: 8px;
        }

        /* Nav on this page: reuse main site nav styles */
        @media (max-width: 768px) {
          .conv-nav .nav-links { display: none; }
          .conv-nav .theme-toggle { display: none; }
        }
      `}</style>

      {/* NAV - matches main site */}
      <nav className="nav" id="nav" style={{ boxShadow: navShadow ? '0 1px 12px rgba(0,0,0,0.08)' : 'none' }}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <span className="bread-icon" style={{fontWeight:900, fontSize:'18px', color:'var(--blue-primary)'}}>SB</span> 식빵영어
          </Link>
          <div className="nav-links">
            <Link href="/free">무료 강의</Link>
            <Link href="/#store">스토어</Link>
            <Link href="/#speakcoach">SpeakCoach AI</Link>
            <Link href="/#reviews">후기</Link>
            <Link href="/study">14일 부트캠프</Link>
            <Link href="/conversation" style={{color:'var(--blue-primary)', fontWeight:600}}>영어 회화</Link>
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="nav-cta">무료 체험하기</a>
          </div>
          <button className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
        <Link href="/free" onClick={closeMobileMenu}>무료 강의</Link>
        <Link href="/#store" onClick={closeMobileMenu}>스토어</Link>
        <Link href="/#speakcoach" onClick={closeMobileMenu}>SpeakCoach AI</Link>
        <Link href="/#reviews" onClick={closeMobileMenu}>후기</Link>
        <Link href="/study" onClick={closeMobileMenu}>14일 부트캠프</Link>
        <Link href="/conversation" onClick={closeMobileMenu} style={{color:'var(--blue-primary)', fontWeight:600}}>1:1 영어 회화</Link>
        <a href="https://open.kakao.com/o/g0jE5t8f" target="_blank" onClick={closeMobileMenu}>OPIC 단톡방 참여</a>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" onClick={closeMobileMenu}>카카오톡 1:1 문의</a>
        <a href="https://sikbang-eng.replit.app/" target="_blank" className="mobile-cta" onClick={closeMobileMenu}>무료 스피킹 테스트 →</a>
      </div>

      <div className="conv-page">
        <div className="conv-container" style={{paddingTop:'64px'}}>

          {/* Hero */}
          <div className="conv-hero">
            <div className="eyebrow">1:1 영어 회화 코칭</div>
            <h1>왕초보부터 고급자까지<br/>레벨에 맞춘 1:1 수업</h1>
            <p className="sub">문법, 표현, 스피킹을 한 수업에서<br/>균형 있게 잡아드려요</p>
          </div>

          <div className="conv-urgency">
            <div className="dot"></div>
            <span className="text">이번 달 모집 <strong>3명 중 2자리</strong> 남았어요</span>
          </div>

          <div className="conv-stats">
            <div className="conv-stat"><div className="val">1:1</div><div className="lbl">수업 방식</div></div>
            <div className="conv-stat"><div className="val">90분</div><div className="lbl">회당</div></div>
            <div className="conv-stat"><div className="val">월 4회</div><div className="lbl">주 1회</div></div>
            <div className="conv-stat"><div className="val blue">33만</div><div className="lbl">월 수강료</div></div>
          </div>

          <div className="conv-divider"></div>

          {/* Curriculum */}
          <div className="conv-section">
            <div className="conv-section-head">수업 구성</div>
            <div className="conv-section-desc">매 수업 90분, 3파트로 진행돼요</div>
            <div className="conv-curr"><span className="time">30분</span><div className="body"><h3>문법</h3><p>실생활에서 자주 틀리는 핵심 문법을 정리하고, 바로 말로 옮기는 연습을 해요</p></div></div>
            <div className="conv-curr"><span className="time">30분</span><div className="body"><h3>단어 &amp; 핵심 표현</h3><p>원어민이 실제로 쓰는 표현을 배우고, 문장으로 만들어 직접 말해봐요</p></div></div>
            <div className="conv-curr"><span className="time">30분</span><div className="body"><h3>아티클 토론 / 프리토킹</h3><p>AI, 심리, 경제 등 요즘 이슈를 영어로 토론해요. 외국인과 대화할 때 바로 써먹을 수 있어요</p></div></div>
          </div>

          <div className="conv-divider"></div>

          {/* Topics */}
          <div className="conv-section">
            <div className="conv-section-head">이런 주제로 토론해요</div>
            <div className="conv-section-desc">매주 다른 주제의 실제 영어 기사를 다뤄요</div>
            <div className="conv-tags">
              <span className="conv-tag">AI / 테크</span><span className="conv-tag">심리학</span><span className="conv-tag">경제 / 금융</span><span className="conv-tag">사회 이슈</span>
              <span className="conv-tag">문화 / 라이프</span><span className="conv-tag">건강 / 과학</span><span className="conv-tag">환경</span><span className="conv-tag">비즈니스</span>
            </div>
          </div>

          <div className="conv-divider"></div>

          {/* Target */}
          <div className="conv-section">
            <div className="conv-section-head">이런 분에게 맞아요</div>
            <div className="conv-section-desc">영어 레벨 A1부터 C2까지 모두 가능해요</div>
            <div className="conv-target"><div className="tdot"></div><span className="ttext">OPIc을 준비하기엔 기초가 너무 부족한 분</span></div>
            <div className="conv-target"><div className="tdot"></div><span className="ttext">OPIc은 졸업했지만 회화·문법·작문을 함께 키우고 싶은 분</span></div>
            <div className="conv-target"><div className="tdot"></div><span className="ttext">외국인과 날씨 말고 진짜 대화를 하고 싶은 분</span></div>
            <div className="conv-target"><div className="tdot"></div><span className="ttext">문법은 알겠는데 입으로 안 나오는 분</span></div>
            <div className="conv-target"><div className="tdot"></div><span className="ttext">혼자 공부하다 한계를 느낀 분</span></div>
          </div>

          <div className="conv-divider"></div>

          {/* Schedule */}
          <div className="conv-section">
            <div className="conv-section-head">수업 시간</div>
            <div className="conv-section-desc">토요일 또는 일요일, 학생과 조율해서 정해요</div>
            <div className="conv-slot">
              <div><span className="day">토요일</span><br/><span className="stime">10:30 – 12:00</span></div>
              <span className="badge closed">마감</span>
            </div>
            <div className="conv-slot">
              <div><span className="day">토요일</span><br/><span className="stime">시간 조율 가능</span></div>
              <span className="badge open">신청 가능</span>
            </div>
            <div className="conv-slot">
              <div><span className="day">일요일</span><br/><span className="stime">시간 조율 가능</span></div>
              <span className="badge open">신청 가능</span>
            </div>
          </div>

          <div className="conv-divider"></div>

          {/* Price */}
          <div className="conv-section">
            <div className="conv-section-head">수강료</div>
            <div className="conv-section-desc"></div>
            <div className="conv-price-area">
              <div className="conv-price-label">월 수강료</div>
              <div className="conv-price-amount">330,000<span className="unit">원</span></div>
              <div className="conv-price-per">주 1회 · 회당 90분 · 월 4회</div>
            </div>
            <div className="conv-price-detail">
              <div className="conv-price-row"><span className="conv-price-key">수업 방식</span><span className="conv-price-value">Discord 화상 1:1</span></div>
              <div className="conv-price-row"><span className="conv-price-key">1회 수업 시간</span><span className="conv-price-value">90분</span></div>
              <div className="conv-price-row"><span className="conv-price-key">월 수업 횟수</span><span className="conv-price-value">4회</span></div>
              <div className="conv-price-row"><span className="conv-price-key">결제 방식</span><span className="conv-price-value">계좌이체 (매월)</span></div>
              <div className="conv-price-row"><span className="conv-price-key">대상 레벨</span><span className="conv-price-value">A1 ~ C2</span></div>
            </div>
          </div>

          <div className="conv-divider"></div>

          {/* Instructor */}
          <div className="conv-section">
            <div className="conv-section-head">강사 소개</div>
            <div className="conv-section-desc">안준영 · 식빵영어 대표</div>
            <div className="conv-inst"><div className="idot"></div><span className="itext"><strong>OPIc AL</strong> 보유</span></div>
            <div className="conv-inst"><div className="idot"></div><span className="itext">누적 수강생 <strong>4,000명</strong> 이상</span></div>
            <div className="conv-inst"><div className="idot"></div><span className="itext">삼성전자 임직원 <strong>200명</strong> 대상 영어 세미나</span></div>
            <div className="conv-inst"><div className="idot"></div><span className="itext">자체 AI 영어 학습 앱 <strong>SpeakCoach AI</strong> 개발·운영</span></div>
            <div className="conv-inst"><div className="idot"></div><span className="itext">미국 교환학생 · 영국 1년 거주</span></div>
            <div className="conv-inst"><div className="idot"></div><span className="itext">Instagram <strong>@sikbang.eng</strong> (1.7만 팔로워)</span></div>
          </div>

          <div className="conv-divider"></div>

          {/* Notice */}
          <div className="conv-section" style={{paddingBottom:0}}>
            <div className="conv-notice">
              수업은 매월 선결제로 진행되며, 수업일 변경은 최소 24시간 전 요청 시 1회 가능합니다. 당일 취소 및 노쇼는 수업이 소진된 것으로 처리됩니다. 환불은 미진행 수업에 한해 가능하며, 이미 진행된 수업분은 환불 대상에서 제외됩니다.
            </div>
          </div>

        </div>

        {/* Fixed Bottom CTA */}
        {!sheetOpen && (
          <div className="conv-bottom-bar">
            <div className="inner">
              <div className="conv-bottom-row">
                <div className="conv-bottom-info">
                  <span className="conv-bottom-price">월 330,000원</span>
                  <span className="conv-bottom-seats">이번 달 2자리 남음</span>
                </div>
                <button className="conv-btn-apply" onClick={openSheet}>수업 신청하기</button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ APPLICATION FLOW (Bottom Sheet) ═══ */}
        <div className={`conv-overlay ${sheetOpen ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) closeSheet(); }}>
          <div className="conv-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="conv-handle"><div className="conv-handle-bar"></div></div>

            {/* STEP 1: Level Select */}
            {currentStep === 1 && (
              <div>
                <div className="conv-sheet-content">
                  <div className="conv-progress">
                    <div className="dot active"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div>
                  </div>
                  <div className="conv-sheet-header">
                    <h2>어떤 목적으로 수업을<br/>듣고 싶으신가요?</h2>
                    <p>레벨에 맞춰 커리큘럼을 조정해드려요</p>
                  </div>
                  <button
                    className={`conv-level-option ${selectedLevel === 'beginner' ? 'selected' : ''}`}
                    onClick={() => setSelectedLevel('beginner')}
                  >
                    <span className="conv-level-tag">기초</span>
                    <h3>영어를 처음부터 시작하고 싶어요</h3>
                    <p>기초 문법부터 차근차근, OPIc을 시작하기엔 아직 이른 분</p>
                  </button>
                  <button
                    className={`conv-level-option ${selectedLevel === 'advanced' ? 'selected' : ''}`}
                    onClick={() => setSelectedLevel('advanced')}
                  >
                    <span className="conv-level-tag">실력 향상</span>
                    <h3>회화 실력을 더 키우고 싶어요</h3>
                    <p>OPIc 졸업 후 문법·스피킹·작문을 함께 키우고 싶은 분</p>
                  </button>
                </div>
                <div className="conv-sheet-cta">
                  <button className="conv-btn-full" disabled={!selectedLevel} onClick={() => goStep(2)}>다음</button>
                  <button className="conv-btn-ghost" onClick={closeSheet}>취소</button>
                </div>
              </div>
            )}

            {/* STEP 2: Info Form */}
            {currentStep === 2 && (
              <div>
                <div className="conv-sheet-content">
                  <div className="conv-progress">
                    <div className="dot done"></div><div className="dot active"></div><div className="dot"></div><div className="dot"></div>
                  </div>
                  <div className="conv-sheet-header">
                    <h2>신청 정보를 입력해주세요</h2>
                    <p>수업 안내를 위해 필요해요</p>
                  </div>
                  <div className="conv-form-group">
                    <label className="conv-form-label">이름</label>
                    <input className="conv-form-input" type="text" placeholder="홍길동" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="conv-form-group">
                    <label className="conv-form-label">전화번호</label>
                    <input className="conv-form-input" type="tel" placeholder="010-0000-0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="conv-form-group">
                    <label className="conv-form-label">이메일</label>
                    <input className="conv-form-input" type="email" placeholder="example@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                  </div>
                  <div className="conv-form-group">
                    <label className="conv-form-label">희망 수업 시간</label>
                    <select className="conv-form-select" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})}>
                      <option value="">선택해주세요</option>
                      <option value="sat-am">토요일 오전</option>
                      <option value="sat-pm">토요일 오후</option>
                      <option value="sun-am">일요일 오전</option>
                      <option value="sun-pm">일요일 오후</option>
                    </select>
                  </div>
                </div>
                <div className="conv-sheet-cta">
                  <button className="conv-btn-full" disabled={!isFormValid} onClick={() => goStep(3)}>다음</button>
                  <button className="conv-btn-ghost" onClick={() => goStep(1)}>이전</button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {currentStep === 3 && (
              <div>
                <div className="conv-sheet-content">
                  <div className="conv-progress">
                    <div className="dot done"></div><div className="dot done"></div><div className="dot active"></div><div className="dot"></div>
                  </div>
                  <div className="conv-sheet-header">
                    <h2>수강료를 입금해주세요</h2>
                    <p>입금 확인 후 수업이 확정돼요</p>
                  </div>
                  <div className="conv-bank-card">
                    <div className="conv-bank-label">입금 계좌</div>
                    <div className="conv-bank-name">카카오뱅크</div>
                    <div className="conv-bank-account">3333-06-0399628</div>
                    <div className="conv-bank-holder">예금주: 안준영</div>
                    <button className="conv-copy-btn" onClick={copyAccount}>
                      {copySuccess ? (
                        <><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> 복사 완료!</>
                      ) : (
                        <><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> 계좌번호 복사</>
                      )}
                    </button>
                    <div className="conv-bank-amount">
                      <div className="amt-label">입금 금액</div>
                      <div className="amt-value">330,000원</div>
                    </div>
                  </div>
                  <p className="conv-payment-notice">입금자명을 신청자 이름과 동일하게 해주세요<br/>입금 확인은 영업일 기준 1일 내 완료됩니다</p>
                </div>
                <div className="conv-sheet-cta">
                  <button className="conv-btn-full" onClick={() => goStep(4)}>입금했어요</button>
                  <button className="conv-btn-ghost" onClick={() => goStep(2)}>이전</button>
                </div>
              </div>
            )}

            {/* STEP 4: Complete */}
            {currentStep === 4 && (
              <div>
                <div className="conv-sheet-content">
                  <div className="conv-progress">
                    <div className="dot done"></div><div className="dot done"></div><div className="dot done"></div><div className="dot active"></div>
                  </div>
                  <div className="conv-complete">
                    <div className="conv-complete-icon">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h2>신청이 완료되었어요!</h2>
                    <p>입금 확인 후 수업 일정을<br/>안내해드릴게요</p>
                    <div className="conv-complete-info">
                      <div className="conv-complete-row"><span className="ck">이름</span><span className="cv">{formData.name}</span></div>
                      <div className="conv-complete-row"><span className="ck">연락처</span><span className="cv">{formData.phone}</span></div>
                      <div className="conv-complete-row"><span className="ck">이메일</span><span className="cv">{formData.email}</span></div>
                      <div className="conv-complete-row"><span className="ck">희망 시간</span><span className="cv">{timeLabels[formData.time] || formData.time}</span></div>
                      <div className="conv-complete-row"><span className="ck">수업 유형</span><span className="cv">{levelLabels[selectedLevel] || selectedLevel}</span></div>
                      <div className="conv-complete-row"><span className="ck">수강료</span><span className="cv">330,000원</span></div>
                    </div>
                  </div>
                </div>
                <div className="conv-sheet-cta">
                  <button className="conv-btn-full" onClick={closeSheet}>확인</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
