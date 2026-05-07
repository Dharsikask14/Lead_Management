import { Router } from "express";
import { create, getOne, list, remove, update } from "../controllers/leadController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createLeadSchema, leadIdSchema, listLeadsSchema, updateLeadSchema } from "../validators/leadSchemas.js";

const router = Router();

router.use(requireAuth);

router.get("/", validate(listLeadsSchema), list);
router.post("/", validate(createLeadSchema), create);
router.get("/:id", validate(leadIdSchema), getOne);
router.patch("/:id", validate(updateLeadSchema), update);
router.delete("/:id", validate(leadIdSchema), remove);

export default router;
