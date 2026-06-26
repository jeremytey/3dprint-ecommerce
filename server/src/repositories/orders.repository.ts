// server/src/repositories/orders.repository.ts
import { prisma } from "../lib/prisma";

interface OrderItemWithName {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  selectedOptions: Record<string, string>;
}

interface CreateOrderData {
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: OrderItemWithName[];
}

export const ordersRepository = {
  create: (data: CreateOrderData) =>
    prisma.order.create({
      data: {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        totalAmount: data.totalAmount,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
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