import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: number;
  shopId: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  variation?: Record<string, string>;
  type: "physical" | "digital";
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: Omit<CartItem, "id">) => {
        const id = `${item.productId}-${JSON.stringify(item.variation ?? {})}`;
        set((state: CartState) => {
          const existing = state.items.find((i: CartItem) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i: CartItem) =>
                i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, id }] };
        });
      },
      removeItem: (id: string) =>
        set((state: CartState) => ({ items: state.items.filter((i: CartItem) => i.id !== id) })),
      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => ({
          items:
            quantity <= 0
              ? state.items.filter((i: CartItem) => i.id !== id)
              : state.items.map((i: CartItem) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0),
    }),
    { name: "noor-cart" }
  )
);
