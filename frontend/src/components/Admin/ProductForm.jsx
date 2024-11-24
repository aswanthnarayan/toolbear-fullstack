import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import EasyCropperModal from "../../components/EasyCropperModal";
import {
  Card,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { FaCloudUploadAlt } from "react-icons/fa";

const ProductForm = ({ mode = "add", onSubmit: submitForm, isLoading, initialData, categories, brands }) => {
  const navigate = useNavigate();
  const [mainImageFile, setMainImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(
    initialData?.mainImage?.imageUrl || initialData?.mainImage || null
  );
  const [additionalImages, setAdditionalImages] = useState(
    mode === 'edit' ? Array(3).fill(null) : [null, null, null]
  );
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState(
    initialData?.additionalImages?.map(img => img.imageUrl || img) || [null, null, null]
  );
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    setError,
    clearErrors,
    setValue,
    trigger,
    watch,
    reset
  } = useForm({
    defaultValues: {
      name: "",
      desc: "",
      category: "",
      brand: "",
      price: "",
      stock: "",
      offerPercentage: "",
      specifications: {
        color: "",
        productType: "",
        weight: "",
        condition: "",
        countryOfOrigin: "",
        warranty: "",
        includedItems: "",
      }
    }
  });

  // Initialize form with data when available
  useEffect(() => {
    if (mode === 'edit' && initialData && categories?.length && brands?.length) {
      const categoryId = categories.find(cat => cat.name === initialData.category)?._id;
      const brandId = brands.find(brand => brand.name === initialData.brand)?._id;
      
      reset({
        name: initialData.name,
        desc: initialData.desc,
        category: categoryId,
        brand: brandId,
        price: initialData.price,
        stock: initialData.stock,
        offerPercentage: initialData.offerPercentage,
        specifications: initialData.specifications
      });
    }
  }, [mode, initialData, categories, brands, reset]);

  // Watch values for category and brand
  const selectedCategory = watch("category");
  const selectedBrand = watch("brand");

  // Validation schema
  const validationRules = {
    name: { 
      required: "Product name is required",
      minLength: { value: 3, message: "Name must be at least 3 characters" }
    },
    desc: { 
      required: "Description is required",
      minLength: { value: 10, message: "Description must be at least 10 characters" }
    },
    category: { 
      required: "Please select a category"
    },
    brand: { 
      required: "Please select a brand"
    },
    price: { 
      required: "Price is required",
      min: { value: 0, message: "Price must be greater than 0" },
      validate: value => !isNaN(value) || "Price must be a number"
    },
    stock: { 
      required: "Stock is required",
      validate: {
        isNumber: value => !isNaN(value) || "Stock must be a number",
        isPositive: value => Number(value) >= 0 || "Stock cannot be negative",
        isInteger: value => Number.isInteger(Number(value)) || "Stock must be a whole number"
      }
    },
    offerPercentage: {
      validate: {
        isNumber: value => {
          if (value === "" || value === null) return true;
          return !isNaN(value) || "Offer percentage must be a number";
        },
        range: value => {
          if (value === "" || value === null) return true;
          const numValue = Number(value);
          return (numValue >= 0 && numValue <= 100) || "Offer percentage must be between 0 and 100";
        },
        isInteger: value => {
          if (value === "" || value === null) return true;
          return Number.isInteger(Number(value)) || "Offer percentage must be a whole number";
        }
      }
    },
    "specifications.color": { 
      required: "Color is required"
    },
    "specifications.productType": { 
      required: "Product type is required"
    },
    "specifications.weight": { 
      required: "Weight is required"
    },
    "specifications.condition": { 
      required: "Please select a condition",
      validate: value => value !== "" || "Please select a condition"
    },
    "specifications.countryOfOrigin": { 
      required: "Country of origin is required"
    },
    "specifications.warranty": { 
      required: "Warranty information is required"
    },
    "specifications.includedItems": { 
      required: "Included items are required"
    }
  };

  useEffect(() => {
    // Register all fields with their validation rules
    Object.entries(validationRules).forEach(([fieldName, rules]) => {
      register(fieldName, rules);
    });
  }, [register]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      // Set main image preview if exists
      setMainImagePreview(initialData.mainImage?.imageUrl || initialData.mainImage);
      
      // Set additional images previews if they exist
      const additionalPreviews = initialData.additionalImages?.map(img => img.imageUrl || img) || [null, null, null];
      setAdditionalImagePreviews(additionalPreviews);
    }
  }, [initialData, mode]);

  // Custom select handler
  const handleSelectChange = async (fieldName, value) => {
    setValue(fieldName, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
    
    // Trigger validation immediately
    await trigger(fieldName);
  };

  const handleImageSelect = (e, type, index = null) => {
    clearErrors("image");
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("image", {
          type: "manual",
          message: "Image size should be less than 5MB"
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("image", {
          type: "manual",
          message: "Please select an image file"
        });
        return;
      }

      setCurrentImageType(type);
      setCurrentImageIndex(index);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = async (croppedImage) => {
    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });

      if (currentImageType === 'main') {
        setMainImageFile(file);
        setMainImagePreview(croppedImage);
      } else if (currentImageType === 'additional' && currentImageIndex !== null) {
        setAdditionalImages(prevImages => {
          const newImages = [...prevImages];
          newImages[currentImageIndex] = file;
          return newImages;
        });
        
        setAdditionalImagePreviews(prevPreviews => {
          const newPreviews = [...prevPreviews];
          newPreviews[currentImageIndex] = croppedImage;
          return newPreviews;
        });
      }
    } catch (error) {
      console.error('Error processing cropped image:', error);
    }
    setShowCropper(false);
  };

  const onSubmit = async (data) => {
    if (!mainImageFile && mode === 'add') {
      setError("image", {
        type: "manual",
        message: "Main product image is required"
      });
      return;
    }

    const formData = new FormData();
    
    // Add text fields
    formData.append('name', data.name);
    formData.append('desc', data.desc);
    formData.append('category', data.category);
    formData.append('brand', data.brand);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    // Handle offer percentage - ensure it's a number or null
    const offerPercentage = data.offerPercentage === '' ? null : Number(data.offerPercentage);
    formData.append('offerPercentage', offerPercentage === null ? '' : offerPercentage.toString());
    formData.append('specifications', JSON.stringify(data.specifications));

    // Add main image only if changed
    if (mainImageFile) {
      formData.append('mainImage', mainImageFile);
    }

    // Add additional images that have been changed
    additionalImages.forEach((image, index) => {
      if (image) {
        formData.append('additionalImages', image);
      } else if (mode === 'edit' && additionalImagePreviews[index]) {
        // Keep existing image URL for unchanged images in edit mode
        formData.append('additionalImageUrls', additionalImagePreviews[index]);
      }
    });

    try {
      await submitForm(formData);
      navigate('/admin/products');
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card className="w-full shadow-lg p-4 sm:p-6 lg:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <Typography variant="h4" color="blue-gray" className="mb-3">
            {mode === "add" ? "Add Product" : "Edit Product"}
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div>
              <CustomInput
                label="Product Name"
                placeholder="Enter product name"
                {...register("name")}
                error={errors.name?.message}
              />
            </div>

            <div className="mt-4">
              <CustomInput
                label="Description"
                placeholder="Enter product description"
                type="textarea"
                {...register("desc")}
                error={errors.desc?.message}
              />
            </div>

            <div className="mt-4 relative">
                <Select
                  label="Select Category"
                  value={selectedCategory || ""}
                  onChange={(value) => {
                    handleSelectChange("category", value);
                  }}
                  error={Boolean(errors.category)}
                  selected={(element) => 
                    element && 
                    categories?.find(cat => cat._id === selectedCategory)?.name
                  }
                >
                  <Option value="">Select a category</Option>
                  {categories?.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                )}
              </div>

            <div className="mt-4 relative">
                <Select
                  label="Select Brand"
                  value={selectedBrand || ""}
                  onChange={(value) => {
                    handleSelectChange("brand", value);
                  }}
                  error={Boolean(errors.brand)}
                  selected={(element) => 
                    element && 
                    brands?.find(brand => brand._id === selectedBrand)?.name
                  }
                >
                  <Option value="">Select a brand</Option>
                  {brands?.map((brand) => (
                    <Option key={brand._id} value={brand._id}>
                      {brand.name}
                    </Option>
                  ))}
                </Select>
                {errors.brand && (
                  <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
                )}
              </div>
          </div>

          <div>
            <div>
              <CustomInput
                label="Price"
                type="number"
                placeholder="Enter price"
                {...register("price")}
                error={errors.price?.message}
              />
            </div>

            <div>
              <CustomInput
                label="Stock"
                type="number"
                {...register("stock", {
                  required: "Stock is required",
                  validate: {
                    isNumber: value => !isNaN(value) || "Stock must be a number",
                    isPositive: value => Number(value) >= 0 || "Stock cannot be negative",
                    isInteger: value => Number.isInteger(Number(value)) || "Stock must be a whole number"
                  }
                })}
                error={errors.stock?.message}
                min="0"
                step="1"
              />
            </div>

            <div className="mt-4">
              <CustomInput
                label="Product Offer Percentage"
                type="number"
                placeholder="Enter product specific offer (0-100)"
                {...register("offerPercentage")}
                error={errors?.offerPercentage?.message}
                min="0"
                max="100"
                step="1"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Product Images
            </Typography>
            
            {/* Main Image Section */}
            <div className="mb-8">
              <Typography variant="h6" color="blue-gray" className="mb-3 text-center">
                Main Product Image
              </Typography>
              <div className="flex justify-center">
                <div className="w-72 h-72 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative hover:border-blue-500 transition-colors">
                  {mainImagePreview ? (
                    <img
                      src={mainImagePreview}
                      alt="Main product"
                      className="w-full h-full object-contain p-3"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FaCloudUploadAlt className="w-14 h-14 text-gray-400" />
                      <Typography variant="small" className="text-gray-500">
                        Click to upload
                      </Typography>
                    </div>
                  )}
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e, 'main')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              {errors.mainImage && (
                <p className="text-red-500 text-sm text-center mt-2">{errors.mainImage.message}</p>
              )}
            </div>

            {/* Additional Images Section */}
            <div className="mb-6">
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Additional Images (Max 3)
              </Typography>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative hover:border-blue-500 transition-colors"
                  >
                    {additionalImagePreviews[index] ? (
                      <img
                        src={additionalImagePreviews[index]}
                        alt={`Additional ${index + 1}`}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <FaCloudUploadAlt className="w-8 h-8 text-gray-400" />
                    )}
                    <input
                      type="file"
                      id={`additionalImage${index}`}
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e, 'additional', index)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              {errors.additionalImages && (
                <span className="text-red-500 text-sm">{errors.additionalImages.message}</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Product Specifications
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
                label="Color"
                type="text"
                {...register("specifications.color")}
                error={errors.specifications?.color?.message}
              />

              <CustomInput
                label="Product Type"
                type="text"
                {...register("specifications.productType")}
                error={errors.specifications?.productType?.message}
              />

              <CustomInput
                label="Weight"
                type="text"
                {...register("specifications.weight")}
                error={errors.specifications?.weight?.message}
                placeholder="e.g., 500g, 1.2kg"
              />

              <div className="relative">
                <Select
                  label="Condition"
                  value={watch("specifications.condition") || ""}
                  onChange={(value) => handleSelectChange("specifications.condition", value)}
                  error={Boolean(errors.specifications?.condition)}
                >
                  <Option value="">Select a condition</Option>
                  <Option value="New">New</Option>
                  <Option value="Refurbished">Refurbished</Option>
                  <Option value="Used">Used</Option>
                </Select>
                {errors.specifications?.condition && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.specifications.condition.message}
                  </p>
                )}
              </div>

              <CustomInput
                label="Country of Origin"
                type="text"
                {...register("specifications.countryOfOrigin")}
                error={errors.specifications?.countryOfOrigin?.message}
              />

              <CustomInput
                label="Warranty"
                type="text"
                {...register("specifications.warranty")}
                error={errors.specifications?.warranty?.message}
              />

              <CustomInput
                label="Included Items"
                type="text"
                {...register("specifications.includedItems")}
                error={errors.specifications?.includedItems?.message}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button 
            type="button" 
            variant="outlined"
            color="blue-gray"
            className="flex-1 md:flex-none md:min-w-[150px]"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 md:flex-none md:min-w-[150px]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </span>
            ) : (
              "Save Product"
            )}
          </Button>
        </div>
      </form>

      {showCropper && (
        <EasyCropperModal
          image={originalImage}
          onCropComplete={handleCroppedImage}
          onClose={() => setShowCropper(false)}
        />
      )}
    </Card>
  );
};

export default ProductForm;
