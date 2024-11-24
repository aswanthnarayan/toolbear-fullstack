import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "../../../App/features/rtkApis/adminApi";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import EasyCropperModal from "../../components/EasyCropperModal";
import {
  Card,
  Typography,
  Checkbox,
  Button,
} from "@material-tailwind/react";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [showCropper, setShowCropper] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      name: "",
      desc: "",
      offerPercentage: "",
      isListed: true
    }
  });

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

  const onSubmit = async (data) => {
    try {
      if (!imagePreview) {
        setError("image", {
          type: "manual",
          message: "Please select an image"
        });
        return;
      }

      // Optimize image size before upload
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      
      // Create a new image to get dimensions
      const img = new Image();
      img.src = imagePreview;
      await new Promise(resolve => img.onload = resolve);

      // Create canvas for resizing if needed
      const maxWidth = 1200;
      const maxHeight = 1200;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get optimized blob
        const optimizedBlob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/jpeg', 0.8);
        });
        
        const imageFile = new File([optimizedBlob], "category_image.jpg", { type: "image/jpeg" });
        const submitData = new FormData();
        submitData.append("name", data.name);
        submitData.append("desc", data.desc);
        submitData.append("offerPercentage", data.offerPercentage);
        submitData.append("isListed", data.isListed);
        submitData.append("image", imageFile);

        const result = await createCategory(submitData).unwrap();
        console.log('Category created:', result);
        navigate("/admin/categories");
      } else {
        // If image is already small enough, use as is
        const imageFile = new File([blob], "category_image.jpg", { type: "image/jpeg" });
        const submitData = new FormData();
        submitData.append("name", data.name);
        submitData.append("desc", data.desc);
        submitData.append("offerPercentage", data.offerPercentage);
        submitData.append("isListed", data.isListed);
        submitData.append("image", imageFile);

        const result = await createCategory(submitData).unwrap();
        console.log('Category created:', result);
        navigate("/admin/categories");
      }
    } catch (error) {
      console.error("Failed to create category:", error);
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
          Add New Category
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                }`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="max-h-[200px] mx-auto"
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
            {isLoading ? "Creating..." : "Create Category"}
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

export default AddCategoryPage;
