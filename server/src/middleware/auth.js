import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./errorHandler.js";
import { User } from "../models/User.js";

export async function requireAuth(req, _res, next) {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : null;
    const token = req.cookies?.access_token || bearer;

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) {
      throw new ApiError(401, "Invalid authentication session");
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }
    next(new ApiError(401, "Invalid or expired token"));
  }
}
