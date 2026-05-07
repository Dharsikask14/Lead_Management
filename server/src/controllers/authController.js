import { authCookieOptions, loginUser, registerUser, signAccessToken } from "../services/authService.js";
import { Lead } from "../models/Lead.js";
import { User } from "../models/User.js";

function setAuthCookie(res, userId) {
  const token = signAccessToken(userId);
  res.cookie("access_token", token, authCookieOptions());
}

export async function register(req, res, next) {
  try {
    const user = await registerUser(req.body);
    setAuthCookie(res, user._id.toString());
    res.status(201).json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await loginUser(req.body);
    setAuthCookie(res, user._id.toString());
    res.json({ user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  res.json({ user: req.user });
}

export function logout(_req, res) {
  res.clearCookie("access_token", authCookieOptions());
  res.status(204).send();
}

export async function deleteAccount(req, res, next) {
  try {
    await Lead.deleteMany({ userId: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie("access_token", authCookieOptions());
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
