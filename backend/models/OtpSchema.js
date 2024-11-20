import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['signup', 'password-reset', 'email-verification'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index on email and type to ensure only one active OTP per email per type
otpSchema.index({ email: 1, type: 1 }, { unique: true });

// TTL index to automatically expire OTPs after 10 minutes
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 * 60 });  // 10 minutes (600 seconds)

const OTP = mongoose.model('OTP', otpSchema);
export { OTP };
