import { z } from "zod";
import { LEAD_STATUSES } from "../models/Lead.js";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

const leadPayload = z.object({
  leadName: z.string().trim().min(1, "Lead name is required").max(120),
  companyName: z.string().trim().min(1, "Company name is required").max(120),
  email: z.string().trim().email("Enter a valid email").toLowerCase(),
  phoneNumber: z
    .string()
    .trim()
    .min(7, "Phone number must be at least 7 characters")
    .max(30)
    .regex(/^[+()\-\s\d.]+$/, "Phone number contains unsupported characters"),
  serviceInterested: z.string().trim().min(1, "Service interested is required").max(120),
  status: z.enum(LEAD_STATUSES).default("New"),
  notes: z.string().trim().max(2000).optional().default("")
});

export const createLeadSchema = z.object({
  body: leadPayload
});

export const updateLeadSchema = z.object({
  params: z.object({ id: objectId }),
  body: leadPayload.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required"
  })
});

export const leadIdSchema = z.object({
  params: z.object({ id: objectId })
});

export const listLeadsSchema = z.object({
  query: z.object({
    q: z.string().trim().max(100).optional(),
    status: z.enum(LEAD_STATUSES).optional(),
    page: z.coerce.number().int().positive().max(10000).default(1),
    limit: z.coerce.number().int().positive().max(100).default(10)
  })
});
