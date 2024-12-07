import Category from '../../models/CategorySchema.js';
import { cloudinary, bufferToDataURI } from '../../utils/cloudinaryConfig.js';
import HttpStatusEnum from '../../constants/httpStatus.js';
import MessageEnum from '../../constants/messages.js';

export const createCategory = async (req, res) => {
  try {
    const { name, desc, offerPercentage, isListed } = req.body;

    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    });
    
    if (existingCategory) {
      return res.status(HttpStatusEnum.CONFLICT).json({ 
        field: 'name',
        message: MessageEnum.Admin.CATEGORY_EXISTS 
      });
    }
    
    if (!req.file) {
      return res.status(HttpStatusEnum.BAD_REQUEST).json({ 
        message: MessageEnum.Validation.INVALID_FILE 
      });
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
    res.status(HttpStatusEnum.CREATED).json({
      message: MessageEnum.Admin.CATEGORY_CREATED,
      category
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: error.message });
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
    
    res.status(HttpStatusEnum.OK).json({
      categories,
      currentPage: page,
      totalPages,
      totalUsers: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, desc, offerPercentage, isListed } = req.body;
    
    // Check if another category with the same name exists (excluding current category)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }, 
      _id: { $ne: categoryId } 
    });
    
    if (existingCategory) {
      return res.status(HttpStatusEnum.CONFLICT).json({ 
        field: 'name',
        message: MessageEnum.Admin.CATEGORY_EXISTS 
      });
    }

    let updateData = {
      name,
      desc,
      offerPercentage: Number(offerPercentage),
      isListed: isListed === 'true'
    };

    if (req.file) {
      // Get the current category to delete old image
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(HttpStatusEnum.NOT_FOUND).json({ 
          message: MessageEnum.Admin.CATEGORY_NOT_FOUND 
        });
      }

      // Delete old image from Cloudinary
      if (category.cloudinary_id) {
        await cloudinary.uploader.destroy(category.cloudinary_id);
      }

      // Upload new image
      const fileFormat = req.file.originalname;
      const { base64: dataURI } = bufferToDataURI(fileFormat, req.file.buffer);
      const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${dataURI}`, {
        folder: 'toolbear/categories',
        public_id: `category_${name.toLowerCase().replace(/\s+/g, '_')}`,
        resource_type: 'auto'
      });

      updateData.image = result.secure_url;
      updateData.cloudinary_id = result.public_id;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({ 
        message: MessageEnum.Admin.CATEGORY_NOT_FOUND 
      });
    }

    res.status(HttpStatusEnum.OK).json({
      message: MessageEnum.Admin.CATEGORY_UPDATED,
      category: updatedCategory
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: error.message });
  }
};

export const toggleListCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({
        message: MessageEnum.Admin.CATEGORY_NOT_FOUND
      });
    }

    category.isListed = !category.isListed;
    await category.save();

    res.status(HttpStatusEnum.OK).json({
      message: category.isListed ? MessageEnum.Admin.CATEGORY_LISTED : MessageEnum.Admin.CATEGORY_UNLISTED,
      isListed: category.isListed
    });
  } catch (error) {
    console.error('Error toggling category:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      return res.status(HttpStatusEnum.NOT_FOUND).json({
        message: MessageEnum.Admin.CATEGORY_NOT_FOUND
      });
    }

    res.status(HttpStatusEnum.OK).json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(HttpStatusEnum.INTERNAL_SERVER).json({ error: error.message });
  }
};