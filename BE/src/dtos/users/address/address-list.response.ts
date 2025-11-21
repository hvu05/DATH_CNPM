import z from "zod";

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
})
export const AddressListResponseSchema = z.object({
  user_id: z.string(),
  addresses: z.array(AddressResponseSchema),
});

export type AddressListResponse = z.infer<typeof AddressListResponseSchema>;
