import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetProductByCategoryQuery } from '../../../App/features/rtkApis/userApi';
import ProductCard from './ProductCard';
import { Spinner } from '@material-tailwind/react';
import CustomSpinner from '../utils/CustomSpinner';

const RelatedProducts = ({ category, currentProductId, onToast }) => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const { data: products, isLoading, error } = useGetProductByCategoryQuery(category?._id);
                                                
  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => 
      item.productId._id === productId || item.productId === productId
    );
  };

  if (isLoading) {
    return (
      <CustomSpinner/>
    );
  }

  if (error || !products || products.length === 0) {
    return null;
  }

  // Filter out the current product and get up to 4 related products
  const relatedProducts = products
    .filter(product => product._id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-semibold ${currentTheme.text}`}>Similar Products</h2>
        <Link 
          to={`/category/${category?._id}`}
          className="text-yellow-500 hover:text-yellow-600 transition-colors"
        >
          Show More
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            image={product.mainImage?.imageUrl || product.mainImage || ''}
            name={product.name || ''}
            brand={product.brand?.name || ''}  
            rating={product.rating || 0}
            reviews={product.reviews || []}
            price={product.price || 0}
            maxOfferPercentage={product.maxOfferPercentage || 0}
            sellingPrice={product.sellingPrice || 0}
            stock={product.stock || 0}
            description={product.description || ''}
            toastMsg={onToast}
            isInWishlist={isProductInWishlist(product._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;