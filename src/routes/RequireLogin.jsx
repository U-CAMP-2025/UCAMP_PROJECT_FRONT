import { useAuthStore } from '@store/auth/useAuthStore';
import { Navigate } from 'react-router-dom';

export function RequireLogin({ children }) {
  const { isLogin } = useAuthStore();

  console.log('isLogin', isLogin);
  if (!isLogin) {
    return <Navigate to='/' replace />;
  }
  return children;
}
