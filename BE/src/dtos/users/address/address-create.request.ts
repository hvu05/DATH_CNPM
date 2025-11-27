import z from 'zod';

export const AddressCreateSchema = z.object({
  receive_name : z.string().optional(),
  phone: z.string().length(10, "Phone number must be 10 digits").optional(),
  province : z.string().nonempty("Province is required"),
  ward : z.string().nonempty("Ward is required"),
  detail : z.string().nonempty("Street is required"),
})

export type AddressCreateRequest = z.infer<typeof AddressCreateSchema>;
