import React, { useState, useRef } from "react";
import {
  Card,
  Typography,
  Input,
  Checkbox,
  Button,
  Textarea,
} from "@material-tailwind/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import EasyCropperModal from "../../components/EasyCropperModal";

const AddCategoryPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerPercentage: "",
    isListed: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleCropComplete = (croppedImage) => {
    setImagePreview(croppedImage);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] h-auto py-6">
      <Card className="w-full p-6">
        <Typography variant="h5" color="blue-gray" className="mb-6">
          Add New Category
        </Typography>
        <div className="flex flex-col  md:flex-row gap-6">
          <div className="w-full md:w-1/2 flex flex-col gap-6 flex-1">
            <Input
              size="lg"
              label="Category Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Input
              size="lg"
              label="Offer Percentage"
              type="number"
              value={formData.offerPercentage}
              onChange={(e) =>
                setFormData({ ...formData, offerPercentage: e.target.value })
              }
            />

            <div className="-ml-3">
              <Checkbox
                label="List this category"
                checked={formData.isListed}
                onChange={(e) =>
                  setFormData({ ...formData, isListed: e.target.checked })
                }
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 ">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />

            <div
              onClick={handleImageClick}
              className="h-[300px] w-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors flex items-center justify-center relative"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain absolute inset-0 m-auto p-2"
                />
              ) : (
                <div className="text-center">
                  <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400 mb-2" />
                  <Typography variant="h6" color="gray" className="font-normal">
                    Click to upload image
                  </Typography>
                  <Typography
                    variant="small"
                    color="gray"
                    className="font-normal"
                  >
                    PNG, JPG, JPEG up to 5MB
                  </Typography>
                </div>
              )}
            </div>

            <EasyCropperModal
              open={isCropperOpen}
              onClose={() => setIsCropperOpen(false)}
              image={originalImage}
              onCropComplete={handleCropComplete}
            />
          </div>
        </div>
        <Button className="w-full md:w-1/2 mt-6">
              Save Category
            </Button> 
      </Card>
    </div>
  );
};

export default AddCategoryPage;
