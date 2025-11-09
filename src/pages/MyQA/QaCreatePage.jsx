import { countPost, createPost } from '@api/postAPIS';
import { fetchUserPayment } from '@api/userAPIS';
import { JobSelector } from '@components/common/JobSelector';
import Typography from '@components/common/Typography';
import WarnDialog from '@components/common/WarnDialog';
import { PageContainer } from '@components/layout/PageContainer';
import {
  DndContext,
  DragOverlay,
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
import React, { useEffect, useState, useRef } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { QACreateInput } from './QaCreateInput';

export default function QACreatePage() {
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertOnClose, setAlertOnClose] = useState(null);
  const [isPaidUser, setIsPaidUser] = useState(false);

  const jobSectionRef = useRef(null);

  const methods = useForm({
    defaultValues: {
      jobIds: [],
      title: '',
      summary: '',
      qaSets: [{ question: '', answer: '' }],
      status: 'Y',
    },
    mode: 'onChange', // 입력 즉시 유효성 체크
  });

  const openAlert = (message, onClose) => {
    setAlertMessage(message);
    setAlertOnClose(() => onClose);
    setAlertOpen(true);
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  // --- 직무 선택 유효성 등록 ---
  useEffect(() => {
    register('jobIds', {
      validate: (value) => value.length > 0 || '직무를 최소 1개 이상 선택해야 합니다.',
    });
  }, [register]);

  // --- 노트 최대 생성 개수
  useEffect(() => {
    Promise.all([countPost(), fetchUserPayment()]).then(([countRes, userPaymentRes]) => {
      const paidStatusStr = userPaymentRes?.paidStatus;
      const isPaid = paidStatusStr === 'Y';

      setIsPaidUser(isPaid);

      const maxNoteCount = isPaid ? 21 : 9;

      if (countRes?.data >= maxNoteCount) {
        const userType = isPaid ? '플러스' : '일반';
        openAlert(
          `${userType} 회원은 면접 노트를 최대 ${maxNoteCount}개까지 작성할 수 있습니다.`,
          () => {
            navigate(-1);
          },
        );
      }
    });
  }, []);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'qaSets',
  });

  const [openItems, setOpenItems] = useState(['item-0']);
  const [activeId, setActiveId] = useState(null);

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
  const watchedQaSets = watch('qaSets');
  const onSubmit = (data) => {
    createPost(data)
      .then((response) => {
        navigate(`/qa/${response?.data}`);
      })
      .catch();
  };

  const onInvalid = (errors) => {
    if (errors.jobIds && jobSectionRef.current) {
      jobSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
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
  );

  const onDragStart = (event) => {
    const { active } = event;
    if (active?.id) {
      setActiveId(active.id);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        move(oldIndex, newIndex);
      }
    }

    setActiveId(null);
  };

  const onDragCancel = () => {
    setActiveId(null);
  };

  return (
    <PageContainer header footer>
      <MainContentWrapper>
        <QaCreateHeader>
          <Typography as='h1' size={7} weight='bold'>
            새 면접 노트 작성
          </Typography>
        </QaCreateHeader>
        <SettingsBox>
          <FormProvider {...methods}>
            <FormWrapper>
              <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                {/* 1. 직무 선택 */}
                <Section ref={jobSectionRef}>
                  <SectionTitle>관련 직무 선택 (최대 3개)</SectionTitle>
                  <JobSelector
                    value={selectedJobIds}
                    onChange={(newJobIds) =>
                      setValue('jobIds', newJobIds, { shouldValidate: true })
                    }
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

                {/* 2. 제목 */}
                <Section>
                  <SectionTitle>
                    <span>
                      제목<RequiredAsterisk>*</RequiredAsterisk>
                    </span>
                  </SectionTitle>
                  <FormInput
                    placeholder='면접 노트의 제목을 입력하세요.'
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

                {/* 3. 세트 요약 */}
                <Section>
                  <SectionTitle>
                    <span>노트 요약</span>
                    <OptionalText>(선택사항)</OptionalText>
                  </SectionTitle>
                  <FormTextAreaSummary
                    placeholder='노트에 대한 간단한 설명을 입력하세요.'
                    {...register('summary')}
                  />
                </Section>

                <Divider />

                {/* 4. 면접 노트 */}
                <Section>
                  <SectionTitle>
                    <span>면접 노트</span>
                    <OptionalText>최소 1개의 노트를 작성해야 합니다.</OptionalText>
                  </SectionTitle>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragCancel={onDragCancel}
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
                            <QACreateInput
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
                    <DragOverlay>
                      {activeId
                        ? (() => {
                            const activeIndex = fields.findIndex((field) => field.id === activeId);
                            if (activeIndex === -1) return null;

                            const activeQuestion =
                              watchedQaSets?.[activeIndex]?.question?.trim() ?? '';

                            return (
                              <OverlayWrapper>
                                <OverlayBadge>질문 {activeIndex + 1}</OverlayBadge>
                                <OverlayQuestion>{activeQuestion}</OverlayQuestion>
                              </OverlayWrapper>
                            );
                          })()
                        : null}
                    </DragOverlay>
                  </DndContext>
                  <AddSetButton type='button' onClick={handleAddSet}>
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
        onOpenChange={(open) => {
          setAlertOpen(open);
          if (!open && alertOnClose) {
            alertOnClose();
            setAlertOnClose(null);
          }
        }}
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
  background-color: ${({ theme }) => theme.colors.gray[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[8]};
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
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const SectionTitle = styled(Typography).attrs({ as: 'h2', size: 5, weight: 'bold' })`
  margin-bottom: ${({ theme }) => theme.space[5]};
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
  margin-top: ${({ theme }) => theme.space[8]};
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

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[5]};
  margin: ${({ theme }) => theme.space[10]} 0;
`;

const OverlayWrapper = styled.div`
  transform: none !important;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  border-radius: ${({ theme }) => theme.radius.sm};
  box-shadow: ${({ theme }) => theme.shadow.md};
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.colors.gray[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  min-width: 260px;
  max-width: 560px;
  box-sizing: border-box;
  pointer-events: none;
`;

const OverlayBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.font.size[1]};
  font-weight: ${({ theme }) => theme.font.weight.medium};
  color: ${({ theme }) => theme.colors.primary[11]};
  background-color: ${({ theme }) => theme.colors.primary[2]};
  width: fit-content;
`;

const OverlayQuestion = styled.div`
  font-size: ${({ theme }) => theme.font.size[3]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.gray[12]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
