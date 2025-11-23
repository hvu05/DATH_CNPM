import z from "zod";
import { OrderStatus } from "./enum";

export const StaffOrderUpdateSchema = z.object({
  status: z.enum(OrderStatus)
})

export type StaffOrderUpdate = z.infer<typeof StaffOrderUpdateSchema>