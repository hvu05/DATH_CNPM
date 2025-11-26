import { File } from "buffer";
import { ImageFileSchema } from "../../dtos/upload/image";
import { AuthPayload } from "../auth-payload";

declare global {
  namespace Express {
    export interface Request {
      user?: AuthPayload
    }
  }
  export interface BigInt {
    toJSON(): string;
  }
}