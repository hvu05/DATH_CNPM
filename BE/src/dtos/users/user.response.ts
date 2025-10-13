export interface UserResponse {
  id : string ;
  full_name: string;
  email: string;
  phone?: string | null;
  role?: String | "Customer" ;
  is_active: boolean;
  avatar?: Uint8Array | null;
}