import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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
  isListed: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model("Category", categorySchema);
