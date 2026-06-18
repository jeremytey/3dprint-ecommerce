// server/src/repositories/orders.repository.ts
import { prisma } from "../lib/prisma";
import { CreateOrderInput } from "../validators/order.schema";

export const ordersRepository = {
  create: (data: CreateOrderInput) =>
    prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: "",   // resolved in service layer
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            selectedOptions: item.selectedOptions,
          })),
        },
      },
      include: { items: true },
    }),

  findAll: () =>
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),

  findById: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: { items: true },
    }),

  updateStatus: (id: string, status: "PENDING" | "CONFIRMED" | "PRINTING" | "DONE") =>
    prisma.order.update({
      where: { id },
      data: { status },
    }),
};