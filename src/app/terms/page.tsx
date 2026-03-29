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
        <p className="legal-date">시행일: 2025년 1월 1일 | 최종 수정: 2025년 3월 30일</p>

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
            <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다. 이용자가 결제를 완료하거나 서비스를 이용하는 경우 본 약관에 동의한 것으로 간주합니다.</li>
            <li>회사는 합리적인 사유가 발생할 경우 관련 법령에 위배되지 않는 범위 안에서 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여 시행일 7일 전에 웹사이트에 공지합니다.</li>
            <li>변경된 약관의 공지 후 이용자가 명시적으로 거부 의사를 표시하지 않고 서비스를 계속 이용하는 경우, 변경된 약관에 동의한 것으로 간주합니다.</li>
            <li>변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단할 수 있으며, 이 경우 제7조에 따른 환불 규정이 적용됩니다.</li>
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
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </li>
            <li>회사는 운영상, 기술상의 필요에 따라 서비스의 전부 또는 일부를 변경, 중단할 수 있으며, 이 경우 변경 내용을 사전에 공지합니다. 다만, 긴급한 경우에는 사후에 공지할 수 있습니다.</li>
            <li>회사는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책에 따라 수정, 중단, 변경할 수 있으며, 이에 대하여 이용자에게 별도의 보상을 하지 않습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제5조 (서비스 이용)</h2>
          <ol>
            <li>무료 서비스(유튜브 강의, 뉴스레터 등)는 별도의 가입 절차 없이 이용할 수 있습니다.</li>
            <li>유료 서비스는 결제 완료 후 이용이 가능하며, 회사가 정한 이용 기간 및 방법에 따릅니다.</li>
            <li>이용자는 서비스 이용 시 관련 법령, 본 약관, 이용안내 및 서비스와 관련하여 공지한 주의사항을 준수하여야 합니다.</li>
            <li>유료 서비스의 이용 기간은 해당 스터디 프로그램에 명시된 기간으로 한정되며, 기간 종료 후 서비스가 자동으로 종료됩니다. 기간 연장은 회사의 별도 안내에 따릅니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제6조 (유료 서비스 및 결제)</h2>
          <ol>
            <li>유료 서비스의 가격은 서비스 페이지에 표시된 금액에 따르며, 회사는 사전 공지 후 가격을 변경할 수 있습니다. 단, 이미 결제가 완료된 서비스에 대해서는 변경된 가격이 소급 적용되지 않습니다.</li>
            <li>결제는 회사가 지정한 결제 수단을 통해 이루어집니다.</li>
            <li>결제 완료 후 이용자에게 서비스 이용에 필요한 안내를 제공합니다.</li>
            <li>이용자의 결제 정보 오류, 잔액 부족 등으로 결제가 완료되지 않은 경우 서비스 이용이 제한될 수 있으며, 이에 대한 책임은 이용자에게 있습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제7조 (청약 철회 및 환불)</h2>
          <ol>
            <li>이용자는 스터디 그룹 인원 편성(그룹 배정) 전까지 전액 환불을 요청할 수 있습니다.</li>
            <li><strong>스터디 그룹 인원 편성이 완료된 이후에는 환불이 불가합니다.</strong> 본 서비스는 소수 인원 기반의 그룹 스터디로 운영되며, 그룹 편성 이후 1인의 이탈은 다른 참여자 전원의 학습 환경과 스터디 진행에 직접적이고 회복 불가능한 영향을 미칩니다. 이에 따라 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조 제2항 제5호(용역의 제공이 개시된 경우) 및 동법 시행령 제21조에 근거하여 청약 철회가 제한됩니다.</li>
            <li>그룹 편성 완료 시점은 회사가 이용자에게 스터디 그룹 배정 안내(단톡방 초대, 그룹 안내 메시지 등)를 발송한 시점으로 합니다.</li>
            <li>이용자는 결제 시 그룹 편성 이후 환불이 불가하다는 점을 충분히 고지받으며, 결제 완료를 통해 이에 동의한 것으로 간주합니다.</li>
            <li>다음 각 호에 해당하는 경우에도 환불이 불가합니다:
              <ul>
                <li>스터디 진행 중 연락 두절(스터디 초대 무시, 단톡방 미참여 등), 무단 불참 등으로 다른 참여자에게 피해를 주는 행위가 확인된 경우</li>
                <li>스터디 일정 조율 등 운영에 필요한 연락에 48시간 이상 미응답이 2회 이상 반복되는 경우</li>
                <li>이용자가 본 약관 제8조에 규정된 의무를 위반하여 서비스 이용이 제한된 경우</li>
              </ul>
            </li>
            <li>회사의 귀책사유(서비스 미제공, 스터디 미진행 등)로 인한 경우에는 전액 환불합니다.</li>
            <li>환불 요청은 이메일(lulu066666@gmail.com)로 접수하며, 접수일로부터 영업일 기준 3일 이내에 환불 여부를 안내하고, 환불 승인 시 영업일 기준 7일 이내에 환불을 처리합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제8조 (이용자의 의무)</h2>
          <ol>
            <li>이용자는 서비스 이용 시 다음 행위를 하여서는 안 됩니다:
              <ul>
                <li>타인의 정보를 도용하거나 허위 정보를 제공하는 행위</li>
                <li>회사의 콘텐츠를 무단으로 복제, 배포, 방송, 전송하거나 제3자에게 제공하는 행위</li>
                <li>콘텐츠를 녹화, 캡처, 스크린샷 등의 방법으로 무단 저장하는 행위</li>
                <li>결제한 서비스를 본인 이외의 제3자에게 양도하거나 공유하는 행위</li>
                <li>다른 이용자의 학습을 방해하거나 불쾌감을 주는 행위</li>
                <li>스터디 그룹 내에서 욕설, 비방, 성희롱 등 부적절한 언행을 하는 행위</li>
                <li>회사의 서비스 운영을 방해하거나 회사의 명예를 훼손하는 행위</li>
                <li>기타 관련 법령에 위배되는 행위</li>
              </ul>
            </li>
            <li>이용자가 전항의 의무를 위반하는 경우, 회사는 사전 경고 없이 즉시 서비스 이용을 제한하거나 이용 계약을 해지할 수 있으며, 이 경우 환불은 제7조 제5항에 따릅니다.</li>
            <li>이용자의 의무 위반으로 인해 회사 또는 제3자에게 손해가 발생한 경우, 해당 이용자가 모든 손해를 배상할 책임을 부담합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제9조 (서비스 이용 제한 및 계약 해지)</h2>
          <ol>
            <li>회사는 이용자가 본 약관의 의무를 위반하거나, 서비스의 정상적인 운영을 방해하는 경우 서비스 이용을 제한하거나 이용 계약을 해지할 수 있습니다.</li>
            <li>회사는 다음 각 호에 해당하는 경우 사전 통보 없이 서비스 이용을 즉시 제한할 수 있습니다:
              <ul>
                <li>다른 이용자에게 심각한 피해를 주는 행위가 확인된 경우</li>
                <li>콘텐츠 무단 유출이 확인된 경우</li>
                <li>스터디 운영에 중대한 지장을 초래하는 행위가 반복되는 경우</li>
              </ul>
            </li>
            <li>회사의 귀책사유로 서비스를 제공하지 못하는 경우, 이용자에게 잔여 기간에 해당하는 금액을 환불합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제10조 (지적재산권)</h2>
          <ol>
            <li>서비스 내 모든 콘텐츠(강의 영상, 학습 자료, 커리큘럼, 디자인, 상표 등)에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.</li>
            <li>이용자는 회사의 사전 서면 동의 없이 콘텐츠를 복제, 전송, 출판, 배포, 방송, 2차 저작물 작성 등의 방법으로 이용하거나 제3자에게 제공할 수 없습니다.</li>
            <li>이용자가 본 조를 위반하여 콘텐츠를 무단 사용한 경우, 회사는 해당 이용자에게 사용 중지를 요구하고 민·형사상 법적 조치를 취할 수 있으며, 이로 인해 발생하는 모든 손해의 배상을 청구할 수 있습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제11조 (면책조항)</h2>
          <ol>
            <li>회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지, 제3자가 제공하는 플랫폼(유튜브, 카카오톡, Stibee 등)의 장애 등 불가항력적 사유로 인해 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.</li>
            <li>회사는 이용자의 귀책사유(기기 오류, 인터넷 연결 불량, 개인 일정 등)로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
            <li>회사는 이용자가 서비스를 통해 기대하는 학습 효과, OPIC 등급 향상, 취업 성공 등 특정 결과를 보장하지 않으며, 이에 대한 책임을 지지 않습니다.</li>
            <li>회사는 무료로 제공하는 서비스(유튜브 강의, 뉴스레터, AI 연습 도구 등)의 이용과 관련하여 발생하는 어떠한 손해에 대해서도 책임을 지지 않습니다.</li>
            <li>이용자가 스터디 그룹 내 다른 이용자와의 관계에서 발생한 분쟁에 대해 회사는 중재 의무를 지지 않으며, 책임을 부담하지 않습니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제12조 (손해배상)</h2>
          <ol>
            <li>회사의 귀책사유로 이용자에게 손해가 발생한 경우, 회사의 손해배상 범위는 이용자가 해당 서비스에 대해 실제 결제한 금액을 상한으로 합니다.</li>
            <li>회사는 간접 손해, 특별 손해, 결과적 손해, 징벌적 손해 및 일실 이익에 대해서는 책임을 지지 않습니다.</li>
            <li>이용자의 귀책사유로 회사에 손해가 발생한 경우(콘텐츠 무단 유출, 서비스 방해 행위 등), 이용자는 회사에 발생한 모든 손해(법적 비용 포함)를 배상하여야 합니다.</li>
          </ol>
        </div>

        <div className="legal-section">
          <h2>제13조 (통신판매업자 정보)</h2>
          <p>「전자상거래 등에서의 소비자보호에 관한 법률」에 따른 통신판매업자 정보는 다음과 같습니다:</p>
          <ul>
            <li>상호: 식빵영어</li>
            <li>대표자: 안준영</li>
            <li>사업자등록번호: 807-29-01639</li>
            <li>이메일: lulu066666@gmail.com</li>
            <li>소재지: 서비스 페이지 참조</li>
          </ul>
        </div>

        <div className="legal-section">
          <h2>제14조 (분쟁해결 및 관할법원)</h2>
          <ol>
            <li>서비스 이용과 관련하여 발생한 분쟁은 상호 협의하여 해결하는 것을 원칙으로 합니다.</li>
            <li>협의가 이루어지지 않을 경우, 회사의 소재지를 관할하는 법원을 전속 관할법원으로 합니다.</li>
            <li>본 약관의 해석 및 적용에 관하여는 대한민국 법률을 준거법으로 합니다.</li>
            <li>본 약관에서 정하지 않은 사항은 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」 등 관련 법령 및 상관례에 따릅니다.</li>
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
