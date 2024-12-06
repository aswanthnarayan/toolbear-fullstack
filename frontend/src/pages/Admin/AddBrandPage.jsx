import React from "react";
import { useCreateBrandMutation } from "../../../App/features/rtkApis/adminApi";
import BrandForm from "../../components/Admin/BrandForm";
import { useNavigate } from "react-router-dom";

const AddBrandPage = () => {
  const [createBrand, { isLoading, error: createError  }] = useCreateBrandMutation();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createBrand(formData).unwrap();
      navigate('/admin/brands');    
    } catch (error) {
      console.error('Failed to create Brand:', error);
      if (error.data?.field === 'name') {
        return { field: 'name', message: error.data.message };
      }
      return false; // Prevent form reset
    }
  };

  return (
    <BrandForm mode="add" onSubmit={handleSubmit} isLoading={isLoading} error={createError?.data} />
  );
};

export default AddBrandPage;