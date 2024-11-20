import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useSelector((state) => state.auth); 
    
    if (!user) {
      return <Navigate to="/user/signin" />;
    }
  
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/user/home" />;
    }
  
    return <Outlet />;
};