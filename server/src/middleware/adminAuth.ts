// server/src/middleware/adminAuth.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const adminAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = process.env.ADMIN_TOKEN;
  const clientToken = req.headers["x-admin-token"];

  if (!token) {
    return next(new AppError("Server misconfiguration: ADMIN_TOKEN not set.", 500));
  }

  if (!clientToken || clientToken !== token) {
    return next(new AppError("Unauthorized.", 401));
  }

  next();
};