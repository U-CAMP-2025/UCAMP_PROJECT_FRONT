import { fetchIsUserPayment } from '@api/paymentAPIS';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  isPlus: false,
};

export const usePaymentStore = create(
  persist(
    (set) => ({
      ...initialState,
      refreshIsPlus: async () => {
        fetchIsUserPayment()
          .then((response) => {
            set({
              isPlus: response.isPlus,
            });
          })
          .catch(() => {
            set({ isPlus: false });
          });
      },
      setIsPlus: (isPlus) => set({ isPlus }),
    }),
    {
      name: 'paymentStore',
    },
  ),
);
