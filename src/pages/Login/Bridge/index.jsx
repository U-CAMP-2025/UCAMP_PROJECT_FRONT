import { PageContainer } from '@components/layout/PageContainer';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginBridge() {
  const { login } = useAuthStore();
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const at = params.get('accessToken');
    const rt = params.get('refreshToken');
    const nickname = params.get('nickname');
    const profileImageUrl = params.get('profileImageUrl');

    if (at && rt) {
      localStorage.setItem('accessToken', at);
      localStorage.setItem('refreshToken', rt);
      login({
        name: nickname,
        profileImageUrl,
      });
      navigate('/', { replace: true });
    } else {
      navigate('/signup', { replace: true });
    }
  }, [search, navigate]);

  return (
    <PageContainer header footer>
      로그인 처리 중
    </PageContainer>
  );
}
