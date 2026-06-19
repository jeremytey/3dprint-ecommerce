// server/src/routes/orders.ts
import { Router } from "express";
import { ordersController } from "../controllers/orders.controller";

export const orderRoutes = Router();

orderRoutes.post("/", ordersController.create);