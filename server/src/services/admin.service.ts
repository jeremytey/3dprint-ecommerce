// server/src/services/admin.service.ts
import { ordersRepository } from "../repositories/orders.repository";
import { AppError } from "../utils/AppError";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "PRINTING", "DONE"] as const;
type OrderStatus = typeof VALID_STATUSES[number];

export const adminService = {
  getAllOrders: () => ordersRepository.findAll(),

  updateStatus: async (id: string, status: string) => {
    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      throw new AppError(`Invalid status: ${status}`, 400);
    }

    const order = await ordersRepository.findById(id);
    if (!order) throw new AppError("Order not found.", 404);

    return ordersRepository.updateStatus(id, status as OrderStatus);
  },
};