import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/route";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import "@/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        {/* RouterProvider bọc toàn bộ ứng dụng và nhận vào router đã cấu hình */}
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);
