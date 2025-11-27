import { UserResponse } from '../users';

export interface UserListResponse {
  users: UserResponse[];
  total: number;
  page: number;
  limit: number;
  filters?: {
    sortBy?: string;
    sortOrder?: string;
    roles?: string[];
    isActive?: boolean[];
    search?: string;
  };
}
