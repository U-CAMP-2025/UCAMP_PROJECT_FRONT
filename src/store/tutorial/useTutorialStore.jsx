import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  seenHeaderTour: false,
  seenSimTour: false,
  seenQAListTour: false,
  seenSimGoTour: false,
};
export const useTutorialStore = create(
  persist(
    (set) => ({
      ...initialState,
      setHeaderTour: (updated) =>
        set((state) => ({
          ...state,
          seenHeaderTour: updated,
        })),
      setSimTour: (updated) =>
        set((state) => ({
          ...state,
          seenSimTour: updated,
        })),
      setQAListTour: (updated) =>
        set((state) => ({
          ...state,
          seenQAListTour: updated,
        })),
      setTutorial: (updated) => {
        set(() => ({
          ...updated,
        }));
      },
    }),
    {
      name: 'tutorialStore',
    },
  ),
);
