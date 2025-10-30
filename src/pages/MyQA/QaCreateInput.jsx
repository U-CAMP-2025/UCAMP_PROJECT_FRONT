// keyframes 임포트 추가
import Typography from '@components/common/Typography';
import * as Accordion from '@radix-ui/react-accordion';
import { Pencil1Icon, TrashIcon, CaretDownIcon, DragHandleDots2Icon } from '@radix-ui/react-icons';
// DragHandleDots2Icon 추가
import React from 'react';
import { useFormContext } from 'react-hook-form';
import styled, { keyframes } from 'styled-components';

// Typography로 alias (경로 수정 필요)

// --- 스타일 정의 ---

export const FormItemContainer = styled(Accordion.Item)`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[5]};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  /* 드래그 상태 스타일 (라이브러리 사용 시 추가) */
  /* &[data-dragging='true'] { ... } */
`;

// 💡 FormHeader에 드래그 핸들 영역 추가
export const FormHeader = styled(Accordion.Header)`
  /* Header는 Trigger를 포함하는 non-button 요소여야 하므로 div로 변경 */
  display: flex;
  align-items: center;
  width: 100%;
  /* Trigger에서 border 관리 */
`;

export const DragHandle = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[2]}; /* 좌우 여백 줄임 */
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
  flex-grow: 1; /* 남은 공간 차지 */
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
  /* 내용이 길 경우 잘림 처리 (옵션) */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 300px; /* 최대 너비 제한 */
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

  /* AccordionTrigger의 data-state를 참조 */
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
 * 질문답변 생성 페이지에서 사용하는 개별 세트 입력 컴포넌트
 * @param {object} props
 * @param {number} props.index - 배열 내 인덱스
 * @param {function} props.onDelete - 삭제 핸들러
 * @param {object} props.dragHandleProps - 드래그 라이브러리 핸들 props (옵션)
 */
export const QACreateInput = ({ index, onDelete, dragHandleProps }) => {
  // useFormContext로 register와 watch(제목 표시용) 가져오기
  const { register, watch } = useFormContext();

  const questionName = `qaSets[${index}].question`;
  const answerName = `qaSets[${index}].answer`;

  // 현재 질문 입력 값을 watch하여 제목으로 사용
  const currentQuestion = watch(questionName);

  return (
    // 아코디언 Root를 각 Item마다 두지 않고, 상위(QACreatePage)에서 관리합니다.
    // Item value를 고유하게 설정 (예: `item-${index}`)
    <FormItemContainer value={`item-${index}`}>
      <FormHeader>
        {/* 드래그 핸들 */}
        <DragHandle type='button' {...dragHandleProps} title='순서 변경'>
          <DragHandleDots2Icon width={20} height={20} />
        </DragHandle>

        {/* 아코디언 열기/닫기 트리거 */}
        <AccordionTriggerStyled>
          <HeaderLeft>
            <QuestionNumberBadge>{index + 1}</QuestionNumberBadge>
            <QuestionTitleText>
              {/* 질문 입력 내용 또는 기본 텍스트 표시 */}
              {currentQuestion || `질문 ${index + 1}`}
            </QuestionTitleText>
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
