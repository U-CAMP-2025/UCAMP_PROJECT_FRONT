import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import * as Accordion from '@radix-ui/react-accordion';
import { CaretDownIcon, PlayIcon } from '@radix-ui/react-icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// Mock 데이터
// 실제로는 Simulation ID를 기반으로 이 데이터를 불러와야 합니다.
const mockSimulationResult = {
  simulationId: 1,
  videoUrl: 'https://path.to/your/video.mp4',
  // Post 데이터
  post: {
    postId: 1,
    title: '신입 프론트엔드 면접 질문 모음',
    qaSets: [
      {
        qaId: 0,
        question: '1분 자기소개 부탁드립니다.',
        originContent: '안녕하십니까. 00회사 00직무에 지원하게 된 000입니다. ...',
      },
      {
        qaId: 1,
        question: '이 회사에 지원하게 된 동기는 어떻게 됩니까?',
        originContent: '비전과 기술력에 깊은 감명을 받았습니다. 특히...',
      },
      {
        qaId: 2,
        question: '프로젝트 중 겪었던 가장 큰 어려움은 무엇인가요?',
        originContent: '가장 큰 어려움은...',
      },
    ],
  },
};

export default function SimulationEndPage() {
  const navigate = useNavigate();

  // TODO: 페이지 접근 시 실제 시뮬레이션 결과 데이터(simulationResult)를
  // URL 파라미터(simulationId)나 location state로 받아와야 합니다.
  const simulationResult = mockSimulationResult;

  // 확인 버튼 클릭 -> 면접 연습 기록 페이지로 이동
  const handleConfirmClick = () => {
    navigate('/simulation/record');
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        {/* 시뮬레이션 영상 제공 섹션 */}
        <SectionTitle>면접 영상</SectionTitle>
        <VideoPlayerWrapper>
          {/* <video controls src={simulationResult.videoUrl}>
                        Your browser does not support the video tag.
                    </video> 
                    */}
          {/* Placeholder Icon */}
          <PlayIconWrapper>
            <PlayIcon width={50} height={50} />
          </PlayIconWrapper>
        </VideoPlayerWrapper>

        {/* 질문/답변 목록 섹션 */}
        <StyledAccordionRoot type='multiple' defaultValue={['q-0']}>
          {simulationResult.post.qaSets.map((qa, index) => (
            <StyledAccordionItem key={index} value={`q-${index}`}>
              <StyledAccordionTrigger>
                <Typography as='h3' size={4} weight='bold' style={{ flex: 1, textAlign: 'left' }}>
                  Q{index + 1}. {qa.question}
                </Typography>
                <CaretIcon aria-hidden />
              </StyledAccordionTrigger>
              <StyledAccordionContent>
                <AnswerContainer>
                  <AnswerLabel>준비한 답변</AnswerLabel>
                  <AnswerTextWrapper>
                    <Typography as='p' size={3} style={{ lineHeight: '1.6' }}>
                      {qa.originContent}
                    </Typography>
                  </AnswerTextWrapper>
                </AnswerContainer>
              </StyledAccordionContent>
            </StyledAccordionItem>
          ))}
        </StyledAccordionRoot>

        {/* 하단 안내문구, 버튼 섹션 */}
        <FooterMessage>
          답변 스크립트 변환에 시간이 다소 소요되며, 완료 시 면접 연습 기록 페이지에서 확인
          가능합니다.
        </FooterMessage>

        <ConfirmButton onClick={handleConfirmClick}>확인</ConfirmButton>
      </MainContentWrapper>
    </PageContainer>
  );
}

// --- [스타일 정의] ---

const MainContentWrapper = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

// 섹션 제목 (예: "면접 영상")
const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 6, weight: 'bold' })`
  margin-bottom: ${({ theme }) => theme.space[5]}; /* 20px */
  color: ${({ theme }) => theme.colors.gray[12]};
`;

// 면접 영상 플레이어 (Placeholder)
const VideoPlayerWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: ${({ theme }) => theme.colors.gray[3]};
  border-radius: ${({ theme }) => theme.radius.lg}; /* 16px */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space[10]}; /* 40px */
  box-shadow: ${({ theme }) => theme.shadow.sm};
  overflow: hidden;

  /* 실제 영상 태그는 아래 주석처럼 삽입할 수 있습니다 */
  /*
  video {
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => theme.radius.lg};
  }
  */
`;

// 플레이 아이콘 (Placeholder)
const PlayIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  color: white;
`;

// 질문/답변 아코디언
const StyledAccordionRoot = styled(Accordion.Root)`
  width: 100%;
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
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[6]}; /* 20px 24px */
  cursor: pointer;
  font-size: ${({ theme }) => theme.font.size[4]}; /* 18px */
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.gray[12]};

  &:focus {
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }

  &[data-state='open'] {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
  }
`;

const CaretIcon = styled(CaretDownIcon)`
  color: ${({ theme }) => theme.colors.gray[9]};
  transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
`;

// 아코디언 콘텐츠 (애니메이션)
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

// 아코디언 내부 "준비한 답변" 영역
const AnswerContainer = styled.div`
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[6]}
    ${({ theme }) => theme.space[6]};
`;

const AnswerLabel = styled(Typography).attrs({ as: 'h4', size: 3, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[10]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

// 와이어프레임의 스크롤 가능한 텍스트 박스
const AnswerTextWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  max-height: 200px; /* 최대 높이 지정 */
  overflow-y: auto; /* 내용 많으면 스크롤 */
`;

// 3. 하단 안내 문구 및 버튼
const FooterMessage = styled(Typography).attrs({ as: 'p', size: 3 })`
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[9]};
  margin-top: ${({ theme }) => theme.space[10]};
`;

const ConfirmButton = styled.button`
  all: unset;
  width: 100%;
  max-width: 400px;
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
