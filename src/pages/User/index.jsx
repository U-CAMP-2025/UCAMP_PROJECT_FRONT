import { fetchUserDetail } from '@api/userAPIS';
import { Footer } from '@components/layout/Footer';
import { Header } from '@components/layout/Header';
import UserDetail from '@components/user/UserDetail';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function User() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetchUserDetail(userId)
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('fetchUserDetail error', err);
        setError(err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <>
      <Header />
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>로딩중...</div>
      ) : error ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>
          사용자 정보를 불러오지 못했습니다.
        </div>
      ) : (
        <UserDetail user={user} />
      )}

      <Footer />
    </>
  );
}
