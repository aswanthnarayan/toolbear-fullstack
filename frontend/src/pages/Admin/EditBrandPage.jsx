import React from "react";
import { useParams } from "react-router-dom";
import { useGetBrandByIdQuery, useUpdateBrandMutation } from "../../../App/features/rtkApis/adminApi";
import BrandForm from "../../components/Admin/BrandForm";
import { Spinner } from "@material-tailwind/react";

const EditBrandPage = () => {

  const { id } = useParams();
  const { data: brand, isLoading: isFetching } = useGetBrandByIdQuery(id);
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();
  
  const handleSubmit = async (formData) => {
    await updateBrand({ brandId: id, formData });
  };;

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
    />
  );
};

export default EditBrandPage;