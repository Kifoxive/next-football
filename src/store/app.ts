import { create } from "zustand";

type AppState = {
  subscription: PushSubscription | null;
  setSubscription: (subscription: PushSubscription | null) => void;
  removeSubscription: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  subscription: null,
  setSubscription: (subscription) => set({ subscription }),
  removeSubscription: () => set({ subscription: null }),
}));
