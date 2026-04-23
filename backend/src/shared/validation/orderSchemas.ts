import { z } from 'zod';

export const checkoutSchema = z.object({
  body: z.object({
    addressId: z.number().int().positive(),
    paymentMethod: z.enum(['pix', 'credit_card', 'cash_on_delivery']),
  }),
});
