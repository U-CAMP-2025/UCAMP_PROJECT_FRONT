import Button from '@components/common/Button';
import Stack from '@components/common/Stack';
import { useState } from 'react';
import { useAuthStore } from 'src/store/auth/useAuthStore';
import styled from 'styled-components';

import Text from './common/Text';

export const LoginExample = () => {
  // 예시 추가
  const [userState, setUserState] = useState({
    name: '',
    email: '',
  });
  const { isLogin, user, login, logout } = useAuthStore();

  const handleChangeInput = (e) => {
    setUserState({
      ...userState,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickLoginButton = () => {
    login(userState);
    setUserState({
      name: '',
      email: '',
    });
  };

  const handleClickLogoutButton = () => {
    logout();
  };

  return (
    <StyledStack direction='column' justify='center' align='center' wrap>
      <Text size='6' weight='bold'>
        로그인 여부: {isLogin ? '로그인됨' : '로그인 안됨'}
      </Text>
      <div>
        닉네임: {user.name} 이메일: {user.email}
      </div>
      <Stack direction='column' gap={({ theme }) => theme.space[2]}>
        <div>
          <label>닉네임 입력: </label>
          <input type='text' name='name' value={userState.name} onChange={handleChangeInput} />
        </div>
        <div>
          <label>이메일 입력: </label>
          <input type='email' name='email' value={userState.email} onChange={handleChangeInput} />
        </div>
      </Stack>
      <Stack direction='row' gap={({ theme }) => theme.space[2]}>
        <Button onClick={handleClickLoginButton}>로그인</Button>
        <Button onClick={handleClickLogoutButton} variant='secondary'>
          로그아웃
        </Button>
      </Stack>
    </StyledStack>
  );
};

// 기존 styled components에서 css를 추가하고 싶을 때
const StyledStack = styled(Stack)`
  border: 1px solid ${({ theme }) => theme.colors.primary[10]};
`;
