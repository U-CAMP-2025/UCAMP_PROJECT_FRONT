import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { useAuthStore } from '@store/auth/useAuthStore';
import { usePaymentStore } from '@store/payment/usePaymentStore';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export default function LoginBridge() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { login, setAccessToken } = useAuthStore.getState();
  const { setIsPlus } = usePaymentStore.getState();

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(search);
        const accessToken = params.get('accessToken');
        const nickname = params.get('nickname');
        const profileImageUrl = params.get('profileImageUrl');
        const isPlus = params.get('isPlus') === 'true';
        const next = params.get('next') || '/'; // next 파라미터 읽기, 없으면 메인으로 이동

        if (!accessToken) {
          navigate('/signup', { replace: true });
          return;
        }

        setAccessToken(accessToken);
        login({
          user: {
            name: nickname,
            profileImageUrl,
          },
        });
        setIsPlus(isPlus);

        navigate(next, { replace: true });
      } catch (err) {
        console.error('LoginBridge Error:', err);
        navigate('/', { replace: true });
      }
    })();
  }, [search, navigate, login, setAccessToken]);

  return (
    <PageContainer>
      <ContentWrapper>
        <Spinner />
        <Typography size={3} weight='bold' color={'gray.12'} style={{ marginTop: '20px' }}>
          로그인 처리중...
        </Typography>
      </ContentWrapper>
    </PageContainer>
  );
}

const ContentWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.gray[4]};
  border-top: 4px solid ${({ theme }) => theme.colors.primary[9]};
  border-radius: 50%;
  width: 48px;
  height: 48px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;
