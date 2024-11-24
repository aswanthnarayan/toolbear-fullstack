import React from "react";
import { useCreateCategoryMutation } from "../../../App/features/rtkApis/adminApi";
import CategoryForm from "../../components/Admin/CategoryForm";

const AddCategoryPage = () => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const handleSubmit = async (formData) => {
    await createCategory(formData);
  };

  return (
    <CategoryForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
      mode="add"
    />
  );
};

export default AddCategoryPage;