import { Router } from "express";
import { deleteAccount, login, logout, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);
router.post("/logout", requireAuth, logout);
router.delete("/account", requireAuth, deleteAccount);

export default router;
