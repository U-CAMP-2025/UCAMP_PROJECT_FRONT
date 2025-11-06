import { useEffect, useState } from 'react';
import SSE from 'sse-client';

import { useAuthStore } from './path-to-your-auth-store';

// 경로에 맞게 수정 필요

export const useSSE = (trigger) => {
  const { isLogin, accessToken } = useAuthStore();
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  let trig = 0;
  let sse; // effect 외부에 sse 변수 선언하여 cleanup에서 참조

  const createSSE = () => {
    sse = new SSE(
      (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api') + '/notifications/sse',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );

    sse.addEventListener('message', (event) => {
      if (event.data) {
        trigger(trig++);
      }
    });

    sse.addEventListener('error', (err) => {
      console.error('SSE error:', err);
      sse.close();
      attemptReconnect();
    });
  };

  const attemptReconnect = () => {
    const maxReconnectAttempts = 20;
    if (reconnectAttempts < maxReconnectAttempts) {
      const timeout = Math.pow(2, reconnectAttempts) * 1000;
      setReconnectAttempts((prev) => prev + 1);
      setTimeout(() => {
        createSSE();
      }, timeout);
    } else {
      console.log('최대 재연결 시도 횟수 도달');
    }
  };

  useEffect(() => {
    if (!accessToken || !isLogin) {
      return;
    }

    createSSE();

    return () => {
      if (sse) sse.close();
    };
  }, [accessToken, isLogin, reconnectAttempts]);
};
