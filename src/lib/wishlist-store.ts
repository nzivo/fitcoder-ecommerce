import { create } from "zustand";

interface WishlistState {
  ids: string[];
  setIds: (ids: string[]) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  ids: [],
  setIds: (ids) => set({ ids }),
  add: (id) => (get().ids.includes(id) ? undefined : set({ ids: [...get().ids, id] })),
  remove: (id) => set({ ids: get().ids.filter((existing) => existing !== id) }),
}));
