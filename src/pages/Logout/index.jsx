import { PageContainer } from '@components/layout/PageContainer';
import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    useAuthStore.getState().logout?.();
    navigate('/');
  }, []);
  return <PageContainer>로그아웃 처리중...</PageContainer>;
}
