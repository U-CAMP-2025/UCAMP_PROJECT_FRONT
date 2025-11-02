import { Content, Description, Overlay, Title } from '@components/common/Dialog';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const mockSimulationResult = {
  simulationId: 1,
  // Post 데이터
  post: {
    postId: 1,
    title: '신입 프론트엔드 면접 질문 모음',
    qaSets: [
      {
        qaId: 0,
        question: '1분 자기소개 부탁드립니다.',
        originContent: '안녕하십니까. 00회사 00직무에 지원하게 된 000입니다. ...',
        transContent:
          '안녕하세요. 저는 000입니다. 00회사에서 ...안녕하세요. 저는 000입니다. 00회사에서 ...안녕하세요. 저는 000입니다. 00회사에서 ...안녕하세요. 저는 000입니다. 00회사에서 ...안녕하세요. 저는 000입니다. 00회사에서 ...안녕하세요. 저는 000입니다. 00회사에서 ...안녕하세요. 저는 000입니다. 00회사에서 ...',
      },
      {
        qaId: 1,
        question: '이 회사에 지원하게 된 동기는 어떻게 됩니까?',
        originContent: '비전과 기술력에 깊은 감명을 받았습니다. 특히...',
        transContent: '이 회사의 비전과 기술력에 매료되었습니다. 특히...',
      },
      {
        qaId: 2,
        question: '프로젝트 중 겪었던 가장 큰 어려움은 무엇인가요?',
        originContent: '가장 큰 어려움은...',
        transContent: '제가 겪었던 가장 큰 어려움은...',
      },
    ],
  },
};

export default function SimulationResultPage() {
  const navigate = useNavigate();

  const simulationResult = mockSimulationResult;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 결과 저장 (모달의 '확인' 버튼) 클릭
  const handleSaveModalClick = () => {
    // 모달을 닫고 페이지 이동
    setIsModalOpen(false);
    navigate('/myqa'); // 저장 후 MyQA 페이지로 이동
  };

  // 취소 버튼 클릭
  const handleCancelClick = () => {
    console.log('취소 처리...');
    navigate('/simulation/record');
  };

  return (
    <PageContainer header footer>
      {' '}
      <MainContentWrapper>
        <SectionTitle>변환 결과</SectionTitle>
        {/* 질문/답변 목록 섹션 */}{' '}
        <StyledAccordionRoot type='multiple' defaultValue={['q-0']}>
          {' '}
          {simulationResult.post.qaSets.map((qa, index) => (
            <StyledAccordionItem key={qa.qaId || index} value={`q-${index}`}>
              {' '}
              <StyledAccordionTrigger>
                {' '}
                <Typography as='h3' size={4} weight='bold' style={{ flex: 1, textAlign: 'left' }}>
                  Q{index + 1}. {qa.question}{' '}
                </Typography>
                <CaretIcon aria-hidden />{' '}
              </StyledAccordionTrigger>{' '}
              <StyledAccordionContent>
                {' '}
                <AnswerContainer>
                  {/* 1. 준비한 답변 */} <AnswerLabel>준비한 답변</AnswerLabel>{' '}
                  <AnswerTextWrapper>
                    {' '}
                    <Typography as='p' size={3} style={{ lineHeight: '1.6' }}>
                      {qa.originContent}{' '}
                    </Typography>{' '}
                  </AnswerTextWrapper>
                  {/* 2. 나의 답변 (STT) */}
                  <AnswerLabel>나의 답변</AnswerLabel>
                  <AnswerTextWrapper>
                    <Typography as='p' size={3} style={{ lineHeight: '1.6' }}>
                      {qa.transContent}
                    </Typography>
                  </AnswerTextWrapper>{' '}
                </AnswerContainer>{' '}
              </StyledAccordionContent>{' '}
            </StyledAccordionItem>
          ))}{' '}
        </StyledAccordionRoot>{' '}
        <ButtonGroup>
          {' '}
          <CancelButton onClick={handleCancelClick}>취소</CancelButton>{' '}
          <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            {' '}
            <Dialog.Trigger asChild>
              <SaveButton>결과 저장</SaveButton>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Overlay />
              <Content>
                <Title>확정하시겠어요?</Title>
                <Description>기존 답변이 대체되며, 저장 시 되돌릴 수 없습니다.</Description>
                <ModalButtonGroup>
                  <Dialog.Close asChild>
                    <CancelButton>취소</CancelButton>
                  </Dialog.Close>
                  <SaveButton onClick={handleSaveModalClick}>확인</SaveButton>
                </ModalButtonGroup>
              </Content>
            </Dialog.Portal>
          </Dialog.Root>
        </ButtonGroup>
      </MainContentWrapper>{' '}
    </PageContainer>
  );
}

// --- [스타일 정의] ---

const MainContentWrapper = styled.div`
  width: 80%;
  // max-width: 900px;
  // margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 6, weight: 'bold' })`
  margin-bottom: ${({ theme }) => theme.space[8]}; /* 32px */
  color: ${({ theme }) => theme.colors.gray[12]};
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

  [data-state='open'] & {
    transform: rotate(-180deg);
  }
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

// 아코디언 내부에 "준비한 답변" + "나의 답변" 2개를 배치
const AnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[6]}
    ${({ theme }) => theme.space[6]};
`;

const AnswerLabel = styled(Typography).attrs({ as: 'h4', size: 3, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[10]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

// (준비한 답변, 나의 답변) 텍스트 박스
const AnswerTextWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  max-height: 200px;
  overflow-y: auto;
`;

// 하단 버튼 그룹 스타일
const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[10]};
`;

const BaseButton = styled.button`
  all: unset;
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
  font-size: ${({ theme }) => theme.font.size[4]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  border-radius: ${({ theme }) => theme.radius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  text-align: center;
  box-sizing: border-box;
`;

const SaveButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[6]};
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.colors.gray[3]};
  color: ${({ theme }) => theme.colors.gray[11]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[4]};
  }
  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.gray[6]};
  }
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
`;
