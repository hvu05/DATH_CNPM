import z from 'zod';
import { ImageFileSchema } from '../upload/image';

export const OrderReturnRequestSchema = z.object({
  reason: z.string().nonempty('Reason is required'),
  images: z.array(ImageFileSchema).min(0).max(5).optional(),
});

export type OrderReturnRequest = z.infer<typeof OrderReturnRequestSchema>;
