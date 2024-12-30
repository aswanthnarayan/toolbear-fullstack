import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true
    },
    publicId: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Banner = mongoose.model('Banner', bannerSchema);