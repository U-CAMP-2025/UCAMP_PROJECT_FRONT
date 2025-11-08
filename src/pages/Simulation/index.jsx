import { axiosInstance } from '@api/axios';
import { fetchSimulationRecords } from '@api/simulationAPIS';
import { fetchUserStatus, patchUserStaus } from '@api/userAPIS';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import { useAuthStore } from '@store/auth/useAuthStore';
import theme from '@styles/theme';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { Joyride } from 'react-joyride';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// --- [컴포넌트 로직] ---

export default function SimulationPresetPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [questionSets, setQuestionSets] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { isLogin } = useAuthStore();

  // ================== 면접 연습 가이드투어 ========================
  const [runSimTour, setRunSimTour] = useState(false);
  const SimTourSteps = [
    {
      target: '#tour-config-label-1',
      content: (
        <>
          <b style={{ fontSize: '20px' }}>면접 모드</b>
          <br />
          <br />
          등장할 면접관의 수를 결정합니다.
          <br />
          다대다 모드는 추후 추가됩니다.
        </>
      ),
      placement: 'right',
      disableBeacon: true,
    },
    {
      target: '#tour-config-label-2',
      content: (
        <>
          <b style={{ fontSize: '20px' }}>질문 순서</b>
          <br />
          <br />
          랜덤 선택 시, 선택한 노트 내 질문의 순서가 섞여 <br />
          면접 연습이 진행됩니다.
        </>
      ),
      placement: 'right',
    },
    {
      target: '#tour-sim-controller',
      content: (
        <>
          <b style={{ fontSize: '20px' }}>면접 노트 선택</b>
          <br />
          <br />
          연습을 진행할 노트를 선택해주세요!
        </>
      ),
      placement: 'bottom',
    },
    {
      target: '#tour-sim-start',
      content: (
        <>
          <b style={{ fontSize: '20px' }}>시작하기</b>
          <br />
          <br />
          클릭 시 면접 연습을 시작합니다.
          <br />
          면접관은 랜덤으로 배정됩니다.
        </>
      ),
      placement: 'right',
      hideBackButton: true,
    },
  ];

  useEffect(() => {
    if (isLogin) {
      const hasSeenHeaderTour = localStorage.getItem('seenHeaderTour') === 'true';
      const hasSeenQAListTour = localStorage.getItem('seenQAListTour') === 'true';
      const hasNotSeenSimTour = !localStorage.getItem('seenSimTour');

      if (hasSeenHeaderTour && hasSeenQAListTour && hasNotSeenSimTour) {
        Promise.all([fetchUserStatus(), fetchSimulationRecords()])
          .then(([statusRes, recordsRes]) => {
            const isNewUser = statusRes?.status === 'NEW';
            const recordCount = recordsRes?.data?.length ?? 0;

            if (isNewUser && recordCount === 0) {
              setTimeout(() => {
                setRunSimTour(true);
              }, 500);
            }
          })
          .catch((err) => {
            console.error('튜토리얼 조건 확인 중 오류: ', err);
          });
      }
    }
  }, [isLogin]);

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status) || action === 'close') {
      setRunSimTour(false);
      localStorage.setItem('seenSimTour', 'true');

      patchUserStaus('ACTIVE')
        .then(() => {
          console.log('최종 튜토리얼 완료: 유저 상태 active 업데이트');
          localStorage.removeItem('seenHeaderTour');
          localStorage.removeItem('seenQAListTour');
          localStorage.removeItem('seenSimTour');
        })
        .catch((err) => {
          console.error('유저 상태 업데이트 실패: ', err);
        });
    }
  };
  // ================== 가이드투어 종료 =========================

  const methods = useForm({
    defaultValues: {
      interviewMode: 'one-on-one', // UI만 사용 (백엔드 미사용)
      questionOrder: 'sequential', // 'sequential' | 'random' -> N/Y 매핑
      selectedSetId: '', // Radix Select 특성상 string 권장
      selectedInterviewerId: '',
    },
  });

  const { control, handleSubmit, reset, watch } = methods;

  const selectedSetId = watch('selectedSetId');
  const selectedSet = useMemo(
    () => questionSets.find((s) => String(s.postId) === String(selectedSetId)),
    [questionSets, selectedSetId],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [interviewerResp, setsResp] = await Promise.all([
          axiosInstance.get('/interviewers'),
          axiosInstance.get('/simulation'),
        ]);

        const fetchedInterviewers = interviewerResp?.data?.data ?? [];
        const fetchedSets = setsResp?.data?.data ?? [];

        if (!mounted) return;

        setInterviewers(fetchedInterviewers);
        setQuestionSets(fetchedSets);

        // 기본값 자동 세팅
        const firstSetId = fetchedSets[0]?.postId ? String(fetchedSets[0].postId) : '';
        const firstInterviewerId = fetchedInterviewers[0]?.interviewerId
          ? String(fetchedInterviewers[0].interviewerId)
          : '';

        reset((prev) => ({
          ...prev,
          selectedSetId: firstSetId,
          selectedInterviewerId: firstInterviewerId,
        }));
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [reset]);

  const onSubmit = async (formData) => {
    // UI -> 백엔드 파라미터 매핑
    const simulationRandom = formData.questionOrder === 'random' ? 'Y' : 'N';
    const postId = Number(formData.selectedSetId) || formData.selectedSetId;
    // const interviewerId = Number(formData.selectedInterviewerId) || formData.selectedInterviewerId;
    const interviewerId = Math.floor(Math.random() * 6) + 1;

    setSubmitting(true);
    try {
      const resp = await axiosInstance.post('/simulation', {
        simulationRandom,
        post: { postId },
        interviewer: { interviewerId },
      });
      const simulationId = resp?.data?.data?.simulationId;
      if (simulationId) {
        console.log(simulationId);
        navigate(`/simulation/${simulationId}/start`);
      } else {
        console.warn('simulationId가 응답에 없습니다.', resp?.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        {/* 상단 탭 */}
        <StyledTabsRoot defaultValue='/simulation' onValueChange={(value) => navigate(value)}>
          <StyledTabsList>
            <StyledTabsTrigger value='/simulation'>면접 연습 시작</StyledTabsTrigger>
            <StyledTabsTrigger value='/simulation/record'>면접 연습 기록</StyledTabsTrigger>
          </StyledTabsList>
        </StyledTabsRoot>

        {/* 설정 폼 */}
        <FormProvider {...methods}>
          <PresetForm onSubmit={handleSubmit(onSubmit)}>
            {/* 면접 모드 (UI만) */}
            <SettingsBox>
              <Controller
                name='interviewMode'
                control={control}
                render={({ field }) => (
                  <ConfigSection>
                    <ConfigLabel>면접 모드</ConfigLabel>
                    <StyledRadioGroup
                      id='tour-config-label-1'
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <RadioOption>
                        <StyledRadioItem value='one-on-one' id='r1' />
                        일대일
                      </RadioOption>
                      <RadioOption>
                        <StyledRadioItem value='multi' id='r2' disabled />
                        다대다 (준비중)
                      </RadioOption>
                    </StyledRadioGroup>
                  </ConfigSection>
                )}
              />

              {/* 질문 순서 */}
              <Controller
                name='questionOrder'
                control={control}
                render={({ field }) => (
                  <ConfigSection>
                    <ConfigLabel>질문 순서</ConfigLabel>
                    <StyledRadioGroup
                      id='tour-config-label-2'
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <RadioOption>
                        <StyledRadioItem value='sequential' id='r3' />
                        순차적으로
                      </RadioOption>
                      <RadioOption>
                        <StyledRadioItem value='random' id='r4' />
                        랜덤
                      </RadioOption>
                    </StyledRadioGroup>
                  </ConfigSection>
                )}
              />

              {/* 질문답변 세트 */}
              <SelectConfigSection>
                <ConfigLabel>면접 노트 선택</ConfigLabel>
                <Controller
                  name='selectedSetId'
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <StyledSelectTrigger id='tour-sim-controller'>
                        {selectedSet ? (
                          <ItemContent>
                            <Typography size={3} weight='semiBold'>
                              {selectedSet.title}
                            </Typography>
                            {Array.isArray(selectedSet.job) ? (
                              selectedSet.job.map((j) => <JobChip key={j}>{j}</JobChip>)
                            ) : selectedSet.job ? (
                              <JobChip>{selectedSet.job}</JobChip>
                            ) : null}
                          </ItemContent>
                        ) : (
                          <Select.Value
                            placeholder={loading ? '불러오는 중…' : '면접 노트를 선택하세요'}
                          />
                        )}
                        <Select.Icon asChild>
                          <CaretDownIcon style={{ marginLeft: 'auto' }} />
                        </Select.Icon>
                      </StyledSelectTrigger>
                      <Select.Portal>
                        <StyledSelectContent position='popper'>
                          <StyledSelectViewport>
                            {questionSets.map((set) => {
                              const value = String(set.postId);
                              return (
                                <StyledSelectItem key={value} value={value}>
                                  <StyledSelectItemIndicator>
                                    <CheckIcon />
                                  </StyledSelectItemIndicator>
                                  <Select.ItemText>
                                    <ItemContent>
                                      <Typography size={3} weight='semiBold'>
                                        {set.title}
                                      </Typography>
                                      {Array.isArray(set.job) ? (
                                        set.job.map((j) => <JobChip key={j}>{j}</JobChip>)
                                      ) : set.job ? (
                                        <JobChip>{set.job}</JobChip>
                                      ) : null}
                                    </ItemContent>
                                  </Select.ItemText>
                                </StyledSelectItem>
                              );
                            })}
                          </StyledSelectViewport>
                        </StyledSelectContent>
                      </Select.Portal>
                    </Select.Root>
                  )}
                />
              </SelectConfigSection>

              {/* 면접관 선택 */}
              {/* <SelectConfigSection>
                <ConfigLabel>면접관 선택</ConfigLabel>
                <Controller
                  name='selectedInterviewerId'
                  control={control}
                  render={({ field }) => (
                    <Select.Root
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={loading}
                    >
                      <StyledSelectTrigger>
                        <Select.Value
                          placeholder={loading ? '불러오는 중…' : '면접관을 선택하세요'}
                        />
                        <Select.Icon asChild>
                          <CaretDownIcon />
                        </Select.Icon>
                      </StyledSelectTrigger>
                      <Select.Portal>
                        <StyledSelectContent position='popper'>
                          <StyledSelectViewport>
                            {interviewers.map((v) => {
                              const value = String(v.interviewerId);
                              return (
                                <StyledSelectItem key={value} value={value}>
                                  <StyledSelectItemIndicator>
                                    <CheckIcon />
                                  </StyledSelectItemIndicator>
                                  <Select.ItemText>{v.interviewerCharacterDesc}</Select.ItemText>
                                </StyledSelectItem>
                              );
                            })}
                          </StyledSelectViewport>
                        </StyledSelectContent>
                      </Select.Portal>
                    </Select.Root>
                  )}
                />
              </SelectConfigSection> */}

              {/* 시작하기 */}
              <StartButtonContainer>
                <Typography
                  size={3}
                  color='gray.9'
                  style={{ textAlign: 'center', whiteSpace: 'nowrap' }}
                >
                  AI 면접관은 랜덤으로 배정됩니다.
                </Typography>
                <StartButton id='tour-sim-start' type='submit' disabled={loading || submitting}>
                  {submitting ? '시작 중…' : '시작하기'}
                </StartButton>
              </StartButtonContainer>
            </SettingsBox>
          </PresetForm>
        </FormProvider>
      </MainContentWrapper>
      <Joyride
        steps={SimTourSteps}
        run={runSimTour}
        callback={handleJoyrideCallback}
        continuous={true}
        showProgress={false}
        showSkipButton={true}
        locale={{
          next: '다음',
          back: '이전',
          skip: '건너뛰기',
          last: '확인',
        }}
        scrollOffset={200}
        styles={{
          options: {
            primaryColor: theme.colors.primary[9],
            textColor: theme.colors.gray[12],
            backgroundColor: theme.colors.gray[1],
            arrowColor: theme.colors.gray[1],
          },
        }}
      />
    </PageContainer>
  );
}

