export interface ApiResponse<T> {
  success: boolean;
  message? :string; // Thông báo 
  data?: T;
  error?: string; // Stack error
}
