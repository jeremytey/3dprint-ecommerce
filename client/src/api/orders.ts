import { apiClient } from "./axios";
import type { OrderPayload } from "@3dprint/types";

export interface CreatedOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: Record<string, string>;
}

export interface CreatedOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PRINTING" | "DONE";
  whatsappSent: boolean;
  createdAt: string;
  items: CreatedOrderItem[];
}

export const ordersApi = {
  create: async (payload: OrderPayload): Promise<CreatedOrder> => {
    const res = await apiClient.post("/api/orders", payload);
    return res.data.data;
  },
};