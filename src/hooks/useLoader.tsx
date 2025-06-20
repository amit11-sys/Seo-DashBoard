import { create } from "zustand";

type LoaderState = {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

export const useLoader = create<LoaderState>((set) => ({
  loading: false,
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
}));
