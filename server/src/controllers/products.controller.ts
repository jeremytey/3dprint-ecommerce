// server/src/controllers/products.controller.ts
import { Request, Response, NextFunction } from "express";
import { productsService } from "../services/products.service";

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
      const product = await productsService.getBySlug(req.params.slug);
      res.json({ status: "success", data: product });
    } catch (err) {
      next(err);
    }
  },
};