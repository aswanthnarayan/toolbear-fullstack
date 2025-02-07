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
