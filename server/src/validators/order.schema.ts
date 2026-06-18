// server/src/validators/order.schema.ts
import { z } from "zod";

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerPhone: z.string().trim().min(1, "Phone is required"),
  totalAmount: z.number().positive("Total must be positive"),
  items: z
    .array(
      z.object({
        productId: z.string().cuid("Invalid product ID"),
        quantity: z.number().int().positive("Quantity must be positive"),
        unitPrice: z.number().positive("Unit price must be positive"),
        selectedOptions: z.record(z.string(), z.string()),
      })
    )
    .min(1, "Order must have at least one item"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;