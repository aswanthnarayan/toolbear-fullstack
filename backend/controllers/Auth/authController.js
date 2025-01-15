import User from "../../models/UserSchema.js";
import { OTP } from "../../models/OtpSchema.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpStatusEnum from "../../constants/httpStatus.js";
import MessageEnum from "../../constants/messages.js";

dotenv.config();

export const verifyEmail = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    // Check if the email / phone already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: MessageEnum.Auth.EMAIL_IN_USE });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: MessageEnum.Auth.PHONE_IN_USE });
    }
    // Generate OTP (6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Delete any existing signup OTPs for this email
    await OTP.deleteMany({ email, type: 'signup' });
    // Store OTP temporarily in the database 
    const otpData = new OTP({
      email,
      otp,
      type: 'signup'
    });
    await otpData.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    // Send OTP to the user's email
    const mailOptions = {
      from: "toolbear@gmail.com",
      to: email,
      subject: "Your OTP for Account Creation",
      text: `Your OTP for account creation is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success response
    res 
      .status(HttpStatusEnum.OK)
      .json({
        message: MessageEnum.Auth.OTP_SENT,
      });
      
  } catch (error) {
    console.error("Error in sending OTP:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
  }
};

export const verifyOtpAndSignUp = async (req, res) => {
  try {
    const { email, otp, name, phone, password } = req.body;

    const otpData = await OTP.findOne({ email, type: 'signup' });

    if (!otpData) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: MessageEnum.Auth.INVALID_OTP });
    }

    if (otpData.otp !== otp) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: MessageEnum.Auth.INVALID_OTP });
    }

    // Create the new user since OTP is valid
    const newUser = new User({
      name,
      email,
      phone,
      password,
      isVerified: true,
    });

    await newUser.save();

    await OTP.deleteOne({ email, type: 'signup' });

    // Return success message
    res.status(HttpStatusEnum.CREATED).json({ message: MessageEnum.Auth.ACCOUNT_CREATED });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
  }
};

export const postSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ field: "email", message: MessageEnum.Auth.USER_NOT_FOUND });
    }
    if (user.isBlocked) {
      return res.status(HttpStatusEnum.FORBIDDEN).json({ field: "email", message: "Your account has been blocked" });
    }
  
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ field: "password", message: MessageEnum.Auth.INVALID_CREDENTIALS });
    }


    // JWT token
    const token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
        role: user.role,
        isBlocked: user.isBlocked,
        provider: user.provider
      },
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
  }
};

export const signUpGoogle = async (req,res)=>{
  try {
    const { email, name } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {

      if (existingUser.isBlocked) {
        return res.status(HttpStatusEnum.FORBIDDEN).json({ error: "Your account has been blocked" });
      }

      // User exists - check if verified
      if (!existingUser.isVerified) {
        return res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Auth.GOOGLE_SIGNUP_REQUIRED, isNewUser: true });
      }
      
      // User exists and is verified - generate token and send user data
      const token = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      });
      
      return res.status(HttpStatusEnum.OK).json({
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
          isVerified: existingUser.isVerified,
          isBlocked: existingUser.isBlocked
        }
      });
    }
    
    // Create a new user
    const newUser = new User({
      email,
      name,
      provider: 'google',
      role: 'user',
    });
    await newUser.save();
    return res.status(HttpStatusEnum.CREATED).json({ message: 'New user created', isNewUser: true });
    
  } catch (error) {
    console.error('Google Signup Error:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: 'Internal server error' });
  }
};

export const completeGoogleSignup = async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ error: MessageEnum.Auth.USER_NOT_FOUND });
    }

    // Update user's phone number
    user.phone = phone;
    user.isVerified = true;
    await user.save();
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatusEnum.OK).json({
      message: "Profile completed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isBlocked: user.isBlocked,
      }
    });
  } catch (error) {
    console.error('Complete Google Signup Error:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: 'Internal server error' });
  }
};

export const sendOtpForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ error: MessageEnum.Auth.USER_NOT_FOUND });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Delete any existing password reset OTPs for this email
    await OTP.deleteMany({ email, type: 'password-reset' });
    // Store OTP temporarily in the database (with expiration time)
    const otpData = new OTP({
      email,
      otp,
      type: 'password-reset'
    });
    await otpData.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    // Send OTP to the user's email
    const mailOptions = {
      from: "toolbear@gmail.com",
      to: email,
      subject: "Your OTP for Change Password ",
      text: `Your OTP for change password is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Auth.OTP_SENT });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: 'Internal server error' });
  }
};  

export const verifyOtpForgotPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Retrieve the OTP data for the given email and type
    const otpData = await OTP.findOne({ email, type: 'password-reset' });

    // Check if OTP data exists
    if (!otpData) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: MessageEnum.Auth.INVALID_OTP });
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ error: MessageEnum.Auth.INVALID_OTP });
    }

    // Delete the OTP after successful verification
    await OTP.deleteOne({ email, type: 'password-reset' });

    // Return success message
    res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Auth.OTP_VERIFIED });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ error: MessageEnum.Auth.USER_NOT_FOUND });
    }

    // Update password and save (this will trigger the pre-save middleware)
    user.password = newPassword;
    await user.save();

    res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Auth.PASSWORD_CHANGED });
  } catch (error) {
    console.error("Error in changing password:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax'
    });
    
    res.status(HttpStatusEnum.OK).json({ message: MessageEnum.Auth.LOGOUT_SUCCESS });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: 'Server error during logout' });
  }
};        

export const resendOtp = async(req,res)=>{
  try {
    const {email, type = 'signup'} = req.body
    const prevOtp = await OTP.findOne({email, type});
    if(prevOtp){
      await OTP.deleteOne({email, type})
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Store OTP temporarily in the database (with expiration time)
    const otpData = new OTP({
      email,
      otp,
      type
    });
    await otpData.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    // Send OTP to the user's email
    const mailOptions = {
      from: "toolbear@gmail.com",
      to: email,
      subject: type === 'signup' ? "Your OTP for Account Creation" : "Your OTP for Reset Password",
      text: `Your OTP for ${type === 'signup' ? 'account creation' : 'reset password'} is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success response
    res 
      .status(HttpStatusEnum.OK)
      .json({
        success: true,
        message: `OTP sent to your email for ${type === 'signup' ? 'account creation' : 'password reset'}.`,
      });
  } catch (error) {
    console.error("Error in sending OTP:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: "Server error" });
  }
}