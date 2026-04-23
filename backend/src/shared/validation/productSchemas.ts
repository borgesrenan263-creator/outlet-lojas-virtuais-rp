import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(200),
    description: z.string().max(2000).optional(),
    price: z.number().positive(),
    stockQuantity: z.number().int().min(0),
    images: z.array(z.string().url()).optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    name: z.string().min(3).max(200).optional(),
    description: z.string().max(2000).optional().nullable(),
    price: z.number().positive().optional(),
    stockQuantity: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
    images: z.array(z.string().url()).optional(),
  }),
});
