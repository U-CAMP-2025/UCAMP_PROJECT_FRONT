import { fetchUserMypage } from '@api/userAPIS';
import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// 기본적인 API 호출 (useEffect 사용)
export const ApiExampleBasic = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserMypage()
      .then((response) => setUser(response?.data ?? null))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <div>로딩 중...</div>;

  return (
    <section>
      {user?.name}의 마이페이지
      <div>직무: {user?.job}</div>
      <div>이메일: {user?.email}</div>
      <div>합격 여부: {user?.passStatus}</div>
    </section>
  );
};

// React Query + Suspense 활용
export const ApiExampleWithQuery = () => {
  const { data } = useQuery({
    queryKey: ['userMypage'],
    queryFn: fetchUserMypage,
    suspense: true,
  });

  const user = data?.data;

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>로딩 중...</div>}>
        <section>
          {user?.name}의 마이페이지
          <div>직무: {user?.job}</div>
          <div>이메일: {user?.email}</div>
          <div>합격 여부: {user?.passStatus}</div>
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};

// 에러가 발생했을 때 보여줄 컴포넌트
const ErrorFallback = ({ error }) => {
  return (
    <div role='alert'>
      <p>에러가 발생했습니다.</p>
      <pre>{error.message}</pre>
    </div>
  );
};
