import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import { interviewers } from '@pages/List/Interviewers';
import { myQaList } from '@pages/List/MyQaList';
import { CaretDownIcon, CheckIcon } from '@radix-ui/react-icons';
import * as RadioGroup from '@radix-ui/react-radio-group';
import * as Select from '@radix-ui/react-select';
import * as Tabs from '@radix-ui/react-tabs';
import React from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// --- [스타일 정의] ---

const MainContentWrapper = styled.div`
  width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

const PresetForm = styled.form`
  // max-width: 800px;
  margin: 0 auto;
`;

// 1. 상단 탭 (시뮬레이션 / 연습기록)
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
  font-size: ${({ theme }) => theme.font.size[6]}; /* 25px */
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

// 2. 설정 섹션 (라디오 버튼)
// 💡 [수정] ConfigSection이 라디오 그룹을 감싸도록 변경
const ConfigSection = styled.section`
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

// 💡 [수정] StyledRadioGroup가 Controller의 props를 직접 받도록 함
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

// 3. 💡 [신규] 드롭다운(Select) 섹션 스타일
const SelectConfigSection = styled.div`
  display: flex;
  flex-direction: column; /* 레이블과 드롭다운을 수직으로 배치 */
  gap: ${({ theme }) => theme.space[3]};
  margin-top: ${({ theme }) => theme.space[8]};
`;

const StyledSelectTrigger = styled(Select.Trigger)`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[4]}; /* 16px */
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[2]};
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
`;

const StyledSelectViewport = styled(Select.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
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
  max-width: 100px;
  display: block;
  margin: ${({ theme }) => theme.space[10]} auto 0;
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

// --- [컴포넌트 로직] ---

export default function SimulationPresetPage() {
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      interviewMode: 'one-on-one',
      questionOrder: 'sequential',
      selectedSetId: 1,
      selectedInterviewerId: 'interviewer1',
    },
  });
  const { control, handleSubmit } = methods;

  const onSubmit = (data) => {
    console.log('시뮬레이션 설정 완료:', data);
    // navigate('/simulation/start', { state: data });
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        {/* 1. 상단 탭 (Radix Tabs) */}
        <StyledTabsRoot defaultValue='/simulation' onValueChange={(value) => navigate(value)}>
          <StyledTabsList>
            <StyledTabsTrigger value='/simulation'>면접 시뮬레이션</StyledTabsTrigger>
            <StyledTabsTrigger value='/simulation/record'>면접 연습기록</StyledTabsTrigger>
          </StyledTabsList>
        </StyledTabsRoot>

        {/* 2. 설정 폼 (react-hook-form) */}
        <FormProvider {...methods}>
          <PresetForm onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name='interviewMode'
              control={control}
              render={({ field }) => (
                <ConfigSection>
                  <ConfigLabel>면접 모드</ConfigLabel>
                  <StyledRadioGroup value={field.value} onValueChange={field.onChange}>
                    <RadioOption>
                      <StyledRadioItem value='one-on-one' id='r1' />
                      일대일
                    </RadioOption>
                    <RadioOption>
                      <StyledRadioItem value='multi' id='r2' />
                      다대다
                    </RadioOption>
                  </StyledRadioGroup>
                </ConfigSection>
              )}
            />

            <Controller
              name='questionOrder'
              control={control}
              render={({ field }) => (
                <ConfigSection>
                  <ConfigLabel>질문 순서</ConfigLabel>
                  <StyledRadioGroup value={field.value} onValueChange={field.onChange}>
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

            {/* 2.3 드롭다운 (질문답변 세트) */}
            <SelectConfigSection>
              <ConfigLabel>질문답변 세트 선택</ConfigLabel>
              <Controller
                name='selectedSetId'
                control={control}
                render={({ field }) => {
                  const selectedSet = myQaList.find((set) => set.postId === Number(field.value));

                  return (
                    <Select.Root value={field.value} onValueChange={field.onChange}>
                      <StyledSelectTrigger>
                        {selectedSet ? (
                          <ItemContent>
                            <Typography size={3} weight='semiBold'>
                              {selectedSet.title}
                            </Typography>
                            {selectedSet.job.map((jobName) => (
                              <JobChip key={jobName}>{jobName}</JobChip>
                            ))}
                          </ItemContent>
                        ) : (
                          <Select.Value placeholder='질문 세트를 선택하세요' />
                        )}
                        <Select.Icon asChild>
                          <CaretDownIcon style={{ marginLeft: 'auto' }} />
                        </Select.Icon>
                      </StyledSelectTrigger>
                      <Select.Portal>
                        <StyledSelectContent position='popper'>
                          <StyledSelectViewport>
                            {myQaList.map((set) => (
                              <StyledSelectItem key={set.postId} value={set.postId}>
                                <StyledSelectItemIndicator>
                                  <CheckIcon />
                                </StyledSelectItemIndicator>
                                <Select.ItemText>
                                  <ItemContent>
                                    <Typography size={3} weight='semiBold'>
                                      {set.title}
                                    </Typography>
                                    {set.job.map((jobName) => (
                                      <JobChip key={jobName}>{jobName}</JobChip>
                                    ))}
                                  </ItemContent>
                                </Select.ItemText>
                              </StyledSelectItem>
                            ))}
                          </StyledSelectViewport>
                        </StyledSelectContent>
                      </Select.Portal>
                    </Select.Root>
                  );
                }}
              />
            </SelectConfigSection>

            <SelectConfigSection>
              <ConfigLabel>면접관 선택</ConfigLabel>
              <Controller
                name='selectedInterviewerId'
                control={control}
                render={({ field }) => (
                  <Select.Root value={field.value} onValueChange={field.onChange}>
                    <StyledSelectTrigger>
                      <Select.Value placeholder='면접관을 선택하세요' />
                      <Select.Icon asChild>
                        <CaretDownIcon />
                      </Select.Icon>
                    </StyledSelectTrigger>
                    <Select.Portal>
                      <StyledSelectContent position='popper'>
                        <StyledSelectViewport>
                          {interviewers.map((interviewer) => (
                            <StyledSelectItem
                              key={interviewer.interviewer_id}
                              value={interviewer.interviewer_id}
                            >
                              <StyledSelectItemIndicator>
                                <CheckIcon />
                              </StyledSelectItemIndicator>
                              <Select.ItemText>{interviewer.character_desc}</Select.ItemText>
                            </StyledSelectItem>
                          ))}
                        </StyledSelectViewport>
                      </StyledSelectContent>
                    </Select.Portal>
                  </Select.Root>
                )}
              />
            </SelectConfigSection>

            {/* 5. 시작하기 버튼 */}
            <StartButton type='submit'>시작하기</StartButton>
          </PresetForm>
        </FormProvider>
      </MainContentWrapper>
    </PageContainer>
  );
}

const ItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
`;

const JobChip = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[3]};
  background-color: ${({ theme }) => theme.colors.primary[3]};
  color: ${({ theme }) => theme.colors.primary[12]};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-size: ${({ theme }) => theme.font.size[2]}; /* 14px */
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;
