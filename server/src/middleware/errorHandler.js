import { ZodError } from "zod";
import { env } from "../config/env.js";

export class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function notFound(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, next) {
  void next;

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.errors.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource identifier" });
  }

  if (error.code === 11000) {
    return res.status(409).json({ message: "A record with that value already exists" });
  }

  const statusCode = error.statusCode || 500;
  const response = {
    message: error.message || "Internal server error"
  };

  if (error.details) {
    response.details = error.details;
  }

  if (!env.isProduction) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
}
