'use client';

import Link from 'next/link';

export default function TermsPage() {
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
        <h1 className="legal-title">이용약관</h1>
        <p className="legal-date">시행일: 2025년 1월 1일 | 최종 수정: 2025년 3월 29일</p>

        <div className="legal-section">
          <h2>제1조 (목적)</h2>
          <p>본 약관은 식빵영어(이하 &quot;회사&quot;)가 제공하는 온라인 영어 교육 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        </div>

        <div className="legal-section">
          <h2>제2조 (정의)</h2>
          <ol>
            <li>&quot;서비스&quot;란 회사가 sikbang.co 웹사이트 및 관련 플랫폼을 통해 제공하는 OPIC 영어 스터디, 무료 강의, 뉴스레터, AI 스피킹 연습 등 일체의 온라인 교육 서비스를 말합니다.</li>
            <li>&quot;이용자&quot;란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
            <li>&quot;유료 서비스&quot;란 회사가 유료로 제공하는 스터디 프로그램, 코스 등을 말합니다.</li>
            <li>&quot;콘텐츠&quot;란 회사가 서비스를 통해 제공하는 강의 영상, 학습 자료, 뉴스레터 등 일체의 정보를 말합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제3조 (약관의 효력 및 변경)</h2>
          <ol>
            <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
            <li>회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 안에서 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여 웹사이트에 공지합니다.</li>
            <li>변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제4조 (서비스의 제공 및 변경)</h2>
          <ol>
            <li>회사는 다음과 같은 서비스를 제공합니다:
              <ul>
                <li>OPIC 대비 2주 집중 스터디 프로그램</li>
                <li>무료 영문법 강의 영상 제공</li>
                <li>영어 학습 뉴스레터 발행</li>
                <li>AI 스피킹 연습 도구 제공</li>
              </ul>
            </li>
            <li>회사는 서비스의 내용을 운영상, 기술상의 필요에 따라 변경할 수 있으며, 이 경우 변경 내용을 사전에 공지합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제5조 (서비스 이용)</h2>
          <ol>
            <li>무료 서비스(유튜브 강의, 뉴스레터 등)는 별도의 가입 절차 없이 이용할 수 있습니다.</li>
            <li>유료 서비스는 결제 완료 후 이용이 가능하며, 회사가 정한 이용 기간 및 방법에 따릅니다.</li>
            <li>이용자는 서비스 이용 시 관련 법령, 본 약관, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수하여야 합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제6조 (유료 서비스 및 결제)</h2>
          <ol>
            <li>유료 서비스의 가격은 서비스 페이지에 표시된 금액에 따르며, 회사는 가격을 변경할 수 있습니다.</li>
            <li>결제는 회사가 지정한 결제 수단을 통해 이루어집니다.</li>
            <li>결제 완료 후 이용자에게 서비스 이용에 필요한 안내를 제공합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제7조 (환불 정책)</h2>
          <ol>
            <li>스터디 시작일 전까지는 전액 환불이 가능합니다.</li>
            <li>스터디 시작 후에는 「전자상거래 등에서의 소비자보호에 관한 법률」에 따라 환불이 처리됩니다.</li>
            <li>다음의 경우 환불이 제한될 수 있습니다:
              <ul>
                <li>스터디 그룹 매칭 완료 후 본인 사유로 인한 불참</li>
                <li>스터디 진행 중 연락 두절, 무단 불참 등으로 다른 참여자에게 피해를 주는 행위</li>
                <li>스터디 초대 및 일정 조율 등의 연락에 지속적으로 미응답하는 경우</li>
              </ul>
            </li>
            <li>환불 요청은 이메일(lulu066666@gmail.com)로 접수하며, 접수일로부터 영업일 기준 3일 이내에 처리됩니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제8조 (이용자의 의무)</h2>
          <ol>
            <li>이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다:
              <ul>
                <li>타인의 정보를 도용하는 행위</li>
                <li>회사의 콘텐츠를 무단으로 복제, 배포, 방송하는 행위</li>
                <li>다른 이용자의 학습을 방해하는 행위</li>
                <li>회사의 서비스 운영을 방해하는 행위</li>
                <li>기타 관련 법령에 위배되는 행위</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제9조 (지적재산권)</h2>
          <ol>
            <li>서비스 내 모든 콘텐츠(강의 영상, 학습 자료, 디자인 등)에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.</li>
            <li>이용자는 회사의 사전 서면 동의 없이 콘텐츠를 복제, 전송, 출판, 배포, 방송 등의 방법으로 이용하거나 제3자에게 제공할 수 없습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제10조 (면책조항)</h2>
          <ol>
            <li>회사는 천재지변, 시스템 장애 등 불가항력적 사유로 인해 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</li>
            <li>회사는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
            <li>회사는 이용자가 서비스를 통해 기대하는 학습 효과나 성적 향상을 보장하지 않습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제11조 (분쟁해결)</h2>
          <ol>
            <li>서비스 이용과 관련하여 발생한 분쟁은 상호 협의하여 해결하는 것을 원칙으로 합니다.</li>
            <li>협의가 이루어지지 않을 경우 「전자상거래 등에서의 소비자보호에 관한 법률」 등 관련 법령에 따른 분쟁해결 절차를 따릅니다.</li>
            <li>본 약관에서 정하지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>부칙</h2>
          <p>본 약관은 2025년 1월 1일부터 시행됩니다.</p>
        </div>
      </div>

      <div className="legal-footer">
        <p>식빵영어 | 대표: 안준영 | 사업자등록번호: 807-29-01639 | 이메일: lulu066666@gmail.com</p>
        <p style={{marginTop: '8px'}}>
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보처리방침</Link>
        </p>
      </div>
    </>
  );
}
