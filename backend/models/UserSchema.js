import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true},
    phone: { type: Number,},
    password: { type: String,},
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    addresses: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    }],
    purchasedProducts:[
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, { timestamps: true });

// Unique indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    next();
});


// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;