import { createPost, editPost, getPost } from '@api/postAPIS';
import { JobSelector } from '@components/common/JobSelector';
import Typography from '@components/common/Typography';
import WarnDialog from '@components/common/WarnDialog';
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
import { Settings } from '@elevenlabs/elevenlabs-js/api/resources/voices/resources/settings/client/Client';
import * as Accordion from '@radix-ui/react-accordion';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { QAUpdateInput } from './QaUpdateInput';

export default function QAUpdatePage() {
  const location = useLocation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { qaId } = location.state || {};
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      jobIds: [1, 4, 6], // 기본값
      title: '',
      summary: '',
      qaSets: [{ question: '', answer: '' }],
      status: 'Y',
    },
    mode: 'onChange', // 필드가 변경될 때 유효성 검사 수행
  });
  const openAlert = (message) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };
  const { reset } = methods;

  useEffect(() => {
    getPost(qaId)
      .then((resp) => {
        const data = resp?.data ?? null;
        reset({
          jobIds: data.jobIds,
          title: data.title,
          summary: data.description,
          qaSets: [...data.qa],
          status: data.public ? 'Y' : 'N',
        });
      })
      .catch();
  }, [qaId]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    register('jobIds', {
      validate: (value) => value.length > 0 || '직무를 최소 1개 이상 선택해야 합니다.',
    });
  }, [register]);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'qaSets',
  });

  const [openItems, setOpenItems] = useState(['item-0']);

  const handleAddSet = () => {
    if (fields.length >= 10) {
      openAlert('질문은 최대 10개까지 등록할 수 있습니다.');
      return;
    }
    const newIndex = fields.length;

    append({ question: '', answer: '' });
    setOpenItems((prevOpenItems) => [...prevOpenItems, `item-${newIndex}`]);
  };

  const selectedJobIds = watch('jobIds');

  const onSubmit = (data) => {
    // 직무가 1개 이상 선택되어 있을 때만 저장 가능
    if (data.jobIds.length === 0) {
      return; // 직무가 선택되지 않았다면 아무 작업도 하지 않음
    }

    editPost(qaId, data)
      .then((response) => {
        navigate(`/qa/${response?.data}`);
      })
      .catch();
  };

  const status = watch('status');
  const handleStatusChange = (newStatus) => {
    setValue('status', newStatus);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        <QaUpdateHeader>
          <Typography as='h1' size={7} weight='bold'>
            면접 노트 수정
          </Typography>
        </QaUpdateHeader>
        <SettingsBox>
          <FormProvider {...methods}>
            <FormWrapper>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* 직무 선택 (최소 1개 선택 필수) */}
                <Section>
                  <SectionTitle>직무 선택 (최대 3개)</SectionTitle>
                  <JobSelector
                    value={selectedJobIds}
                    onChange={(newJobIds) => {
                      setValue('jobIds', newJobIds, { shouldValidate: true });
                    }}
                  />
                  {errors.jobIds && (
                    <span
                      style={{ color: 'red', fontSize: '14px', marginTop: '8px', display: 'block' }}
                    >
                      {errors.jobIds.message}
                    </span>
                  )}
                </Section>
                <Divider />

                {/* 제목 */}
                <Section>
                  <SectionTitle>
                    <span>
                      제목<RequiredAsterisk>*</RequiredAsterisk>
                    </span>
                  </SectionTitle>
                  <FormInput
                    placeholder='노트의 제목을 입력하세요.'
                    {...register('title', { required: '제목은 필수 입력입니다.' })}
                  />
                  {errors.title && (
                    <span
                      style={{ color: 'red', fontSize: '14px', marginTop: '8px', display: 'block' }}
                    >
                      {errors.title.message}
                    </span>
                  )}
                </Section>

                {/* 세트 요약 */}
                <Section>
                  <SectionTitle>
                    <span>노트 요약</span>
                    <OptionalText>(선택사항)</OptionalText>
                  </SectionTitle>
                  <FormTextAreaSummary
                    placeholder='이 면접 노트에 대한 간단한 설명을 입력하세요.'
                    {...register('summary')}
                  />
                </Section>
                <Divider />

                {/* 질문답변 세트 목록 */}
                <Section>
                  <SectionTitle>
                    <span>면접 노트</span>
                    <OptionalText>최소 1개의 노트를 작성해야 합니다.</OptionalText>
                  </SectionTitle>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                  >
                    <SortableContext
                      items={fields.map((field) => field.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <Accordion.Root
                        type='multiple'
                        value={openItems}
                        onValueChange={setOpenItems}
                      >
                        <QASetListContainer>
                          {fields.map((item, index) => (
                            <QAUpdateInput
                              key={item.id}
                              id={item.id}
                              index={index}
                              onDelete={() =>
                                fields.length > 1
                                  ? remove(index)
                                  : openAlert('최소 1개의 질문 세트가 필요합니다.')
                              }
                            />
                          ))}
                        </QASetListContainer>
                      </Accordion.Root>
                    </SortableContext>
                  </DndContext>
                  <AddSetButton type='button' onClick={handleAddSet}>
                    <PlusIcon width={30} height={30} />
                  </AddSetButton>
                </Section>

                {/* 공개 설정 및 저장 */}
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
      <WarnDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title='알림'
        message={alertMessage}
        confirmText='확인'
      />
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

const QaUpdateHeader = styled.div`
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
  background-color: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[8]}
    ${({ theme }) => theme.space[6]};
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
  min-height: auto;
  resize: none;
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
const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.primary[9]};
  font-size: ${({ theme }) => theme.font.size[5]};
  margin-left: 4px;
`;
const OptionalText = styled.span`
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  color: ${({ theme }) => theme.colors.gray[9]};
  margin-left: 8px;
`;
const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[5]};
  margin: ${({ theme }) => theme.space[10]} 0; /* 👈 섹션 간 여백 (40px) */
`;
