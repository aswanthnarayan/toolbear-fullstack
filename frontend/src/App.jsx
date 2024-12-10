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
import UserProfilePage from './pages/User/UserProfilePage';
import Layout from "./components/utils/Layout";
import AuthLayout from "./components/utils/AuthLayout";
import { ProtectedRoute } from "./components/utils/ProtectedRoute";
import AllProductsPage from "./pages/User/AllProductsPage";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import Dashboard from "./pages/Admin/AdminDashboardPage";
import AdminUsersPage from "./pages/Admin/AdminUsersPage";
import { useSelector } from "react-redux";
import CategoriesPage from "./pages/User/CategoriesPage";
import BrandsPage from "./pages/User/BrandsPage";
import AdminCategoriesPage from "./pages/Admin/AdminCategoriesPage";
import AddCategoryPage from "./pages/Admin/AddCategoryPage";
import EditCategoryPage from "./pages/Admin/EditCategoryPage";
import AdminProductsPage from "./pages/Admin/AdminProductsPage";
import AdminBrandsPage from "./pages/Admin/AdminBrandsPage";
import AddBrandPage from "./pages/Admin/AddBrandPage";
import EditBrandPage from "./pages/Admin/EditBrandPage";
import AddProductPage from "./pages/Admin/AddProductPage";
import EditProductPage from "./pages/Admin/EditProductPage";
import SingleProductPage from "./pages/User/SingleProductPage";
import EditProfileSection from "./components/Users/profile/sections/EditProfileSection";
import OrdersSection from "./components/Users/profile/sections/OrdersSection";
import AddressSection from "./components/Users/profile/sections/AddressSection";
import PaymentMethodsSection from "./components/Users/profile/sections/PaymentMethodsSection";
import WalletSection from "./components/Users/profile/sections/WalletSection";
import CouponsSection from "./components/Users/profile/sections/CouponsSection";
import CartPage from "./pages/User/CartPage";
import CheckoutPage from "./pages/User/CheckoutPage";
import PurchasePaymentPage from "./pages/User/PurchasePaymentPage";
import OrderCompletePage from "./pages/User/OrderCompletePage";

function App() {
  const user = useSelector((state) => state.auth.user);
  
  // Redirect based on user role
  const getHomeRoute = () => {
    if (!user) return "/user/deals";
    return user.role === 'admin' ? "/admin/dashboard" : "/user/deals";
  };

  return (
    <Routes>
      {/* Public and Protected Routes with Navbar */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to={getHomeRoute()} />} />
        <Route path="/user/home" element={<Navigate to="/user/deals" />} />
        <Route path="/user/deals" element={<DealsPage />} />
        <Route path="/user/all-products" element={<AllProductsPage />} />
        <Route path="/user/categories" element={<CategoriesPage />} />
        <Route path="/user/brands" element={<BrandsPage />} />
        <Route path="/user/products/:id" element={<SingleProductPage />} />

        {/* Protected User Routes (still within Layout) */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
        <Route path="/user/cart" element={<CartPage />} />
        <Route path="/user/checkout" element={<CheckoutPage />} />
        <Route path="/user/checkout/payments" element={<PurchasePaymentPage />} />
        <Route path="/user/checkout/success" element={<OrderCompletePage />} />

          <Route path="/user/profile" element={<UserProfilePage />}>
            <Route index element={<Navigate to="edit" />} />
            <Route path="edit" element={<EditProfileSection />} />
            <Route path="orders" element={<OrdersSection />} />
            <Route path="address" element={<AddressSection />} />
            <Route path="payment" element={<PaymentMethodsSection />} />
            <Route path="wallet" element={<WalletSection />} />
            <Route path="coupons" element={<CouponsSection />} />
          </Route>
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminHomePage />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="categories/new" element={<AddCategoryPage />} />
          <Route path="categories/edit/:id" element={<EditCategoryPage />} />
          <Route path="brands" element={<AdminBrandsPage/>} />
          <Route path="brands/new" element={<AddBrandPage />} />
          <Route path="brands/edit/:id" element={<EditBrandPage />} />
          <Route path="products" element={<AdminProductsPage/>} />
          <Route path="products/new" element={<AddProductPage/>} />
          <Route path="products/edit/:id" element={<EditProductPage />} />
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
      {/* <Route path="*" element={<Navigate to="/no-access" replace />} /> */}
    </Routes>
  );
}

export default App;
