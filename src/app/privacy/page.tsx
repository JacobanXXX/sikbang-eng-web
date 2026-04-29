'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .legal-nav {
          position: sticky;
          top: 0;
          background: white;
          border-bottom: 1px solid #F2F4F6;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
        }
        .legal-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .legal-nav .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #3182F6;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }
        .legal-nav .logo {
          font-size: 18px;
          font-weight: 800;
          color: #191F28;
        }
        .legal-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }
        .legal-title {
          font-size: 28px;
          font-weight: 800;
          color: #191F28;
          margin-bottom: 8px;
        }
        .legal-date {
          font-size: 14px;
          color: #8B95A1;
          margin-bottom: 40px;
        }
        .legal-section {
          margin-bottom: 36px;
        }
        .legal-section h2 {
          font-size: 18px;
          font-weight: 700;
          color: #191F28;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #F2F4F6;
        }
        .legal-section p, .legal-section li {
          font-size: 15px;
          line-height: 1.8;
          color: #4E5968;
        }
        .legal-section ol, .legal-section ul {
          padding-left: 20px;
          margin-top: 8px;
        }
        .legal-section li {
          margin-bottom: 4px;
        }
        .legal-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
          font-size: 14px;
        }
        .legal-table th, .legal-table td {
          border: 1px solid #E5E8EB;
          padding: 10px 12px;
          text-align: left;
          color: #4E5968;
        }
        .legal-table th {
          background: #F8F9FA;
          font-weight: 600;
          color: #191F28;
        }
        .legal-footer {
          background: #F8F9FA;
          padding: 32px 24px;
          text-align: center;
          font-size: 13px;
          color: #8B95A1;
          border-top: 1px solid #F2F4F6;
        }
        .legal-footer a {
          color: #3182F6;
          text-decoration: none;
          margin: 0 12px;
        }
      `}</style>

      <nav className="legal-nav">
        <div className="legal-nav-left">
          <Link href="/" className="logo">🍞 식빵영어</Link>
        </div>
        <Link href="/" className="back-btn">← 돌아가기</Link>
      </nav>

      <div className="legal-container">
        <h1 className="legal-title">개인정보처리방침</h1>
        <p className="legal-date">시행일: 2025년 1월 1일 | 최종 수정: 2025년 3월 29일</p>

        <div className="legal-section">
          <h2>제1조 (개인정보의 처리 목적)</h2>
          <p>식빵영어(이하 &quot;회사&quot;)는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
          <ol>
            <li><strong>서비스 제공 및 운영:</strong> 유료 부트캠프 프로그램 운영, 부트캠프 그룹 배정 및 일정 안내, 학습 자료 제공</li>
            <li><strong>뉴스레터 발송:</strong> 영어 학습 관련 뉴스레터 및 정보성 이메일 발송</li>
            <li><strong>결제 및 환불 처리:</strong> 유료 서비스 결제 확인 및 환불 처리</li>
            <li><strong>고객 문의 응대:</strong> 이용자의 문의사항 및 불만 처리</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제2조 (수집하는 개인정보 항목 및 수집 방법)</h2>
          <p>회사는 서비스 제공을 위해 필요한 최소한의 개인정보만을 수집합니다.</p>
          <table className="legal-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>수집 항목</th>
                <th>수집 목적</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>뉴스레터 구독</td>
                <td>이메일 주소</td>
                <td>뉴스레터 발송</td>
              </tr>
              <tr>
                <td>유료 부트캠프 신청</td>
                <td>이름, 이메일 주소, 연락처(카카오톡 등)</td>
                <td>부트캠프 운영, 그룹 배정, 연락</td>
              </tr>
              <tr>
                <td>결제</td>
                <td>결제 정보(결제 수단, 결제일시)</td>
                <td>결제 확인 및 환불 처리</td>
              </tr>
              <tr>
                <td>고객 문의</td>
                <td>이메일 주소, 문의 내용</td>
                <td>문의 응대 및 처리</td>
              </tr>
            </tbody>
          </table>
          <p style={{marginTop: '12px'}}>수집 방법: 웹사이트 내 입력 양식, 이메일을 통한 직접 수집</p>
        </div>

        <div className="legal-section">
          <h2>제3조 (개인정보의 처리 및 보유 기간)</h2>
          <p>회사는 법령에 따른 개인정보 보유·이용 기간 또는 이용자로부터 개인정보를 수집 시 동의받은 개인정보 보유·이용 기간 내에서 개인정보를 처리·보유합니다.</p>
          <ol>
            <li><strong>뉴스레터 구독 정보:</strong> 구독 해지 시까지</li>
            <li><strong>부트캠프 참여 정보:</strong> 부트캠프 종료 후 6개월 (환불 분쟁 대비)</li>
            <li><strong>결제 정보:</strong> 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 5년</li>
            <li><strong>고객 문의 기록:</strong> 3년 (「전자상거래 등에서의 소비자보호에 관한 법률」에 따른 소비자 불만 또는 분쟁 처리에 관한 기록)</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제4조 (개인정보의 제3자 제공)</h2>
          <p>회사는 이용자의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 이용자의 동의 없이는 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다:</p>
          <ol>
            <li>이용자가 사전에 동의한 경우</li>
            <li>법률에 특별한 규정이 있거나 법령상 의무를 준수하기 위하여 불가피한 경우</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제5조 (개인정보의 파기)</h2>
          <ol>
            <li>회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</li>
            <li>전자적 파일 형태의 정보는 복구 및 재생이 되지 않도록 안전하게 삭제하며, 그 밖의 기록물 등은 파쇄하거나 소각합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제6조 (이용자의 권리·의무 및 행사 방법)</h2>
          <ol>
            <li>이용자는 회사에 대해 언제든지 다음의 개인정보 보호 관련 권리를 행사할 수 있습니다:
              <ul>
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </li>
            <li>위 권리 행사는 이메일(lulu066666@gmail.com)을 통해 할 수 있으며, 회사는 이에 대해 지체 없이 조치하겠습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제7조 (개인정보의 안전성 확보 조치)</h2>
          <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
          <ol>
            <li><strong>관리적 조치:</strong> 개인정보 취급자 최소화, 개인정보 보호 교육 실시</li>
            <li><strong>기술적 조치:</strong> 개인정보 처리 시스템에 대한 접근 권한 관리, 보안 프로그램 설치 및 갱신</li>
            <li><strong>물리적 조치:</strong> 개인정보가 포함된 서류 등의 잠금장치가 있는 안전한 장소 보관</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제8조 (쿠키의 사용)</h2>
          <p>회사는 웹사이트 이용 과정에서 쿠키를 사용할 수 있습니다. 쿠키는 웹사이트 이용 편의를 위해 사용되며, 이용자는 브라우저 설정을 통해 쿠키의 저장을 거부할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 발생할 수 있습니다.</p>
        </div>

        <div className="legal-section">
          <h2>제9조 (개인정보 보호책임자)</h2>
          <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
          <ul>
            <li><strong>개인정보 보호책임자:</strong> 안준영 (대표)</li>
            <li><strong>이메일:</strong> lulu066666@gmail.com</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>제10조 (권익침해 구제방법)</h2>
          <p>이용자는 개인정보침해로 인한 구제를 받기 위하여 다음의 기관에 분쟁해결이나 상담 등을 신청할 수 있습니다:</p>
          <ul>
            <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)</li>
            <li>경찰청 사이버수사국: (국번없이) 182 (ecrm.cyber.go.kr)</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>제11조 (개인정보처리방침의 변경)</h2>
          <p>본 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 웹사이트를 통해 공지하겠습니다.</p>
        </div>

        <div className="legal-section">
          <h2>부칙</h2>
          <p>본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.</p>
        </div>
      </div>

      <div className="legal-footer">
        <p>식빵영어 | 대표: 안준영 | 사업자등록번호: 807-29-01639 | 소재지: 부산광역시 진구 만리산로98, 2층 | 이메일: lulu066666@gmail.com</p>
        <p style={{marginTop: '8px'}}>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보처리방침</Link>
        </p>
      </div>
    </>
  );
}
