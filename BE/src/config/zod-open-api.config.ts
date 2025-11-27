import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const zCoerceObject = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  }, schema);

export const zCoerceArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    // case 1: string (form-data)
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch (err) {
        return value;
      }
    }

    // case 2: object => bọc thành array
    if (value && !Array.isArray(value)) {
      return [value];
    }

    return value;
  }, z.array(schema));

