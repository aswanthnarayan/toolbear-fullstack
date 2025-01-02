import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "../../../App/features/rtkApis/adminApi";
import CustomInput from "../../components/CustomInput";
import EasyCropperModal from "../../components/EasyCropperModal";
import {
  Card,
  Typography,
  Checkbox,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { FaCloudUploadAlt } from "react-icons/fa";

const CategoryForm = ({ initialData, onSubmit, isLoading, mode, error }) => {
  const navigate = useNavigate();
  const [showCropper, setShowCropper] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset
  } = useForm({
    defaultValues: {
      name: "",
      desc: "",
      offerPercentage: "",
      isListed: true
    }
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  // Set initial form data when editing
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset({
        name: initialData.name,
        desc: initialData.desc,
        offerPercentage: initialData.offerPercentage,
        isListed: initialData.isListed
      });
      setImagePreview(initialData.image);
    }
  }, [initialData, mode, reset]);

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
    if (mode === 'add'){
      register("image", {
        validate: () => {
          if (mode === 'add' && !imagePreview) {
            return "Category image is required";
          }
          return true;
        }
      });
    }  
  }, [register,imagePreview,imageFile]);

  const handleImageSelect = (e) => {
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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = (croppedImage) => {
    setImagePreview(croppedImage);
    setShowCropper(false);
  };

  const handleFormSubmit = async (data) => {
    try {
      // Only require image for new categories
      if (mode === 'add' && !imagePreview) {
        setError("image", {
          type: "manual",
          message: "Please select an image"
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("desc", data.desc);
      formData.append("offerPercentage", data.offerPercentage);
      formData.append("isListed", data.isListed);

      // Handle image for both new and edit cases
      if (imagePreview && (mode === 'add' || imagePreview !== initialData?.image)) {
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const imageFile = new File([blob], "category_image.jpg", { type: "image/jpeg" });
        formData.append("image", imageFile);
      }

      const result = await onSubmit(formData);
      if (result !== false) { // Only navigate if not explicitly prevented
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.data?.message?.includes("already exists")) {
        setError("name", {
          type: "manual",
          message: "Category with this name already exists"
        });
      } else {
        setError("general", {
          type: "manual",
          message: error.data?.message || "Failed to create category"
        });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] h-auto py-6">
      <Card className="w-full p-6">
        <Typography variant="h5" color="blue-gray" className="mb-6">
          {mode === 'add' ? 'Add New Category' : 'Edit Category'}
        </Typography>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 flex flex-col gap-6 flex-1">
              <CustomInput
                label="Category Name"
                placeholder="Enter category name"
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 3,
                    message: "Category name must be at least 3 characters"
                  },
                  maxLength: {
                    value: 50,
                    message: "Category name must not exceed 50 characters"
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

              <CustomInput
                label="Description"
                placeholder="Enter category description"
                type="textarea"
                {...register("desc", {
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

              <CustomInput
                label="Offer Percentage"
                type="number"
                placeholder="Enter offer percentage"
                {...register("offerPercentage", {
                  required: "Offer percentage is required",
                  min: {
                    value: 0,
                    message: "Offer percentage must be between 0 and 100"
                  },
                  max: {
                    value: 100,
                    message: "Offer percentage must be between 0 and 100"
                  }
                })}
                error={errors.offerPercentage?.message}
              />

              <div className="-ml-3">
                <Checkbox
                  label="List this category"
                  {...register("isListed")}
                />
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="imageInput"
              />

              <label
                htmlFor="imageInput"
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                  imagePreview ? "border-green-500" : "border-gray-300 hover:border-blue-500"
                } w-full h-48 flex justify-center items-center`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="max-h-full mx-auto"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FaCloudUploadAlt className="text-4xl text-gray-400" />
                    <Typography variant="small" className="font-normal">
                      Click or drag to upload image
                    </Typography>
                  </div>
                )}
              </label>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
              )}
            </div>
            
          </div>

          <Button
            type="submit"
            className="mt-6"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="h-4 w-4" />
                {mode === 'add' ? "Create Category" : "Update Category"}
              </div>
            ) : (
              mode === 'add' ? "Create Category" : "Update Category"
            )}
          </Button>
        </form>
      </Card>

      {showCropper && (
        <EasyCropperModal
          image={originalImage}
          onCropComplete={handleCroppedImage}
          onClose={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default CategoryForm;