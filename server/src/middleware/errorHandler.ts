// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  if (
    err.name === "PrismaClientKnownRequestError" ||
    err.name === "PrismaClientValidationError"
  ) {
    res.status(400).json({
      status: "fail",
      message: "Invalid request parameters.",
    });
    return;
  }

  console.error("💥 UNHANDLED ERROR:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
};