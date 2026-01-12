import { z } from 'zod';

export const promoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number(),
  status: z.boolean()
});

export type promoSchema = z.infer<typeof promoSchema>;