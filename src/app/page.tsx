// @ts-nocheck
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function MainPage() {
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faqAnswerRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Review scroll
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [reviewsPaused, setReviewsPaused] = useState(false);
  // Newsletter
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  // === NAV SHADOW ON SCROLL ===
  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('nav');
      if (nav) {
        nav.style.boxShadow = window.scrollY > 10 ? '0 1px 12px rgba(0,0,0,0.08)' : 'none';
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // === AUTO-SCROLL REVIEWS (infinite marquee) ===
  const [reviewOffset, setReviewOffset] = useState(0);
  const reviewAnimRef = useRef<number>(0);
  const reviewSpeed = 0.5; // px per frame

  useEffect(() => {
    if (reviewsPaused) return;
    let raf: number;
    const animate = () => {
      setReviewOffset(prev => {
        if (!reviewScrollRef.current) return prev;
        const singleSetWidth = reviewScrollRef.current.scrollWidth / 2;
        const next = prev + reviewSpeed;
        return next >= singleSetWidth ? next - singleSetWidth : next;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [reviewsPaused]);

  // === FAQ TOGGLE ===
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    faqAnswerRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.style.maxHeight = index === openFaqIndex ? ref.scrollHeight + 'px' : '0px';
      }
    });
  }, [openFaqIndex]);

  // === SMOOTH SCROLL ===
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Newsletter - Save to Google Sheets
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || subscribing) return;
    setSubscribing(true);
    try {
      // Save to Google Sheets via Apps Script Web App
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/DEPLOY_ID_HERE/exec';
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, timestamp: new Date().toISOString() })
      });
      setSubscribed(true);
    } catch (err) {
      // Even if fetch fails (no-cors), treat as success since Google Script receives it
      setSubscribed(true);
    }
    setSubscribing(false);
  };

  const faqItems = [
    {
      question: 'OPIC\uc744 \ucc98\uc74c \uc900\ube44\ud558\ub294\ub370 \uc5b4\ub514\uc11c\ubd80\ud130 \uc2dc\uc791\ud574\uc57c \ud558\ub098\uc694?',
      answer: '\ud604\uc7ac \ub808\ubca8\uc5d0 \ub530\ub77c \ucd94\ucc9c \uacbd\ub85c\uac00 \ub2ec\ub77c\uc694. \uc601\uc5b4 \uae30\ucd08\uac00 \ubd80\uc871\ud558\ub2e4\uba74 \uc804\uc790\ucc45\uc73c\ub85c \ud504\ub808\uc784\uc6cc\ud06c\ub97c \uba3c\uc800 \uc775\ud788\uace0, \ub2e8\uae30\uac04\uc5d0 \uacb0\uacfc\ub97c \ub0b4\uace0 \uc2f6\ub2e4\uba74 2\uc8fc \uc2a4\ud130\ub514\ub97c \ucd94\ucc9c\ud569\ub2c8\ub2e4. \uc798 \ubaa8\ub974\uaca0\ub2e4\uba74 SpeakCoach AI\uc5d0\uc11c \ubb34\ub8cc \ud14c\uc2a4\ud2b8\ub97c \uba3c\uc800 \ud574\ubcf4\uc138\uc694. \ud604\uc7ac \uc608\uc0c1 \ub4f1\uae09\uc744 \ubc14\ub85c \ud655\uc778\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.'
    },
    {
      question: 'SpeakCoach AI\ub294 \uc5b4\ub5bb\uac8c \uc0ac\uc6a9\ud558\ub098\uc694?',
      answer: 'SpeakCoach AI\ub294 \uc6f9 \uc571(PWA)\uc774\ub77c \ubcc4\ub3c4 \uc124\uce58 \uc5c6\uc774 \ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c \ubc14\ub85c \uc811\uc18d\ud560 \uc218 \uc788\uc5b4\uc694. \uac00\uc785 \ud6c4 \ub2f5\ubcc0\uc744 \ub179\uc74c\ud558\uba74 AI\uac00 \ubc1c\uc74c, \ubb38\ubc95, \uc720\ucc3d\uc131, \uc5b4\ud718 \ub4f1 7\uac1c \uce74\ud14c\uace0\ub9ac\ub85c \ubd84\uc11d\ud574\uc11c \uc608\uc0c1 \ub4f1\uae09\uacfc \uad6c\uccb4\uc801\uc778 \ud53c\ub4dc\ubc31\uc744 \uc81c\uacf5\ud569\ub2c8\ub2e4. \ubb34\ub8cc \uccb4\ud5d8\ub3c4 \uac00\ub2a5\ud569\ub2c8\ub2e4.'
    },
    {
      question: '2\uc8fc \uc2a4\ud130\ub514\ub294 \uc5b4\ub5a4 \uc2dd\uc73c\ub85c \uc9c4\ud589\ub418\ub098\uc694?',
      answer: '3\uc778 1\ud300\uc73c\ub85c \uad6c\uc131\ub418\uba70, 14\uc77c \ub3d9\uc548 \ub9e4\uc77c \uc2a4\ud53c\ud0b9 \uacfc\uc81c\ub97c \uc81c\ucd9c\ud569\ub2c8\ub2e4. \ucf54\uce58\uc758 \uc2e4\uc2dc\uac04 \ud53c\ub4dc\ubc31 + SpeakCoach AI\uc758 \uc815\ubc00 \ubd84\uc11d\uc744 \ud568\uaed8 \ubc1b\uc2b5\ub2c8\ub2e4. \uce74\uce74\uc624\ud1a1 \uadf8\ub8f9\uc5d0\uc11c \uc18c\ud1b5\ud558\uba70, 1\uc8fc\ucc28\ub294 \uae30\ubcf8 \ud504\ub808\uc784\uc6cc\ud06c, 2\uc8fc\ucc28\ub294 \uc2e4\uc804 \ubaa8\uc758\uace0\uc0ac\uc5d0 \uc9d1\uc911\ud569\ub2c8\ub2e4.',
      hasLink: true
    },
    {
      question: '\uc601\uc5b4\ub97c \uc9c4\uc9dc \ubabb\ud558\ub294\ub370 \ub530\ub77c\uac08 \uc218 \uc788\uc744\uae4c\uc694?',
      answer: '\ub124, \uac00\ub2a5\ud569\ub2c8\ub2e4. \ud504\ub808\uc784\uc6cc\ud06c \uae30\ubc18 \ud6c8\ub828\uc774\ub77c \uc601\uc5b4\ub97c \uc798 \ubabb\ud558\ub354\ub77c\ub3c4 \ub2f5\ubcc0 \uad6c\uc870\ub97c \ub530\ub77c\uac00\uba70 \ud559\uc2b5\ud560 \uc218 \uc788\uc5b4\uc694. \uc2e4\uc81c\ub85c IL \uc218\uc900\uc5d0\uc11c \uc2dc\uc791\ud574\uc11c IM2, IH\ub97c \ub2ec\uc131\ud55c \ubd84\ub4e4\uc774 \ub9ce\uc2b5\ub2c8\ub2e4. \uc911\uc694\ud55c \uac74 \ub9e4\uc77c \uafb8\uc900\ud788 \uacfc\uc81c\ub97c \uc81c\ucd9c\ud558\ub294 \uac83\uc785\ub2c8\ub2e4.'
    },
    {
      question: '\uc9c1\uc7a5\uc778\uc778\ub370 \uc2dc\uac04 \ud22c\uc790\uac00 \ub9ce\uc774 \ud544\uc694\ud55c\uac00\uc694?',
      answer: '\ud558\ub8e8 \ud3c9\uade0 1~2\uc2dc\uac04\uc774\uba74 \ucda9\ubd84\ud569\ub2c8\ub2e4. \ud559\uc2b5 \uc790\ub8cc \ud655\uc778 10\ubd84, \ub2f5\ubcc0 \uc900\ube44 \ubc0f \ub179\uc74c 30~40\ubd84, AI \ubd84\uc11d \ud655\uc778 20\ubd84, \ucf54\uce58 \ud53c\ub4dc\ubc31 \ubc18\uc601 20\ubd84 \uc815\ub3c4\uc608\uc694. \ucd9c\ud1f4\uadfc \uc2dc\uac04\uc5d0 \uc790\ub8cc\ub97c \ubcf4\uace0, \ud1f4\uadfc \ud6c4 \ub179\uc74c\ud558\ub294 \ud328\ud134\uc73c\ub85c \uc9c4\ud589\ud558\uc2dc\ub294 \uc9c1\uc7a5\uc778\ubd84\ub4e4\uc774 \ub9ce\uc2b5\ub2c8\ub2e4.'
    },
    {
      question: '\ud658\ubd88\uc740 \uc5b4\ub5bb\uac8c \ub418\ub098\uc694?',
      answer: '\u26a0\ufe0f \uc2a4\ud130\ub514 \uc778\uc6d0 \ud3b8\uc131 \uc774\ud6c4(\ub2e8\ud1a1\ubc29 \ucd08\ub300 \uc774\ud6c4)\uc5d0\ub294 \uc5b4\ub5a0\ud55c \uc0ac\uc720\ub85c\ub3c4 \ud658\ubd88\uc774 \ubd88\uac00\ud569\ub2c8\ub2e4. \ubcf8 \uc2a4\ud130\ub514\ub294 \uc18c\uaddc\ubaa8 \uc815\uc6d0 \uae30\ubc18\uc73c\ub85c \uc6b4\uc601\ub418\uba70, \uadf8\ub8f9 \ud655\uc815\uacfc \ub3d9\uc2dc\uc5d0 \ub9de\ucda4 \ucee4\ub9ac\ud050\ub7fc\uacfc \uc6b4\uc601 \ub9ac\uc18c\uc2a4\uac00 \uc989\uc2dc \ubc30\uc815\ub418\uae30 \ub54c\ubb38\uc785\ub2c8\ub2e4. \ub2e8\ud1a1\ubc29 \ucd08\ub300 \uc804\uc5d0\ub294 \uc804\uc561 \ud658\ubd88 \uac00\ub2a5\ud569\ub2c8\ub2e4. SpeakCoach AI \uad6c\ub3c5\uc740 \uacb0\uc81c \ud6c4 7\uc77c \uc774\ub0b4 \ud658\ubd88 \uac00\ub2a5\ud569\ub2c8\ub2e4. \uacb0\uc81c \uc2dc \ubcf8 \ud658\ubd88 \uc815\ucc45\uc5d0 \ub3d9\uc758\ud55c \uac83\uc73c\ub85c \uac04\uc8fc\ub429\ub2c8\ub2e4.'
    },
    {
      question: '\uc804\uc790\ucc45, \uc778\uac15, \uc2a4\ud130\ub514 \uc911 \ubb58 \uc120\ud0dd\ud574\uc57c \ud558\ub098\uc694?',
      answer: '\ubaa9\ud45c\uc640 \uc0c1\ud669\uc5d0 \ub530\ub77c \ub2ec\ub77c\uc694. \ub3c5\ud559 \uc120\ud638 + \uae30\ucd08 \ud559\uc2b5\uc774\uba74 \uc804\uc790\ucc45, \uccb4\uacc4\uc801 \uc601\uc0c1 \uac15\uc758\ub97c \uc6d0\ud558\uba74 \uc778\uac15, \ub2e8\uae30\uac04 \ud655\uc2e4\ud55c \uc131\uacfc\ub97c \uc6d0\ud558\uba74 2\uc8fc \uc2a4\ud130\ub514\ub97c \ucd94\ucc9c\ud569\ub2c8\ub2e4. \uac00\uc7a5 \ud6a8\uacfc\uac00 \uc88b\uc740 \uc870\ud569\uc740 \uc778\uac15 + \uc2a4\ud130\ub514\uc774\uace0, \uc608\uc0b0\uc774 \uc81c\ud55c\uc801\uc774\ub77c\uba74 \uc804\uc790\ucc45 + SpeakCoach AI \ubb34\ub8cc \uccb4\ud5d8\uc73c\ub85c \uc2dc\uc791\ud574\ubcf4\uc138\uc694.'
    }
  ];

  const reviews = [
    {
      initial: 'J',
      name: '\uc815*\ud604',
      info: '\ub300\ud559\uc0dd \u00b7 2\uc8fc \uc2a4\ud130\ub514',
      stars: 5,
      text: '2\uc8fc \ub9cc\uc5d0 IM2\uc5d0\uc11c IH\ub85c \uc62c\ub790\uc2b5\ub2c8\ub2e4. \ud504\ub808\uc784\uc6cc\ud06c \ub2f5\ubcc0\uc774 \uc9c4\uc9dc \ud6a8\uacfc\uc801\uc774\uc5d0\uc694. \ud63c\uc790 \ud588\uc73c\uba74 \uc808\ub300 \ubabb \uc62c\ub838\uc744 \uc810\uc218\uc785\ub2c8\ub2e4.',
      badge: 'IM2 \u2192 IH',
      result: '2\uc8fc \ub9cc\uc5d0 \ub4f1\uae09 \uc0c1\uc2b9'
    },
    {
      initial: 'S',
      name: '\uc11c*\uc601',
      info: '\ucde8\uc900\uc0dd \u00b7 \uc2a4\ud130\ub514 + AI',
      stars: 5,
      text: 'SpeakCoach AI\ub85c \ub9e4\uc77c \uc5f0\uc2b5\ud558\uace0, \uc2a4\ud130\ub514\uc5d0\uc11c \ud53c\ub4dc\ubc31 \ubc1b\uc73c\ub2c8\uae4c \ub0b4 \uc57d\uc810\uc774 \uc815\ud655\ud788 \ubcf4\uc600\uc5b4\uc694. \uacb0\uad6d AL \ubc1b\uc558\uc2b5\ub2c8\ub2e4!',
      badge: 'IH \u2192 AL',
      result: '\ucd5c\uace0 \ub4f1\uae09 \ub2ec\uc131'
    },
    {
      initial: 'K',
      name: '\uae40*\uc218',
      info: '\uc9c1\uc7a5\uc778 \u00b7 \uc804\uc790\ucc45 + AI',
      stars: 4,
      text: '\ud1f4\uadfc \ud6c4 \uc2dc\uac04\uc774 \uc5c6\uc5b4\uc11c \uc804\uc790\ucc45\uc73c\ub85c \ud2c0 \uc7a1\uace0, AI\ub85c \ub9e4\uc77c 15\ubd84\uc529 \uc5f0\uc2b5\ud588\uc5b4\uc694. \ud55c \ub2ec \ub9cc\uc5d0 IM3 \ubc1b\uc558\uc2b5\ub2c8\ub2e4.',
      badge: 'IL \u2192 IM3',
      result: '3\ub2e8\uacc4 \uc0c1\uc2b9'
    },
    {
      initial: 'L',
      name: '\uc774*\uc9c4',
      info: '\ub300\ud559\uc0dd \u00b7 2\uc8fc \uc2a4\ud130\ub514',
      stars: 5,
      text: '3\uba85\uc774\uc11c \ud300\uc73c\ub85c \ud558\ub2c8\uae4c \uae34\uc7a5\uac10\ub3c4 \uc788\uace0, \uc11c\ub85c \ud53c\ub4dc\ubc31 \uc8fc\ub294 \uac8c \uc9c4\uc9dc \ub3c4\uc6c0\ub410\uc5b4\uc694. \ucde8\uc5c5 \uba74\uc811 \uc804\uc5d0 \uc790\uc2e0\uac10\ub3c4 \uc0dd\uacbc\uc2b5\ub2c8\ub2e4.',
      badge: 'IM1 \u2192 IH',
      result: '\ubaa9\ud45c \ub4f1\uae09 \ub2ec\uc131'
    },
    {
      initial: 'P',
      name: '\ubc15*\ud76c',
      info: '\uc774\uc9c1 \uc900\ube44 \u00b7 \uc778\uac15 + \uc2a4\ud130\ub514',
      stars: 5,
      text: '\uc778\uac15\uc73c\ub85c \uae30\ubcf8\uae30 \uc7a1\uace0 \uc2a4\ud130\ub514\uc5d0\uc11c \uc2e4\uc804 \uc5f0\uc2b5\ud558\ub2c8\uae4c \uc2dc\ub108\uc9c0\uac00 \ub300\ub2e8\ud588\uc5b4\uc694. IH \ubaa9\ud45c\uc600\ub294\ub370 AL\uc774 \ub098\uc654\uc2b5\ub2c8\ub2e4.',
      badge: 'IM3 \u2192 AL',
      result: '\ubaa9\ud45c \ucd08\uacfc \ub2ec\uc131'
    },
    {
      initial: 'C',
      name: '\ucd5c*\uc544',
      info: '\ub300\ud559\uc6d0\uc0dd \u00b7 \uc804\uc790\ucc45',
      stars: 5,
      text: '\ud504\ub808\uc784\uc6cc\ud06c\uac00 \uc9c4\uc9dc \ud575\uc2ec\uc774\uc5d0\uc694. \ub2f5\ubcc0 \uad6c\uc870\ub97c \uc7a1\uc73c\ub2c8\uae4c \uc5b4\ub5a4 \uc9c8\ubb38\uc774 \ub098\uc640\ub3c4 \ub2f9\ud669\ud558\uc9c0 \uc54a\uac8c \ub410\uc5b4\uc694.',
      badge: 'IM2 \u2192 IH',
      result: '\uc804\uc790\ucc45\ub9cc\uc73c\ub85c \uc0c1\uc2b9'
    },
    {
      initial: 'H',
      name: '\ud669*\uc6b0',
      info: '\uc9c1\uc7a5\uc778 \u00b7 2\uc8fc \uc2a4\ud130\ub514',
      stars: 5,
      text: '\ud68c\uc0ac\uc5d0\uc11c OPIC IH \ud544\uc218\uc600\ub294\ub370, \ub450 \ubc88 \ub5a8\uc5b4\uc9c0\uace0 \uc5ec\uae30\uc11c \ub4dc\ub514\uc5b4 \ub531\uc5d0 \ud569\uaca9\ud588\uc2b5\ub2c8\ub2e4. \ucf54\uce58\ub2d8 \ud53c\ub4dc\ubc31\uc774 \uc815\ub9d0 \uc815\ud655\ud574\uc694.',
      badge: 'IM1 \u2192 IH',
      result: '\uc2b9\uc9c4 \uc694\uac74 \ucda9\uc871'
    },
    {
      initial: 'Y',
      name: '\uc724*\ub9b0',
      info: '\ub300\ud559\uc0dd \u00b7 \uc778\uac15 + \uc2a4\ud130\ub514',
      stars: 5,
      text: '\uc778\uac15\uc73c\ub85c \uae30\ubcf8\uae30 \uc7a1\uace0 \uc2a4\ud130\ub514\uc5d0\uc11c \uc2e4\uc804 \uac10\uac01 \uc775\ud614\uc5b4\uc694. \ub450 \uac00\uc9c0 \ubcd1\ud589\ud558\ub2c8\uae4c \uc2dc\ub108\uc9c0\uac00 \uc5c4\uccad\ub0ac\uc2b5\ub2c8\ub2e4.',
      badge: 'IM2 \u2192 AL',
      result: '\ubaa9\ud45c \ucd08\uacfc \ub2ec\uc131'
    },
    {
      initial: 'M',
      name: '\ubb38*\ud76c',
      info: '\ucde8\uc900\uc0dd \u00b7 AI + \uc804\uc790\ucc45',
      stars: 5,
      text: 'SpeakCoach AI\ub85c \ub9e4\uc77c \uc544\uce68\uc5d0 15\ubd84\uc529 \uc5f0\uc2b5\ud588\uc5b4\uc694. \ubc1c\uc74c \ubd84\uc11d\uc774 \uc815\ub9d0 \uc815\ubc00\ud574\uc11c \uc57d\uc810\uc744 \uc815\ud655\ud788 \uace0\uce60 \uc218 \uc788\uc5c8\uc2b5\ub2c8\ub2e4.',
      badge: 'IL \u2192 IM2',
      result: '\uae30\ucd08\ubd80\ud130 \ub2e8\uae30 \uc0c1\uc2b9'
    },
    {
      initial: 'A',
      name: '\uc548*\uc900',
      info: '\uc9c1\uc7a5\uc778 \u00b7 \uc2a4\ud130\ub514',
      stars: 4,
      text: '\ud300\uc6d0\ub4e4\uc774 \uc11c\ub85c \ub3d9\uae30\ubd80\uc5ec\uac00 \ub418\ub2c8\uae4c \ub9e4\uc77c \uacfc\uc81c \uc548 \ub0b4\uba74 \uc548 \ub418\ub294 \ubd84\uc704\uae30\uc600\uc5b4\uc694. \ub355\ubd84\uc5d0 2\uc8fc \uc644\uc8fc\ud588\uc2b5\ub2c8\ub2e4.',
      badge: 'IM3 \u2192 IH',
      result: '\ubaa9\ud45c \ub4f1\uae09 \ub2ec\uc131'
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
        img { max-width: 100%; display: block; }

        /* === TOSS COLOR SYSTEM === */
        :root {
          --blue-primary: #3182F6;
          --blue-dark: #1B64DA;
          --blue-light: #E8F3FF;
          --blue-bg: #F2F4F6;
          --text-primary: #191F28;
          --text-secondary: #4E5968;
          --text-tertiary: #8B95A1;
          --text-white: #FFFFFF;
          --bg-white: #FFFFFF;
          --bg-gray: #F2F4F6;
          --border: #E5E8EB;
          --card-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06);
          --card-hover: 0 4px 16px rgba(0,0,0,0.08), 0 12px 40px rgba(0,0,0,0.1);
          --section-padding: 120px 0;
          --kakao-yellow: #FEE500;
        }

        .container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
        .section { padding: var(--section-padding); }
        .section-gray { background: var(--bg-gray); }

        /* === NAV === */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .nav-inner {
          max-width: 1140px; margin: 0 auto; padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px;
        }
        .nav-logo {
          font-size: 19px; font-weight: 800; color: var(--text-primary);
          display: flex; align-items: center; gap: 6px;
          letter-spacing: -0.03em;
        }
        .nav-logo .logo-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 10px;
          background: linear-gradient(135deg, #FFD43B 0%, #F59F00 100%);
          font-size: 18px; line-height: 1;
          box-shadow: 0 2px 8px rgba(245, 159, 0, 0.25);
        }
        .nav-logo .logo-text {
          display: flex; flex-direction: column; line-height: 1.1;
        }
        .nav-logo .logo-text .logo-main {
          font-size: 17px; font-weight: 800; color: var(--text-primary);
          letter-spacing: -0.02em;
        }
        .nav-logo .logo-text .logo-sub {
          font-size: 10px; font-weight: 600; color: var(--text-tertiary);
          letter-spacing: 0.04em;
        }
        .nav-links { display: flex; gap: 32px; align-items: center; }
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
        }
        .nav-cta:hover { background: var(--blue-dark); }

        /* === HAMBURGER MENU === */
        .hamburger {
          display: none;
          width: 40px; height: 40px;
          background: none; border: none;
          flex-direction: column; align-items: center; justify-content: center;
          gap: 5px; cursor: pointer; z-index: 200;
          padding: 8px;
        }
        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        .mobile-menu {
          display: none;
          position: fixed; top: 64px; left: 0; right: 0; bottom: 0;
          background: rgba(255,255,255,0.98);
          backdrop-filter: blur(20px);
          z-index: 99;
          flex-direction: column;
          padding: 32px 24px;
          gap: 8px;
        }
        .mobile-menu.show { display: flex; }
        .mobile-menu a {
          display: block; padding: 16px 20px;
          font-size: 18px; font-weight: 600;
          color: var(--text-primary);
          border-radius: 14px;
          transition: background 0.2s;
        }
        .mobile-menu a:hover { background: var(--bg-gray); }
        .mobile-menu .mobile-cta {
          margin-top: 16px;
          background: var(--blue-primary); color: white;
          text-align: center; border-radius: 16px;
          padding: 18px;
          font-size: 17px; font-weight: 700;
        }

        /* === HERO === */
        .hero {
          padding: 160px 0 120px;
          background: #FFFFFF;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--blue-light); color: var(--blue-primary);
          padding: 8px 16px; border-radius: 100px;
          font-size: 14px; font-weight: 600;
          margin-bottom: 24px;
        }
        .hero h1 {
          font-size: 52px; font-weight: 800; line-height: 1.3;
          color: var(--text-primary);
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .hero h1 .highlight { color: var(--blue-primary); }
        .hero p {
          font-size: 18px; color: var(--text-secondary);
          max-width: 560px; margin: 0 auto 40px;
          line-height: 1.7;
        }
        .hero-buttons { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          background: var(--blue-primary); color: white;
          padding: 16px 32px; border-radius: 16px;
          font-size: 17px; font-weight: 700;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { background: var(--blue-dark); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(49,130,246,0.3); }
        .btn-secondary {
          background: var(--bg-gray); color: var(--text-primary);
          padding: 16px 32px; border-radius: 16px;
          font-size: 17px; font-weight: 700;
          transition: all 0.2s;
        }
        .btn-secondary:hover { background: #E5E8EB; }

        .hero-stats {
          display: flex; justify-content: center; gap: 60px;
          margin-top: 64px; padding-top: 48px;
          border-top: 1px solid var(--border);
        }
        .hero-stat { text-align: center; }
        .hero-stat .number { font-size: 36px; font-weight: 800; color: var(--blue-primary); }
        .hero-stat .label { font-size: 14px; color: var(--text-tertiary); margin-top: 4px; font-weight: 500; }

        /* === SECTION HEADINGS === */
        .section-header { text-align: center; margin-bottom: 64px; }
        .section-header .overline {
          font-size: 14px; font-weight: 700; color: var(--blue-primary);
          text-transform: uppercase; letter-spacing: 0.05em;
          margin-bottom: 12px;
        }
        .section-header h2 {
          font-size: 36px; font-weight: 800; line-height: 1.35;
          letter-spacing: -0.02em;
        }
        .section-header p {
          font-size: 16px; color: var(--text-secondary);
          max-width: 480px; margin: 16px auto 0;
          line-height: 1.7;
        }

        /* === PRODUCTS / STORE === */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 24px;
        }
        .product-card {
          background: var(--bg-white);
          border-radius: 20px;
          border: 1px solid var(--border);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .product-card:hover {
          border-color: var(--blue-primary);
          box-shadow: var(--card-hover);
          transform: translateY(-4px);
        }
        .product-card-image {
          height: 200px;
          background: linear-gradient(135deg, #E8F3FF 0%, #D0E8FF 100%);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .product-card-image.ebook-bg { background: linear-gradient(135deg, #E8F3FF 0%, #C7DEFF 100%); }
        .product-card-image.course-bg { background: linear-gradient(135deg, #F0E8FF 0%, #DDD0FF 100%); }
        .product-card-image.study-bg { background: linear-gradient(135deg, #E8FFF0 0%, #C7FFD8 100%); }
        .product-icon-wrap {
          width: 72px; height: 72px; border-radius: 20px;
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .product-icon-wrap.ebook-icon { background: linear-gradient(135deg, #3182F6 0%, #1B64DA 100%); }
        .product-icon-wrap.course-icon { background: linear-gradient(135deg, #7C5CFC 0%, #6344E0 100%); }
        .product-icon-wrap.study-icon { background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); }
        .product-card-label {
          font-size: 14px; font-weight: 700; letter-spacing: -0.02em;
          opacity: 0.85;
        }
        .product-badge {
          position: absolute; top: 16px; left: 16px;
          background: var(--blue-primary); color: white;
          padding: 4px 12px; border-radius: 8px;
          font-size: 12px; font-weight: 700;
        }
        .product-badge.hot { background: #F04452; }
        .product-badge.new { background: #3CB371; }
        .product-card-body { padding: 24px; }
        .product-card-body .category {
          font-size: 13px; font-weight: 600; color: var(--blue-primary);
          margin-bottom: 8px;
        }
        .product-card-body h3 {
          font-size: 20px; font-weight: 700; margin-bottom: 8px;
          line-height: 1.4;
        }
        .product-card-body .desc {
          font-size: 14px; color: var(--text-secondary);
          margin-bottom: 16px; line-height: 1.6;
        }
        .product-price-row {
          display: flex; align-items: center; justify-content: space-between;
        }
        .product-price {
          display: flex; align-items: baseline; gap: 8px;
        }
        .product-price .original {
          font-size: 14px; color: var(--text-tertiary);
          text-decoration: line-through;
        }
        .product-price .current {
          font-size: 22px; font-weight: 800; color: var(--text-primary);
        }
        .product-price .unit {
          font-size: 14px; color: var(--text-secondary); font-weight: 500;
        }
        .btn-buy {
          background: var(--blue-primary); color: white;
          padding: 10px 20px; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          transition: all 0.2s;
        }
        .btn-buy:hover { background: var(--blue-dark); }

        /* === SPEAKCOACH AI === */
        .speakcoach-section { position: relative; overflow: hidden; }
        .speakcoach-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .speakcoach-content .tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--blue-light); color: var(--blue-primary);
          padding: 6px 14px; border-radius: 100px;
          font-size: 13px; font-weight: 700;
          margin-bottom: 20px;
        }
        .speakcoach-content h2 {
          font-size: 40px; font-weight: 800; line-height: 1.3;
          margin-bottom: 16px; letter-spacing: -0.02em;
        }
        .speakcoach-content h2 .highlight { color: var(--blue-primary); }
        .speakcoach-content > p {
          font-size: 16px; color: var(--text-secondary);
          line-height: 1.7; margin-bottom: 32px;
        }
        .speakcoach-features {
          display: flex; flex-direction: column; gap: 16px;
          margin-bottom: 36px;
        }
        .feature-item {
          display: flex; align-items: flex-start; gap: 12px;
        }
        .feature-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: var(--blue-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .feature-text h4 { font-size: 15px; font-weight: 700; margin-bottom: 2px; }
        .feature-text p { font-size: 14px; color: var(--text-secondary); }
        .speakcoach-mockup {
          background: linear-gradient(135deg, #1B1D29 0%, #2B2E3B 100%);
          border-radius: 24px; padding: 40px;
          position: relative;
          box-shadow: var(--card-shadow);
        }
        .mockup-header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 32px;
        }
        .mockup-dot { width: 12px; height: 12px; border-radius: 50%; }
        .mockup-dot.red { background: #FF5F57; }
        .mockup-dot.yellow { background: #FEBC2E; }
        .mockup-dot.green { background: #28C840; }
        .mockup-screen {
          background: #FFFFFF; border-radius: 16px;
          padding: 24px;
        }
        .mockup-grade-row {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
        }
        .mockup-grade {
          font-size: 48px; font-weight: 800;
          color: var(--blue-primary);
        }
        .mockup-grade-label { font-size: 13px; color: var(--text-tertiary); }
        .mockup-al-prob { text-align: right; }
        .mockup-al-prob .prob-num { font-size: 28px; font-weight: 800; color: #F04452; }
        .mockup-al-prob .prob-label { font-size: 12px; color: var(--text-tertiary); }
        .mockup-bars { display: flex; flex-direction: column; gap: 10px; }
        .mockup-bar-item { display: flex; align-items: center; gap: 12px; }
        .mockup-bar-label { font-size: 12px; color: var(--text-secondary); width: 60px; flex-shrink: 0; }
        .mockup-bar-track {
          flex: 1; height: 8px; background: var(--bg-gray);
          border-radius: 4px; overflow: hidden;
        }
        .mockup-bar-fill {
          height: 100%; border-radius: 4px;
          background: var(--blue-primary);
          transition: width 1.5s ease;
        }
        .mockup-bar-fill.weak { background: #F04452; }
        .mockup-bar-fill.mid { background: #FF9F43; }

        /* === PRICING PLANS === */
        .pricing-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 20px; max-width: 960px; margin: 0 auto;
        }
        .pricing-card {
          background: var(--bg-white); border-radius: 20px;
          border: 1px solid var(--border); padding: 32px;
          position: relative; transition: all 0.3s;
        }
        .pricing-card.featured {
          border-color: var(--blue-primary);
          box-shadow: 0 0 0 1px var(--blue-primary), var(--card-shadow);
          transform: scale(1.02);
        }
        .pricing-card .recommend-badge {
          position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
          background: var(--blue-primary); color: white;
          padding: 4px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 700;
        }
        .pricing-card .plan-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
        .pricing-card .plan-price {
          font-size: 32px; font-weight: 800; margin: 16px 0 4px;
        }
        .pricing-card .plan-price .won { font-size: 18px; font-weight: 600; }
        .pricing-card .plan-original {
          font-size: 14px; color: var(--text-tertiary);
          text-decoration: line-through; margin-bottom: 4px;
        }
        .pricing-card .plan-sub { font-size: 13px; color: var(--text-tertiary); margin-bottom: 24px; }
        .pricing-card .plan-features { list-style: none; margin-bottom: 24px; }
        .pricing-card .plan-features li {
          font-size: 14px; color: var(--text-secondary);
          padding: 6px 0; display: flex; align-items: center; gap: 8px;
        }
        .pricing-card .plan-features li::before {
          content: '\u2713'; color: var(--blue-primary); font-weight: 700;
        }
        .btn-plan {
          width: 100%; padding: 14px; border-radius: 14px;
          font-size: 15px; font-weight: 700; text-align: center;
          transition: all 0.2s;
        }
        .btn-plan.primary { background: var(--blue-primary); color: white; }
        .btn-plan.primary:hover { background: var(--blue-dark); }
        .btn-plan.outline {
          background: transparent; color: var(--text-primary);
          border: 1px solid var(--border);
        }
        .btn-plan.outline:hover { border-color: var(--blue-primary); color: var(--blue-primary); }

        /* === REVIEWS === */
        .reviews-wrapper { position: relative; overflow: hidden; cursor: grab; }
        .reviews-scroll {
          display: flex; gap: 20px;
          padding-bottom: 20px;
          transition: none;
        }
        .review-card {
          min-width: 320px; max-width: 360px;
          background: var(--bg-white); border-radius: 20px;
          border: 1px solid var(--border); padding: 28px;
          scroll-snap-align: start;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .review-card:hover { border-color: var(--blue-primary); box-shadow: var(--card-shadow); }
        .review-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .review-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--blue-light); display: flex;
          align-items: center; justify-content: center;
          font-size: 18px; font-weight: 700; color: var(--blue-primary);
        }
        .review-meta .name { font-size: 15px; font-weight: 700; }
        .review-meta .info { font-size: 13px; color: var(--text-tertiary); }
        .review-stars { color: #FF9F43; font-size: 14px; margin-bottom: 12px; letter-spacing: 2px; line-height: 1; }
        .review-stars .empty { color: #E5E8EB; }
        .review-text { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .review-result {
          margin-top: 16px; padding-top: 16px;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; gap: 8px;
        }
        .review-result .grade-badge {
          background: var(--blue-light); color: var(--blue-primary);
          padding: 4px 10px; border-radius: 8px;
          font-size: 13px; font-weight: 700;
        }
        .review-result .grade-text { font-size: 13px; color: var(--text-secondary); }
        .reviews-count-badge { text-align: center; margin-top: 32px; }
        .reviews-count-badge span {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--blue-light); color: var(--blue-primary);
          padding: 10px 24px; border-radius: 100px;
          font-size: 15px; font-weight: 700;
        }

        /* === FAQ === */
        .faq-list { max-width: 720px; margin: 0 auto; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-question {
          width: 100%; padding: 24px 0; background: none;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 16px; font-weight: 600; color: var(--text-primary);
          text-align: left;
        }
        .faq-question .arrow {
          transition: transform 0.3s; font-size: 20px; color: var(--text-tertiary);
          flex-shrink: 0; margin-left: 16px;
        }
        .faq-question.open .arrow { transform: rotate(180deg); }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
        .faq-answer-inner {
          padding: 0 0 24px;
          font-size: 15px; color: var(--text-secondary); line-height: 1.7;
        }

        /* === CTA BANNER === */
        .cta-banner {
          background: linear-gradient(135deg, #3182F6 0%, #1B64DA 100%);
          padding: 80px 0; text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-banner::before {
          content: '';
          position: absolute; top: -100px; right: -100px;
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        }
        .cta-banner h2 {
          font-size: 36px; font-weight: 800; color: white;
          margin-bottom: 12px;
        }
        .cta-banner p {
          font-size: 16px; color: rgba(255,255,255,0.8);
          margin-bottom: 32px;
        }
        .btn-white {
          background: white; color: var(--blue-primary);
          padding: 16px 40px; border-radius: 16px;
          font-size: 17px; font-weight: 700;
          transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }

        /* === FOOTER === */
        .footer {
          background: #191F28; color: rgba(255,255,255,0.6);
          padding: 64px 0 40px;
        }
        .footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px; margin-bottom: 48px;
        }
        .footer-brand .logo {
          font-size: 20px; font-weight: 800; color: white;
          margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
        }
        .footer-brand p { font-size: 14px; line-height: 1.7; }
        .footer-col h4 { color: white; font-size: 14px; font-weight: 700; margin-bottom: 16px; }
        .footer-col a {
          display: block; font-size: 14px; padding: 4px 0;
          color: rgba(255,255,255,0.5); transition: color 0.2s;
        }
        .footer-col a:hover { color: rgba(255,255,255,0.9); }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          font-size: 13px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-bottom .social { display: flex; gap: 16px; }
        .footer-bottom .social a { font-size: 14px; }

        /* === NEWSLETTER / FREE RESOURCE === */
        .newsletter-section {
          background: #F8FAFC;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 100px 0;
        }
        .newsletter-inner {
          max-width: 640px; margin: 0 auto; text-align: center;
        }
        .newsletter-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: var(--blue-light);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px; margin: 0 auto 24px;
        }
        .newsletter-inner h2 {
          font-size: 32px; font-weight: 800; line-height: 1.35;
          margin-bottom: 12px; letter-spacing: -0.02em;
        }
        .newsletter-inner h2 .highlight { color: var(--blue-primary); }
        .newsletter-inner > p {
          font-size: 16px; color: var(--text-secondary);
          line-height: 1.7; margin-bottom: 32px;
        }
        .newsletter-form {
          display: flex; gap: 10px; max-width: 480px; margin: 0 auto 16px;
        }
        .newsletter-form input {
          flex: 1; padding: 16px 20px; border-radius: 14px;
          border: 1px solid var(--border); font-size: 15px;
          font-family: inherit; outline: none;
          transition: border-color 0.2s;
        }
        .newsletter-form input:focus { border-color: var(--blue-primary); }
        .newsletter-form input::placeholder { color: var(--text-tertiary); }
        .newsletter-form button {
          padding: 16px 28px; border-radius: 14px;
          background: var(--blue-primary); color: white;
          font-size: 15px; font-weight: 700;
          transition: all 0.2s; white-space: nowrap;
        }
        .newsletter-form button:hover { background: var(--blue-dark); }
        .newsletter-note {
          font-size: 13px; color: var(--text-tertiary);
          margin-top: 8px;
        }
        .newsletter-benefits {
          display: flex; gap: 24px; justify-content: center;
          margin-top: 32px; flex-wrap: wrap;
        }
        .newsletter-benefit {
          display: flex; align-items: center; gap: 8px;
          font-size: 14px; color: var(--text-secondary); font-weight: 500;
        }
        .newsletter-benefit .check {
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--blue-light); color: var(--blue-primary);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700;
        }
        .newsletter-success {
          display: none; padding: 20px; border-radius: 16px;
          background: #E8FFF0; color: #1A8D48;
          font-size: 15px; font-weight: 600;
          max-width: 480px; margin: 0 auto;
        }
        .newsletter-success.show { display: block; }

        /* === KAKAOTALK FLOATING BUTTON === */
        .kakao-float {
          position: fixed; bottom: 28px; right: 28px; z-index: 150;
          display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
        }
        .kakao-tooltip {
          background: var(--text-primary); color: white;
          padding: 10px 16px; border-radius: 12px;
          font-size: 13px; font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          opacity: 0; transform: translateY(8px);
          transition: all 0.3s ease;
          pointer-events: none;
        }
        .kakao-tooltip::after {
          content: ''; position: absolute; bottom: -6px; right: 24px;
          width: 12px; height: 12px; background: var(--text-primary);
          transform: rotate(45deg);
        }
        .kakao-float:hover .kakao-tooltip {
          opacity: 1; transform: translateY(0);
        }
        .kakao-btn {
          width: 60px; height: 60px; border-radius: 50%;
          background: var(--kakao-yellow);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          border: none; cursor: pointer;
        }
        .kakao-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 28px rgba(0,0,0,0.2);
        }
        .kakao-btn svg { width: 32px; height: 32px; }

        /* === ANIMATIONS === */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate { animation: fadeInUp 0.6s ease forwards; opacity: 0; }
        .animate.delay-1 { animation-delay: 0.1s; }
        .animate.delay-2 { animation-delay: 0.2s; }
        .animate.delay-3 { animation-delay: 0.3s; }
        .animate.delay-4 { animation-delay: 0.4s; }

        /* === MOBILE === */
        @media (max-width: 768px) {
          .hero h1 { font-size: 32px; }
          .hero p { font-size: 16px; }
          .hero-stats { flex-direction: column; gap: 24px; }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .speakcoach-grid { grid-template-columns: 1fr; gap: 40px; }
          .pricing-grid { grid-template-columns: 1fr; max-width: 400px; }
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .products-grid { grid-template-columns: 1fr; }
          .section { padding: 80px 0; }
          .section-header h2 { font-size: 28px; }
          .kakao-float { bottom: 20px; right: 20px; }
          .kakao-btn { width: 52px; height: 52px; }
          .kakao-btn svg { width: 28px; height: 28px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav" id="nav">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="logo-mark">{'\ud83c\udf5e'}</span>
            <span className="logo-text">
              <span className="logo-main">{'\uc2dd\ube75\uc601\uc5b4'}</span>
              <span className="logo-sub">OPIC MASTER</span>
            </span>
          </a>
          <div className="nav-links">
            <a href="#free-resource">{'\ubb34\ub8cc \uc790\ub8cc'}</a>
            <a href="#store">{'\uc2a4\ud1a0\uc5b4'}</a>
            <a href="#speakcoach">SpeakCoach AI</a>
            <a href="#reviews">{'\ud6c4\uae30'}</a>
            <a href="#faq">FAQ</a>
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="nav-cta">{'\ubb34\ub8cc \uccb4\ud5d8\ud558\uae30'}</a>
          </div>
          <button className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
        <a href="#free-resource" onClick={closeMobileMenu}>{'\ubb34\ub8cc \uc790\ub8cc'}</a>
        <a href="#store" onClick={closeMobileMenu}>{'\uc2a4\ud1a0\uc5b4'}</a>
        <a href="#speakcoach" onClick={closeMobileMenu}>SpeakCoach AI</a>
        <a href="#reviews" onClick={closeMobileMenu}>{'\ud6c4\uae30'}</a>
        <a href="#faq" onClick={closeMobileMenu}>FAQ</a>
        <Link href="/study" onClick={closeMobileMenu}>2{'\uc8fc \uc2a4\ud130\ub514'}</Link>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" onClick={closeMobileMenu}>{'\uce74\uce74\uc624\ud1a1 \ubb38\uc758'}</a>
        <a href="https://sikbang-eng.replit.app/" target="_blank" className="mobile-cta" onClick={closeMobileMenu}>{'\ubb34\ub8cc \uc2a4\ud53c\ud0b9 \ud14c\uc2a4\ud2b8'} &rarr;</a>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge animate">2{'\uc8fc \uc644\uc131'} OPIC {'\ud504\ub85c\uadf8\ub7a8'}</div>
          <h1 className="animate delay-1">
            OPIC {'\uc810\uc218\ub97c \uc62c\ub9ac\ub294'}<br />
            <span className="highlight">{'\uac00\uc7a5 \uad6c\uc870\uc801\uc778 \ubc29\ubc95'}</span>
          </h1>
          <p className="animate delay-2">
            {'\uc0ac\ub78c\uc758 \ucf54\uce6d\uacfc'} AI {'\ud53c\ub4dc\ubc31\uc758 \uacb0\ud569'}.<br />
            {'\uc2dd\ube75\uc601\uc5b4\uc758'} 2{'\uc8fc \uc2a4\ud130\ub514\ub85c \ubaa9\ud45c \uc810\uc218\uc5d0 \ub3c4\ub2ec\ud558\uc138\uc694'}.
          </p>
          <div className="hero-buttons animate delay-3">
            <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">
              {'\ubb34\ub8cc \uc2a4\ud53c\ud0b9 \ud14c\uc2a4\ud2b8'} &rarr;
            </a>
            <a href="#free-resource" className="btn-secondary">
              {'\ubb34\ub8cc \uc790\ub8cc \ubc1b\uae30'}
            </a>
          </div>
          <div className="hero-stats animate delay-4">
            <div className="hero-stat">
              <div className="number">4,000+</div>
              <div className="label">{'\ub204\uc801 \uc218\uac15\uc0dd'}</div>
            </div>
            <div className="hero-stat">
              <div className="number">1,000+</div>
              <div className="label">{'\uc218\uac15\uc0dd \ud6c4\uae30'}</div>
            </div>
            <div className="hero-stat">
              <div className="number">2{'\uc8fc'}</div>
              <div className="label">{'\uc9d1\uc911 \uc644\uc131 \ud504\ub85c\uadf8\ub7a8'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* FREE RESOURCE + NEWSLETTER */}
      <section className="newsletter-section" id="free-resource">
        <div className="container">
          <div className="newsletter-inner">
            <div className="newsletter-icon" style={{ fontSize: '28px' }}>{'\u2709'}</div>
            <h2>OPIC {'\ubb34\ub8cc \uc790\ub8cc'}<br /><span className="highlight">{'\uc9c0\uae08 \ubc14\ub85c \ubc1b\uc544\ubcf4\uc138\uc694'}</span></h2>
            <p>{'\uc774\uba54\uc77c\uc744 \uad6c\ub3c5\ud558\uba74'} OPIC {'\uc900\ube44\uc5d0 \uaf2d \ud544\uc694\ud55c \ubb34\ub8cc \ud559\uc2b5 \uc790\ub8cc\ub97c \ubcf4\ub0b4\ub4dc\ub9bd\ub2c8\ub2e4'}.<br />{'\ub9e4\uc8fc'} OPIC {'\uaf40\ud301\uacfc \ud45c\ud604 \uc815\ub9ac\ub3c4 \ud568\uaed8 \ubc1b\uc544\ubcf4\uc138\uc694'}.</p>

            {!subscribed ? (
              <div>
                <form className="newsletter-form" onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    placeholder={'\uc774\uba54\uc77c \uc8fc\uc18c\ub97c \uc785\ub825\ud558\uc138\uc694'}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" disabled={subscribing}>{subscribing ? '\uc800\uc7a5 \uc911...' : '\ubb34\ub8cc \uc790\ub8cc \ubc1b\uae30'}</button>
                </form>
                <div className="newsletter-note">{'\uc2a4\ud338 \uc5c6\uc774, \uc5b8\uc81c\ub4e0 \uad6c\ub3c5 \ud574\uc9c0 \uac00\ub2a5\ud569\ub2c8\ub2e4'}.</div>
              </div>
            ) : (
              <div className="newsletter-success show">
                <div style={{ marginBottom: '16px' }}>{'\u2705 \uad6c\ub3c5 \uc644\ub8cc!'}</div>
                <a
                  href="https://sikbang-eng.notion.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '14px 32px',
                    background: '#3366FF',
                    color: '#fff',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '15px',
                    textDecoration: 'none',
                    transition: 'background 0.2s'
                  }}
                >{'\ud83d\udcda \ubb34\ub8cc \uc790\ub8cc \ubc1b\uc73c\ub7ec \uac00\uae30 \u2192'}</a>
              </div>
            )}

            <div className="newsletter-benefits">
              <div className="newsletter-benefit">
                <div className="check">{'\u2713'}</div>
                OPIC {'\ud544\uc218 \ud45c\ud604 \uc815\ub9ac'}
              </div>
              <div className="newsletter-benefit">
                <div className="check">{'\u2713'}</div>
                {'\ud504\ub808\uc784\uc6cc\ud06c \ub2f5\ubcc0 \ud15c\ud50c\ub9bf'}
              </div>
              <div className="newsletter-benefit">
                <div className="check">{'\u2713'}</div>
                {'\ub9e4\uc8fc \uc2a4\ud53c\ud0b9 \uaf40\ud301 \ubc1c\uc1a1'}
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
            <h2>OPIC {'\uc900\ube44\uc758 \ubaa8\ub4e0 \uac83'},<br />{'\uc5ec\uae30\uc11c \uc2dc\uc791\ud558\uc138\uc694'}</h2>
            <p>{'\uc804\uc790\ucc45\ubd80\ud130 \uc778\uac15'}, 2{'\uc8fc \uc2a4\ud130\ub514\uae4c\uc9c0'}. {'\ub098\uc5d0\uac8c \ub9de\ub294 \ud559\uc2b5 \ubc29\ubc95\uc744 \uc120\ud0dd\ud558\uc138\uc694'}.</p>
          </div>
          <div className="products-grid">

            {/* E-Book */}
            <div className="product-card">
              <div className="product-card-image ebook-bg">
                <span className="product-badge hot">BEST</span>
                <div className="product-icon-wrap ebook-icon">{'\ud83d\udcda'}</div>
                <span className="product-card-label" style={{ color: 'var(--blue-primary)' }}>E-BOOK + {'\uae30\ucd9c \ubc88\ub4e4'}</span>
              </div>
              <div className="product-card-body">
                <div className="category">{'\uc804\uc790\ucc45'}</div>
                <h3>OPIC {'\uc804\uc790\ucc45'} + {'\uae30\ucd9c \ubc88\ub4e4'}</h3>
                <div className="desc">{'\uc2e4\uc804 \uae30\ucd9c \ubb38\uc81c\uc640 \ud504\ub808\uc784\uc6cc\ud06c \ub2f5\ubcc0 \ud15c\ud50c\ub9bf\uc744 \ud55c \ubc88\uc5d0'}. {'\uac00\uc7a5 \ub9ce\uc740 \uc218\uac15\uc0dd\uc774 \uc120\ud0dd\ud55c \ubca0\uc2a4\ud2b8\uc140\ub7ec'}.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="current">39,900</span>
                    <span className="unit">{'\uc6d0'}</span>
                  </div>
                  <a href="https://blog.naver.com/lulu05/223353024018" target="_blank" className="btn-buy">{'\uad6c\ub9e4\ud558\uae30'}</a>
                </div>
              </div>
            </div>

            {/* Video Course */}
            <div className="product-card">
              <div className="product-card-image course-bg">
                <span className="product-badge new">NEW</span>
                <div className="product-icon-wrap course-icon">{'\ud83c\udfa5'}</div>
                <span className="product-card-label" style={{ color: '#7C5CFC' }}>VIDEO COURSE</span>
              </div>
              <div className="product-card-body">
                <div className="category">{'\uc778\uac15'}</div>
                <h3>OPIC {'\uc644\uc804\uc815\ubcf5 \uc778\uac15 \ud328\ud0a4\uc9c0'}</h3>
                <div className="desc">{'\uc720\ud615\ubcc4 \ub2f5\ubcc0 \uc804\ub7b5\ubd80\ud130 \uc2e4\uc804 \ub864\ud50c\ub808\uc774\uae4c\uc9c0'}. {'\ud504\ub808\uc784\uc6cc\ud06c \uae30\ubc18 \uccb4\uacc4\uc801 \uc601\uc0c1 \uac15\uc758'}.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="original">269,000{'\uc6d0'}</span>
                    <span className="current">169,000</span>
                    <span className="unit">{'\uc6d0'}</span>
                  </div>
                  <a href="https://sikbang-eng.liveklass.com/" target="_blank" className="btn-buy">{'\uc218\uac15\ud558\uae30'}</a>
                </div>
              </div>
            </div>

            {/* 2-Week Study */}
            <div className="product-card">
              <div className="product-card-image study-bg">
                <span className="product-badge">{'\uc5bc\ub9ac\ubc84\ub4dc'}</span>
                <div className="product-icon-wrap study-icon">{'\ud83d\udcac'}</div>
                <span className="product-card-label" style={{ color: '#1A8D48' }}>2-WEEK STUDY</span>
              </div>
              <div className="product-card-body">
                <div className="category">2{'\uc8fc \uc2a4\ud130\ub514'}</div>
                <h3>2{'\uc8fc \uc9d1\uc911'} OPIC {'\uc2a4\ud130\ub514'}</h3>
                <div className="desc">3{'\uc778 \uc18c\uadf8\ub8f9 \ucf54\uce6d'} + SpeakCoach AI Pro {'\uc81c\uacf5'}. 2{'\uc8fc \uc548\uc5d0 \uc810\uc218\ub97c \uc62c\ub9ac\ub294 \uac00\uc7a5 \ud655\uc2e4\ud55c \ubc29\ubc95'}.</div>
                <div className="product-price-row">
                  <div className="product-price">
                    <span className="original">179,900{'\uc6d0'}</span>
                    <span className="current">149,000</span>
                    <span className="unit">{'\uc6d0'}</span>
                  </div>
                  <Link href="/study" className="btn-buy">{'\uc790\uc138\ud788 \ubcf4\uae30'}</Link>
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
                {'\ub098\uc758 \uc2a4\ud53c\ud0b9\uc744'}<br />
                <span className="highlight">AI{'\uac00 \ubd84\uc11d'}</span>{'\ud569\ub2c8\ub2e4'}
              </h2>
              <p>SpeakCoach AI{'\ub294 \ub179\uc74c \ud55c \ubc88\uc73c\ub85c \ub2f9\uc2e0\uc758'} OPIC {'\uc608\uc0c1 \ub4f1\uae09\uacfc \uc57d\uc810\uc744 \ubd84\uc11d\ud569\ub2c8\ub2e4'}. {'\ub2e8\uc21c \uc810\uc218\uac00 \uc544\ub2cc, \uad6c\uccb4\uc801\uc778 \uad50\uc815 \ubc29\ud5a5\uae4c\uc9c0'}.</p>
              <div className="speakcoach-features">
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '16px' }}>STT</div>
                  <div className="feature-text">
                    <h4>{'\ub2f5\ubcc0 \ub179\uc74c'} &amp; STT {'\ubcc0\ud658'}</h4>
                    <p>OpenAI Whisper {'\uae30\ubc18 \uc815\ubc00 \uc74c\uc131 \uc778\uc2dd'}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '16px' }}>AI</div>
                  <div className="feature-text">
                    <h4>7{'\uac1c \uce74\ud14c\uace0\ub9ac'} AI {'\ubd84\uc11d'}</h4>
                    <p>{'\ubb38\ubc95, \uc5b4\ud718, \uc720\ucc3d\uc131 \ub4f1 \uc0c1\uc138 \uc2a4\ud0ac\ubcc4 \ud53c\ub4dc\ubc31'}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '14px' }}>FIX</div>
                  <div className="feature-text">
                    <h4>{'\uc57d\uc810 \uad50\uc815 \ub4dc\ub9b4'}</h4>
                    <p>{'\uac00\uc7a5 \uc57d\ud55c \uc601\uc5ed\uc744 \uc9d1\uc911 \ud6c8\ub828\ud558\ub294'} 7{'\ubd84 \uad50\uc815 \uc138\uc158'}</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon" style={{ fontSize: '14px' }}>TEST</div>
                  <div className="feature-text">
                    <h4>{'\uc2e4\uc804 \ubaa8\uc758\uace0\uc0ac'}</h4>
                    <p>35{'\ubd84'} / 14{'\ubb38\ud56d \uc2e4\uc81c'} OPIC {'\ud615\uc2dd \ubaa8\uc758 \ud14c\uc2a4\ud2b8'}</p>
                  </div>
                </div>
              </div>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-primary">{'\ubb34\ub8cc\ub85c \ub0b4 \ub4f1\uae09 \ud655\uc778\ud558\uae30'} &rarr;</a>
            </div>

            {/* MOCKUP */}
            <div className="speakcoach-mockup">
              <div className="mockup-header">
                <div className="mockup-dot red"></div>
                <div className="mockup-dot yellow"></div>
                <div className="mockup-dot green"></div>
              </div>
              <div className="mockup-screen">
                <div style={{ fontSize: '13px', color: '#8B95A1', marginBottom: '4px' }}>SpeakCoach AI {'\ubd84\uc11d \uacb0\uacfc'}</div>
                <div className="mockup-grade-row">
                  <div>
                    <div className="mockup-grade">IH</div>
                    <div className="mockup-grade-label">{'\uc608\uc0c1 \ub4f1\uae09'}</div>
                  </div>
                  <div className="mockup-al-prob">
                    <div className="prob-num">47%</div>
                    <div className="prob-label">AL {'\ud655\ub960'}</div>
                  </div>
                </div>
                <div className="mockup-bars">
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">{'\uc720\ucc3d\uc131'}</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '78%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">{'\ubb38\ubc95'}</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill mid" style={{ width: '62%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">{'\uc5b4\ud718'}</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '85%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">{'\ubc1c\uc74c'}</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{ width: '73%' }}></div></div>
                  </div>
                  <div className="mockup-bar-item">
                    <div className="mockup-bar-label">{'\uad6c\uc131\ub825'}</div>
                    <div className="mockup-bar-track"><div className="mockup-bar-fill weak" style={{ width: '45%' }}></div></div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '12px', background: '#FFF5F5', borderRadius: '10px', fontSize: '12px', color: '#F04452' }}>
                  <strong>{'\uad6c\uc131\ub825'}</strong>{'\uc774 \uac00\uc7a5 \uc57d\ud55c \uc601\uc5ed\uc785\ub2c8\ub2e4'}. {'\uad50\uc815 \ub4dc\ub9b4\uc744 \uc2dc\uc791\ud574\ubcf4\uc138\uc694'}.
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
            <h2>SpeakCoach AI {'\uc694\uae08\uc81c'}</h2>
            <p>{'\ucee4\ud53c \ud55c \uc794 \uac12\uc73c\ub85c'} AI {'\uc2a4\ud53c\ud0b9 \ucf54\uce58\ub97c \ub9cc\ub098\ubcf4\uc138\uc694'}.</p>
          </div>
          <div className="pricing-grid">

            {/* FREE */}
            <div className="pricing-card">
              <div className="plan-name">{'\ubb34\ub8cc \uc774\uc6a9\uc790'}</div>
              <div className="plan-price">0<span className="won">{'\uc6d0'}</span></div>
              <div className="plan-sub">{'\uac00\uc785 \ud6c4'} 7{'\uc77c\uac04 \ubb34\ub8cc'}</div>
              <ul className="plan-features">
                <li>7{'\uc77c\uac04 \ubb34\ub8cc \uccb4\ud5d8'}</li>
                <li>1{'\uc77c'} 1{'\ud68c \uc5f0\uc2b5'}</li>
                <li>AI {'\ud53c\ub4dc\ubc31'} &amp; {'\uc810\uc218'}</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan outline" style={{ display: 'block' }}>{'\ubb34\ub8cc\ub85c \uc2dc\uc791\ud558\uae30'}</a>
            </div>

            {/* PRO */}
            <div className="pricing-card featured">
              <div className="recommend-badge">{'\ucd94\ucc9c'}</div>
              <div className="plan-name">{'\ud504\ub85c \ud328\ud0a4\uc9c0'}</div>
              <div className="plan-original">31,900{'\uc6d0'}</div>
              <div className="plan-price">24,900<span className="won">{'\uc6d0'}</span></div>
              <div className="plan-sub">{'\uc6d4 \ub2e8 \ucee4\ud53c'} 4~5{'\uc794 \uac12'} {'\u00b7'} 3{'\uac1c\uc6d4 \uad6c\ub3c5 \uc2dc'} 63,500{'\uc6d0'}</div>
              <ul className="plan-features">
                <li>{'\ubb34\uc81c\ud55c \uc5f0\uc2b5'}</li>
                <li>500{'\uac1c \uc774\uc0c1'} OPIC {'\ubb38\uc81c'}</li>
                <li>{'\uc720\ud615\ubcc4 \ub9de\ucda4 \ud544\ud130\ub9c1'}</li>
                <li>{'\uc0c1\uc138'} AI {'\ud53c\ub4dc\ubc31'}</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan primary" style={{ display: 'block' }}>{'\ubb34\ub8cc\ub85c \uc2dc\uc791\ud558\uae30'}</a>
            </div>

            {/* PREMIUM */}
            <div className="pricing-card">
              <div className="plan-name">{'\ud504\ub9ac\ubbf8\uc5c4 \ud328\ud0a4\uc9c0'}</div>
              <div className="plan-original">41,900{'\uc6d0'}</div>
              <div className="plan-price">34,900<span className="won">{'\uc6d0'}</span></div>
              <div className="plan-sub">{'\ud558\ub8e8 \uc57d'} 1,163{'\uc6d0\uc73c\ub85c'} AL {'\ub2ec\uc131'} {'\u00b7'} 3{'\uac1c\uc6d4'} 89,000{'\uc6d0'}</div>
              <ul className="plan-features">
                <li>{'\ud504\ub85c \ubaa8\ub4e0 \uae30\ub2a5 \ud3ec\ud568'}</li>
                <li>{'\uc2e4\uc804 \ubaa8\uc758\uace0\uc0ac'} 10{'\uc138\ud2b8'}</li>
                <li>Native Shadowing</li>
                <li>{'\uace0\uae09 \ud2b8\ub798\ud0b9'} &amp; {'\uc778\uc0ac\uc774\ud2b8'}</li>
              </ul>
              <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-plan outline" style={{ display: 'block' }}>{'\ud504\ub9ac\ubbf8\uc5c4\uc73c\ub85c \uc2dc\uc791\ud558\uae30'}</a>
            </div>

          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="section-header">
            <div className="overline">Reviews</div>
            <h2>{'\uc2e4\uc81c \uc218\uac15\uc0dd\ub4e4\uc758 \uc774\uc57c\uae30'}</h2>
            <p>1,000{'\uac1c \uc774\uc0c1\uc758 \uc2e4\uc81c \ud6c4\uae30\uac00 \uc99d\uba85\ud569\ub2c8\ub2e4'}.</p>
          </div>
          <div className="reviews-wrapper"
            onMouseEnter={() => setReviewsPaused(true)}
            onMouseLeave={() => setReviewsPaused(false)}
            onTouchStart={() => setReviewsPaused(true)}
            onTouchEnd={() => { setReviewsPaused(true); setTimeout(() => setReviewsPaused(false), 2000); }}
          >
            <div
              className="reviews-scroll"
              ref={reviewScrollRef}
              style={{ transform: `translateX(-${reviewOffset}px)`, willChange: 'transform' }}
            >
              {[...reviews, ...reviews].map((review, idx) => (
                <div className="review-card" key={idx}>
                  <div className="review-top">
                    <div className="review-avatar">{review.initial}</div>
                    <div className="review-meta">
                      <div className="name">{review.name}</div>
                      <div className="info">{review.info}</div>
                    </div>
                  </div>
                  <div className="review-stars">
                    {'★'.repeat(review.stars)}{review.stars < 5 && <span className="empty">{'★'.repeat(5 - review.stars)}</span>}
                  </div>
                  <div className="review-text">{review.text}</div>
                  <div className="review-result">
                    <span className="grade-badge">{review.badge}</span>
                    <span className="grade-text">{review.result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reviews-count-badge">
            <span>{'\ub204\uc801 \uc218\uac15\uc0dd'} 4,000+ {'\u00b7'} {'\uc2e4\uc81c \ud6c4\uae30'} 1,000+ (liveclass {'\uc778\uc99d'})</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-gray" id="faq">
        <div className="container">
          <div className="section-header">
            <div className="overline">FAQ</div>
            <h2>{'\uc790\uc8fc \ubb3b\ub294 \uc9c8\ubb38'}</h2>
            <p>{'\uad81\uae08\ud55c \uc810\uc774 \uc788\ub2e4\uba74 \uba3c\uc800 \ud655\uc778\ud574\ubcf4\uc138\uc694'}.</p>
          </div>
          <div className="faq-list">
            {faqItems.map((item, index) => (
              <div className="faq-item" key={index}>
                <button
                  className={`faq-question ${openFaqIndex === index ? 'open' : ''}`}
                  onClick={() => toggleFaq(index)}
                >
                  {item.question}
                  <span className="arrow">{'\u25bc'}</span>
                </button>
                <div
                  className="faq-answer"
                  ref={(el) => { faqAnswerRefs.current[index] = el; }}
                >
                  <div className="faq-answer-inner">
                    {item.answer}
                    {item.hasLink && (
                      <>{' '}<Link href="/study" style={{ color: 'var(--blue-primary)', fontWeight: 600 }}>{'\uc2a4\ud130\ub514 \uc0c1\uc138 \ud398\uc774\uc9c0'}</Link>{'\uc5d0\uc11c \ud655\uc778\ud558\uc138\uc694'}.</>
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
          <h2>{'\uc9c0\uae08 \ubc14\ub85c \uc2dc\uc791\ud558\uc138\uc694'}</h2>
          <p>{'\ubb34\ub8cc \uc2a4\ud53c\ud0b9 \ud14c\uc2a4\ud2b8\ub85c \ub098\uc758'} OPIC {'\uc608\uc0c1 \ub4f1\uae09\uc744 \ud655\uc778\ud574\ubcf4\uc138\uc694'}.</p>
          <a href="https://sikbang-eng.replit.app/" target="_blank" className="btn-white">{'\ubb34\ub8cc \uc2a4\ud53c\ud0b9 \ud14c\uc2a4\ud2b8 \uc2dc\uc791'} &rarr;</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">{'\ud83c\udf5e'} {'\uc2dd\ube75\uc601\uc5b4'}</div>
              <p>2{'\uc8fc \uc548\uc5d0'} OPIC {'\uc810\uc218\ub97c \uc62c\ub9ac\ub294'}<br />{'\uac00\uc7a5 \uad6c\uc870\uc801\uc778 \ubc29\ubc95'}.</p>
            </div>
            <div className="footer-col">
              <h4>{'\uc81c\ud488'}</h4>
              <a href="https://blog.naver.com/lulu05/223353024018" target="_blank">{'\uc804\uc790\ucc45'}</a>
              <a href="https://sikbang-eng.liveklass.com/" target="_blank">{'\uc778\uac15'}</a>
              <Link href="/study">2{'\uc8fc \uc2a4\ud130\ub514'}</Link>
              <a href="https://sikbang-eng.replit.app/" target="_blank">SpeakCoach AI</a>
            </div>
            <div className="footer-col">
              <h4>{'\uace0\uac1d\uc9c0\uc6d0'}</h4>
              <a href="#faq">{'\uc790\uc8fc \ubb3b\ub294 \uc9c8\ubb38'}</a>
              <a href="http://pf.kakao.com/_SJYQn" target="_blank">{'\uce74\uce74\uc624\ud1a1 \ubb38\uc758'}</a>
              <a href="mailto:lulu066666@gmail.com">{'\uc774\uba54\uc77c \ubb38\uc758'}</a>
            </div>
            <div className="footer-col">
              <h4>{'\uc18c\uc15c'}</h4>
              <a href="https://instagram.com/sikbang.eng" target="_blank">Instagram @sikbang.eng</a>
              <a href="https://blog.naver.com/lulu05" target="_blank">{'\ub124\uc774\ubc84 \ube14\ub85c\uadf8'}</a>
              <a href="#free-resource">{'\ub274\uc2a4\ub808\ud130 \uad6c\ub3c5'}</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2025 {'\uc2dd\ube75\uc601\uc5b4'}. All rights reserved.</span>
            <div className="social">
              <a href="#">{'\uc774\uc6a9\uc57d\uad00'}</a>
              <a href="#">{'\uac1c\uc778\uc815\ubcf4\ucc98\ub9ac\ubc29\uce68'}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* KAKAOTALK FLOATING BUTTON */}
      <div className="kakao-float">
        <div className="kakao-tooltip">{'\uad81\uae08\ud55c \uc810\uc774 \uc788\uc73c\uc2e0\uac00\uc694'}?</div>
        <a href="http://pf.kakao.com/_SJYQn" target="_blank" className="kakao-btn" aria-label={'\uce74\uce74\uc624\ud1a1 \uc0c1\ub2f4'}>
          <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
            <path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-1.5 5.6-9.8 36.3-10.2 38.6 0 0-.2 1.7.9 2.3 1.1.7 2.4.1 2.4.1 3.2-.4 36.8-24.2 42.6-28.3 6.4.9 13 1.3 19.5 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#191919"/>
            <g fill="#FEE500">
              <path d="M70.5 146.6c-2.3 0-4.2-1.3-4.2-3V113h-9.8c-2.4 0-3.5-1.8-3.5-3.5s1.1-3.5 3.5-3.5h27.5c2.4 0 3.5 1.8 3.5 3.5s-1.1 3.5-3.5 3.5H74.7v30.6c0 1.7-1.9 3-4.2 3z"/>
              <path d="M101.3 146.2c-2.2 0-4-1.5-4-3.3V109.8c0-1.8 1.8-3.3 4-3.3s4 1.5 4 3.3v29.8h14.7c2.2 0 3.3 1.5 3.3 3.3s-1.1 3.3-3.3 3.3h-18.7z"/>
              <path d="M147.5 146.6c-1 0-2-.4-2.7-1.1l-8.2-9.6-8.2 9.6c-1.4 1.7-4 1.9-5.7.5-1.7-1.4-1.9-4-.5-5.7l9.5-11.2-9-10.6c-1.4-1.7-1.2-4.3.5-5.7 1.7-1.4 4.3-1.2 5.7.5l7.7 9.1 7.7-9.1c1.4-1.7 4-1.9 5.7-.5 1.7 1.4 1.9 4 .5 5.7l-9 10.6 9.5 11.2c1.4 1.7 1.2 4.3-.5 5.7-.8.7-1.8 1-2.8 1z"/>
              <path d="M172.7 146.6c-1.6 0-3.1-.8-3.7-2.3l-14.2-33c-.9-2.1.1-4.5 2.2-5.4 2.1-.9 4.5.1 5.4 2.2l8.3 19.3 8.3-19.3c.9-2.1 3.3-3.1 5.4-2.2 2.1.9 3.1 3.3 2.2 5.4l-14.2 33c-.6 1.5-2.1 2.3-3.7 2.3z"/>
            </g>
          </svg>
        </a>
      </div>
    </>
  );
}
