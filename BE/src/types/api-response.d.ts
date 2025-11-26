/**
 * @deprecated Dùng type ApiResponse trong dtos/common/api-response
 */
export interface ApiResponse<T> {
  success: boolean;
  message? :string; // Thông báo 
  data?: T;
  error?: string; // Stack error
}