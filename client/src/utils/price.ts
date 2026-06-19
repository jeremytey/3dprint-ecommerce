import type { CartItem } from "@/store/useCartStore";

export const computeUnitPrice = (item: Pick<CartItem, "basePrice" | "selectedOptions">): number => {
  const modifierSum = item.selectedOptions.reduce(
    (sum, opt) => sum + opt.priceModifier,
    0
  );
  return item.basePrice + modifierSum;
};

export const computeLineTotal = (item: CartItem): number => {
  return computeUnitPrice(item) * item.quantity;
};

export const computeCartTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + computeLineTotal(item), 0);
};

export const formatPriceRM = (amount: number): string => {
  return `RM ${amount.toFixed(2)}`;
};