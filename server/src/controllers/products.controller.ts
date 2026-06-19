// server/src/controllers/products.controller.ts
import { Request, Response, NextFunction } from "express";
import { productsService } from "../services/products.service";
import { AppError } from "../utils/AppError";

export const productsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await productsService.getAll();
      res.json({ status: "success", data: products });
    } catch (err) {
      next(err);
    }
  },

  getBySlug: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    if (typeof slug !== "string") {
      throw new AppError("Invalid product slug.", 400);
    }
    const product = await productsService.getBySlug(slug);
    res.json({ status: "success", data: product });
  } catch (err) {
    next(err);
  }
},
};