import User from "../models/UserSchema.js";
import { OTP } from "../models/OtpSchema.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyEmail = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    // Check if the email / phone already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ error: "Phone is already in use" });
    }
    // Generate OTP (6-digit number)
    const otp = Math.floor(100000 + Math.random() * 900000);
    // Delete any existing signup OTPs for this email
    await OTP.deleteMany({ email, type: 'signup' });
    // Store OTP temporarily in the database (with expiration time)
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
      .status(200)
      .json({
        message: "OTP sent to your email. Please verify to complete sign up.",
        
      });
      
  } catch (error) {
    console.error("Error in sending OTP:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const verifyOtpAndSignUp = async (req, res) => {
  try {
    const { email, otp, name, phone, password } = req.body;

    // Retrieve the OTP data for the given email
    const otpData = await OTP.findOne({ email, type: 'signup' });

    // Check if OTP data exists and if the OTP matches
    if (!otpData) {
      return res.status(400).json({ error: "OTP not found or expired. Please request a new one." });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Optional: Check for OTP expiry (if applicable)
    if (otpData.expiry && Date.now() > otpData.expiry) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
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

    // Delete the OTP entry after successful verification
    await OTP.deleteOne({ email, type: 'signup' });

    // Return success message
    res.status(201).json({ message: "User successfully created" });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const postSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ field: "email", message: "User does not exist" });
    }
    
  
    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ field: "password", message: "Password does not match" });
    }


    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
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
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const signUpGoogle = async (req,res)=>{
  try {
    const { email, name } = req.body;
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      // User exists - check if verified
      if (!existingUser.isVerified) {
        return res.status(200).json({ message: 'New user created', isNewUser: true });
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
      
      return res.status(200).json({
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          phone: existingUser.phone,
          role: existingUser.role,
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
    return res.status(201).json({ message: 'New user created', isNewUser: true });
    
  } catch (error) {
    console.error('Google Signup Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const completeGoogleSignup = async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
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

    res.status(200).json({
      message: "Profile completed successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Complete Google Signup Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;
    
    try {
      // Try to sign in or sign up with Google
      const response = await signUpGoogle({
        email: user.email,
        name: user.displayName,
      }).unwrap();
      
      if (response.message === 'New user created' && response.isNewUser) {
        // New user - redirect to complete profile
        navigate('/user/complete-signup', { 
          state: { email: user.email }
        });
      } else {
        // Existing user - navigate based on role
        if (response.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/home");
        }
      }
    } catch (error) {
      console.error('Server error:', error);
      setError('general', { 
        type: 'server', 
        message: error.data?.error || 'An error occurred during Google sign in' 
      });
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    setError('general', { 
      type: 'server', 
      message: 'Could not sign in with Google' 
    });
  }
};


export const sendOtpForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
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
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};  

export const verifyOtpForgotPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Retrieve the OTP data for the given email and type
    const otpData = await OTP.findOne({ email, type: 'password-reset' });

    // Check if OTP data exists
    if (!otpData) {
      return res.status(400).json({ error: "OTP not found or expired. Please request a new one." });
    }

    // Check if OTP matches
    if (otpData.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Delete the OTP after successful verification
    await OTP.deleteOne({ email, type: 'password-reset' });

    // Return success message
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update password and save (this will trigger the pre-save middleware)
    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in changing password:", error);
    res.status(500).json({ error: "Server error" });
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
    
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Server error during logout' });
  }
};        

export const resendOtp = async(req,res)=>{
  try {
    const {email} = req.body
    const prevOtp = await OTP.findOne({email});;
    if(prevOtp){
      await OTP.deleteOne({email})
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
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
      subject: "Your OTP for Reset Password ",
      text: `Your OTP for reset password is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Return success response
    res 
      .status(200)
      .json({
        message: "OTP sent to your email. Please verify to complete sign up.",
        
      });
  } catch (error) {
    console.error("Error in sending OTP:", error);
    res.status(500).json({ error: "Server error" });
  }
}