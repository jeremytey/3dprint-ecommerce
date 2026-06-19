// server/src/services/orders.service.ts
import { prisma } from "../lib/prisma";
import { ordersRepository } from "../repositories/orders.repository";
import { AppError } from "../utils/AppError";
import { CreateOrderInput } from "../validators/order.schema";

export const ordersService = {
  create: async (data: CreateOrderInput) => {
    // Resolve product names for snapshot — never trust client-sent names
    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p.name]));

    // Validate all productIds exist
    for (const item of data.items) {
      if (!productMap.has(item.productId)) {
        throw new AppError(`Product ${item.productId} not found.`, 404);
      }
    }

    const enrichedData = {
      ...data,
      items: data.items.map((item) => ({
        ...item,
        productName: productMap.get(item.productId)!,
      })),
    };

    return ordersRepository.create(enrichedData);
  },
};