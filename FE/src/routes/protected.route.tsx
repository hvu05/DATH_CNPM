import { useAuthContext } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface IProps {
  children: React.ReactNode;
  allow?: Role | null;
  restrictedForAuthenticated?: boolean;
}

export const ProtectedRoute = ({
  children,
  allow = null,
  restrictedForAuthenticated = false,
}: IProps): React.ReactNode => {
  const { user, isLoggedIn, isLoading } = useAuthContext();

  // If still loading authentication state, show loading or nothing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Check access conditions after loading is complete
  const hasAccess =
    // If route is restricted for authenticated users and user is logged in
    (restrictedForAuthenticated && isLoggedIn) ||
    // If route requires specific role and user doesn't have that role
    (isLoggedIn && user && user.role !== allow) ||
    // If route requires authentication but user is not logged in
    (!isLoggedIn && allow);

  if (hasAccess) {
    return <Navigate to={"/"} replace />;
  }

  return <>{children}</>;
};
