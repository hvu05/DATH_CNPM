export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  role?: string | "CUSTOMER";
  is_active: boolean;
  avatar?: string | null;
  create_at: Date;
  update_at: Date;
}

export interface UserContext {
  user: User | null;
  setUser: (v: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}