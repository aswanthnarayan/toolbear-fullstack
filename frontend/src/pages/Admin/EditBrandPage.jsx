import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBrandByIdQuery, useUpdateBrandMutation } from "../../../App/features/rtkApis/adminApi";
import BrandForm from "../../components/Admin/BrandForm";
import { Spinner } from "@material-tailwind/react";


const EditBrandPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const { data: brand, isLoading: isFetching } = useGetBrandByIdQuery(id);
  const [updateBrand, { isLoading: isUpdating, error: updateError }] = useUpdateBrandMutation();
  
  const handleSubmit = async (formData) => {
    try {
      await updateBrand({ brandId: id, formData }).unwrap();
      navigate('/admin/brands');  
    } catch (error) {
      console.error('Failed to update brand:', error);
      if (error.data?.field === 'name') {
        return { field: 'name', message: error.data.message };
      }
      return false; // Prevent form reset
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <BrandForm
      mode="edit"
      onSubmit={handleSubmit}
      isLoading={isUpdating}
      initialData={brand}
      error={updateError?.data} 
    />
  );
};

export default EditBrandPage;