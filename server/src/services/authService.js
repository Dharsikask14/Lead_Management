import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";
import { User } from "../models/User.js";

export function signAccessToken(userId) {
  return jwt.sign({}, env.jwtSecret, {
    subject: userId,
    expiresIn: env.jwtExpiresIn
  });
}

export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashedPassword });

  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
}
