'use client';

import { useState } from 'react';
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

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'lectures' | 'resources'>('lectures');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const login = async () => {
    if (!password) { setMessage('비밀번호를 입력해주세요.'); return; }
    setMessage('로그인 중...');
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'read', type: 'lectures' }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: '로그인 실패' }));
        setMessage(err.error || '비밀번호가 틀렸습니다.');
        return;
      }
      const lectureData = await res.json();
      setLectures(lectureData);

      const res2 = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'read', type: 'resources' }),
      });
      if (!res2.ok) {
        const err = await res2.json().catch(() => ({ error: '자료 불러오기 실패' }));
        setMessage(err.error || '자료 불러오기 실패');
        return;
      }
      const resourceData = await res2.json();
      setResources(resourceData);

      setIsLoggedIn(true);
      setMessage('');
    } catch (e) {
      setMessage(e instanceof Error ? `로그인 실패: ${e.message}` : '로그인 실패');
    }
  };

  const save = async (type: 'lectures' | 'resources') => {
    setSaving(true);
    try {
      const data = type === 'lectures' ? lectures : resources;
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, action: 'write', type, data }),
      });
      if (res.ok) {
        setMessage(`${type === 'lectures' ? '강의' : '자료'} 저장 완료! (1~2분 후 사이트 반영)`);
        setTimeout(() => setMessage(''), 5000);
      } else {
        const err = await res.json().catch(() => ({ error: '저장 실패' }));
        setMessage(err.error || '저장 실패');
      }
    } catch (e) {
      setMessage(e instanceof Error ? `저장 실패: ${e.message}` : '저장 실패');
    }
    setSaving(false);
  };

  const addLecture = () => {
    const newId = lectures.length > 0 ? Math.max(...lectures.map(l => l.id)) + 1 : 1;
    setLectures([...lectures, {
      id: newId,
      title: '',
      description: '',
      tag: '입문',
      youtubeId: '',
      youtubeUrl: '',
    }]);
  };

  const removeLecture = (id: number) => {
    setLectures(lectures.filter(l => l.id !== id));
  };

  const updateLecture = (id: number, field: keyof Lecture, value: string | number) => {
    setLectures(lectures.map(l => {
      if (l.id !== id) return l;
      const updated = { ...l, [field]: value };
      // Auto-extract YouTube ID from URL
      if (field === 'youtubeUrl' && typeof value === 'string') {
        const match = value.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
        if (match) updated.youtubeId = match[1];
      }
      return updated;
    }));
  };

  const addResource = () => {
    const newId = resources.length > 0 ? Math.max(...resources.map(r => r.id)) + 1 : 1;
    setResources([...resources, {
      id: newId,
      category: '전략',
      title: '',
      preview: '',
      url: '',
    }]);
  };

  const removeResource = (id: number) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const updateResource = (id: number, field: keyof Resource, value: string | number) => {
    setResources(resources.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F2F4F6', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>🍞 식빵영어 관리자</h1>
          <p style={{ fontSize: '14px', color: '#8B95A1', textAlign: 'center', marginBottom: '24px' }}>비밀번호를 입력하세요</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="비밀번호"
            style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #E5E8EB', fontSize: '15px', marginBottom: '12px', outline: 'none', boxSizing: 'border-box' }}
          />
          <button onClick={login} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#3182F6', color: 'white', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            로그인
          </button>
          {message && <p style={{ color: '#E74C3C', fontSize: '13px', textAlign: 'center', marginTop: '12px' }}>{message}</p>}
          <Link href="/" style={{ display: 'block', textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#8B95A1' }}>← 메인으로</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F2F4F6', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #E5E8EB', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ fontSize: '18px', fontWeight: 800, color: '#191F28' }}>🍞 식빵영어</Link>
          <span style={{ fontSize: '13px', color: '#8B95A1', background: '#F2F4F6', padding: '4px 10px', borderRadius: '6px' }}>관리자</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {message && <span style={{ fontSize: '13px', color: '#1A8D48', fontWeight: 600 }}>{message}</span>}
          <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#F2F4F6', border: 'none', fontSize: '13px', cursor: 'pointer', color: '#4E5968' }}>로그아웃</button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('lectures')}
            style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: activeTab === 'lectures' ? '#3182F6' : 'white', color: activeTab === 'lectures' ? 'white' : '#4E5968' }}
          >
            강의 관리 ({lectures.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: activeTab === 'resources' ? '#3182F6' : 'white', color: activeTab === 'resources' ? 'white' : '#4E5968' }}
          >
            자료 관리 ({resources.length})
          </button>
        </div>

        {/* Lectures Tab */}
        {activeTab === 'lectures' && (
          <div>
            {lectures.map((lecture, idx) => (
              <div key={lecture.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '12px', border: '1px solid #E5E8EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#8B95A1' }}>#{idx + 1}</span>
                  <button onClick={() => removeLecture(lecture.id)} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <input value={lecture.title} onChange={(e) => updateLecture(lecture.id, 'title', e.target.value)} placeholder="제목 (예: Ep14. 조동사 — 영문법 완벽정리)" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }} />
                  <input value={lecture.description} onChange={(e) => updateLecture(lecture.id, 'description', e.target.value)} placeholder="설명 (한 줄 소개)" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={lecture.youtubeUrl} onChange={(e) => updateLecture(lecture.id, 'youtubeUrl', e.target.value)} placeholder="YouTube URL (붙여넣기)" style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }} />
                    <select value={lecture.tag} onChange={(e) => updateLecture(lecture.id, 'tag', e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }}>
                      <option value="입문">입문</option>
                      <option value="중급">중급</option>
                      <option value="실전">실전</option>
                    </select>
                  </div>
                  {lecture.youtubeId && (
                    <div style={{ fontSize: '12px', color: '#8B95A1' }}>YouTube ID: {lecture.youtubeId}</div>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={addLecture} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px dashed #E5E8EB', background: 'white', fontSize: '15px', fontWeight: 600, color: '#3182F6', cursor: 'pointer' }}>
                + 강의 추가
              </button>
              <button onClick={() => save('lectures')} disabled={saving} style={{ padding: '14px 28px', borderRadius: '12px', background: '#3182F6', color: 'white', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                {saving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div>
            {resources.map((resource, idx) => (
              <div key={resource.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '12px', border: '1px solid #E5E8EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#8B95A1' }}>#{idx + 1}</span>
                  <button onClick={() => removeResource(resource.id)} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>삭제</button>
                </div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <input value={resource.title} onChange={(e) => updateResource(resource.id, 'title', e.target.value)} placeholder="제목" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }} />
                  <input value={resource.preview} onChange={(e) => updateResource(resource.id, 'preview', e.target.value)} placeholder="미리보기 텍스트" style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={resource.url} onChange={(e) => updateResource(resource.id, 'url', e.target.value)} placeholder="URL (링크 붙여넣기)" style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }} />
                    <select value={resource.category} onChange={(e) => updateResource(resource.id, 'category', e.target.value)} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E8EB', fontSize: '14px', outline: 'none' }}>
                      <option value="전략">전략</option>
                      <option value="표현">표현</option>
                      <option value="발음">발음</option>
                      <option value="문법">문법</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={addResource} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px dashed #E5E8EB', background: 'white', fontSize: '15px', fontWeight: 600, color: '#3182F6', cursor: 'pointer' }}>
                + 자료 추가
              </button>
              <button onClick={() => save('resources')} disabled={saving} style={{ padding: '14px 28px', borderRadius: '12px', background: '#3182F6', color: 'white', border: 'none', fontSize: '15px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                {saving ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
