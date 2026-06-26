// server/src/routes/products.ts
import { Router } from "express";
import { productsController } from "../controllers/products.controller";

export const productRoutes = Router();

productRoutes.get("/", productsController.getAll);
productRoutes.get("/:slug", productsController.getBySlug);