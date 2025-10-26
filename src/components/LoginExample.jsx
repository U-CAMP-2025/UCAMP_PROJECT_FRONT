import { useState } from 'react';
import { useAuthStore } from 'src/store/auth/useAuthStore';

export const LoginExample = () => {
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
    <>
      <div>로그인 여부: {isLogin ? '로그인됨' : '로그인 안됨'}</div>
      <div>
        닉네임: {user.name} 이메일: {user.email}
      </div>
      <div>
        <label>닉네임 입력: </label>
        <input type='text' name='name' value={userState.name} onChange={handleChangeInput} />
        <label>이메일 입력: </label>
        <input type='email' name='email' value={userState.email} onChange={handleChangeInput} />
        <button onClick={handleClickLoginButton}>로그인</button>
        <button onClick={handleClickLogoutButton}>로그아웃</button>
      </div>
    </>
  );
};
