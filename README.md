# Toolbear: E-commerce Website

## Live Demo
Check out the live application at [Toolbear Live](https://toolbear.shop).

## Description
Developed a full-stack e-commerce platform using the MERN stack featuring user authentication, product catalog, shopping cart functionality, and secure payment integration with Redux state management.

Engineered a secure authentication system with JWT, email verification, and role-based access control (RBAC), integrated with Firebase for media storage and user management.

Implemented a comprehensive admin dashboard with sales analytics, order management, and inventory tracking, utilizing MVC architecture for scalable code organization.

Built promotional features including a coupon management system, product review functionality, and dynamic pricing, enhancing user engagement and sales conversions.

Created a responsive UI with Tailwind CSS, featuring advanced product filtering, real-time cart updates, and intuitive checkout process for optimal user experience.

Deployed and maintained the application on Google Cloud Platform (GCP) with continuous integration, ensuring high availability and optimal performance for users.

## Dependencies
- **bcryptjs**: For password hashing.
- **cloudinary**: For image uploads and management.
- **cookie-parser**: For parsing cookies.
- **dotenv**: For environment variable management.
- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling tool.
- **nodemailer**: For sending emails.
- **razorpay**: Payment gateway integration.
- **pdfkit**: For generating PDF documents.
- **multer**: Middleware for handling multipart/form-data, used for uploading files.
- **jsonwebtoken**: For implementing JWT authentication.
- **exceljs**: For reading and writing Excel files.
- **crypto**: For cryptographic functions.
- **datauri**: For converting data to a URI format.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/aswanthnarayan/toolbear-fullstack.git
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Navigate to the frontend directory and install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Create a `.env` file in the backend and frontend directory and add your environment variables.

## Usage
To run the application:
1. Start the backend server:
   ```bash
   npm run server
   ```
2. In another terminal, start the frontend:
   ```bash
   npm run client
   ```
3. Access the application at `http://localhost:3000`.

## Scripts
- **start**: Runs the backend server.
- **server**: Uses nodemon to run the backend server with auto-reload.
- **client**: Runs the frontend development server.
- **dev**: Runs both the backend and frontend servers concurrently.

```
ToolBear
├─ README.md
├─ backend
│  ├─ config
│  │  └─ database.js
│  ├─ constants
│  │  ├─ httpStatus.js
│  │  └─ messages.js
│  ├─ controllers
│  │  ├─ Admin
│  │  │  ├─ OrderController.js
│  │  │  ├─ bannerController.js
│  │  │  ├─ brandController.js
│  │  │  ├─ categoryController.js
│  │  │  ├─ couponController.js
│  │  │  ├─ productController.js
│  │  │  ├─ salesController.js
│  │  │  └─ userController.js
│  │  ├─ Auth
│  │  │  └─ authController.js
│  │  └─ Users
│  │     ├─ AddressController.js
│  │     ├─ CartController.js
│  │     ├─ CouponController.js
│  │     ├─ FilterdQuieriesController.js
│  │     ├─ OrderController.js
│  │     ├─ ProfileController.js
│  │     ├─ ReviewController.js
│  │     ├─ WalletController.js
│  │     └─ WishlistController.js
│  ├─ middleware
│  │  ├─ authMiddleware.js
│  │  └─ multerMiddleWare.js
│  ├─ models
│  │  ├─ AddressSchema.js
│  │  ├─ BannerSchema.js
│  │  ├─ BrandSchema.js
│  │  ├─ CartSchema.js
│  │  ├─ CategorySchema.js
│  │  ├─ CouponSchema.js
│  │  ├─ OrderSchema.js
│  │  ├─ OtpSchema.js
│  │  ├─ ProductSchema.js
│  │  ├─ ReviewSchema.js
│  │  ├─ UserSchema.js
│  │  ├─ WalletSchema.js
│  │  └─ WishlistSchema.js
│  ├─ routes
│  │  ├─ adminRoutes.js
│  │  ├─ authRoutes.js
│  │  └─ userRoutes.js
│  ├─ server.js
│  └─ utils
│     ├─ cloudinaryConfig.js
│     ├─ generateOrderId.js
│     └─ generateToken.js
├─ frontend
│  ├─ .vite
│  │  └─ deps
│  │     ├─ @heroicons_react_24_outline.js
│  │     ├─ @heroicons_react_24_outline.js.map
│  │     ├─ @material-tailwind_react.js
│  │     ├─ @material-tailwind_react.js.map
│  │     ├─ @reduxjs_toolkit.js
│  │     ├─ @reduxjs_toolkit.js.map
│  │     ├─ @reduxjs_toolkit_query_react.js
│  │     ├─ @reduxjs_toolkit_query_react.js.map
│  │     ├─ _metadata.json
│  │     ├─ chunk-2X33BNKP.js
│  │     ├─ chunk-2X33BNKP.js.map
│  │     ├─ chunk-3JJPDTVM.js
│  │     ├─ chunk-3JJPDTVM.js.map
│  │     ├─ chunk-ECWTWNUD.js
│  │     ├─ chunk-ECWTWNUD.js.map
│  │     ├─ chunk-EWTE5DHJ.js
│  │     ├─ chunk-EWTE5DHJ.js.map
│  │     ├─ chunk-J4KOQHYD.js
│  │     ├─ chunk-J4KOQHYD.js.map
│  │     ├─ chunk-JCH7QQEQ.js
│  │     ├─ chunk-JCH7QQEQ.js.map
│  │     ├─ chunk-MBT3EELI.js
│  │     ├─ chunk-MBT3EELI.js.map
│  │     ├─ chunk-P2XIBMDM.js
│  │     ├─ chunk-P2XIBMDM.js.map
│  │     ├─ chunk-SD42HLFO.js
│  │     ├─ chunk-SD42HLFO.js.map
│  │     ├─ chunk-UHINIFCJ.js
│  │     ├─ chunk-UHINIFCJ.js.map
│  │     ├─ chunk-W4EHDCLL.js
│  │     ├─ chunk-W4EHDCLL.js.map
│  │     ├─ firebase_app.js
│  │     ├─ firebase_app.js.map
│  │     ├─ firebase_auth.js
│  │     ├─ firebase_auth.js.map
│  │     ├─ firebase_firestore.js
│  │     ├─ firebase_firestore.js.map
│  │     ├─ firebase_storage.js
│  │     ├─ firebase_storage.js.map
│  │     ├─ framer-motion.js
│  │     ├─ framer-motion.js.map
│  │     ├─ package.json
│  │     ├─ prop-types.js
│  │     ├─ prop-types.js.map
│  │     ├─ react-cropper.js
│  │     ├─ react-cropper.js.map
│  │     ├─ react-dom_client.js
│  │     ├─ react-dom_client.js.map
│  │     ├─ react-hook-form.js
│  │     ├─ react-hook-form.js.map
│  │     ├─ react-icons_fa.js
│  │     ├─ react-icons_fa.js.map
│  │     ├─ react-icons_fa6.js
│  │     ├─ react-icons_fa6.js.map
│  │     ├─ react-icons_fi.js
│  │     ├─ react-icons_fi.js.map
│  │     ├─ react-redux.js
│  │     ├─ react-redux.js.map
│  │     ├─ react-router-dom.js
│  │     ├─ react-router-dom.js.map
│  │     ├─ react.js
│  │     ├─ react.js.map
│  │     ├─ redux-persist.js
│  │     ├─ redux-persist.js.map
│  │     ├─ redux-persist_integration_react.js
│  │     ├─ redux-persist_integration_react.js.map
│  │     ├─ redux-persist_lib_storage.js
│  │     └─ redux-persist_lib_storage.js.map
│  ├─ App
│  │  ├─ features
│  │  │  ├─ rtkApis
│  │  │  │  ├─ adminApi.js
│  │  │  │  ├─ authApi.js
│  │  │  │  └─ userApi.js
│  │  │  └─ slices
│  │  │     ├─ authSlice.js
│  │  │     ├─ checkoutSlice.js
│  │  │     ├─ themeSlice.js
│  │  │     └─ wishlistSlice.js
│  │  └─ store.js
│  ├─ README.md
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  └─ fav-icon.png
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  ├─ google.png
│  │  │  └─ logo.png
│  │  ├─ components
│  │  │  ├─ Admin
│  │  │  │  ├─ AdminLogin.jsx
│  │  │  │  ├─ AdminNavbar.jsx
│  │  │  │  ├─ AdminOrders.jsx
│  │  │  │  ├─ BrandForm.jsx
│  │  │  │  ├─ CategoryForm.jsx
│  │  │  │  ├─ FilterSection.jsx
│  │  │  │  ├─ OrderUpdateSelect.jsx
│  │  │  │  ├─ ProductForm.jsx
│  │  │  │  ├─ ReturnedRequestPage.jsx
│  │  │  │  ├─ SalesChart.jsx
│  │  │  │  ├─ SideBar.jsx
│  │  │  │  ├─ SummaryCards.jsx
│  │  │  │  ├─ SwitchButton.jsx
│  │  │  │  ├─ Tabels
│  │  │  │  │  ├─ BrandTable.jsx
│  │  │  │  │  ├─ CategoryTable.jsx
│  │  │  │  │  ├─ ProductsTable.jsx
│  │  │  │  │  ├─ SalesReportTable.jsx
│  │  │  │  │  ├─ UserTAble.jsx
│  │  │  │  │  └─ test.jsx
│  │  │  │  └─ TopSelling.jsx
│  │  │  ├─ AlertModal.jsx
│  │  │  ├─ Auth
│  │  │  │  ├─ ChangePassword.jsx
│  │  │  │  ├─ CompleteProfile.jsx
│  │  │  │  ├─ EmailVerification.jsx
│  │  │  │  ├─ ForgotPwEmailVerification.jsx
│  │  │  │  ├─ ForgotPwOtpVerification.jsx
│  │  │  │  ├─ OtpVerification.jsx
│  │  │  │  ├─ SignIn.jsx
│  │  │  │  ├─ SignUp.jsx
│  │  │  │  └─ ToolThemeBackground.jsx
│  │  │  ├─ CustomButton.jsx
│  │  │  ├─ CustomInput.jsx
│  │  │  ├─ CustomSelect.jsx
│  │  │  ├─ EasyCropperModal.jsx
│  │  │  ├─ Logo.jsx
│  │  │  ├─ OtpComponent.jsx
│  │  │  ├─ SortSelect.jsx
│  │  │  ├─ Users
│  │  │  │  ├─ BrandCard.jsx
│  │  │  │  ├─ BrandStore.jsx
│  │  │  │  ├─ CategoryCard.jsx
│  │  │  │  ├─ FilterSidebar.jsx
│  │  │  │  ├─ Footer.jsx
│  │  │  │  ├─ Navbar.jsx
│  │  │  │  ├─ Pagination.jsx
│  │  │  │  ├─ PopularContainer.jsx
│  │  │  │  ├─ ProductCard.jsx
│  │  │  │  ├─ RelatedProducts.jsx
│  │  │  │  ├─ ReviewSection.jsx
│  │  │  │  ├─ ScrollableContainer.jsx
│  │  │  │  ├─ SecondaryFooter.jsx
│  │  │  │  ├─ SingleProduct.jsx
│  │  │  │  └─ profile
│  │  │  │     ├─ sections
│  │  │  │     │  ├─ AddressSection.jsx
│  │  │  │     │  ├─ CouponsSection.jsx
│  │  │  │     │  ├─ EditProfileSection.jsx
│  │  │  │     │  ├─ OrdersSection.jsx
│  │  │  │     │  └─ WalletSection.jsx
│  │  │  │     ├─ shared
│  │  │  │     │  ├─ AddAddressModal.jsx
│  │  │  │     │  ├─ AddressCard.jsx
│  │  │  │     │  ├─ DefaultBadge.jsx
│  │  │  │     │  └─ ReturnReasonModal.jsx
│  │  │  │     └─ sidebar
│  │  │  │        └─ ProfileSidebar.jsx
│  │  │  └─ utils
│  │  │     ├─ AuthLayout.jsx
│  │  │     ├─ Layout.jsx
│  │  │     └─ ProtectedRoute.jsx
│  │  ├─ firebase
│  │  │  └─ config.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  └─ pages
│  │     ├─ Admin
│  │     │  ├─ AddBrandPage.jsx
│  │     │  ├─ AddCategoryPage.jsx
│  │     │  ├─ AddCouponPage.jsx
│  │     │  ├─ AddProductPage.jsx
│  │     │  ├─ AdminBannerPage.jsx
│  │     │  ├─ AdminBrandsPage.jsx
│  │     │  ├─ AdminCategoriesPage.jsx
│  │     │  ├─ AdminCouponPage.jsx
│  │     │  ├─ AdminDashboardPage.jsx
│  │     │  ├─ AdminHomePage.jsx
│  │     │  ├─ AdminOrdersPage.jsx
│  │     │  ├─ AdminProductsPage.jsx
│  │     │  ├─ AdminSingleOrderPage.jsx
│  │     │  ├─ AdminUsersPage.jsx
│  │     │  ├─ EditBrandPage.jsx
│  │     │  ├─ EditCategoryPage.jsx
│  │     │  └─ EditProductPage.jsx
│  │     ├─ Auth
│  │     │  ├─ CompeteDetailsPage.jsx
│  │     │  ├─ CreateNewPwPage.jsx
│  │     │  ├─ EmailVerificationPage.jsx
│  │     │  ├─ ForgotPwEmailVerificationPage.jsx
│  │     │  ├─ ForgotPwOtpConfirmPage.jsx
│  │     │  ├─ SignInPage.jsx
│  │     │  └─ SignUpPage.jsx
│  │     ├─ NoAccessPage.jsx
│  │     └─ User
│  │        ├─ AllProductsPage.jsx
│  │        ├─ BrandsPage.jsx
│  │        ├─ CartPage.jsx
│  │        ├─ CategoriesPage.jsx
│  │        ├─ CheckoutPage.jsx
│  │        ├─ DealsPage.jsx
│  │        ├─ FilterdCatefgoryOrBrandPage.jsx
│  │        ├─ OrderCompletePage.jsx
│  │        ├─ OrderDetailsPage.jsx
│  │        ├─ OrderPaymentFailPage.jsx
│  │        ├─ PurchasePaymentPage.jsx
│  │        ├─ SingleProductPage.jsx
│  │        ├─ UserProfilePage.jsx
│  │        └─ WishlistPage.jsx
│  ├─ tEST.JSX
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ package-lock.json
└─ package.json

```