// server/src/routes/admin.ts
import { Router } from "express";
import { adminAuth } from "../middleware/adminAuth";
import { adminController } from "../controllers/admin.controller";

export const adminRoutes = Router();

adminRoutes.use(adminAuth);

adminRoutes.get("/orders", adminController.getAllOrders);
adminRoutes.patch("/orders/:id/status", adminController.updateStatus);