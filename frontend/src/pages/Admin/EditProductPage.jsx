import React from 'react';
import { useParams } from 'react-router-dom';
import ProductForm from '../../components/Admin/ProductForm';
import { 
  useUpdateProductMutation, 
  useGetProductByIdQuery,
  useGetAllCategoriesQuery, 
  useGetAllBrandsQuery 
} from '../../../App/features/rtkApis/adminApi';

const EditProductPage = () => {
  const { id } = useParams();
  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const { data: productData, isLoading: isProductLoading } = useGetProductByIdQuery(id);
  const { data: categoriesData } = useGetAllCategoriesQuery({ page: 1, limit: 100 });
  const { data: brandsData } = useGetAllBrandsQuery({ page: 1, limit: 100 });

  const handleSubmit = async (formData) => {
    await updateProduct({ productId: id, formData });
  };

  if (isProductLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <ProductForm 
        mode="edit"
        onSubmit={handleSubmit}
        isLoading={isLoading}
        categories={categoriesData?.categories || []}
        brands={brandsData?.brands || []}
        initialData={productData}
      />
    </div>
  );
};

export default EditProductPage;