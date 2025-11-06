import { PageContainer } from '@components/layout/PageContainer';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginBridge() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { login, setAccessToken } = useAuthStore.getState();

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(search);
        const accessToken = params.get('accessToken');
        const nickname = params.get('nickname');
        const profileImageUrl = params.get('profileImageUrl');
        const next = params.get('next') || '/'; // next 파라미터 읽기, 없으면 메인으로 이동

        if (!accessToken) {
          navigate('/signup', { replace: true });
          return;
        }

        setAccessToken(accessToken);
        login({
          user: {
            name: nickname,
            profileImageUrl,
          },
        });

        navigate(next, { replace: true });
      } catch (err) {
        console.error('LoginBridge Error:', err);
        navigate('/', { replace: true });
      }
    })();
  }, [search, navigate, login, setAccessToken]);

  return (
    <PageContainer header footer>
      로그인 처리 중
    </PageContainer>
  );
}
