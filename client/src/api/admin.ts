import { apiClient } from "./axios";

export interface AdminOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: Record<string, string>;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PRINTING" | "DONE";
  whatsappSent: boolean;
  createdAt: string;
  items: AdminOrderItem[];
}

export const adminApi = {
  getAllOrders: async (token: string): Promise<AdminOrder[]> => {
    const res = await apiClient.get("/api/admin/orders", {
      headers: { "x-admin-token": token },
    });
    return res.data.data;
  },

  updateStatus: async (
    token: string,
    id: string,
    status: AdminOrder["status"]
  ): Promise<AdminOrder> => {
    const res = await apiClient.patch(
      `/api/admin/orders/${id}/status`,
      { status },
      { headers: { "x-admin-token": token } }
    );
    return res.data.data;
  },
};