// --- [스타일 정의] ---

const MainContentWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
  // padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

const PresetForm = styled.form`
  margin: 0 auto;
`;

const SettingsBox = styled.div`
  width: 90%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[6]} ${({ theme }) => theme.space[8]};
  margin-top: ${({ theme }) => theme.space[8]};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  /* 박스 내부의 섹션 간 간격 */
  & > * {
    margin-bottom: ${({ theme }) => theme.space[6]};
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// 1. 상단 탭
const StyledTabsRoot = styled(Tabs.Root)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const StyledTabsList = styled(Tabs.List)`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[5]};
`;

const StyledTabsTrigger = styled(Tabs.Trigger)`
  all: unset;
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[6]};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  cursor: pointer;
  position: relative;

  &[data-state='active'] {
    color: ${({ theme }) => theme.colors.primary[9]};
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 3px;
      background-color: ${({ theme }) => theme.colors.primary[9]};
    }
  }
`;

// 2. 설정 섹션
const ConfigSection = styled.section`
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[8]};
  padding: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[4]};
`;

const ConfigLabel = styled(Typography).attrs({ size: 4, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[12]};
  min-width: 100px;
`;

const StyledRadioGroup = styled(RadioGroup.Root)`
  display: flex;
  gap: ${({ theme }) => theme.space[6]};
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[11]};
  cursor: pointer;
`;

