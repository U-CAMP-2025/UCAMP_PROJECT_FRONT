import { PageContainer } from '@components/layout/PageContainer';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginBridge() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { login, setAccessToken } = useAuthStore.getState();
  useEffect(() => {
    try {
      const params = new URLSearchParams(search);
      const at = params.get('accessToken');
      const nickname = params.get('nickname');
      const profileImageUrl = params.get('profileImageUrl');

      if (at) {
        setAccessToken(at);
        login({
          user: {
            name: nickname,
            profileImageUrl,
          },
        });
        navigate('/', { replace: true });
      } else {
        navigate('/signup', { replace: true });
      }
    } catch (e) {
      console.error('Login Error', e);
      navigate('/signup', { replace: true });
    }
  }, []);

  return (
    <PageContainer header footer>
      로그인 처리 중
    </PageContainer>
  );
}
