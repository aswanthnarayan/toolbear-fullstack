import express from 'express';
import {
    verifyEmail,
    postSignIn,
    verifyOtpAndSignUp,
    signUpGoogle,
    completeGoogleSignup,
    sendOtpForgotPassword,
    verifyOtpForgotPassword,
    changePassword,
    logout
} from '../controllers/authController.js'

const router = express.Router();

router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOtpAndSignUp);
router.post("/signin", postSignIn);
router.post("/signup-google", signUpGoogle);
router.post("/complete-google-signup", completeGoogleSignup);
router.post("/forgot-password/verify-email", sendOtpForgotPassword);
router.post("/forgot-password/verify-otp", verifyOtpForgotPassword);
router.patch("/forgot-password/change-password", changePassword);
router.post("/logout", logout);

export default router
