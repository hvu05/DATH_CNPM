import z, { optional } from "zod";
import { UserResponseSchema } from "../user.response";

// export interface AddressListResponse {
//   user_id: string;
//   addresses: {
//     id: number;
//     province: string;
//     ward: string;
//     detail: string;
//   }[];
// };
export const AddressResponseSchema = z.object({
  id: z.number(),
  province: z.string(),
  ward: z.string(),
  detail: z.string(),
  receive_name: z.string().optional().nullable(),
  phone: z.string().length(10, "Phone number must be 10 digits").optional().nullable(),
  user: optional(UserResponseSchema.pick({
    id: true,
    full_name: true,
    avatar: true,
    email: true,
    phone: true
  })),
})
export const AddressListResponseSchema = z.object({
  // user_id: z.string(),
  addresses: z.array(AddressResponseSchema),
});

export type AddressListResponse = z.infer<typeof AddressListResponseSchema>;
