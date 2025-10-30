import { JobSelector } from '@components/common/JobSelector';
// JobSelector 임포트
import Typography from '@components/common/Typography';
import { PageContainer } from '@components/layout/PageContainer';
// QASetInputItem 임포트
import * as Accordion from '@radix-ui/react-accordion';
// Accordion Root 사용
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
// Radix Checkbox 사용
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { QACreateInput } from './QaCreateInput';

// --- 페이지 스타일 정의 ---

const FormWrapper = styled.div`
  padding: ${({ theme }) => theme.space[8]} ${({ theme }) => theme.space[6]};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.space[10]}; /* 섹션 간 간격 40px */
`;

const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 5, weight: 'bold' })`
  margin-bottom: ${({ theme }) => theme.space[5]}; /* 제목 아래 여백 20px */
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
  gap: ${({ theme }) => theme.space[4]}; /* 아이템 간 간격 16px */
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
// --- 스타일 정의 끝 ---

export default function QACreatePage() {
  const navigate = useNavigate();
  // react-hook-form 설정 (FormProvider 사용)
  const methods = useForm({
    defaultValues: {
      jobIds: [],
      title: '',
      summary: '',
      qaSets: [{ question: '', answer: '' }], // 기본 1개 세트
      status: 'N', // 기본 비공개
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

  // useFieldArray 설정
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'qaSets',
  });

  // JobSelector 상태 관리
  const selectedJobIds = watch('jobIds'); // jobIds 필드 watch

  const onSubmit = (data) => {
    console.log('Form Data Submitted:', data);
    // 실제 API 호출 로직
    // 예: await api.post('/qa', data);
    // 성공 시 페이지 이동
    // navigate('/my-qa');
  };

  // 공개/비공개 상태 처리
  const status = watch('status');
  const handleStatusChange = (newStatus) => {
    setValue('status', newStatus);
  };

  // 드래그 앤 드롭 핸들러 (라이브러리 필요)
  // const onDragEnd = (result) => {
  //     if (!result.destination) return;
  //     move(result.source.index, result.destination.index);
  // };

  return (
    <PageContainer header footer>
      {/* FormProvider로 전체 폼 감싸기 */}
      <FormProvider {...methods}>
        <FormWrapper>
          <Typography as='h1' size={7} weight='bold' style={{ marginBottom: '40px' }}>
            새 질문답변 세트 만들기
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 1. 직무 선택 */}
            <Section>
              <SectionTitle>직무 선택 (최대 3개)</SectionTitle>
              <JobSelector
                value={selectedJobIds}
                // setValue를 사용하여 react-hook-form 상태 업데이트
                onChange={(newJobIds) => setValue('jobIds', newJobIds, { shouldValidate: true })}
              />
              {/* react-hook-form validation (옵션) */}
              {/* <input type="hidden" {...register('jobIds', { required: '직무를 선택해주세요.'})} /> */}
              {errors.jobIds && <Typography color='error'>{errors.jobIds.message}</Typography>}
            </Section>

            {/* 2. 제목 */}
            <Section>
              <SectionTitle>제목</SectionTitle>
              <FormInput
                placeholder='세트의 제목을 입력하세요'
                {...register('title', { required: '제목은 필수 입력 항목입니다.' })}
              />
              {errors.title && <Typography color='error'>{errors.title.message}</Typography>}
            </Section>

            {/* 3. 세트 요약 */}
            <Section>
              <SectionTitle>세트 요약 (선택)</SectionTitle>
              <FormTextAreaSummary
                placeholder='이 질문답변 세트에 대한 간단한 설명을 입력하세요'
                {...register('summary')}
              />
            </Section>

            {/* 4. 질문답변 세트 목록 */}
            <Section>
              <SectionTitle>질문답변 세트</SectionTitle>
              {/* Accordion Root로 QACreateInput 목록 감싸기 */}
              <Accordion.Root type='multiple' /* 여러 개 열 수 있도록 multiple */>
                <QASetListContainer>
                  {/* DragDropContext 필요 */}
                  {/* <DragDropContext onDragEnd={onDragEnd}> */}
                  {/* <Droppable droppableId="qaSetsList"> */}
                  {/* {(provided) => ( */}
                  {/* <div {...provided.droppableProps} ref={provided.innerRef}> */}
                  {fields.map((item, index) => (
                    // Draggable 필요
                    // <Draggable key={item.id} draggableId={item.id} index={index}>
                    //   {(provided) => (
                    //     <div ref={provided.innerRef} {...provided.draggableProps}>
                    <QACreateInput
                      key={item.id} // react-hook-form의 id 사용
                      index={index}
                      onDelete={() =>
                        fields.length > 1
                          ? remove(index)
                          : alert('최소 1개의 질문 세트가 필요합니다.')
                      }
                      // dragHandleProps={provided.dragHandleProps} // DnD 핸들 props 전달
                    />
                    //     </div>
                    //   )}
                    // </Draggable>
                  ))}
                  {/* {provided.placeholder} */}
                  {/* </div> */}
                  {/* )} */}
                  {/* </Droppable> */}
                  {/* </DragDropContext> */}
                </QASetListContainer>
              </Accordion.Root>

              <AddSetButton type='button' onClick={() => append({ question: '', answer: '' })}>
                <PlusIcon width={30} height={30} />
              </AddSetButton>
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
              {/* 숨겨진 input으로 status 값 전달 */}
              <input type='hidden' {...register('status')} />

              <SubmitButton type='submit' disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : '저장'}
              </SubmitButton>
            </FormFooter>
          </form>
        </FormWrapper>
      </FormProvider>
    </PageContainer>
  );
}
