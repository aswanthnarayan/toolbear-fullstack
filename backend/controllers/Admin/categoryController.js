import Category from '../../models/CategorySchema.js';
import { cloudinary, bufferToDataURI } from '../../utils/cloudinaryConfig.js';


export const createCategory = async (req, res) => {
  try {
    const { name, desc, offerPercentage, isListed } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Convert buffer to data URI
    const fileFormat = req.file.originalname;
    const { base64: dataURI } = bufferToDataURI(fileFormat, req.file.buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${dataURI}`, {
      folder: 'toolbear/categories',
      public_id: `category_${name.toLowerCase().replace(/\s+/g, '_')}`,
      resource_type: 'auto'
    });

    // Create new category with Cloudinary image URL and public_id
    const category = new Category({
      name,
      desc,
      offerPercentage: Number(offerPercentage),
      isListed: isListed === 'true',
      image: result.secure_url,
      cloudinary_id: result.public_id
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
            ],
        };

        const skip = (page - 1) * limit;

        const [categories, total] = await Promise.all([
            Category.find(query)
                .skip(skip)
                .limit(limit)
                .select('name desc offerPercentage isListed image cloudinary_id createdAt'),
            Category.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        
        res.json({
            categories,
            currentPage: page,
            totalPages,
            totalUsers: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, desc, offerPercentage, isListed } = req.body;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If new image is uploaded, delete old image and upload new one
    if (req.file) {
      // Delete old image from Cloudinary
      if (category.cloudinary_id) {
        await cloudinary.uploader.destroy(category.cloudinary_id);
      }

      // Convert buffer to data URI
      const fileFormat = req.file.originalname;
      const { base64: dataURI } = bufferToDataURI(fileFormat, req.file.buffer);

      // Upload new image
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${dataURI}`, {
        folder: 'toolbear/categories',
        public_id: `category_${name.toLowerCase().replace(/\s+/g, '_')}`,
        resource_type: 'auto'
      });

      category.image = result.secure_url;
      category.cloudinary_id = result.public_id;
    }

    // Update other fields
    category.name = name || category.name;
    category.desc = desc || category.desc;
    category.offerPercentage = Number(offerPercentage) || category.offerPercentage;
    category.isListed = isListed === 'true';

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: error.message });
  }
};

export const toggleListCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isListed = !category.isListed;
    await category.save();

    res.json(category);
  } catch (error) {
    console.error("Error toggling category listing:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: error.message });
  }
};