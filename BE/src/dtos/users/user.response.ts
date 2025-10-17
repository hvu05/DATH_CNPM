export interface UserResponse {
  id : string ;
  full_name: string;
  email: string;
  phone?: string | null;
  role?: String | "CUSTOMER" ;
  is_active: boolean;
  avatar?: string | null  
  create_at: Date
  update_at: Date
}