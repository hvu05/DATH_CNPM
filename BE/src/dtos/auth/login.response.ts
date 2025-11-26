import z from "zod";
export const LoginResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
})

export type LoginResponse = z.infer<typeof LoginResponseSchema>

// export interface LoginResponse {
//   access_token: string
//   refresh_token: string
// }
