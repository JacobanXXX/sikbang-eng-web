'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  '전략': '#3182F6',
  '가이드': '#1A8D48',
  '표현': '#6B4EFF',
  '문법': '#FF6B35',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState('전체');
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

  useEffect(() => {
    fetch('/data/posts.json')
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => {});
  }, []);

  const categories = ['전체', ...Array.from(new Set(posts.map(p => p.category)))];
  const filteredPosts = filter === '전체' ? posts : posts.filter(p => p.category === filter);

  return (
    <>
      <style jsx>{`
        .blog-nav {
          position: sticky; top: 0; background: rgba(255,255,255,0.95);
          backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
          z-index: 100; height: 64px; display: flex; align-items: center;
        }
        [data-theme="dark"] .blog-nav { background: rgba(26,29,35,0.95); }
        .blog-nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; max-width: 900px; margin: 0 auto; padding: 0 24px;
        }
        .blog-nav .logo { font-size: 18px; font-weight: 800; color: var(--text-primary); }
        .blog-nav .back { font-size: 14px; color: var(--blue-primary); font-weight: 600; }
        .blog-container { max-width: 900px; margin: 0 auto; padding: 48px 24px 80px; }
        .blog-header { margin-bottom: 40px; }
        .blog-header h1 { font-size: 36px; font-weight: 800; color: var(--text-primary); margin-bottom: 8px; }
        .blog-header p { font-size: 16px; color: var(--text-secondary); line-height: 1.7; }
        .blog-filters { display: flex; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; }
        .blog-filter {
          padding: 8px 16px; border-radius: 20px; border: 1px solid var(--border);
          background: var(--bg-white); color: var(--text-secondary);
          font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .blog-filter.active {
          background: var(--blue-primary); color: white; border-color: var(--blue-primary);
        }
        .blog-filter:hover:not(.active) { border-color: var(--blue-primary); color: var(--blue-primary); }
        .blog-grid { display: grid; gap: 20px; }
        .blog-card {
          background: var(--bg-white); border: 1px solid var(--border);
          border-radius: 16px; padding: 28px; transition: all 0.2s; cursor: pointer;
        }
        .blog-card:hover { border-color: var(--blue-primary); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        [data-theme="dark"] .blog-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .blog-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .blog-category {
          font-size: 12px; font-weight: 700; padding: 3px 10px;
          border-radius: 6px; color: white;
        }
        .blog-date { font-size: 13px; color: var(--text-tertiary); }
        .blog-read-time { font-size: 13px; color: var(--text-tertiary); }
        .blog-card h2 { font-size: 20px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; line-height: 1.4; }
        .blog-card p { font-size: 15px; color: var(--text-secondary); line-height: 1.7; }
        .blog-cta {
          margin-top: 48px; background: linear-gradient(135deg, #3182F6, #1B64DA);
          border-radius: 20px; padding: 40px; text-align: center; color: white;
        }
        .blog-cta h3 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
        .blog-cta p { font-size: 15px; opacity: 0.9; margin-bottom: 20px; }
        .blog-cta-btn {
          display: inline-block; background: white; color: #3182F6;
          padding: 12px 28px; border-radius: 12px; font-size: 15px; font-weight: 700;
          transition: all 0.2s;
        }
        .blog-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
        @media (max-width: 768px) {
          .blog-header h1 { font-size: 28px; }
        }
      `}</style>

      <nav className="blog-nav">
        <div className="blog-nav-inner">
          <Link href="/" className="logo">🍞 식빵영어</Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="theme-toggle" onClick={toggleDarkMode} aria-label="다크모드 전환">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link href="/" className="back">← 메인</Link>
          </div>
        </div>
      </nav>

      <div className="blog-container">
        <div className="blog-header">
          <h1>OPIC 학습 블로그</h1>
          <p>오픽 준비에 필요한 전략, 가이드, 표현 정리를 한곳에서 확인하세요.</p>
        </div>

        <div className="blog-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`blog-filter ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="blog-grid">
          {filteredPosts.map(post => (
            <div key={post.id} className="blog-card">
              <div className="blog-card-top">
                <span className="blog-category" style={{ background: CATEGORY_COLORS[post.category] || '#3182F6' }}>
                  {post.category}
                </span>
                <span className="blog-date">{post.date}</span>
                <span className="blog-read-time">{post.readTime}분 읽기</span>
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </div>
          ))}
        </div>

        <div className="blog-cta">
          <h3>직접 해보는 게 가장 빠릅니다</h3>
          <p>2주 소그룹 스터디에서 실전 스피킹을 연습해보세요.</p>
          <Link href="/study" className="blog-cta-btn">스터디 알아보기 →</Link>
        </div>
      </div>
    </>
  );
}
