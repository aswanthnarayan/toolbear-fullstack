import React, { useState, useEffect } from 'react';
import { Card, CardBody, Typography, Button, IconButton, Select, Option, Spinner } from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useGetBannersQuery, useUpdateBannersMutation, useGetAllBrandsQuery } from '../../../App/features/rtkApis/adminApi';

const AdminBannerPage = () => {
  const [bannerPreviews, setBannerPreviews] = useState([null, null, null]);
  const [bannerFiles, setBannerFiles] = useState([null, null, null]);
  const [selectedBrands, setSelectedBrands] = useState([null, null, null]);

  const { data: bannersData, isLoading: isLoadingBanners } = useGetBannersQuery();
  const { data: brandsData, isLoading: isLoadingBrands } = useGetAllBrandsQuery({ page: 1, limit: 100 });
  const [updateBanners, { isLoading: isUpdating }] = useUpdateBannersMutation();

  const {
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  // Initialize banners and brands from API data
  useEffect(() => {
    if (bannersData?.banners) {
      const sortedBanners = [...bannersData.banners].sort((a, b) => a.position - b.position);
      setBannerPreviews(sortedBanners.map(banner => banner.imageUrl));
      setSelectedBrands(sortedBanners.map(banner => banner.brandId?._id || null));
    }
  }, [bannersData]);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newPreviews = [...bannerPreviews];
          newPreviews[index] = reader.result;
          setBannerPreviews(newPreviews);

          const newFiles = [...bannerFiles];
          newFiles[index] = file;
          setBannerFiles(newFiles);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select an image file');
      }
    }
  };

  const handleBrandChange = (value, index) => {
    const newSelectedBrands = [...selectedBrands];
    newSelectedBrands[index] = value;
    setSelectedBrands(newSelectedBrands);
  };

  const handleRemoveImage = (index) => {
    const newPreviews = [...bannerPreviews];
    const newFiles = [...bannerFiles];
    newPreviews[index] = bannersData?.banners[index]?.imageUrl || null;
    newFiles[index] = null;
    setBannerPreviews(newPreviews);
    setBannerFiles(newFiles);
  };

  const onSubmit = async () => {
    try {
      // Validate that all three banners and brands are selected
      if (selectedBrands.some(brand => !brand)) {
        toast.error('Please select all brands');
        return;
      }

      // When updating existing banners, we don't need new files
      if (!bannersData?.banners && bannerFiles.some(file => !file)) {
        toast.error('Please select all banners');
        return;
      }

      const formData = new FormData();
      bannerFiles.forEach((file, index) => {
        if (file) {
          formData.append(`banner${index + 1}`, file);
        }
      });

      // Ensure brandIds are valid before sending
      const validBrandIds = selectedBrands.filter(brandId => brandId);
      if (validBrandIds.length !== 3) {
        toast.error('Please select all brands');
        return;
      }

      formData.append('brandIds', JSON.stringify(validBrandIds));

      await updateBanners(formData).unwrap();
      toast.success('Banners updated successfully');
      
      // Reset files after successful upload
      setBannerFiles([null, null, null]);
    } catch (error) {
      console.error('Error uploading banners:', error);
      toast.error(error.data?.message || 'Failed to upload banners');
    }
  };

  if (isLoadingBanners || isLoadingBrands) {
    return <Spinner />;
  }

  const activeBrands = brandsData?.brands?.filter(brand => brand.isListed) || [];

  return (
    <div className="p-4">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Manage Deal Banners
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="flex flex-col items-center">
                  <Typography variant="h6" className="mb-2">
                    Banner {index + 1}
                  </Typography>
                  <div className="relative w-full aspect-[16/9] mb-2">
                    {bannerPreviews[index] ? (
                      <>
                        <img
                          src={bannerPreviews[index]}
                          alt={`Banner ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <IconButton
                          size="sm"
                          color="red"
                          variant="text"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, index)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Typography color="gray" className="text-center">
                          Click to upload banner
                        </Typography>
                      </div>
                    )}
                  </div>
                  <div className="w-full mt-2">
                    <Select
                      label="Select Brand"
                      value={selectedBrands[index]}
                      onChange={(value) => handleBrandChange(value, index)}
                    >
                      {activeBrands.map((brand) => (
                        <Option key={brand._id} value={brand._id}>
                          {brand.name}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating && <Spinner size="sm" />}
            {isUpdating ? 'Updating...' : 'Update Banners'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminBannerPage;