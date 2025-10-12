export interface UserCreateRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string | null;
  role_id: number;  
}