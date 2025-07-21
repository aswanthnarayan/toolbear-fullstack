import React from "react";
import { useParams } from "react-router-dom";
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from "../../../App/features/rtkApis/adminApi";
import CategoryForm from "../../components/Admin/CategoryForm";
import { Spinner } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

const EditCategoryPage = () => {
  const { id } = useParams();
  const { data: category, isLoading: isFetching } = useGetCategoryByIdQuery(id);
  const [updateCategory, { isLoading: isUpdating, error: updateError }] = useUpdateCategoryMutation();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await updateCategory({ 
        categoryId: id,  
        formData  
      }).unwrap();
      navigate('/admin/categories');  
    } catch (error) {
      console.error('Failed to update category:', error);
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
    <CategoryForm
      initialData={category}
      onSubmit={handleSubmit}
      isLoading={isUpdating}
      mode="edit"
      error={updateError?.data} // Pass the error data from RTK Query
    />
  );
};

export default EditCategoryPage;