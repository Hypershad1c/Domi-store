import { z } from "zod";

export const orderSchema = z.object({
  idempotencyKey: z.string().min(12).max(100),
  customerName: z.string().min(2),
  phone: z.string().min(8),
  city: z.string().min(2),
  address: z.string().min(5),
  note: z.string().max(500).optional().default(""),
  items: z.array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(20) })).min(1)
});

export const quoteSchema = z.object({
  name: z.string().min(2),
  company: z.string().min(2),
  city: z.string().min(2),
  doors: z.number().int().min(1).max(10000),
  model: z.string().min(2),
  message: z.string().min(5).max(2000)
});

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  price: z.number().int().positive(),
  compareAt: z.number().int().positive().optional(),
  shortDesc: z.string().min(10),
  description: z.string().min(20),
  features: z.array(z.string().min(1)).min(1),
  stock: z.number().int().min(0),
  published: z.boolean(),
  featured: z.boolean(),
  hasCamera: z.boolean(),
  faceId: z.boolean(),
  imageUrl: z.string().url().optional()
});

export const orderStatusSchema = z.enum(["NEW", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]);
