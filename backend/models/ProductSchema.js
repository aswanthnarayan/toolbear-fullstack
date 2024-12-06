import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    desc: {
        type: String,
        required: true,
        minlength: 10
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    offerPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    specifications: {
        color: {
            type: String,
            required: true
        },
        productType: {
            type: String,
            required: true
        },
        weight: {
            type: String,
            required: true
        },
        condition: {
            type: String,
            required: true,
            enum: ['New', 'Refurbished', 'Used']
        },
        countryOfOrigin: {
            type: String,
            required: true
        },
        warranty: {
            type: String,
            required: true
        },
        includedItems: {
            type: String,
            required: true
        }
    },
    mainImage: {
        imageUrl: {
            type: String,
            required: true,
        },
        cloudinary_id: {
            type: String,
            required: true,
        }
    },
    additionalImages: [{
        imageUrl: {
            type: String,
            required: true,
        },
        cloudinary_id: {
            type: String,
            required: true,
        }
    }],
    isListed: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Validate additional images length
productSchema.path('additionalImages').validate(function(value) {
    return value.length <= 3;
}, 'Additional images cannot exceed 3');

// Virtual field for final price
productSchema.virtual('finalPrice').get(async function() {
    // Populate category and brand if not already populated
    if (!this.populated('category')) await this.populate('category');
    if (!this.populated('brand')) await this.populate('brand');

    // Get all applicable offer percentages
    const productOffer = this.offerPercentage || 0;
    const categoryOffer = this.category?.offerPercentage || 0;
    const brandOffer = this.brand?.offerPercentage || 0;

    // Find the highest offer percentage
    const maxOfferPercentage = Math.max(productOffer, categoryOffer, brandOffer);

    // Calculate final price
    const finalPrice = this.price - (this.price * maxOfferPercentage / 100);
    return Math.round(finalPrice);
});

// Add text indexes for search
productSchema.index({ name: 'text', desc: 'text' });

// Add compound indexes for better query performance
productSchema.index({ category: 1, brand: 1, isListed: 1 });

const Product = mongoose.model('Product', productSchema);

export { Product };