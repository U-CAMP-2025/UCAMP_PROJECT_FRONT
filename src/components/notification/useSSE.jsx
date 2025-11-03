import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect } from 'react';
import { SSE } from 'sse.js';

export const useSSE = (trigger) => {
  const { isLogin, accessToken } = useAuthStore();

  let trig = 0;

  useEffect(() => {
    if (!accessToken && isLogin) {
      return;
    }

    const sse = new SSE(
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
      sse.close();
    });

    // cleanup
    return () => {
      sse.close();
    };
  }, [isLogin]);
};
