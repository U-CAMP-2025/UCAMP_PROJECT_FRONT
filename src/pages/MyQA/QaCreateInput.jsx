import * as I from '@components/qaset/QAInputStyle';
import { useSortable } from '@dnd-kit/sortable';
import { TrashIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const QACreateInput = ({ id, index, onDelete }) => {
  const { register, watch } = useFormContext();

  const questionName = `qaSets[${index}].question`;
  const answerName = `qaSets[${index}].answer`;
  const currentQuestion = watch(questionName);
  const currentAnswer = watch(answerName);

  // 💡 dnd-kit 훅 사용
  const {
    attributes,
    listeners,
    setNodeRef, // DOM 노드 참조
    transform,
    transition,
    isDragging, // 드래그 상태
  } = useSortable({ id: id }); // useFieldArray의 item.id를 고유 ID로 사용

  // 💡 dnd-kit 스타일
  const style = {
    transform,
    transition,
  };

  return (
    // 💡 setNodeRef, style, data-dragging 속성 추가
    <I.FormItemContainer
      value={`item-${index}`}
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging}
    >
      <I.FormHeader>
        {/* 드래그 핸들 */}
        <I.DragHandle type='button' {...attributes} {...listeners} title='순서 변경'>
          <DragHandleDots2Icon width={18} height={18} />
        </I.DragHandle>

        {/* 접기/펼치기 트리거: 질문 번호 + 제목 + 화살표 */}
        <I.AccordionTriggerStyled>
          <I.HeaderLeft>
            <I.QuestionNumberBadge>{index + 1}</I.QuestionNumberBadge>
            <I.QuestionTitleText>{currentQuestion}</I.QuestionTitleText>
          </I.HeaderLeft>
          <I.CaretIcon aria-hidden width={20} height={20} />
        </I.AccordionTriggerStyled>

        {/* 휴지통 아이콘: 트리거 밖, 우측 정렬 */}
        <I.DeleteButton type='button' title='삭제' onClick={onDelete} aria-label='질문 삭제'>
          <TrashIcon width={16} height={16} />
        </I.DeleteButton>
      </I.FormHeader>

      <I.FormContent>
        <I.FormInputsWrapper>
          <div>
            <I.InputGroup>
              <I.InputLabel htmlFor={questionName}>질문을 입력하세요</I.InputLabel>
              <I.FormTextArea
                id={questionName}
                placeholder='예: 프로젝트 경험에 대해 설명해주세요.'
                maxLength={100}
                {...register(questionName, { required: '질문은 필수입니다.' })}
              />
            </I.InputGroup>
            <I.CharCount>{(currentQuestion || '').length} / 100</I.CharCount>
          </div>
          <div>
            <I.InputGroup>
              <I.InputLabel htmlFor={answerName}>답변을 입력하세요</I.InputLabel>
              <I.FormTextArea2
                id={answerName}
                placeholder='예: React와 TypeScript를 사용한...'
                maxLength={500}
                {...register(answerName, { required: '답변은 필수입니다.' })}
              />
            </I.InputGroup>
            <I.CharCount>{(currentAnswer || '').length} / 500</I.CharCount>
          </div>
        </I.FormInputsWrapper>
      </I.FormContent>
    </I.FormItemContainer>
  );
};
