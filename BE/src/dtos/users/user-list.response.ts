import { UserResponse } from "./user.response";

export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page?: number;
  limit?: number;
}