import Button from '@components/common/Button';
import Typography from '@components/common/Typography';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';

/**
 * QAReviewForm — 로그인 사용자의 리뷰 작성 폼
 *
 * Props
 *  - user?: { nickname?: string; profileImage?: string }
 *  - maxLength?: number (기본 500)
 *  - initialValue?: string (기본 '')
 *  - isSubmitting?: boolean (제출 로딩)
 *  - onSubmit: (payload: { content: string }) => void
 *  - onCancel?: () => void
 */
export default function QAReviewForm({
  user,
  maxLength = 500,
  initialValue = '',
  isSubmitting = false,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { content: initialValue },
    mode: 'onBlur',
  });

  const content = watch('content');
  const remain = Math.max(0, maxLength - (content?.length || 0));

  const submit = async (data) => {
    // 💡 async 키워드 추가
    if (!data?.content?.trim()) return;

    if (onSubmit) {
      try {
        // 💡 onSubmit (즉, handleCreateReview)이 완료될 때까지 await
        await onSubmit({ content: data.content.trim() });
        // 💡 API 호출 성공 시에만 폼을 리셋
        reset({ content: '' });
      } catch (error) {
        // 💡 API 호출 실패 시 (handleCreateReview에서 throw error)
        // 폼을 리셋하지 않고 사용자가 내용을 수정할 수 있게 둠
        console.log('Submission failed, not resetting form.');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <TextArea
        placeholder='질문 셋에 대한 의견, 개선점, 도움이 된 점 등을 자유롭게 남겨주세요.'
        {...register('content', {
          required: '리뷰 내용을 입력해주세요',
          minLength: { value: 5, message: '최소 5자 이상 입력해주세요' },
          maxLength: { value: maxLength, message: `최대 ${maxLength}자까지 입력할 수 있어요` },
        })}
      />
      <Footer>
        <div>
          {errors.content ? (
            <ErrorText>{errors.content.message}</ErrorText>
          ) : (
            <Typography size={1} color='gray.8'>
              {remain} / 500
            </Typography>
          )}
        </div>
        <Actions>
          {onCancel && (
            <Button variant='ghost' type='button' onClick={onCancel} disabled={isSubmitting}>
              취소
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting} size='sm'>
            {isSubmitting ? '등록 중…' : '등록하기'}
          </Button>
        </Actions>
      </Footer>
    </Form>
  );
}

// ===== styled =====
const Form = styled.form`
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: #fff;
  padding: ${({ theme }) => theme.space[5]};
  display: grid;
  gap: ${({ theme }) => theme.space[2]};
`;

const Header = styled.div`
  display: flex;
  grid-template-columns: 48px 1fr;
  gap: ${({ theme }) => theme.space[3]};
  align-items: center;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.gray[2]};
  padding: ${({ theme }) => theme.space[4]};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[8]};
    box-shadow: 0 0 0 3px rgba(110, 86, 207, 0.15);
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
`;

const ErrorText = styled(Typography).attrs({ as: 'div', size: 1 })`
  color: ${({ theme }) => theme.colors.error};
`;
