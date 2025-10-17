import z from "zod";

export const AddressCreateSchema = z.object({
  province : z.string().nonempty("Province is required"),
  ward : z.string().nonempty("Ward is required"),
  detail : z.string().nonempty("Street is required"),
})

export type AddressCreateRequest = z.infer<typeof AddressCreateSchema>