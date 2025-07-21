import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  desc: {
    type: String,
    required: true,
    
  },
  offerPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
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
      
      },
      desc: {
        type: String,
        required: true,
      
      }
    },
    section2: {
      title: {
        type: String,
        required: true,
       
      },
      desc: {
        type: String,
        required: true,
        
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