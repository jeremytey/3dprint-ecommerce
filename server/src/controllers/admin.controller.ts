// server/src/controllers/admin.controller.ts
import { Request, Response, NextFunction } from "express";
import { adminService } from "../services/admin.service";
import { AppError } from "../utils/AppError";

export const adminController = {
  getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await adminService.getAllOrders();
      res.json({ status: "success", data: orders });
    } catch (err) {
      next(err);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      throw new AppError("Invalid order ID.", 400);
    }
    const { status } = req.body;
    const order = await adminService.updateStatus(id, status);
    res.json({ status: "success", data: order });
  } catch (err) {
    next(err);
  }
},
};