// SimulationResultPage.tsx
import { axiosInstance } from '@api/axios';
import { Content, Description, Overlay, Title } from '@components/common/Dialog';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export default function SimulationResultPage() {
  const navigate = useNavigate();
  const { simulationId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(`/simulation/${simulationId}/result`);
        setData(res.data?.data ?? null);
      } catch (e) {
        setError(e?.response?.data?.message ?? '결과를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [simulationId]);

  const handleSaveModalClick = async () => {
    try {
      await axiosInstance.put(`/simulation/${simulationId}/finalize`);
      setIsModalOpen(false);
      navigate('/myqa'); // 저장 후 이동 위치
    } catch (e) {
      alert(e?.response?.data?.message ?? '저장에 실패했습니다.');
    }
  };

  const handleCancelClick = () => navigate('/simulation/record');

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        <SectionTitle>변환 결과</SectionTitle>

        {loading && <div style={{ padding: 24 }}>불러오는 중…</div>}
        {error && <div style={{ padding: 24, color: 'crimson' }}>{error}</div>}

        {!loading && !error && data && (
          <>
            <StyledAccordionRoot type='multiple' defaultValue={['q-0']}>
              {data.post.qaList.map((qa, index) => (
                <StyledAccordionItem key={qa.qaId || index} value={`q-${index}`}>
                  <StyledAccordionTrigger>
                    <Typography
                      as='h3'
                      size={4}
                      weight='bold'
                      style={{ flex: 1, textAlign: 'left' }}
                    >
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

                      <AnswerLabel>나의 답변</AnswerLabel>
                      <AnswerTextWrapper>
                        <Typography as='p' size={3} style={{ lineHeight: '1.6' }}>
                          {qa.transContent || '—'}
                        </Typography>
                      </AnswerTextWrapper>
                    </AnswerContainer>
                  </StyledAccordionContent>
                </StyledAccordionItem>
              ))}
            </StyledAccordionRoot>

            <ButtonGroup>
              <CancelButton onClick={handleCancelClick}>취소</CancelButton>
              <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
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
          </>
        )}
      </MainContentWrapper>
    </PageContainer>
  );
}

/* 스타일: 네 기존 코드 그대로 */
const MainContentWrapper = styled.div`
  width: 80%;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;
const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 6, weight: 'bold' })`
  margin-bottom: ${({ theme }) => theme.space[8]};
  color: ${({ theme }) => theme.colors.gray[12]};
`;
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
const slideDown = keyframes` from { height: 0; opacity: 0; } to { height: var(--radix-accordion-content-height); opacity: 1; }`;
const slideUp = keyframes` from { height: var(--radix-accordion-content-height); opacity: 1; } to { height: 0; opacity: 0; }`;
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
const AnswerTextWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  max-height: 200px;
  overflow-y: auto;
`;
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
const ModalButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[6]};
`;
