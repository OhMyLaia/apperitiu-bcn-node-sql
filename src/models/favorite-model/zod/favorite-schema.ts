
import { z } from 'zod';

export const favoriteSchema = z.object({
  userId: z.string().uuid(),
  terraceId: z.string().uuid(),
});