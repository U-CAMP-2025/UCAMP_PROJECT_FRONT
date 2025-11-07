import { postLogout } from '@api/authAPIS';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  accessToken: null,
  isLogin: false,
  user: {
    name: '',
    profileImageUrl: '',
  },
};
export const useAuthStore = create(
  persist(
    (set) => ({
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
          // ignore
        } finally {
          localStorage.removeItem('seenHeaderTour');
          localStorage.removeItem('seenQAListTour');
          localStorage.removeItem('seenSimTour');
          set({ ...initialState });
        }
      },
      withdraw: () => {
        set({
          ...initialState,
        });
      },
    }),
    {
      name: 'authStore',
      partialize: (state) => ({
        accessToken: state.accessToken,
        isLogin: state.isLogin,
        user: state.user,
      }),
    },
  ),
);
