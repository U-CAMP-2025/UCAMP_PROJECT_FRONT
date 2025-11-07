// SimulationResultPage.jsx
import { fetchSimulationResult, putSimulationFinalize } from '@api/simulationAPIS';
import ConfirmDialog from '@components/common/ConfirmDialog';
import ErrorDialog from '@components/common/ErrorDialog';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { feedback } from '@elevenlabs/elevenlabs-js/api/resources/conversationalAi/resources/conversations';
import * as Accordion from '@radix-ui/react-accordion';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CaretDownIcon } from '@radix-ui/react-icons';
import { CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import theme from '@styles/theme';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export default function SimulationResultPage() {
  const navigate = useNavigate();
  const { simulationId } = useParams();
  const [data, setData] = useState(null);
  const location = useLocation();
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);

  const incomingBlob = location.state?.initialBlob ?? null;
  const [videoUrl, setVideoUrl] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const keyOf = (idx, qa) => String(qa?.qaId ?? idx);
  const isSelected = (key) => selectedKeys.has(key);
  const toggleOne = (key) =>
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const selectAll = () => setSelectedKeys(new Set(qaList.map((qa, i) => keyOf(i, qa))));
  const clearAll = () => setSelectedKeys(new Set());

  useEffect(() => {
    if (!incomingBlob) return;
    let url = URL.createObjectURL(incomingBlob);
    setVideoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [incomingBlob]);

  const openAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };

  useEffect(() => {
    fetchSimulationResult(simulationId)
      .then((response) => {
        const raw = response.data.post?.qaList ?? [];

        // 피드백 정규화: 문자열 1개로 보장
        const list = raw.map((q) => ({
          ...q,
          // 1) 새 백엔드: q.feedback 사용
          feedback: (q.feedback ?? '').trim(),
        }));
        console.log(feedback);
        setQaList(list);
        setSelectedKeys(new Set(list.map((qa, i) => keyOf(i, qa))));
        setData(response.data);
      })
      .catch(() => {
        setError('결과를 불러오지 못했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [simulationId]);

  const handleTransContentChange = (index, value) => {
    setQaList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], transContent: value };
      return next;
    });
  };
  const handleSaveButtonClick = () => {
    setSaveConfirmOpen(true); // 모달 열기
  };

  const handleSaveConfirm = () => {
    const selected = qaList.filter((q, i) => isSelected(keyOf(i, q)));
    if (selected.length === 0) {
      openAlert('저장할 항목을 선택해주세요.');
      setSaveConfirmOpen(false);
      return;
    }
    const body = {
      qaList: selected.map((q) => ({
        qaId: q.qaId,
        transContent: (q.transContent ?? '').trim(),
      })),
    };
    setSaving(true);
    putSimulationFinalize(simulationId, body)
      .then(() => {
        navigate('/myqa');
      })
      .catch((e) => {
        openAlert('저장에 실패했습니다.');
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleCancelClick = () => navigate('/simulation/record');

  const openKeys = useMemo(() => (qaList.length ? ['q-0'] : []), [qaList.length]);

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        <SimResHeader>
          <Typography as='h1' size={7} weight='bold'>
            면접 연습 결과
          </Typography>
        </SimResHeader>

        {videoUrl && (
          <VideoPlayerWrapper>
            <video controls src={videoUrl}>
              Your browser does not support the video tag.
            </video>
          </VideoPlayerWrapper>
        )}
        {loading && <div style={{ padding: 24 }}>불러오는 중…</div>}
        {error && <div style={{ padding: 24, color: 'crimson' }}>{error}</div>}
        <SelectionBar>
          <Info>
            <InfoCircledIcon />
            <Typography as='span' size={3}>
              선택한 항목만 저장됩니다.{' '}
              <Typography
                as='span'
                style={{
                  color: theme.colors.primary[10],
                }}
              >
                ({selectedKeys.size} / {qaList.length})
              </Typography>
            </Typography>
          </Info>
          <SelActions>
            <MiniButton type='button' onClick={selectAll}>
              전체 선택
            </MiniButton>
            <MiniButton type='button' onClick={clearAll}>
              전체 해제
            </MiniButton>
          </SelActions>
        </SelectionBar>
        {!loading && !error && data && (
          <>
            <StyledAccordionRoot type='multiple' defaultValue={openKeys}>
              {qaList.map((qa, index) => (
                <StyledAccordionItem key={qa.qaId || index} value={`q-${index}`}>
                  <StyledAccordionHeader>
                    <RowLeft>
                      <SelCheckbox
                        checked={isSelected(keyOf(index, qa))}
                        onCheckedChange={() => toggleOne(keyOf(index, qa))}
                        aria-label={`Q${index + 1} 선택`}
                      >
                        <Checkbox.Indicator>
                          <CheckIcon />
                        </Checkbox.Indicator>
                      </SelCheckbox>
                      <StyledAccordionTrigger>
                        <TitleText>
                          <Typography as='h3' size={4} weight='bold'>
                            Q{index + 1}. {qa.qaQuestion}
                          </Typography>
                        </TitleText>
                      </StyledAccordionTrigger>
                    </RowLeft>

                    <CaretIcon aria-hidden />
                  </StyledAccordionHeader>
                  <StyledAccordionContent>
                    <AnswerContainer>
                      <AnswerLabel>기존 답변</AnswerLabel>
                      <AnswerTextWrapper>
                        <Typography
                          as='p'
                          size={3}
                          style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
                        >
                          {qa.qaAnswer || '—'}
                        </Typography>
                      </AnswerTextWrapper>

                      <AnswerLabel>
                        새로운 답변 <SmallHint>(마지막 면접 연습에서 내가 했던 답변)</SmallHint>
                      </AnswerLabel>
                      <SelectedHint $on={isSelected(keyOf(index, qa))}>
                        {isSelected(keyOf(index, qa))
                          ? '이 항목은 저장됩니다'
                          : '이 항목은 저장되지 않습니다'}
                      </SelectedHint>
                      <EditableTextArea
                        value={qa.transContent ?? ''}
                        placeholder='STT로 인식된 답변을 필요에 맞게 수정하세요.'
                        onChange={(e) => handleTransContentChange(index, e.target.value)}
                        rows={6}
                        maxLength={500}
                      />
                      <CharCount>{(qa.transContent?.length ?? 0).toLocaleString()}/500자</CharCount>
                      {/* 여기에 피드백 좋았던점 아쉬웠던점 추천 답변을 대입 */}
                      {(qa.feedback ?? '').trim().length > 0 ? (
                        <FeedbackBox>
                          <Typography as='h4' size={3} weight='semiBold'>
                            AI 피드백
                          </Typography>
                          <AnswerTextWrapper style={{ marginTop: 8 }}>
                            <Typography
                              as='p'
                              size={3}
                              style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
                            >
                              {qa.feedback}
                            </Typography>
                          </AnswerTextWrapper>
                        </FeedbackBox>
                      ) : null}
                    </AnswerContainer>
                  </StyledAccordionContent>
                </StyledAccordionItem>
              ))}
            </StyledAccordionRoot>

            <ButtonGroup>
              <CancelButton onClick={handleCancelClick}>나가기</CancelButton>
              <SaveButton onClick={handleSaveButtonClick} disabled={saving}>
                {saving ? '저장 중…' : '저장'}
              </SaveButton>
            </ButtonGroup>
          </>
        )}
      </MainContentWrapper>
      <ConfirmDialog
        open={saveConfirmOpen}
        onOpenChange={setSaveConfirmOpen}
        title='면접 결과 저장'
        messages={['저장하면 현재 나의 노트에 반영됩니다.', '저장하시겠어요?']}
        onConfirm={handleSaveConfirm}
      />
      <ErrorDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title='알림'
        message={alertMessage}
        confirmText='확인'
      />
    </PageContainer>
  );
}
/* ---------- styled-components ---------- */
const MainContentWrapper = styled.div`
  width: 90%;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;
const SimResHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;

const StyledAccordionRoot = styled(Accordion.Root)`
  width: 90%;
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
const StyledAccordionHeader = styled(Accordion.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[6]};
  gap: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
`;
const StyledAccordionTrigger = styled(Accordion.Trigger)`
  all: unset;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* ellipsis 허용 */
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[12]};
`;
const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  flex: 1;
  min-width: 0;
`;
const TitleText = styled.span`
  display: block;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const CaretIcon = styled(CaretDownIcon)`
  color: ${({ theme }) => theme.colors.gray[9]};
  flex: 0 0 auto;
  margin-left: ${({ theme }) => theme.space[2]};
  transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);
  [data-state='open'] & {
    transform: rotate(-180deg);
  }
`;
const SelCheckbox = styled(Checkbox.Root)`
  all: unset;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &[data-state='checked'] {
    background: ${({ theme }) => theme.colors.primary[9]};
    border-color: ${({ theme }) => theme.colors.primary[9]};
    color: #fff;
  }
`;
const SelectionBar = styled.div`
  width: 90%;
  margin: 0 auto ${({ theme }) => theme.space[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.gray[2]};
`;
const Info = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.gray[10]};
  svg {
    color: ${({ theme }) => theme.colors.primary[9]};
  }
`;
const SelActions = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.space[2]};
`;
const MiniButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  font-size: ${({ theme }) => theme.font.size[2]};
  &:hover {
    background: ${({ theme }) => theme.colors.gray[3]};
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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[6]};
`;

const AnswerLabel = styled(Typography).attrs({ as: 'h4', size: 3, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[10]};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;
const SmallHint = styled.span`
  font-weight: normal;
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[9]};
  margin-left: ${({ theme }) => theme.space[2]};
`;
const AnswerTextWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  max-height: 200px;
  overflow-y: auto;
`;
const EditableTextArea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.font.size[3]};
  line-height: 1.6;
  resize: vertical;
  min-height: 120px;
  outline: none;
  &:focus {
    background: ${({ theme }) => theme.colors.gray[1]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[5]}40;
  }
`;
const SelectedHint = styled.div`
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[2]};
  background: ${({ $on, theme }) => ($on ? theme.colors.primary[3] : theme.colors.gray[3])};
  color: ${({ $on, theme }) => ($on ? theme.colors.primary[11] : theme.colors.gray[10])};
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

const CharCount = styled.div`
  align-self: flex-end;
  color: ${({ theme }) => theme.colors.gray[9]};
  font-size: ${({ theme }) => theme.font.size[2]};
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
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
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
const FeedbackBox = styled.div`
  margin-top: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.gray[1]};
  padding: ${({ theme }) => theme.space[4]};
`;

const Section = styled.div`
  margin-top: ${({ theme }) => theme.space[3]};
`;

const List = styled.ul`
  margin-top: ${({ theme }) => theme.space[2]};
  padding-left: 1rem;
  display: grid;
  gap: 4px;
`;

const Empty = styled.span`
  color: ${({ theme }) => theme.colors.gray[8]};
`;

const Suggested = styled.div`
  margin-top: ${({ theme }) => theme.space[2]};
  white-space: pre-wrap;
  background: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[3]};
`;
