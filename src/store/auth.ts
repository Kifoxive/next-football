import { IUser } from "@/app/[locale]/players/types";
import { create } from "zustand";

export enum USER_ROLE {
  "admin" = "admin",
  "moderator" = "moderator",
  "player" = "player",
}

type AuthState = {
  user: IUser | null | undefined;
  setUser: (user: IUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
