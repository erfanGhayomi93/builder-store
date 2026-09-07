import { z } from 'zod';
export const directionSchema = z.enum(['rtl', 'ltr']);
export const healthResponseSchema = z.object({ status: z.literal('ok'), service: z.literal('api') });

