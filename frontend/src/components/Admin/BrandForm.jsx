import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import EasyCropperModal from "../../components/EasyCropperModal";
import {
  Card,
  Typography,
  Checkbox,
  Button,
  Spinner
} from "@material-tailwind/react";
import { FaCloudUploadAlt } from "react-icons/fa";

const BrandForm = ({ mode = "add", onSubmit: submitForm, isLoading, initialData }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showCropper, setShowCropper] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageType, setCurrentImageType] = useState(null); // 'logo' or 'banner'
  const [currentBannerIndex, setCurrentBannerIndex] = useState(null);
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(initialData?.logo?.imageUrl || null);
  
  const [bannerImages, setBannerImages] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState(
    initialData?.bannerImages?.map(banner => banner.imageUrl) || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch
  } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      desc: initialData?.desc || "",
      offerPercentage: initialData?.offerPercentage || "",
      base_color: initialData?.base_color || "#000000",
      isListed: initialData?.isListed ?? true,
      about: {
        section1: {
          title: initialData?.about?.section1?.title || "",
          desc: initialData?.about?.section1?.desc || ""
        },
        section2: {
          title: initialData?.about?.section2?.title || "",
          desc: initialData?.about?.section2?.desc || ""
        },
        section3: {
          title: initialData?.about?.section3?.title || "",
          desc: initialData?.about?.section3?.desc || ""
        }
      }
    }
  });

  const selectedColor = watch("base_color");

  const handleLogoSelect = (e) => {
    clearErrors("logo");
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("logo", {
          type: "manual",
          message: "Logo size should be less than 5MB"
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("logo", {
          type: "manual",
          message: "Please select an image file"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result);
        setCurrentImageType('logo');
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSelect = (e, index) => {
    clearErrors("banners");
    const file = e.target.files[0];
    
    if (bannerImages.length >= 3 && !bannerImages[index]) {
      setError("banners", {
        type: "manual",
        message: "Maximum 3 banner images allowed"
      });
      return;
    }

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("banners", {
          type: "manual",
          message: "Each banner image should be less than 5MB"
        });
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("banners", {
          type: "manual",
          message: "Please select image files only"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result);
        setCurrentImageType('banner');
        setCurrentBannerIndex(index);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCroppedImage = async (croppedImageUrl) => {
    try {
      // Convert the cropped image URL to a Blob
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      
      // Create a File object from the Blob
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

      if (currentImageType === 'logo') {
        setLogoFile(file);
        setLogoPreview(croppedImageUrl);
      } else if (currentImageType === 'banner') {
        const newBannerImages = [...bannerImages];
        const newBannerPreviews = [...bannerPreviews];
        
        newBannerImages[currentBannerIndex] = file;
        newBannerPreviews[currentBannerIndex] = croppedImageUrl;
        
        setBannerImages(newBannerImages);
        setBannerPreviews(newBannerPreviews);
      }
    } catch (error) {
      console.error('Error processing cropped image:', error);
    }
    
    setShowCropper(false);
    setCurrentImage(null);
    setCurrentImageType(null);
    setCurrentBannerIndex(null);
  };

  const onSubmit = async (data) => {
    try {
      if (mode === "add" && !logoFile) {
        setError("logo", {
          type: "manual",
          message: "Logo is required"
        });
        return;
      }

      const formData = new FormData();
      
      // Append files only if they've been changed
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Append banners with their positions
      bannerImages.forEach((banner, index) => {
        if (banner && banner instanceof File) {  // Only append new/changed banners
          formData.append("banners", banner);
          formData.append("bannerPositions", index);  // Track position of each banner
        }
      });
      
      // Append existing banner URLs that weren't changed
      formData.append("existingBanners", JSON.stringify(
        bannerPreviews.map((preview, index) => ({
          position: index,
          imageUrl: bannerImages[index] instanceof File ? null : preview,
          publicId: initialData?.bannerImages?.[index]?.publicId
        }))
      ));

      // Append other form data as strings
      formData.append("name", data.name);
      formData.append("desc", data.desc);
      formData.append("offerPercentage", data.offerPercentage);
      formData.append("base_color", data.base_color);
      formData.append("isListed", String(data.isListed));
      formData.append("about", JSON.stringify({
        section1: {
          title: data.about.section1.title,
          desc: data.about.section1.desc
        },
        section2: {
          title: data.about.section2.title,
          desc: data.about.section2.desc
        },
        section3: {
          title: data.about.section3.title,
          desc: data.about.section3.desc
        }
      }));

      await submitForm(formData);
      navigate(-1);
    } catch (error) {
      console.error("Error submitting brand form:", error);
      
      // Handle validation errors
      if (error.data?.message?.includes("must be at least")) {
        const field = error.data.message.split(" ")[0].toLowerCase();
        setError(field, {
          type: "manual",
          message: error.data.message
        });
      } 
      // Handle duplicate name error
      else if (error.data?.message?.includes("already exists")) {
        setError("name", {
          type: "manual",
          message: "A brand with this name already exists"
        });
      }
    }
  };



  return (
    <form className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      {/* Form Heading */}
      <Typography variant="h4" color="blue-gray" className="mb-6">
        {mode === "add" ? "Add New Brand" : "Edit Brand"}
      </Typography>
      
      <div className="grid grid-cols-1 gap-6">
        {/* General Information */}
        <div className="space-y-4">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            General Information
          </Typography>
          <CustomInput
            label="Brand Name"
            {...register("name", { 
              required: "Brand name is required",
              minLength: {
                value: 2,
                message: "Brand name must be at least 2 characters long"
              }
            })}
            error={errors.name?.message}
          />
          <CustomInput
            label="Description"
            type="textarea"
            {...register("desc", { 
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long"
              }
            })}
            error={errors.desc?.message}
          />
          <CustomInput
            label="Offer Percentage"
            type="number"
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
          <div className="relative">
            <input
              type="color"
              {...register("base_color", { required: "Base color is required" })}
              className="w-12 h-12 p-1 rounded cursor-pointer absolute left-0 top-0"
            />
            <input
              type="text"
              value={selectedColor}
              className="w-full pl-16 h-12 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Selected Color"
              readOnly
            />
            {errors.base_color && (
              <p className="text-red-500 text-sm mt-1">{errors.base_color.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              {...register("isListed")}
              defaultChecked
              label="List this brand"
            />
          </div>
        </div>

        {/* Logo Section */}
        <div className="mb-6">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Brand Logo
          </Typography>
          <div className="flex items-center gap-4">
            <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <FaCloudUploadAlt className="w-8 h-8 text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo.message}</p>
            )}
          </div>
        </div>

        {/* Banner Images Section */}
        <div className="mb-6">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Banner Images (Max 3)
          </Typography>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative"
              >
                {bannerPreviews[index] ? (
                  <img
                    src={bannerPreviews[index]}
                    alt={`Banner ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FaCloudUploadAlt className="w-8 h-8 text-gray-400" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBannerSelect(e, index)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={bannerImages.length >= 3 && !bannerImages[index]}
                />
              </div>
            ))}
          </div>
          {errors.banners && (
            <p className="text-red-500 text-sm mt-2">{errors.banners.message}</p>
          )}
        </div>

        {/* About Section 1 */}
        <div className="space-y-4">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            About Section 1
          </Typography>
          <CustomInput
            label="Title"
            {...register("about.section1.title", { 
              required: "Section 1 title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters long"
              }
            })}
            error={errors?.about?.section1?.title?.message}
          />
          <CustomInput
            label="Description"
            type="textarea"
            {...register("about.section1.desc", { 
              required: "Section 1 description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long"
              }
            })}
            error={errors?.about?.section1?.desc?.message}
          />
        </div>

        {/* About Section 2 */}
        <div className="space-y-4">
          <Typography variant="h6" color="blue-gray" className="mb-3">
            About Section 2
          </Typography>
          <CustomInput
            label="Title"
            {...register("about.section2.title", { 
              required: "Section 2 title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters long"
              }
            })}
            error={errors?.about?.section2?.title?.message}
          />
          <CustomInput
            label="Description"
            type="textarea"
            {...register("about.section2.desc", { 
              required: "Section 2 description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long"
              }
            })}
            error={errors?.about?.section2?.desc?.message}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outlined"
            color="red"
            onClick={() => navigate(-1)}
            className="flex items-center gap-3"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="filled"
            className="flex items-center gap-2"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? (
              <>
                <Spinner className="h-4 w-4" /> Creating...
              </>
            ) : (
              mode === "add" ? "Add Brand" : "Update Brand"
            )}
          </Button>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && currentImage && (
        <EasyCropperModal
          image={currentImage}
          onClose={() => {
            setShowCropper(false);
            setCurrentImage(null);
            setCurrentImageType(null);
            setCurrentBannerIndex(null);
          }}
          onCropComplete={handleCroppedImage}
        />
      )}
    </form>
  );
};

export default BrandForm;
