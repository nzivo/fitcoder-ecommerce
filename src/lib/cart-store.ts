import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  size: string | null;
  color: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export function lineKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}__${item.size ?? ""}__${item.color ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (item) => {
        const key = lineKey(item);
        const existing = get().items.find((i) => lineKey(i) === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              lineKey(i) === key ? { ...i, quantity: i.quantity + item.quantity } : i,
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
        set({ isOpen: true });
      },
      removeItem: (key) => set({ items: get().items.filter((i) => lineKey(i) !== key) }),
      setQuantity: (key, quantity) =>
        set({
          items: get().items.map((i) =>
            lineKey(i) === key ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "dope-beyond-cart" },
  ),
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
