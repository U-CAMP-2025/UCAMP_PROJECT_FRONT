import Typography from '@components/common/Typography';
// 💡 dnd-kit 임포트
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Accordion from '@radix-ui/react-accordion';
import { Pencil1Icon, TrashIcon, CaretDownIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled, { keyframes } from 'styled-components';

// --- 스타일 정의 ---

// 💡 FormItemContainer에 transform, transition 추가 (dnd-kit용)
export const FormItemContainer = styled(Accordion.Item)`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  /* 💡 dnd-kit이 아이템을 움직일 때 사용할 스타일 */
  transform: ${({ style }) =>
    style?.transform ? CSS.Transform.toString(style.transform) : 'none'};
  transition: ${({ style }) => style?.transition || 'none'};

  /* 💡 드래그 중일 때의 스타일 (그림자 강조) */
  &[data-dragging='true'] {
    box-shadow: ${({ theme }) => theme.shadow.lg};
    z-index: 10;
  }
`;

export const FormHeader = styled(Accordion.Header)`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const DragHandle = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[2]};
  cursor: grab;
  color: ${({ theme }) => theme.colors.gray[8]};

  &:active {
    cursor: grabbing;
  }
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }
`;

export const AccordionTriggerStyled = styled(Accordion.Trigger)`
  all: unset;
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[4]};
  cursor: pointer;
  border-bottom: 1px solid transparent;

  &[data-state='open'] {
    border-bottom-color: ${({ theme }) => theme.colors.gray[4]};
  }
  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.primary[6]};
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

export const QuestionNumberBadge = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background-color: ${({ theme }) => theme.colors.primary[9]};
  color: white;
  font-size: ${({ theme }) => theme.font.size[2]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;

export const QuestionTitleText = styled(Typography).attrs({ size: 3, weight: 'semiBold' })`
  color: ${({ theme }) => theme.colors.gray[12]};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 300px;
`;

export const ControlIconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const BaseIconButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.gray[8]};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[3]};
    color: ${({ theme }) => theme.colors.gray[11]};
  }
`;
export const EditButton = styled(BaseIconButton)``;
export const DeleteButton = styled(BaseIconButton)``;

export const CaretIcon = styled(CaretDownIcon)`
  color: ${({ theme }) => theme.colors.gray[8]};
  transition: transform 300ms cubic-bezier(0.87, 0, 0.13, 1);

  ${AccordionTriggerStyled}[data-state='open'] & {
    transform: rotate(-180deg);
  }
`;

// --- 콘텐츠 영역 스타일 (QAForm과 동일) ---
const slideDown = keyframes`
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
`;
const slideUp = keyframes`
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
`;
export const FormContent = styled(Accordion.Content)`
  overflow: hidden;
  padding: 0 ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[4]};

  &[data-state='open'] {
    animation: ${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
  &[data-state='closed'] {
    animation: ${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1);
  }
`;
export const FormInputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[4]};
`;
export const InputGroup = styled.div`
  padding: ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.sm};
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary[7]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[7]};
  }
`;
export const InputLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.font.size[2]};
  color: ${({ theme }) => theme.colors.gray[10]};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
`;
export const FormTextArea = styled.textarea`
  all: unset;
  width: 100%;
  min-height: 80px;
  font-family: ${({ theme }) => theme.font.family.primary};
  font-size: ${({ theme }) => theme.font.size[3]};
  color: ${({ theme }) => theme.colors.gray[12]};
  line-height: ${({ theme }) => theme.font.lineHeight[4]};
  resize: vertical;
`;
// --- 스타일 정의 끝 ---

/**
 * @param {object} props
 * @param {string} props.id - dnd-kit을 위한 고유 ID (useFieldArray의 item.id)
 * @param {number} props.index - 배열 내 인덱스
 * @param {function} props.onDelete - 삭제 핸들러
 */
export const QAUpdateInput = ({ id, index, onDelete }) => {
  const { register, watch } = useFormContext();

  const questionName = `qaSets[${index}].question`;
  const answerName = `qaSets[${index}].answer`;
  const currentQuestion = watch(questionName);

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
    <FormItemContainer
      value={`item-${index}`}
      ref={setNodeRef}
      style={style}
      data-dragging={isDragging}
    >
      <FormHeader>
        {/* 💡 드래그 핸들에 listeners와 attributes 적용 */}
        <DragHandle type='button' {...attributes} {...listeners} title='순서 변경'>
          <DragHandleDots2Icon width={20} height={20} />
        </DragHandle>

        <AccordionTriggerStyled asChild>
          <div className='accordion-header'>
            <HeaderLeft>
              <QuestionNumberBadge>{index + 1}</QuestionNumberBadge>
              <QuestionTitleText>{currentQuestion || `질문 ${index + 1}`}</QuestionTitleText>
            </HeaderLeft>

            <ControlIconGroup>
              <EditButton
                type='button'
                title='수정'
                onClick={() => console.log('Edit clicked', index)}
              >
                <Pencil1Icon width={16} height={16} />
              </EditButton>
              <DeleteButton type='button' title='삭제' onClick={onDelete}>
                <TrashIcon width={16} height={16} />
              </DeleteButton>
              <CaretIcon aria-hidden />
            </ControlIconGroup>
          </div>
        </AccordionTriggerStyled>
      </FormHeader>

      <FormContent>
        <FormInputsWrapper>
          <InputGroup>
            <InputLabel htmlFor={questionName}>질문을 입력하세요</InputLabel>
            <FormTextArea
              id={questionName}
              placeholder='예: 프로젝트 경험에 대해 설명해주세요.'
              {...register(questionName, { required: '질문은 필수입니다.' })}
            />
          </InputGroup>
          <InputGroup>
            <InputLabel htmlFor={answerName}>답변을 입력하세요</InputLabel>
            <FormTextArea
              id={answerName}
              placeholder='예: React와 TypeScript를 사용한...'
              {...register(answerName, { required: '답변은 필수입니다.' })}
            />
          </InputGroup>
        </FormInputsWrapper>
      </FormContent>
    </FormItemContainer>
  );
};
