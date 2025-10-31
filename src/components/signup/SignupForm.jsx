import { postSignUp, getCheckNickname } from '@api/authAPIS';
import SearchableSelect from '@components/common/SearchableSelect';
import Typography from '@components/common/Typography';
import { useAuthStore } from '@store/auth/useAuthStore';
import theme from '@styles/theme';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Props
 *  - jobOptions?: { jobId:number, name:string }[]
 *  - onSubmitForm?: (data:{ nickname:string; email:string; jobId:number }) => void
 */
export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { nickname: '', email: '', jobId: undefined },
    mode: 'onBlur',
  });
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmitForm = (data) => {
    const { nickname, jobId } = data;
    postSignUp(nickname, jobId).then((response) => {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      login({
        name: response.nickname,
        profileImageUrl: response.profileImageUrl,
      });
      navigate('/', { replace: true });
    });
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitForm)}>
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
            maxLength: { value: 10, message: '닉네임은 10자 이하로 입력해주세요' },
            pattern: {
              value: /^[A-Za-z0-9가-힣_]{2,10}$/,
              message: '한글/영문/숫자/밑줄만 사용할 수 있습니다',
            },
            validate: async (value) => {
              const v = (value ?? '').trim();
              if (!v) return '닉네임을 입력해주세요';
              try {
                const res = await getCheckNickname(v);
                return res.available || '이미 사용 중인 닉네임입니다';
              } catch (e) {
                return '닉네임 확인 중 오류가 발생했습니다';
              }
            },
          })}
        />
        {errors.nickname && <ErrorText>{errors.nickname.message}</ErrorText>}
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
  color: ${({ theme }) => theme.colors.error};
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
