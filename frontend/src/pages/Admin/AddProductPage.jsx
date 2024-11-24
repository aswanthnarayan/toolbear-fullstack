import React from 'react';
import ProductForm from '../../components/Admin/ProductForm';
import { useCreateProductMutation, useGetAllCategoriesQuery, useGetAllBrandsQuery } from '../../../App/features/rtkApis/adminApi';

const AddProductPage = () => {
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, limit: 100 });
  const { data: brandsData } = useGetAllBrandsQuery({ page: 1, limit: 100 });

  const handleSubmit = async (formData) => {
    await createProduct(formData);
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
      />
    </div>
  );
};

export default AddProductPage;