import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  isLogin: false,
  user: {
    name: '',
    email: '',
    profileImageUrl: '',
  },
};
export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      login: (user) => {
        set({
          isLogin: true,
          user,
        });
      },
      logout: () => {
        set({ ...initialState });
      },
    }),
    {
      name: 'authStore',
    },
  ),
);
