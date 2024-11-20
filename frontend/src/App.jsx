import { Routes, Route, Navigate } from "react-router-dom";
import SignInPage from "./pages/Auth/SignInPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import EmailVerificationPage from "./pages/Auth/EmailVerificationPage";
import CompeteDetailsPage from "./pages/Auth/CompeteDetailsPage";
import ForgotPwEmailVerificationPage from "./pages/Auth/ForgotPwEmailVerificationPage";
import ForgotPwOtpConfirmPage from "./pages/Auth/ForgotPwOtpConfirmPage";
import CreateNewPwPage from "./pages/Auth/CreateNewPwPage";
import NoAccessPage from "./pages/NoAccessPage";
import DealsPage from "./pages/User/DealsPage";
import Layout from "./components/utils/Layout";
import AuthLayout from "./components/utils/AuthLayout";
import { ProtectedRoute } from "./components/utils/ProtectedRoute";
import ProductsPage from "./pages/User/ProductsPage";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import Dashboard from "./pages/Admin/DashboardPage";
import UsersPage from "./pages/Admin/UsersPage";
import { useSelector } from "react-redux";
import CategoriesPage from "./pages/User/CategoriesPage";
import BrandsPage from "./pages/User/BrandsPage";

function App() {
  const user = useSelector((state) => state.auth.user);
  
  // Redirect based on user role
  const getHomeRoute = () => {
    if (!user) return "/user/deals";
    return user.role === 'admin' ? "/admin/dashboard" : "/user/deals";
  };

  return (
    <Routes>
      {/* Public and User Routes with Navbar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to={getHomeRoute()} />} />
        <Route path="/user/home" element={<Navigate to="/user/deals" />} />
        
        {/* These routes should only be accessible to non-admin users */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/deals" element={<DealsPage />} />
          <Route path="/user/products" element={<ProductsPage />} />
          <Route path="/user/categories" element={<CategoriesPage />} />
          <Route path="/user/brands" element={<BrandsPage />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminHomePage />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Route>

      {/* Auth Routes without Navbar */}
      <Route element={<AuthLayout />}>
        <Route path="/user/signin" element={<SignInPage />} />
        <Route path="/user/signup" element={<SignUpPage />} />
        <Route path="/user/verify-email" element={<EmailVerificationPage />} />
        <Route path="/user/complete-signup" element={<CompeteDetailsPage />} />
        <Route path="/user/forgot-password/verify-email" element={<ForgotPwEmailVerificationPage />} />
        <Route path="/user/forgot-password/verify-otp" element={<ForgotPwOtpConfirmPage />} />
        <Route path="/user/forgot-password/change-password" element={<CreateNewPwPage />} />
      </Route>

      <Route path="/no-access" element={<NoAccessPage />} />
      <Route path="*" element={<Navigate to="/no-access" replace />} />
    </Routes>
  );
}

export default App;
