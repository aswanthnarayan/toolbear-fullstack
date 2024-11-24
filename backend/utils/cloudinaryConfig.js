import { v2 as cloudinary } from 'cloudinary';
import DatauriParser from 'datauri/parser.js';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const parser = new DatauriParser();

// Convert buffer to base64
const bufferToDataURI = (fileFormat, buffer) => 
  parser.format(path.extname(fileFormat).toString(), buffer);

export { cloudinary, bufferToDataURI };