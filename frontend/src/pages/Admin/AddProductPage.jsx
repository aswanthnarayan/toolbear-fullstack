import React from 'react';
import ProductForm from '../../components/Admin/ProductForm';
import { useCreateProductMutation, useGetAllCategoriesQuery, useGetAllBrandsQuery } from '../../../App/features/rtkApis/adminApi';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const [createProduct, { isLoading, error: createError }] = useCreateProductMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, limit: 100 });
  const { data: brandsData } = useGetAllBrandsQuery({ page: 1, limit: 100 });
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const result = await createProduct(formData).unwrap();
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      if (error.status === 409) {
        return { error: error.data }; // Return error data to the form
      }
      return false; // Prevent form reset for other errors
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <ProductForm 
        mode="add"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        categories={categoriesData?.categories || []}
        brands={brandsData?.brands || []}
        error={createError?.data}
      />
    </div>
  );
};

export default AddProductPage;