import { axiosInstance } from '@api/axios';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import * as Accordion from '@radix-ui/react-accordion';
import { CaretDownIcon, PlayIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export default function SimulationEndPage() {
  const navigate = useNavigate();
  const { simulationId } = useParams();
  const location = useLocation();

  // ★ GO 페이지에서 Blob으로 전달받음
  const initialBlob = location.state?.recordedBlob ?? null;
  const initialPost = location.state?.postData ?? null;

  const [videoUrl, setVideoUrl] = useState(null);
  const [post, setPost] = useState(initialPost);
  const [loading, setLoading] = useState(!initialPost); // post가 없으면 fetch
  const [error, setError] = useState(null);

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
        <SimEndHeader>
          <Typography as='h1' size={7} weight='bold'>
            시뮬레이션 돌아보기
          </Typography>
        </SimEndHeader>

        {/* 질문/답변 아코디언 */}
        <SectionTitle as='h2'>질문 & 준비한 답변</SectionTitle>

        {loading && <div style={{ padding: 16 }}>불러오는 중…</div>}
        {error && <div style={{ padding: 16, color: 'crimson' }}>{error}</div>}

        {!loading && !error && post && (
          <StyledAccordionRoot type='multiple' defaultValue={['q-0']}>
            {(post.qaList ?? []).map((qa, index) => (
              <StyledAccordionItem key={qa.qaId ?? index} value={`q-${index}`}>
                <StyledAccordionTrigger>
                  <Typography as='h3' size={4} weight='bold' style={{ flex: 1, textAlign: 'left' }}>
                    Q{index + 1}. {qa.qaQuestion}
                  </Typography>
                  <CaretIcon aria-hidden />
                </StyledAccordionTrigger>
                <StyledAccordionContent>
                  <AnswerContainer>
                    <AnswerLabel>준비한 답변</AnswerLabel>
                    <AnswerTextWrapper>
                      <Typography as='p' size={3} style={{ lineHeight: '1.6' }}>
                        {qa.qaAnswer || '—'}
                      </Typography>
                    </AnswerTextWrapper>
                  </AnswerContainer>
                </StyledAccordionContent>
              </StyledAccordionItem>
            ))}
          </StyledAccordionRoot>
        )}

        <FooterMessage>
          답변(STT) 텍스트 변환은 약간의 시간이 걸릴 수 있습니다.
          <br />
          완료되면 <b>면접 연습 기록</b>에서 확인할 수 있어요.
        </FooterMessage>
      </MainContentWrapper>
    </PageContainer>
  );
}

/* ---------- 스타일 ---------- */

const MainContentWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

const SimEndHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]}; /* 24px */
  padding-bottom: ${({ theme }) => theme.space[4]}; /* 16px */
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;

const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 6, weight: 'bold' })`
  width: 80%;
  margin: 0 auto;
  margin-bottom: ${({ theme }) => theme.space[5]};
  color: ${({ theme }) => theme.colors.gray[12]};
`;

const VideoPlayerWrapper = styled.div`
  position: relative;
  width: 80%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.gray[3]};
  border-radius: ${({ theme }) => theme.radius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;
  margin: ${({ theme }) => theme.space[10]} auto ${({ theme }) => theme.space[10]};

  video {
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => theme.radius.lg};
  }
`;

const PlayIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  color: white;
`;

const StyledAccordionRoot = styled(Accordion.Root)`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;

const StyledAccordionItem = styled(Accordion.Item)`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const StyledAccordionTrigger = styled(Accordion.Trigger)`
  all: unset;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[6]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size[4]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.gray[12]};

  &[data-state='open'] {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
  }
`;

const CaretIcon = styled(CaretDownIcon)`
  color: ${({ theme }) => theme.colors.gray[9]};
  transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);

  [data-state='open'] & {
    transform: rotate(-180deg);
  }
`;

const slideDown = keyframes`
  from { height: 0; opacity: 0; }
  to { height: var(--radix-accordion-content-height); opacity: 1; }
`;

const slideUp = keyframes`
  from { height: var(--radix-accordion-content-height); opacity: 1; }
  to { height: 0; opacity: 0; }
`;

const StyledAccordionContent = styled(Accordion.Content)`
  overflow: hidden;
  &[data-state='open'] {
    animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
  &[data-state='closed'] {
    animation: ${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
`;

const AnswerContainer = styled.div`
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[6]}
    ${({ theme }) => theme.space[6]};
`;

const AnswerLabel = styled(Typography).attrs({ as: 'h4', size: 3, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[10]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const AnswerTextWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  max-height: 200px;
  overflow-y: auto;
`;

const FooterMessage = styled(Typography).attrs({ as: 'p', size: 3 })`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[9]};
  margin-top: ${({ theme }) => theme.space[10]};
`;

const ConfirmButton = styled.button`
  all: unset;
  width: 100%;
  max-width: 300px;
  display: block;
  margin: ${({ theme }) => theme.space[6]} auto 0;
  padding: ${({ theme }) => theme.space[5]} 0;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.font.size[5]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }

  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[6]};
  }
`;
