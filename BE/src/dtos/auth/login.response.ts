import { User } from "@prisma/client";
import z from "zod";

export interface LoginResponse {
  access_token: string
  refresh_token: string
}