const StyledRadioItem = styled(RadioGroup.Item)`
  all: unset;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  background-color: white;

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }

  &[data-state='checked'] {
    border-color: ${({ theme }) => theme.colors.primary[9]};
    background-color: ${({ theme }) => theme.colors.primary[9]};
    position: relative;
    &::after {
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

// 3. 드롭다운
const SelectConfigSection = styled.div`
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[8]};
`;

const StyledSelectTrigger = styled(Select.Trigger)`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]};
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  min-height: 40px;
  &:hover {
    cursor: pointer;
  }
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[7]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[7]};
  }
  &[data-placeholder] {
    color: ${({ theme }) => theme.colors.gray[9]};
  }
`;

const StyledSelectContent = styled(Select.Content)`
  overflow: hidden;
  background-color: white;
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: 101;
  width: var(--radix-select-trigger-width);
  max-height: 320px;
`;

const StyledSelectViewport = styled(Select.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[1]};
  max-height: 200px; /* ⬅️ 리스트 높이 제한 */
  overflow-y: auto; /* ⬅️ 세로 스크롤 */
`;
const StyledSelectItem = styled(Select.Item)`
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  border-radius: ${({ theme }) => theme.radius.sm};
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[4]};
  padding-left: ${({ theme }) => theme.space[6]};
  position: relative;
  user-select: none;
  cursor: pointer;

  &[data-highlighted] {
    background-color: ${({ theme }) => theme.colors.primary[4]};
    color: ${({ theme }) => theme.colors.primary[12]};
    outline: none;
  }
`;

const StyledSelectItemIndicator = styled(Select.ItemIndicator)`
  position: absolute;
  left: ${({ theme }) => theme.space[2]};
  width: ${({ theme }) => theme.space[4]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[9]};
`;

// 4. 시작하기 버튼
const StartButton = styled.button`
  all: unset;
  width: 100%;
  max-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  // margin: ${({ theme }) => theme.space[10]} auto 0;
  padding: ${({ theme }) => theme.space[3]} 0;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 보조 UI
const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  flex-wrap: wrap;
`;

const JobChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[12]};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

const StartButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
  margin: ${({ theme }) => theme.space[10]} auto 0;
  width: 100%;
  max-width: 120px;
`;
