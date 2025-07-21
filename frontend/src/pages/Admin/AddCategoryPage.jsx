import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCategoryMutation } from "../../../App/features/rtkApis/adminApi";
import CategoryForm from "../../components/Admin/CategoryForm";

const AddCategoryPage = () => {
  const [createCategory, { isLoading, error: createError }] = useCreateCategoryMutation();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createCategory(formData).unwrap();
      navigate('/admin/categories');
    } catch (error) {
      console.error('Failed to create category:', error);
      return false; // Prevent form reset
    }
  };

  return (
    <CategoryForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      mode="add"
      error={createError?.data} // Pass the error data from RTK Query
    />
  );
};

export default AddCategoryPage;