// server/src/services/orders.service.ts
import { productsRepository } from "../repositories/products.repository";
import { ordersRepository } from "../repositories/orders.repository";
import { AppError } from "../utils/AppError";
import { CreateOrderInput } from "../validators/order.schema";

export const ordersService = {
  create: async (data: CreateOrderInput) => {
    const productIds = [...new Set(data.items.map((i) => i.productId))];
    const products = await productsRepository.findManyWithOptionsByIds(productIds);
    const productMap = new Map(products.map((p) => [p.id, p]));

    let recomputedTotal = 0;

    const enrichedItems = data.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found.`, 404);
      }

      // Validate every selected optionGroupId/optionValueId actually belongs
      // to this product, and accumulate price modifiers.
      let unitPrice = product.basePrice;

      for (const [groupId, valueId] of Object.entries(item.selectedOptions)) {
        const group = product.optionGroups.find((g) => g.id === groupId);
        if (!group) {
          throw new AppError(
            `Option group ${groupId} does not belong to product ${product.id}.`,
            400
          );
        }
        const value = group.optionValues.find((v) => v.id === valueId);
        if (!value) {
          throw new AppError(
            `Option value ${valueId} does not belong to group ${groupId}.`,
            400
          );
        }
        unitPrice += value.priceModifier;
      }

      const lineTotal = unitPrice * item.quantity;
      recomputedTotal += lineTotal;

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice, // server-computed — client value discarded
        selectedOptions: item.selectedOptions,
      };
    });

    return ordersRepository.create({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      totalAmount: recomputedTotal, // server-computed — client value discarded
      items: enrichedItems,
    });
  },
};