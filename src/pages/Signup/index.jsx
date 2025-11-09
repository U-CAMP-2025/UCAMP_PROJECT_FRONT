import WarnDialog from '@components/common/WarnDialog';
import { PageContainer } from '@components/layout/PageContainer';
import { SignupForm } from '@components/signup/SignupForm';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import styled from 'styled-components';

export default function SignupPage() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertOnClose, setAlertOnClose] = useState(null);

  const navigate = useNavigate();

  // URL에서 쿼리 파라미터 가져오기
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorCode = queryParams.get('error');

  const openAlert = (message, onClose) => {
    setAlertMessage(message);
    setAlertOnClose(() => onClose);
    setAlertOpen(true);
  };

  // 에러 코드에 따른 알림 메시지 처리
  useEffect(() => {
    if (errorCode) {
      let message = '';
      const remainingHours = 24 - errorCode;
      message = (
        <>
          회원탈퇴 후 재가입까지 <StrongSpan>{remainingHours}</StrongSpan>시간 남았습니다.
        </>
      );
      openAlert(message, () => navigate(-1)); // 알림 닫히면 뒤로가기
    }
  }, [errorCode, navigate]);

  return (
    <PageContainer>
      <WarnDialog
        open={alertOpen}
        onOpenChange={(open) => {
          setAlertOpen(open);
          if (!open && alertOnClose) {
            alertOnClose(); // 경고창 닫히면 콜백 실행
            setAlertOnClose(null); // 콜백 초기화
          }
        }}
        title='알림'
        message={alertMessage}
        confirmText='확인'
      />
      {/* errorCode가 없을 때만 SignupForm을 렌더링 */}
      {!errorCode && <SignupForm />}
    </PageContainer>
  );
}

const StrongSpan = styled.span`
  color: ${({ theme }) => theme.colors.primary[9]};
  font-size: ${({ theme }) => theme.font.size[4]};
  font-weight: bold;
`;
