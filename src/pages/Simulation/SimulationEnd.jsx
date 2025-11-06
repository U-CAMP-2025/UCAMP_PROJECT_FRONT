import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

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

export default function SimulationEndPage() {
  const navigate = useNavigate();
  const { simulationId } = useParams();
  const location = useLocation();

  // GO 페이지에서 Blob으로 전달받음
  const initialBlob = location.state?.recordedBlob ?? null;

  // ★ Blob → objectURL 생성 (cleanup 시 revoke)
  useEffect(() => {
    let timer = setTimeout(() => {
      console.log(initialBlob);
      navigate(`/simulation/${simulationId}/result`, {
        state: {
          initialBlob,
        },
        replace: true,
      });
    }, 10000); // 살짝의 로딩 연출
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        <Spinner />
        <FooterMessage>
          면접 연습에서 말한 답변을 텍스트로 변환하고 있습니다. <br />
          완료되면 <b>면접 연습 기록</b>에서 확인할 수 있습니다.
        </FooterMessage>
      </MainContentWrapper>
    </PageContainer>
  );
}

const MainContentWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FooterMessage = styled(Typography).attrs({ as: 'p', size: 3 })`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[11]};
  margin-top: ${({ theme }) => theme.space[10]};
  line-height: 28px;

  b {
    color: ${({ theme }) => theme.colors.primary[10]};
  }
`;
