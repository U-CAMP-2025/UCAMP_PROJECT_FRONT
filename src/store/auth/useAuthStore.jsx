import { postLogout } from '@api/authAPIS';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  accessToken: null,
  isLogin: false,
  user: {
    name: '',
    email: '',
    profileImageUrl: '',
  },
};
export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      setAccessToken: (token) => set({ accessToken: token }),
      login: ({ user, accessToken }) => {
        set((s) => ({
          user,
          isLogin: true,
          accessToken: accessToken ?? s.accessToken,
        }));
      },
      logout: async () => {
        try {
          await postLogout();
        } catch (e) {
          set({ ...initialState });
        } finally {
          set({ ...initialState });
        }
      },
    }),
    {
      name: 'authStore',
      partialize: (state) => ({
        isLogin: state.isLogin,
        user: state.user,
      }),
    },
  ),
);
