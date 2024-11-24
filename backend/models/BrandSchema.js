import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [2, 'Brand name must be at least 2 characters long']
  },
  desc: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  offerPercentage: {
    type: Number,
    required: true,
    min: [0, 'Offer percentage must be between 0 and 100'],
    max: [100, 'Offer percentage must be between 0 and 100']
  },
  base_color: {
    type: String,
    required: true,
    default: "#000000"
  },
  logo: {
    imageUrl: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
      required: true,
    }
  },
  bannerImages: [{
    imageUrl: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
      required: true,
    }
  }],
  about: {
    section1: {
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Section 1 title must be at least 3 characters long'],
        default: "About Our Brand"
      },
      desc: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Section 1 description must be at least 10 characters long'],
        default: "Tell us about your brand's story and mission"
      }
    },
    section2: {
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Section 2 title must be at least 3 characters long'],
        default: "Why Choose Us"
      },
      desc: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Section 2 description must be at least 10 characters long'],
        default: "Share what makes your brand unique and special"
      }
    }
  },
  isListed: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

// Add text indexes for search
brandSchema.index({ name: 'text', desc: 'text' });

// Add compound index for better query performance
brandSchema.index({ name: 1, isListed: 1 });

const Brand = mongoose.model('Brand', brandSchema);
export { Brand };