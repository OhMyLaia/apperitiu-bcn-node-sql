
import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3).max(1000),
  userId: z.string().uuid(),
  terraceId: z.string().uuid(),
  userName: z.string().min(1).max(100).optional(),
});
