import { z } from 'zod';

export const addItemSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive().optional().default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
  body: z.object({
    quantity: z.number().int().positive(),
  }),
});
