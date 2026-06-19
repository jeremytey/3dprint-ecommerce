import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SelectedOption {
  groupId: string;
  groupLabel: string;
  valueId: string;
  valueLabel: string;
  priceModifier: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  productSlug: string;
  basePrice: number;
  imageUrl: string | null;
  selectedOptions: SelectedOption[];
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "cartItemId" | "quantity">,
    quantity?: number
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const buildCartItemId = (
  productId: string,
  selectedOptions: SelectedOption[]
): string => {
  const sortedValueIds = [...selectedOptions]
    .map((opt) => opt.valueId)
    .sort()
    .join(",");
  return `${productId}::${sortedValueIds}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item, quantity = 1) =>
        set((state) => {
          const cartItemId = buildCartItemId(item.productId, item.selectedOptions);
          const existing = state.items.find((i) => i.cartItemId === cartItemId);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.cartItemId === cartItemId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, cartItemId, quantity }],
          };
        }),

      removeItem: (cartItemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        })),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.cartItemId !== cartItemId)
              : state.items.map((i) =>
                  i.cartItemId === cartItemId ? { ...i, quantity } : i
                ),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: "3dprint-cart" }
  )
);