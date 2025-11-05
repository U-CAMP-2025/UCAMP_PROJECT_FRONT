import { createPost } from '@api/postAPIS';
import { JobSelector } from '@components/common/JobSelector';
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import * as Accordion from '@radix-ui/react-accordion';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import React from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { QACreateInput } from './QaCreateInput';

export default function QACreatePage() {
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      jobIds: [],
      title: '',
      summary: '',
      qaSets: [{ question: '', answer: '' }],
      status: 'Y',
    },
  });
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'qaSets',
  });

  const selectedJobIds = watch('jobIds');
  const onSubmit = (data) => {
    createPost(data)
      .then((response) => {
        navigate(`/qa/${response?.data}`);
      })
      .catch();
  };

  const status = watch('status');
  const handleStatusChange = (newStatus) => {
    setValue('status', newStatus);
  };

  // 💡 dnd-kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  ); // 💡 dnd-kit 드래그 종료 핸들러

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // useFieldArray의 'id' (item.id)를 기준으로 인덱스 찾기
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex); // 💡 react-hook-form의 'move' 함수 호출
      }
    }
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        <QaCreateHeader>
          <Typography as='h1' size={7} weight='bold'>
            새 질문답변 세트 만들기
          </Typography>
        </QaCreateHeader>
        <SettingsBox>
          <FormProvider {...methods}>
            <FormWrapper>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* 1. 직무 선택 */}
                <Section>
                  <SectionTitle>직무 선택 (최대 3개)</SectionTitle>
                  <JobSelector
                    value={selectedJobIds}
                    onChange={(newJobIds) =>
                      setValue('jobIds', newJobIds, { shouldValidate: true })
                    }
                  />
                  {errors.jobIds && <Typography color='error'>{errors.jobIds.message}</Typography>}
                </Section>
                {/* 2. 제목 */}
                <Section>
                  <SectionTitle>제목</SectionTitle>
                  <FormInput
                    placeholder='세트의 제목을 입력하세요'
                    {...register('title', { required: '제목은 필수 입력입니다.' })}
                  />
                  {errors.title && <Typography color='error'>{errors.title.message}</Typography>}
                </Section>
                {/* 3. 세트 요약 */}
                <Section>
                  <SectionTitle>세트 요약 (선택)</SectionTitle>
                  <FormTextAreaSummary
                    placeholder='이 질문답변 세트에 대한 간단한 설명을 입력하세요'
                    {...register('summary')}
                  />{' '}
                </Section>
                {/* 4. 질문답변 세트 목록 (dnd-kit 적용) */}{' '}
                <Section>
                  <SectionTitle>질문답변 세트</SectionTitle>
                  {/* 💡 DragDropContext 대신 DndContext 사용 */}{' '}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                  >
                    {/* 💡 Droppable 대신 SortableContext 사용 */}
                    <SortableContext
                      items={fields.map((field) => field.id)} // 💡 고유 ID 배열 전달
                      strategy={verticalListSortingStrategy}
                    >
                      {' '}
                      <Accordion.Root type='multiple'>
                        {' '}
                        <QASetListContainer>
                          {' '}
                          {fields.map((item, index) => (
                            // 💡 Draggable 대신 QACreateInput이 useSortable 훅을 사용
                            <QACreateInput
                              key={item.id}
                              id={item.id} // 💡 dnd-kit에 ID 전달
                              index={index}
                              onDelete={() =>
                                fields.length > 1
                                  ? remove(index)
                                  : alert('최소 1개의 질문 세트가 필요합니다.')
                              }
                            />
                          ))}{' '}
                        </QASetListContainer>{' '}
                      </Accordion.Root>
                    </SortableContext>
                  </DndContext>{' '}
                  <AddSetButton
                    type='button'
                    onClick={() =>
                      fields.length < 10
                        ? append({ question: '', answer: '' })
                        : alert('질문은 최대 10개까지 등록할 수 있습니다.')
                    }
                  >
                    <PlusIcon width={30} height={30} />{' '}
                  </AddSetButton>{' '}
                </Section>
                {/* 5. 공개 설정 및 저장 */}
                <FormFooter>
                  <CheckboxLabel htmlFor='status-public'>
                    <CheckboxRoot
                      id='status-public'
                      checked={status === 'Y'}
                      onCheckedChange={() => handleStatusChange('Y')}
                    >
                      <CheckboxIndicator>
                        <CheckIcon />
                      </CheckboxIndicator>
                    </CheckboxRoot>
                    공개
                  </CheckboxLabel>
                  <CheckboxLabel htmlFor='status-private'>
                    <CheckboxRoot
                      id='status-private'
                      checked={status === 'N'}
                      onCheckedChange={() => handleStatusChange('N')}
                    >
                      <CheckboxIndicator>
                        <CheckIcon />
                      </CheckboxIndicator>
                    </CheckboxRoot>
                    비공개
                  </CheckboxLabel>
                  <input type='hidden' {...register('status')} />
                  <SubmitButton type='submit' disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '저장'}
                  </SubmitButton>
                </FormFooter>
              </form>
            </FormWrapper>
          </FormProvider>
        </SettingsBox>
      </MainContentWrapper>
    </PageContainer>
  );
}

// --- 페이지 스타일 정의 ---
const MainContentWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  min-height: 80vh;
`;

const QaCreateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
  padding-bottom: ${({ theme }) => theme.space[4]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray[12]};
`;

const SettingsBox = styled.div`
  width: 90%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.gray[2]}; -
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
  margin-top: ${({ theme }) => theme.space[8]};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  & > * {
    margin-bottom: ${({ theme }) => theme.space[6]};
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const FormWrapper = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
`;
const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.space[10]};
`;
const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 5, weight: 'bold' })`
  margin-bottom: ${({ theme }) => theme.space[5]};
`;
const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size[3]};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[7]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[7]};
  }
`;
const FormTextAreaSummary = styled(FormInput).attrs({ as: 'textarea' })`
  min-height: 100px;
  resize: vertical;
`;
const QASetListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;
const AddSetButton = styled.button`
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  margin: ${({ theme }) => theme.space[6]} auto 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary[9]};
  cursor: pointer;
  color: white;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
`;

// Radix Checkbox 스타일
const CheckboxRoot = styled(CheckboxPrimitive.Root)`
  all: unset;
  background-color: white;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[3]};
  }
  &[data-state='checked'] {
    background-color: ${({ theme }) => theme.colors.primary[9]};
    border-color: ${({ theme }) => theme.colors.primary[9]};
  }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }
`;
const CheckboxIndicator = styled(CheckboxPrimitive.Indicator)`
  color: white;
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[11]};
  cursor: pointer;
  user-select: none;
`;
const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.space[4]};
  margin-top: ${({ theme }) => theme.space[8]}; /* 하단 여백 32px */
`;
const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[5]};
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[10]};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[5]};
    cursor: not-allowed;
  }
`;
