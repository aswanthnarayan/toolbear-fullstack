import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { logout } from "../../../App/features/slices/authSlice";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    if (!user) {
        return <Navigate to="/user/signin" />;
    }

    // Check if user is blocked
    if (user.isBlocked) {
        dispatch(logout());
        return <Navigate to="/user/signin" />;
    }
  
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/user/home" />;
    }
  
    return <Outlet />;
};