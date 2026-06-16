export interface OrderPayload {
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: OrderItemPayload[];
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: Record<string, string>;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "PRINTING" | "DONE";