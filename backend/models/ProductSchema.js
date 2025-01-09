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
    offerPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    maxOfferPercentage: {
        type: Number,
        default: 0
    },
    sellingPrice: {
        type: Number,
        default: function() {
            return this.price; 
        }
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
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
    },
    
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Validate additional images length
productSchema.path('additionalImages').validate(function(value) {
    return value.length <= 3;
}, 'Additional images cannot exceed 3');

// Add text indexes for search
productSchema.index({ name: 'text', desc: 'text' });

// Add compound indexes for better query performance
productSchema.index({ category: 1, brand: 1, isListed: 1 });

// Pre-save middleware to calculate max offer percentage and selling price
productSchema.pre('save', async function(next) {
    if (!this.isModified('price') && !this.isModified('offerPercentage')) {
        return next();
    }

    await this.populate(['category', 'brand']);
    
    // Calculate max offer percentage
    const productOffer = this.offerPercentage || 0;
    const categoryOffer = this.category?.offerPercentage || 0;
    const brandOffer = this.brand?.offerPercentage || 0;
    
    this.maxOfferPercentage = Math.max(productOffer, categoryOffer, brandOffer);
    
    // Calculate selling price
    this.sellingPrice = Math.round(this.price - (this.price * this.maxOfferPercentage / 100));
    
    next();
});

const Product = mongoose.model('Product', productSchema);

export { Product };