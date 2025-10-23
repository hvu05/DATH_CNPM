import { useAuthContext } from "@/contexts/AuthContext"
import { Navigate } from "react-router"

interface IProps {
    children: React.ReactNode
    allow?: Role | null
    restrictedForAuthenticated?: boolean
}

export const ProtectedRoute = ({
    children,
    allow = null,
    restrictedForAuthenticated = false
}: IProps): React.ReactNode => {
    const { user, isLoggedIn } = useAuthContext();
    if ((restrictedForAuthenticated && isLoggedIn) || (isLoggedIn && user && user.role !== allow) || !isLoggedIn && allow) {
        return <Navigate to={'/'} replace />
    }
    return <>{children} </>
}