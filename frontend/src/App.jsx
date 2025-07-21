import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/utils/Layout";
import AuthLayout from "./components/utils/AuthLayout";
import { ProtectedRoute } from "./components/utils/ProtectedRoute";
import { useSelector } from "react-redux";
import CustomSpinner from './components/utils/CustomSpinner';

// Lazy-loaded page components
const SignInPage = lazy(() => import("./pages/Auth/SignInPage"));
const SignUpPage = lazy(() => import("./pages/Auth/SignUpPage"));
const EmailVerificationPage = lazy(() => import("./pages/Auth/EmailVerificationPage"));
const CompeteDetailsPage = lazy(() => import("./pages/Auth/CompeteDetailsPage"));
const ForgotPwEmailVerificationPage = lazy(() => import("./pages/Auth/ForgotPwEmailVerificationPage"));
const ForgotPwOtpConfirmPage = lazy(() => import("./pages/Auth/ForgotPwOtpConfirmPage"));
const CreateNewPwPage = lazy(() => import("./pages/Auth/CreateNewPwPage"));
const NoAccessPage = lazy(() => import("./pages/NoAccessPage"));
const DealsPage = lazy(() => import("./pages/User/DealsPage"));
const UserProfilePage = lazy(() => import('./pages/User/UserProfilePage'));
const AllProductsPage = lazy(() => import("./pages/User/AllProductsPage"));
const AdminHomePage = lazy(() => import("./pages/Admin/AdminHomePage"));
const Dashboard = lazy(() => import("./pages/Admin/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("./pages/Admin/AdminUsersPage"));
const CategoriesPage = lazy(() => import("./pages/User/CategoriesPage"));
const BrandsPage = lazy(() => import("./pages/User/BrandsPage"));
const AdminCategoriesPage = lazy(() => import("./pages/Admin/AdminCategoriesPage"));
const AddCategoryPage = lazy(() => import("./pages/Admin/AddCategoryPage"));
const EditCategoryPage = lazy(() => import("./pages/Admin/EditCategoryPage"));
const AdminProductsPage = lazy(() => import("./pages/Admin/AdminProductsPage"));
const AdminBrandsPage = lazy(() => import("./pages/Admin/AdminBrandsPage"));
const AddBrandPage = lazy(() => import("./pages/Admin/AddBrandPage"));
const EditBrandPage = lazy(() => import("./pages/Admin/EditBrandPage"));
const AddProductPage = lazy(() => import("./pages/Admin/AddProductPage"));
const EditProductPage = lazy(() => import("./pages/Admin/EditProductPage"));
const SingleProductPage = lazy(() => import("./pages/User/SingleProductPage"));
const EditProfileSection = lazy(() => import("./components/Users/profile/sections/EditProfileSection"));
const OrdersSection = lazy(() => import("./components/Users/profile/sections/OrdersSection"));
const AddressSection = lazy(() => import("./components/Users/profile/sections/AddressSection"));
const WalletSection = lazy(() => import("./components/Users/profile/sections/WalletSection"));
const CouponsSection = lazy(() => import("./components/Users/profile/sections/CouponsSection"));
const CartPage = lazy(() => import("./pages/User/CartPage"));
const CheckoutPage = lazy(() => import("./pages/User/CheckoutPage"));
const PurchasePaymentPage = lazy(() => import("./pages/User/PurchasePaymentPage"));
const OrderCompletePage = lazy(() => import("./pages/User/OrderCompletePage"));
const OrderPaymentFailPage = lazy(() => import("./pages/User/OrderPaymentFailPage"));
const AdminOrdersPage = lazy(() => import("./pages/Admin/AdminOrdersPage"));
const WishlistPage = lazy(() => import("./pages/User/WishlistPage"));
const ReturnedRequestPage = lazy(() => import("./components/Admin/ReturnedRequestPage"));
const AdminCouponPage = lazy(() => import("./pages/Admin/AdminCouponPage"));
const AddCouponPage = lazy(() => import("./pages/Admin/AddCouponPage"));
const FilterdCatefgoryOrBrandPage = lazy(() => import("./pages/User/FilterdCatefgoryOrBrandPage"));
const BrandStore = lazy(() => import("./components/Users/BrandStore"));
const OrderDetailsPage = lazy(() => import("./pages/User/OrderDetailsPage"));
const AdminSingleOrderPage = lazy(() => import("./pages/Admin/AdminSingleOrderPage"));
const AdminBannerPage = lazy(() => import("./pages/Admin/AdminBannerPage"));

function App() {
  const user = useSelector((state) => state.auth.user);
  
  // Redirect based on user role
  const getHomeRoute = () => {
    if (!user) return "/user/deals";
    return user.role === 'admin' ? "/admin/dashboard" : "/user/deals";
  };

  return (
    <Suspense fallback={<CustomSpinner/>}>
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
          <Route path="/category/:id" element={<FilterdCatefgoryOrBrandPage />} />
          <Route path="/brand/:id" element={<FilterdCatefgoryOrBrandPage />} />
          <Route path="/brand-store/:id" element={<BrandStore />} />

          {/* Protected User Routes (still within Layout) */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user/wishlist" element={<WishlistPage />} />
          <Route path="/user/cart" element={<CartPage />} />
          <Route path="/user/checkout" element={<CheckoutPage />} />
          <Route path="/user/checkout/payments" element={<PurchasePaymentPage />} />
          <Route path="/user/checkout/success" element={<OrderCompletePage />} />
          <Route path="/user/checkout/payment/fail" element={<OrderPaymentFailPage />} />
          <Route path="/user/orders/:orderId" element={<OrderDetailsPage />} />

            <Route path="/user/profile" element={<UserProfilePage />}>
              <Route index element={<Navigate to="edit" />} />
              <Route path="edit" element={<EditProfileSection />} />
              <Route path="orders" element={<OrdersSection />} />
              <Route path="address" element={<AddressSection />} />
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
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="orders/:orderId" element={<AdminSingleOrderPage />} />
            <Route path="orders/return" element={<ReturnedRequestPage />} />
            <Route path="coupons" element={<AdminCouponPage />} />
            <Route path="/admin/coupons/new" element={<AddCouponPage />} />
            <Route path="/admin/banners" element={<AdminBannerPage />} />


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
    </Suspense>
  );
}

export default App;
