// server/src/controllers/orders.controller.ts
import { Request, Response, NextFunction } from "express";
import { ordersService } from "../services/orders.service";
import { createOrderSchema } from "../validators/order.schema";
import { AppError } from "../utils/AppError";

export const ordersController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = createOrderSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError(parsed.error.issues[0].message, 400);
      }

      const order = await ordersService.create(parsed.data);
      res.status(201).json({ status: "success", data: order });
    } catch (err) {
      next(err);
    }
  },
};