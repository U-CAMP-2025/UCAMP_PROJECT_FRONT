import SearchableSelect from '@components/common/SearchableSelect';
import Typography from '@components/common/Typography';
import theme from '@styles/theme';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';

/**
 * Props
 *  - jobOptions?: { jobId:number, name:string }[]
 *  - onSubmitForm?: (data:{ nickname:string; email:string; jobId:number }) => void
 */

// TODO: 이메일 자동으로 입력, 닉네임 중복체크 API 연결, 관심 직무 API 연결, 회원가입 API 연결
export const SignupForm = ({
  jobOptions = [
    { jobId: 1, name: '프론트엔드 개발자' },
    { jobId: 2, name: '백엔드 개발자' },
    { jobId: 3, name: '풀스택 개발자' },
  ],
  onSubmitForm,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { nickname: '', email: '', jobId: undefined },
    mode: 'onBlur',
  });

  const onSubmit = (data) => {
    // data: { nickname, email, jobId }
    if (onSubmitForm) return onSubmitForm(data);
    console.log('signup submit:', data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Header>
        <Typography size={7} weight='bold' style={{ color: theme.colors.primary[10] }}>
          면접톡
        </Typography>
        <Typography size={4} weight='semiBold' style={{ marginTop: theme.space[4] }}>
          회원가입
        </Typography>
      </Header>

      {/* 닉네임 */}
      <Field>
        <Label htmlFor='nickname'>닉네임</Label>
        <Input
          id='nickname'
          type='text'
          placeholder='닉네임을 입력하세요'
          {...register('nickname', {
            required: '닉네임을 입력해주세요',
            minLength: { value: 2, message: '닉네임은 2자 이상이어야 합니다' },
            maxLength: { value: 20, message: '닉네임은 20자 이하로 입력해주세요' },
          })}
        />
        {errors.nickname && <ErrorText>{errors.nickname.message}</ErrorText>}
      </Field>

      {/* 이메일 */}
      <Field>
        <Label htmlFor='email'>이메일</Label>
        <Input
          id='email'
          type='email'
          placeholder='가져온 이메일'
          autoComplete='email'
          disabled
          {...register('email')}
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </Field>

      {/* 관심 직무 */}
      <Field>
        <Label>관심 직무</Label>
        <Controller
          name='jobId'
          control={control}
          rules={{ required: '관심 직무를 선택해주세요' }}
          render={({ field: { value, onChange } }) => (
            <SearchableSelect
              value={value}
              onChange={onChange}
              options={jobOptions}
              placeholder='관심 직무를 선택하세요'
            />
          )}
        />
        {errors.jobId && <ErrorText>{errors.jobId.message}</ErrorText>}
      </Field>

      <Submit type='submit' disabled={isSubmitting}>
        회원가입
      </Submit>
    </Form>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[5]};
  width: 420px;
  padding: ${({ theme }) => theme.space[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: #fff;
  box-shadow: ${({ theme }) => theme.shadow.sm};
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -45%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  color: ${({ theme }) => theme.colors.gray[11]};
`;

const Input = styled.input`
  height: 44px;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[6]};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[8]};
    box-shadow: 0 0 0 3px rgba(110, 86, 207, 0.15);
  }
`;

const ErrorText = styled(Typography).attrs({ as: 'div', size: 2 })`
  color: #ef4444;
`;

const Submit = styled.button`
  height: 46px;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${theme.colors.primary[9]};
  color: #fff;
  font-weight: ${({ theme }) => theme.font.weight.bold};
  cursor: pointer;
  &:hover {
    background: ${theme.colors.primary[10]};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default SignupForm;
