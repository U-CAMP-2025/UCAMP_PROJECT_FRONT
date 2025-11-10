import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export default function LogoutComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    useAuthStore.getState().logout?.();
    navigate('/');
  }, []);

  return (
    <PageContainer>
      <ContentWrapper>
        <Spinner />
        <Typography size={3} weight='bold' color={'gray.12'} style={{ marginTop: '20px' }}>
          로그아웃 처리중...
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
