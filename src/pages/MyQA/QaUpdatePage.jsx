import { editPost, getPost } from '@api/postAPIS';
import { JobSelector } from '@components/common/JobSelector';
import Typography from '@components/common/Typography';
import WarnDialog from '@components/common/WarnDialog';
import { PageContainer } from '@components/layout/PageContainer';
import * as C from '@components/qaset/QACreateStyle';
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
import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { QAUpdateInput } from './QaUpdateInput';

export default function QAUpdatePage() {
  const location = useLocation();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertOnClose, setAlertOnClose] = useState(null);
  const jobSectionRef = useRef(null);

  const { qaId } = location.state || {};
  const navigate = useNavigate();
  const methods = useForm({
    defaultValues: {
      jobIds: [], // 기본값
      title: '',
      summary: '',
      qaSets: [{ question: '', answer: '' }],
      status: 'Y',
    },
    mode: 'onSubmit', // 필드가 변경될 때 유효성 검사 수행
  });
  const openAlert = (message, onClose) => {
    setAlertMessage(message);
    setAlertOnClose(() => onClose);
    setAlertOpen(true);
  };

  const handleNavigateBack = () => {
    setAlertOpen(false);
    navigate(-1);
  };
  const { reset } = methods;
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    getPost(qaId)
      .then((resp) => {
        const data = resp?.data ?? null;
        if (!data.payment) {
          openAlert('스크랩해온 글은 플러스 유저만 수정이 가능합니다.', handleNavigateBack);
          return;
        }
        reset({
          jobIds: data.jobIds,
          title: data.title,
          summary: data.description,
          qaSets: [...data.qa],
          status: data.public ? 'Y' : 'N',
        });
      })
      .catch();
  }, [qaId, reset]);

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'qaSets',
  });

  const onInvalid = (errors) => {
    // console.log('Form validation failed:', errors);

    // 1. 직무 선택 에러 처리
    if (errors.jobIds && jobSectionRef.current) {
      jobSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    // 2. qaSets 에러 처리
    if (errors.qaSets) {
      const firstErrorIndex = fields.findIndex((_, index) => errors.qaSets[index]);
      if (firstErrorIndex !== -1) {
        const errorItemId = `item-${firstErrorIndex}`;

        // 해당 아코디언 열기(이미 열려있지 않은 경우)
        setOpenItems((prev) => {
          if (!prev.includes(errorItemId)) {
            return [...prev, errorItemId];
          }
          return prev;
        });

        setTimeout(() => {
          const errorField = errors.qaSets[firstErrorIndex];
          const errorFieldName = errorField.question
            ? `qaSets[${firstErrorIndex}].question`
            : `qaSets[${firstErrorIndex}].answer`;

          const element = document.querySelector(`[name="${errorFieldName}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }, 300);
      }
    }
  };

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
    // console.log('onSubmit called with:', data);
    // console.log('jobIds length:', data.jobIds?.length);

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
      <C.MainContentWrapper>
        <C.QaUpdateHeader>
          <Typography as='h1' size={7} weight='bold'>
            면접 노트 수정
          </Typography>
        </C.QaUpdateHeader>
        <C.SettingsBox>
          <FormProvider {...methods}>
            <C.FormWrapper>
              <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                <input
                  type='hidden'
                  {...register('jobIds', {
                    validate: (value) =>
                      value.length > 0 || '직무를 최소 1개 이상 선택해야 합니다.',
                  })}
                />
                {/* 직무 선택 (최소 1개 선택 필수) */}
                <C.Section ref={jobSectionRef}>
                  <C.SectionTitle>
                    <span>
                      관련 직무 선택(최대 3개)<C.RequiredAsterisk>*</C.RequiredAsterisk>
                    </span>
                  </C.SectionTitle>

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
                </C.Section>
                <C.Divider />

                {/* 제목 */}
                <C.Section>
                  <C.SectionTitle>
                    <span>
                      제목<C.RequiredAsterisk>*</C.RequiredAsterisk>
                    </span>
                  </C.SectionTitle>
                  <C.FormInput
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
                </C.Section>

                {/* 세트 요약 */}
                <C.Section>
                  <C.SectionTitle>
                    <span>노트 요약</span>
                    <C.OptionalText>(선택사항)</C.OptionalText>
                  </C.SectionTitle>
                  <C.FormTextAreaSummary
                    placeholder='이 면접 노트에 대한 간단한 설명을 입력하세요.'
                    {...register('summary')}
                  />
                </C.Section>
                <C.Divider />

                {/* 질문답변 세트 목록 */}
                <C.Section>
                  <C.SectionTitle>
                    <span>면접 노트</span>
                    <C.RequiredAsterisk>*</C.RequiredAsterisk>
                    <C.OptionalText>최소 1개의 노트를 작성해야 합니다.</C.OptionalText>
                  </C.SectionTitle>
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
                        <C.QASetListContainer>
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
                        </C.QASetListContainer>
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
                              <C.OverlayWrapper>
                                <C.OverlayBadge>질문 {activeIndex + 1}</C.OverlayBadge>
                                <C.OverlayQuestion>{activeQuestion}</C.OverlayQuestion>
                              </C.OverlayWrapper>
                            );
                          })()
                        : null}
                    </DragOverlay>
                  </DndContext>
                  {fields.length < 10 && (
                    <C.AddSetButton type='button' onClick={handleAddSet}>
                      <PlusIcon width={30} height={30} />
                    </C.AddSetButton>
                  )}
                </C.Section>

                {/* 공개 설정 및 저장 */}
                <C.FormFooter>
                  <C.CheckboxLabel htmlFor='status-public'>
                    <C.CheckboxRoot
                      id='status-public'
                      checked={status === 'Y'}
                      onCheckedChange={() => handleStatusChange('Y')}
                    >
                      <C.CheckboxIndicator>
                        <CheckIcon />
                      </C.CheckboxIndicator>
                    </C.CheckboxRoot>
                    공개
                  </C.CheckboxLabel>
                  <C.CheckboxLabel htmlFor='status-private'>
                    <C.CheckboxRoot
                      id='status-private'
                      checked={status === 'N'}
                      onCheckedChange={() => handleStatusChange('N')}
                    >
                      <C.CheckboxIndicator>
                        <CheckIcon />
                      </C.CheckboxIndicator>
                    </C.CheckboxRoot>
                    비공개
                  </C.CheckboxLabel>
                  <input type='hidden' {...register('status')} />
                  <C.SubmitButton type='submit' disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '저장'}
                  </C.SubmitButton>
                </C.FormFooter>
              </form>
            </C.FormWrapper>
          </FormProvider>
        </C.SettingsBox>
      </C.MainContentWrapper>
      <WarnDialog
        open={alertOpen}
        onOpenChange={(open) => {
          setAlertOpen(open);
          if (!open && alertOnClose) {
            alertOnClose();
          }
        }}
        title='알림'
        message={alertMessage}
        confirmText='확인'
      />
    </PageContainer>
  );
}
