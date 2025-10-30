import { postLogout, postTokenRefresh } from '@api/authAPIS';
import { fetchUserMypage } from '@api/userAPIS';
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: true, // 앱 부팅시 초기화 로딩
  initialized: false, // 초기화 완료 플래그

  setAccessToken: (t) => set({ accessToken: t }),
  setUser: (u) => set({ user: u }),

  // 앱 초기화: 새로고침 / 첫 방문시 세션 복구
  bootstrap: async () => {
    if (get().initialized) return;
    try {
      const data = postTokenRefresh();
      set({ accessToken: data.accessToken });
      const me = fetchUserMypage();
      set({ user: me.data, loading: false, initialized: true });
    } catch {
      set({
        accessToken: null,
        user: null,
        loading: false,
        initialized: true,
      });
    }
  },

  // 로그인 후 accessToken 반영하고 me를 갱신
  completeLogin: async (accessToken) => {
    set({ accessToken });
    const me = fetchUserMypage();
    set({ user: me.data });
  },

  // 서버 로그아웃 호출 + 로컬 상태 초기화
  logout: async () => {
    try {
      postLogout();
    } catch {
      set({ accessToken: null, user: null });
    }
    set({ accessToken: null, user: null });
  },

  // refresth 실패 등 로컬만 정리
  logoutLoacl: () => set({ accessToken: null, user: null }),
}));
