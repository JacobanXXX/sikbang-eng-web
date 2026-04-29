'use client';

import { useState } from 'react';

export default function GuaranteeClaimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cohort: '',
    preGrade: '',
    postGrade: '',
    testNumber: '',
    testDate: '',
  });

  // 수강 기수 동적 생성: 최근 3개월 + 현재/다음 달
  const getCohortOptions = () => {
    const now = new Date();
    const options: string[] = [];
    for (let i = -3; i <= 1; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      options.push(`${y}년 ${m}월 기수`);
    }
    return options;
  };
  const [preScoreFile, setPreScoreFile] = useState<File | null>(null);
  const [postScoreFile, setPostScoreFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [checks, setChecks] = useState({
    homework: false,
    attendance: false,
    coaching: false,
    examTiming: false,
    submitTiming: false,
    truthful: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const allChecked = Object.values(checks).every(Boolean);

  const handleSubmit = async () => {
    // Validation
    const { name, email, phone, cohort, preGrade, postGrade, testNumber, testDate } = formData;
    if (!name || !email || !phone || !cohort || !preGrade || !postGrade || !testNumber || !testDate) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
      setError('전화번호를 000-0000-0000 형식으로 입력해주세요.');
      return;
    }
    if (!preScoreFile || !postScoreFile || !idFile) {
      setError('사전 성적표, 사후 성적표, 신분증을 모두 첨부해주세요.');
      return;
    }
    if (!allChecked) {
      setError('모든 보증 조건을 확인해주세요.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('name', name);
      submitData.append('email', email);
      submitData.append('phone', phone);
      submitData.append('cohort', cohort);
      submitData.append('preGrade', preGrade);
      submitData.append('postGrade', postGrade);
      submitData.append('testNumber', testNumber);
      submitData.append('testDate', testDate);
      submitData.append('preScoreFile', preScoreFile);
      submitData.append('postScoreFile', postScoreFile);
      submitData.append('idFile', idFile);

      const checkedLabels = [];
      if (checks.homework) checkedLabels.push('과제 100%');
      if (checks.attendance) checkedLabels.push('스터디 100%');
      if (checks.coaching) checkedLabels.push('코칭 100%');
      if (checks.examTiming) checkedLabels.push('2주 내 응시');
      if (checks.submitTiming) checkedLabels.push('30일 내 제출');
      if (checks.truthful) checkedLabels.push('사실 확인');
      submitData.append('checkedConditions', checkedLabels.join(', '));

      const res = await fetch('/api/guarantee-claim', {
        method: 'POST',
        body: submitData,
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || '청구 처리 중 오류가 발생했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        :root {
          --green: #1A8D48;
          --bg-gray: #F2F4F6;
          --border: #E5E8EB;
          --text-primary: #191F28;
          --text-secondary: #4E5968;
          --text-tertiary: #8B95A1;
          --error: #DC3545;
          --warning: #FF9800;
        }
        .gc-page {
          font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          background: #FFFFFF;
          color: var(--text-primary);
          line-height: 1.6;
          padding: 40px 20px;
          -webkit-font-smoothing: antialiased;
          word-break: keep-all;
        }
        .gc-container { max-width: 700px; margin: 0 auto; }

        .gc-header { text-align: center; margin-bottom: 40px; }
        .gc-logo { font-size: 20px; font-weight: 700; color: var(--green); margin-bottom: 24px; }
        .gc-header h1 { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
        .gc-header p { font-size: 14px; color: var(--text-secondary); }

        .gc-card {
          background: #FFFFFF; border: 1px solid var(--border); border-radius: 16px;
          padding: 32px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .gc-section { margin-bottom: 32px; }
        .gc-section:last-of-type { margin-bottom: 0; }
        .gc-section-title {
          font-size: 14px; font-weight: 600; margin-bottom: 16px;
          padding-bottom: 12px; border-bottom: 1px solid var(--border);
        }

        .gc-field { margin-bottom: 16px; }
        .gc-field label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; }
        .gc-field .req { color: var(--error); }
        .gc-field input[type="text"],
        .gc-field input[type="email"],
        .gc-field input[type="tel"],
        .gc-field input[type="date"],
        .gc-field select {
          width: 100%; padding: 12px 14px; font-size: 14px;
          border: 1px solid var(--border); border-radius: 8px;
          font-family: inherit; color: var(--text-primary); background: var(--bg-white);
          transition: border-color 0.2s;
        }
        .gc-field input:focus, .gc-field select:focus {
          outline: none; border-color: var(--green);
          box-shadow: 0 0 0 3px rgba(26,141,72,0.1);
        }
        .gc-field select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23222' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px;
        }

        .gc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        .gc-row .gc-field { margin-bottom: 0; }

        .gc-file-input {
          width: 100%; padding: 12px; font-size: 13px;
          border: 1.5px dashed var(--border); border-radius: 8px;
          background: var(--bg-gray); cursor: pointer; font-family: inherit;
        }
        .gc-file-name { font-size: 12px; color: var(--green); margin-top: 4px; font-weight: 500; }

        .gc-checklist { margin-bottom: 24px; }
        .gc-checklist-title {
          font-size: 14px; font-weight: 600; margin-bottom: 16px;
          padding-bottom: 12px; border-bottom: 1px solid var(--border);
        }
        .gc-checklist-note { font-size: 12px; color: var(--text-secondary); margin-bottom: 12px; }

        .gc-check-item {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px; margin-bottom: 8px; background: var(--bg-gray);
          border-radius: 8px; transition: all 0.2s; cursor: pointer;
        }
        .gc-check-item:hover { background: #eef1f4; }
        .gc-check-item input[type="checkbox"] {
          width: 18px; height: 18px; accent-color: var(--green);
          cursor: pointer; margin-top: 2px; flex-shrink: 0;
        }
        .gc-check-item label {
          margin-bottom: 0; font-size: 13px; font-weight: 400; cursor: pointer; padding-top: 1px;
        }
        .gc-check-item.checked label { color: var(--green); font-weight: 500; }

        .gc-warning {
          background: rgba(255,152,0,0.05); border-left: 4px solid var(--warning);
          border-radius: 8px; padding: 14px; margin-bottom: 24px;
          font-size: 12px; color: var(--text-secondary); line-height: 1.6;
        }

        .gc-error {
          background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px;
          padding: 12px 16px; color: var(--error); font-size: 13px;
          margin-bottom: 16px;
        }

        .gc-btn-row { display: flex; gap: 12px; margin-bottom: 24px; }
        .gc-btn {
          flex: 1; padding: 14px 20px; font-size: 14px; font-weight: 600;
          border: none; border-radius: 8px; cursor: pointer; font-family: inherit;
          transition: all 0.2s;
        }
        .gc-btn-primary {
          background: var(--green); color: #fff;
        }
        .gc-btn-primary:hover { box-shadow: 0 4px 12px rgba(26,141,72,0.3); }
        .gc-btn-primary:disabled { background: #ccc; cursor: not-allowed; }
        .gc-btn-secondary {
          background: var(--bg-gray); color: var(--text-primary); border: 1px solid var(--border);
        }

        .gc-footer {
          text-align: center; padding-top: 24px; border-top: 1px solid var(--border);
          font-size: 12px; color: var(--text-secondary); line-height: 1.6;
        }

        .gc-success {
          text-align: center; padding: 48px 24px;
        }
        .gc-success-icon { font-size: 48px; margin-bottom: 16px; }
        .gc-success h2 { font-size: 22px; font-weight: 700; margin-bottom: 12px; }
        .gc-success p { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }
        .gc-success-detail {
          background: var(--bg-gray); border-radius: 12px; padding: 20px;
          margin-top: 24px; text-align: left;
        }
        .gc-success-row {
          display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;
        }
        .gc-success-row span { color: var(--text-secondary); }

        @media (max-width: 768px) {
          .gc-page { padding: 24px 16px; }
          .gc-card { padding: 20px; }
          .gc-header h1 { font-size: 24px; }
          .gc-row { grid-template-columns: 1fr; gap: 12px; }
          .gc-btn-row { flex-direction: column; }
        }
      `}</style>

      <div className="gc-page">
        <div className="gc-container">
          <div className="gc-header">
            <div className="gc-logo">식빵영어</div>
            <h1>성적 보증 청구</h1>
            <p>조건을 충족했는데 등급이 오르지 않았다면, 아래 서류를 제출해 주세요.</p>
          </div>

          {submitted ? (
            <div className="gc-card">
              <div className="gc-success">
                <div className="gc-success-icon">✓</div>
                <h2>청구가 접수되었습니다</h2>
                <p>심사는 접수일로부터 14영업일 이내에 완료됩니다.<br/>결과는 이메일과 카카오톡으로 안내됩니다.</p>
                <div className="gc-success-detail">
                  <div className="gc-success-row"><span>이름</span><strong>{formData.name}</strong></div>
                  <div className="gc-success-row"><span>사전 등급</span><strong>{formData.preGrade}</strong></div>
                  <div className="gc-success-row"><span>사후 등급</span><strong>{formData.postGrade}</strong></div>
                  <div className="gc-success-row"><span>시험일</span><strong>{formData.testDate}</strong></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="gc-card">
              {/* 개인정보 */}
              <div className="gc-section">
                <div className="gc-section-title">개인정보</div>
                <div className="gc-field">
                  <label><span className="req">*</span> 성함</label>
                  <input type="text" placeholder="예: 김식빵" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="gc-field">
                  <label><span className="req">*</span> 이메일</label>
                  <input type="email" placeholder="example@gmail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="gc-field">
                  <label><span className="req">*</span> 전화번호</label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="01012345678"
                    value={formData.phone}
                    onChange={(e) => {
                      const nums = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                      let formatted = nums;
                      if (nums.length > 3 && nums.length <= 7) {
                        formatted = nums.slice(0, 3) + '-' + nums.slice(3);
                      } else if (nums.length > 7) {
                        formatted = nums.slice(0, 3) + '-' + nums.slice(3, 7) + '-' + nums.slice(7);
                      }
                      setFormData({...formData, phone: formatted});
                    }}
                  />
                </div>
              </div>

              {/* 수강정보 */}
              <div className="gc-section">
                <div className="gc-section-title">수강정보</div>
                <div className="gc-field">
                  <label><span className="req">*</span> 수강 기수</label>
                  <select value={formData.cohort} onChange={(e) => setFormData({...formData, cohort: e.target.value})}>
                    <option value="">기수를 선택해주세요</option>
                    {getCohortOptions().map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 성적정보 */}
              <div className="gc-section">
                <div className="gc-section-title">성적정보</div>
                <div className="gc-row">
                  <div className="gc-field">
                    <label><span className="req">*</span> 사전 OPIc 등급</label>
                    <select value={formData.preGrade} onChange={(e) => setFormData({...formData, preGrade: e.target.value})}>
                      <option value="">등급 선택</option>
                      <option value="NH">NH</option>
                      <option value="IL">IL</option>
                      <option value="IM1">IM1</option>
                      <option value="IM2">IM2</option>
                      <option value="IM3">IM3</option>
                      <option value="IH">IH</option>
                      <option value="AL">AL</option>
                      <option value="AH">AH</option>
                    </select>
                  </div>
                  <div className="gc-field">
                    <label><span className="req">*</span> 사후 OPIc 등급</label>
                    <select value={formData.postGrade} onChange={(e) => setFormData({...formData, postGrade: e.target.value})}>
                      <option value="">등급 선택</option>
                      <option value="NH">NH</option>
                      <option value="IL">IL</option>
                      <option value="IM1">IM1</option>
                      <option value="IM2">IM2</option>
                      <option value="IM3">IM3</option>
                      <option value="IH">IH</option>
                      <option value="AL">AL</option>
                      <option value="AH">AH</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 성적표 첨부 */}
              <div className="gc-section">
                <div className="gc-section-title">성적표</div>
                <div style={{
                  background: 'var(--bg-gray)', borderRadius: '8px', padding: '14px',
                  marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7,
                }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', fontSize: '13px' }}>성적표 제출 가이드</p>
                  <p style={{ margin: 0 }}>
                    OPIc 공식 사이트(opic.or.kr) &gt; 성적 조회 화면을 캡처해 주세요.<br/>
                    <strong>성명, 수험번호, 등급, 응시일</strong>이 한 화면에 모두 보여야 합니다.<br/>
                    화면 캡처 또는 해당 화면이 보이는 상태에서 휴대폰으로 촬영한 사진도 가능합니다.<br/>
                    AI로 생성·편집하거나 이미지 편집 프로그램으로 수정한 성적표는 제출 불가하며,<br/>
                    ACTFL 공식 채널을 통해 진위 확인이 진행됩니다.
                  </p>
                </div>
                <div className="gc-field">
                  <label><span className="req">*</span> 사전 성적표 (스터디 수강 전)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="gc-file-input" onChange={(e) => setPreScoreFile(e.target.files?.[0] || null)} />
                  {preScoreFile && <div className="gc-file-name">{preScoreFile.name} ({(preScoreFile.size / 1024).toFixed(0)}KB)</div>}
                </div>
                <div className="gc-field">
                  <label><span className="req">*</span> 사후 성적표 (스터디 수료 후 응시)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="gc-file-input" onChange={(e) => setPostScoreFile(e.target.files?.[0] || null)} />
                  {postScoreFile && <div className="gc-file-name">{postScoreFile.name} ({(postScoreFile.size / 1024).toFixed(0)}KB)</div>}
                </div>
              </div>

              {/* 시험정보 */}
              <div className="gc-section">
                <div className="gc-section-title">시험정보</div>
                <div className="gc-field">
                  <label><span className="req">*</span> OPIc 수험번호</label>
                  <input type="text" placeholder="예: 12345-12345" value={formData.testNumber} onChange={(e) => setFormData({...formData, testNumber: e.target.value})} />
                </div>
                <div className="gc-field">
                  <label><span className="req">*</span> 시험 응시일</label>
                  <input type="date" value={formData.testDate} onChange={(e) => setFormData({...formData, testDate: e.target.value})} />
                </div>
                <div className="gc-field">
                  <label><span className="req">*</span> 본인 확인 서류 (신분증 사본)</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="gc-file-input" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
                  {idFile && <div className="gc-file-name">{idFile.name} ({(idFile.size / 1024).toFixed(0)}KB)</div>}
                </div>
              </div>

              {/* 보증 조건 체크리스트 */}
              <div className="gc-checklist">
                <div className="gc-checklist-title">보증 조건 확인</div>
                <div className="gc-checklist-note">다음 조건을 모두 충족해야 성적 보증 청구가 가능합니다.</div>

                {([
                  { key: 'homework' as const, label: '14일간 과제 100% 제출 및 암기 확인을 모두 통과했습니다' },
                  { key: 'attendance' as const, label: '정규 스터디 세션에 100% 참석했습니다' },
                  { key: 'coaching' as const, label: '1:3 코치 피드백 세션에 100% 참석했습니다' },
                  { key: 'examTiming' as const, label: '스터디 종료 후 2주 이내에 OPIc에 응시했습니다' },
                  { key: 'submitTiming' as const, label: '응시일로부터 30일 이내에 공식 성적표 및 수험번호를 제출합니다' },
                  { key: 'truthful' as const, label: '제출하는 성적표와 정보가 사실과 다름없으며, 위·변조 시 보증이 영구 박탈됨을 이해합니다' },
                ]).map(({ key, label }) => (
                  <div key={key} className={`gc-check-item ${checks[key] ? 'checked' : ''}`} onClick={() => setChecks({...checks, [key]: !checks[key]})}>
                    <input type="checkbox" checked={checks[key]} onChange={() => setChecks({...checks, [key]: !checks[key]})} />
                    <label>{label}</label>
                  </div>
                ))}
              </div>

              {/* 경고 */}
              <div className="gc-warning">
                허위 서류 제출 시 보증 영구 박탈, 전 프로그램 이용 제한, 민·형사 조치가 진행됩니다.
              </div>

              {error && <div className="gc-error">{error}</div>}

              <div className="gc-btn-row">
                <button
                  className="gc-btn gc-btn-secondary"
                  onClick={() => {
                    setFormData({ name: '', email: '', phone: '', cohort: '', preGrade: '', postGrade: '', testNumber: '', testDate: '' });
                    setPreScoreFile(null); setPostScoreFile(null); setIdFile(null);
                    setChecks({ homework: false, attendance: false, coaching: false, examTiming: false, submitTiming: false, truthful: false });
                    setError('');
                  }}
                >
                  작성 초기화
                </button>
                <button className="gc-btn gc-btn-primary" disabled={submitting || !allChecked} onClick={handleSubmit}>
                  {submitting ? '접수 중...' : '청구 신청하기'}
                </button>
              </div>
            </div>
          )}

          <div className="gc-footer">
            <p>심사는 접수일로부터 14영업일 이내에 완료됩니다.<br/>결과는 이메일과 카카오톡으로 안내됩니다.</p>
          </div>
        </div>
      </div>
    </>
  );
}
