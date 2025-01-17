import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import CustomSelect from "../../components/CustomSelect";
import EasyCropperModal from "../../components/EasyCropperModal";
import {
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";
import { FaCloudUploadAlt } from "react-icons/fa";

const ProductForm = ({ mode = "add", onSubmit: submitForm, isLoading, initialData, categories, brands, error }) => {
 
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
      },
      isListed: false
    }
  });

  useEffect(() => {
    // Register mainImage field for validation
    register("mainImage", {
      validate: () => {
        if (mode === 'add' && !mainImageFile) {
          return "Main product image is required";
        }
        return true;
      }
    });
  }, [register, mode, mainImageFile]);

  useEffect(() => {
    // Register additionalImages field for validation
    register("additionalImages", {
      validate: () => {
        // In create mode
        if (mode === 'add') {
          const validImages = additionalImages.filter(img => img !== null);
          const totalImages = validImages.length;
          console.log(totalImages);
          
          if (totalImages < 2) {
            const remaining = 2 - totalImages;
            return `Please add ${remaining} more image${remaining !== 1 ? 's' : ''}`;
          }
        }
        
        // In edit mode
        if (mode === 'edit') {
          const totalValidImages = additionalImages.reduce((count, img, idx) => {
            // Count either a new image or an existing preview that hasn't been replaced
            return count + (img !== null || (additionalImagePreviews[idx] && !additionalImages[idx]) ? 1 : 0);
          }, 0);
          
          if (totalValidImages < 3) {
            const remaining = 3 - totalValidImages;
            return `Please add ${remaining} more image${remaining !== 1 ? 's' : ''}`;
          }
        }
        return true;
      }
    });
  }, [register, mode, additionalImages, additionalImagePreviews]);

  useEffect(() => {
    if (error) {
      if (error.field === 'name') {
        setError('name', {
          type: 'manual',
          message: error.message
        });
      } else {
        setError('general', {
          type: 'manual',
          message: error.message || 'Failed to update category'
        });
      }
    }
  }, [error, setError]);

  useEffect(() => {
    if (mode === 'edit' && initialData && categories?.length && brands?.length) {
      // Find the category and brand by comparing IDs instead of names
      const categoryId = initialData.category?._id || initialData.category;
      const brandId = initialData.brand?._id || initialData.brand;
      
      reset({
        name: initialData.name,
        desc: initialData.desc,
        category: categoryId,
        brand: brandId,
        price: initialData.price,
        stock: initialData.stock,
        offerPercentage: initialData.offerPercentage,
        specifications: initialData.specifications,
        isListed: initialData.isListed
      });
    }
  }, [mode, initialData, categories, brands, reset]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      // image preview 
      setMainImagePreview(initialData.mainImage?.imageUrl || initialData.mainImage);
      
      const additionalPreviews = initialData.additionalImages?.map(img => img.imageUrl || img) || [null, null, null];
      setAdditionalImagePreviews(additionalPreviews);
    }
  }, [initialData, mode]);

  const selectedCategory = watch("category");
  const selectedBrand = watch("brand");

  const handleSelectChange = (field, value) => {
    setValue(field, value);
    trigger(field);
  };

  const handleImageSelect = (e, type, index = null) => {
    clearErrors("mainImage");
    clearErrors("additionalImages");
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(type === 'main' ? "mainImage" : "additionalImages", {
          type: "manual",
          message: "Image size should be less than 5MB"
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError(type === 'main' ? "mainImage" : "additionalImages", {
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

  const handleAdditionalImageSelect = (e, index) => {
    clearErrors("additionalImages");
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("additionalImages", {
          type: "manual",
          message: "Image size should be less than 5MB"
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("additionalImages", {
          type: "manual",
          message: "Please select an image file"
        });
        return;
      }

      setCurrentImageType('additional');
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
        clearErrors("mainImage");
      } else if (currentImageType === 'additional' && currentImageIndex !== null) {
        // Update the images array at the specific index
        setAdditionalImages(prevImages => {
          const newImages = [...prevImages];
          newImages[currentImageIndex] = file;
          return newImages;
        });
        
        // Update the previews
        setAdditionalImagePreviews(prevPreviews => {
          const newPreviews = [...prevPreviews];
          newPreviews[currentImageIndex] = croppedImage;
          return newPreviews;
        });

        // Clear any existing errors and trigger validation
        clearErrors("additionalImages");
        trigger("additionalImages");
      }
    } catch (error) {
      console.error('Error processing cropped image:', error);
    }
    setShowCropper(false);
  };

  const handleRemoveAdditionalImage = (index) => {
    setAdditionalImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = null;
      return newImages;
    });
    
    setAdditionalImagePreviews(prevPreviews => {
      const newPreviews = [...prevPreviews];
      newPreviews[index] = null;
      return newPreviews;
    });

    // Trigger validation after removing image
    trigger("additionalImages");
  };

  const validateImages = () => {
    const totalImages = mode === 'add'
      ? additionalImages.filter(img => img !== null).length
      : additionalImages.reduce((count, img, idx) => {
          return count + (img !== null || (additionalImagePreviews[idx] && !additionalImages[idx]) ? 1 : 0);
        }, 0);

    return totalImages === 3;
  };

  const onSubmit = async (data) => {
    try {
      if (!mainImageFile && mode === 'add') {
        setError("image", {
          type: "manual",
          message: "Main product image is required"
        });
        return;
      }

      if (!validateImages()) {
        setError("additionalImages", {
          type: "manual",
          message: "Please add 3 additional images"
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("desc", data.desc);
      formData.append("category", data.category);
      formData.append("brand", data.brand);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      
      // Handle offer percentage
      const offerPercentage = data.offerPercentage === '' ? null : Number(data.offerPercentage);
      formData.append('offerPercentage', offerPercentage === null ? '' : offerPercentage.toString());
      
      // Add specifications
      formData.append('specifications', JSON.stringify(data.specifications));
      formData.append("isListed", data.isListed);

      // Handle main image
      if (mainImageFile) {
        formData.append('mainImage', mainImageFile);
      }

      // Handle additional images
      let hasAdditionalImages = false;
      additionalImages.forEach((image, index) => {
        if (image) {
          formData.append('additionalImages', image);
          hasAdditionalImages = true;
        }
      });

      // If in edit mode and we have existing images that weren't changed
      if (mode === 'edit') {
        additionalImagePreviews.forEach((preview, index) => {
          // Only append if this position doesn't have a new image
          if (preview && !additionalImages[index]) {
            formData.append('additionalImageUrls', preview);
          }
        });
      }

      const result = await submitForm(formData);
      if (result?.error) {
        // Handle the error returned from parent component
        if (result.error.field === 'name') {
          setError('name', {
            type: 'manual',
            message: result.error.message
          });
          return;
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
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
                {...register("name",{
                  required:"Product Name required",
                  minLength: {
                    value: 3,
                    message: "Product name must be at least 3 characters"
                  },
                  maxLength: {
                    value: 50,
                    message: "Product name must not exceed 50 characters"
                  },
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Name cannot be empty or spaces only",
                  
                    noSpecialChars: (value) =>
                      /^[a-zA-Z\s]*$/.test(value) || "Name cannot include special characters",
                  
                  }
                })}
                error={errors.name?.message}
              />
            </div>

            <div className="mt-4">
              <CustomInput
                label="Description"
                placeholder="Enter product description"
                type="textarea"
                {...register("desc",{
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters"
                  },
                  maxLength: {
                    value: 500,
                    message: "Description must not exceed 500 characters"
                  },
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Description cannot be empty or spaces only",
                    firstThreeNotSpecial: (value) =>
                      /^[a-zA-Z]{3}/.test(value.trim()) || "The first three characters must be letters",
                  }
                })}
                error={errors.desc?.message}
              />
            </div>

            <div className="mt-4 relative">
              <CustomSelect
                label="Select Category"
                value={watch("category") || ""}
                {...register("category", {
                  required: "Category is required",
                })}
                onChange={(e) => handleSelectChange("category", e.target.value)}
                error={errors.category?.message}
                options={categories?.map(category => ({
                  value: category._id,
                  label: category.name
                })) || []}
                placeholder="Select a category"
              />
            </div>

            <div className="mt-4 relative">
              <CustomSelect
                label="Select Brand"
                value={watch("brand") || ""}
                {...register("brand", {
                  required: "Brand is required",
                })}
                onChange={(e) => handleSelectChange("brand", e.target.value)}
                error={errors.brand?.message}
                options={brands?.map(brand => ({
                  value: brand._id,
                  label: brand.name
                })) || []}
                placeholder="Select a brand"
              />
            </div>
          </div>

          <div>
            <div>
              <CustomInput
                label="Price"
                type="number"
                placeholder="Enter price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be greater than 0" },
                  validate: value => !isNaN(value) || "Price must be a number"
                })}
                error={errors.price?.message}
                min="0"
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
                {...register("offerPercentage",
                  {
                    required: "Offer Percentage is required",
                    min: { value: 0, message: "Offer percentage must be greater than 0" },
                    max: { value: 100, message: "Offer percentage must be less than 100" },
                    validate: value => !isNaN(value) || "Offer percentage must be a number"
                  }
                )}
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
                      onChange={(e) => handleAdditionalImageSelect(e, index)}
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
                {...register("specifications.color",
                  {
                    required: "Color is required",
                    validate: (value) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      return regex.test(value) || "Color must contain only letters and spaces";
                    },
                  }
                )}
                error={errors.specifications?.color?.message}
              />

              <CustomInput
                label="Product Type"
                type="text"
                {...register("specifications.productType",
                  {
                    required: "Product type is required",
                    validate: (value) => {
                      const regex = /^[a-zA-Z\s]+$/;
                      return regex.test(value) || "Product type must contain only letters and spaces";
                    },
                  }
                )}
                error={errors.specifications?.productType?.message}
              />

              <CustomInput
                label="Weight"
                type="text"
                {...register("specifications.weight",
                  {
                    required: "Weight is required",
                    validate: (value) => {
                      const regex = /^[0-9.]+(kg|g)$/;
                      return regex.test(value) || "Weight must be in the format of number followed by kg or g";
                    },
                  }
                )}
                error={errors.specifications?.weight?.message}
                placeholder="e.g., 500g, 1.2kg"
              />

              <div className="relative">
                <CustomSelect
                  label="Condition"
                  value={watch("specifications.condition") || ""}
                  {...register("specifications.condition",
                    {
                      required: "Condition is required",
                    }
                  )}
                  onChange={(e) => handleSelectChange("specifications.condition", e.target.value)}
                  error={errors.specifications?.condition?.message}
                  options={[
                    { value: "New", label: "New" },
                    { value: "Used", label: "Used" },
                    { value: "Refurbished", label: "Refurbished" }
                  ]}
                  placeholder="Select a condition"
                />
              </div>

              <div className="relative">
                <CustomSelect
                  label="Country of Origin"
                  value={watch("specifications.countryOfOrigin") || ""}
                  {...register("specifications.countryOfOrigin",
                    {
                      required: "Country of Origin is required",
                    }
                  )}
                  onChange={(e) => handleSelectChange("specifications.countryOfOrigin", e.target.value)}
                  error={errors.specifications?.countryOfOrigin?.message}
                  options={[
                    { value: "China", label: "China" },
                    { value: "India", label: "India" },
                    { value: "USA", label: "USA" },
                    { value: "Germany", label: "Germany" },
                    { value: "Japan", label: "Japan" },
                    { value: "South Korea", label: "South Korea" },
                    { value: "Taiwan", label: "Taiwan" },
                    { value: "Other", label: "Other" }
                  ]}
                  placeholder="Select country of origin"
                />
              </div>

              <div className="relative">
                <CustomSelect
                  label="Warranty"
                  value={watch("specifications.warranty") || ""}
                  {...register("specifications.warranty",
                    {
                      required: "Warranty is required",
                    }
                  )}
                  onChange={(e) => handleSelectChange("specifications.warranty", e.target.value)}
                  error={errors.specifications?.warranty?.message}
                  options={[
                    { value: "No Warranty", label: "No Warranty" },
                    { value: "6 Months", label: "6 Months" },
                    { value: "1 Year", label: "1 Year" },
                    { value: "2 Years", label: "2 Years" },
                    { value: "3 Years", label: "3 Years" },
                    { value: "5 Years", label: "5 Years" },
                    { value: "Lifetime", label: "Lifetime" }
                  ]}
                  placeholder="Select warranty period"
                />
              </div>

              <CustomInput
                label="Included Items"
                type="text"
                {...register("specifications.includedItems",
                  {
                    required: "Included Items is required",
                    validate: {
                      notOnlyWhitespace: (value) => value.trim() !== "" || "Included Items cannot be empty",
                      firstThreeNotSpecial: (value) =>
                        /^[a-zA-Z]{3}/.test(value.trim()) || "The first three characters must be letters",
                    }
                  }
                )}
                error={errors.specifications?.includedItems?.message}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Typography variant="h5" color="blue-gray" className="mb-4">
              Product Status
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <CustomSelect
                  label="Listing Status"
                  value={watch("isListed") || ""}
                  {...register("isListed",
                    { required: "Listing Status is required" }
                  )}
                  onChange={(e) => handleSelectChange("isListed", e.target.value)}
                  error={errors.isListed?.message}
                  options={[
                    { value: true, label: "Listed" },
                    { value: false, label: "Not Listed" }
                  ]}
                  placeholder="Select listing status"
                />
              </div>
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