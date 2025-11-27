import { spec } from "node:test/reporters";
import z from "zod";

export const ProductSpecCreateSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z.string().nonempty("Value is required"),
});

export type ProductSpecCreate = z.infer<typeof ProductSpecCreateSchema>;