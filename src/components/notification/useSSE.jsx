import { useAuthStore } from '@store/auth/useAuthStore';
import { useEffect, useState, useRef } from 'react';
import { SSE } from 'sse.js';

export const useSSE = (trigger) => {
  const { isLogin, accessToken } = useAuthStore();
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const sseRef = useRef(null); // SSE 객체를 useRef로 관리

  let trig = 0;

  const createSSE = () => {
    // 이미 SSE 연결이 존재하면 새로 생성하지 않음
    if (sseRef.current) return;

    const sse = new SSE(
      (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api') + '/notifications/sse',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      },
    );

    sseRef.current = sse; // 연결된 SSE 객체를 useRef에 저장

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
        createSSE(); // 재연결 시도
      }, timeout);
    } else {
      sseRef.current.close();
      sseRef.current = null; // 최대 재연결 시도 초과 시 SSE 객체 초기화
    }
  };

  useEffect(() => {
    if (!accessToken || !isLogin) {
      return;
    }

    createSSE(); // 처음 연결 생성

    return () => {
      if (sseRef.current) {
        sseRef.current.close(); // 컴포넌트 언마운트 시 연결 종료
        sseRef.current = null; // SSE 객체 초기화
      }
    };
  }, [accessToken, isLogin]); // `trigger` 값에는 의존하지 않음
};
