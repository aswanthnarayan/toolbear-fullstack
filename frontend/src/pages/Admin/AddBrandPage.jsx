import React from "react";
import { useCreateBrandMutation } from "../../../App/features/rtkApis/adminApi";
import BrandForm from "../../components/Admin/BrandForm";

const AddBrandPage = () => {
  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const handleSubmit = async (formData) => {
    await createBrand(formData);
  };

  return (
    <BrandForm mode="add" onSubmit={handleSubmit} isLoading={isLoading} />
  );
};

export default AddBrandPage;