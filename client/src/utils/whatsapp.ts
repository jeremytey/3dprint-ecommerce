import type { CartItem } from "@/store/useCartStore";
import { computeUnitPrice, computeLineTotal, computeCartTotal, formatPriceRM } from "./price";

const formatItemLine = (item: CartItem, index: number): string => {
  const optionsLine = item.selectedOptions
    .map((opt) => `${opt.groupLabel}: ${opt.valueLabel}`)
    .join(", ");

  return [
    `${index + 1}. ${item.productName}`,
    optionsLine ? `   ${optionsLine}` : null,
    `   Qty: ${item.quantity} (${formatPriceRM(computeUnitPrice(item))} each = ${formatPriceRM(computeLineTotal(item))})`,
  ]
    .filter(Boolean)
    .join("\n");
};

export const buildWhatsAppMessage = (
  items: CartItem[],
  customerName: string,
  customerPhone: string
): string => {
  const itemLines = items.map(formatItemLine).join("\n\n");
  const total = formatPriceRM(computeCartTotal(items));

  return [
    "Hi! I'd like to place an order:",
    "",
    itemLines,
    "",
    `Total: ${total}`,
    `Name: ${customerName}`,
    `Contact: ${customerPhone}`,
  ].join("\n");
};

export const buildWhatsAppUrl = (message: string): string => {
  const businessNumber = import.meta.env.VITE_BUSINESS_WHATSAPP_NUMBER;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessNumber}?text=${encodedMessage}`;
};