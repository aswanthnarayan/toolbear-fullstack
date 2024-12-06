import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Spinner,
  IconButton,
} from "@material-tailwind/react";
import { FaMagnifyingGlass, FaPencil } from "react-icons/fa6";
import { SwitchButton } from "../SwitchButton";
import { useGetAllProductsQuery, useToggleListProductMutation } from "../../../../App/features/rtkApis/adminApi";
import { AlertModal } from "../../AlertModal";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import CustomInput from "../../CustomInput";

const TABLE_HEAD = ["Image", "Product Name", "Category", "Brand", "Price", "Stock", "Offer %", "Listed/Unlisted", "Edit"];

export function ProductsTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // RTK Query hooks
  const { data, isLoading, isFetching, error } = useGetAllProductsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery
  });

  const [toggleList, { isLoading: isToggling }] = useToggleListProductMutation();

  const handleModalOpen = () => setModalOpen(!modalOpen);

  const handleListToggle = async (id) => {
    try {
      await toggleList(id).unwrap();
      handleModalOpen();
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to toggle product list status:', error);
    }
  };

  const handleSwitchClick = (product) => {
    setSelectedProduct(product);
    handleModalOpen();
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, data?.totalPages || prev));
  };

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Products List
            </Typography>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <div className="relative">
              <CustomInput
                label=""
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-0 focus:border-gray-300 hover:border-gray-400 transition-colors"
              />
              <FaMagnifyingGlass className="absolute right-3 top-[35%] text-gray-400" />
            </div>
          </div>
          <Button
            variant="filled"
            size="md"
            onClick={() => navigate('/admin/products/new')}
          >
            Add Product
          </Button>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                  <Spinner className="h-6 w-6 mx-auto" />
                </td>
              </tr>
            ) : data?.products?.length === 0 ? (
              <tr>
                <td colSpan={TABLE_HEAD.length} className="text-center py-4">
                  <Typography variant="small" color="blue-gray">
                    No products found
                  </Typography>
                </td>
              </tr>
            ) : (
              data?.products?.map((product, index) => {
                const isLast = index === data.products.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={product._id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.mainImage?.imageUrl || product.mainImage}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {product.name}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {product.category?.name || '-'}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {product.brand?.name || '-'}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        ₹{product.price}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {product.stock}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {product.offerPercentage ? `${product.offerPercentage}%` : '-'}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <SwitchButton
                          id={product._id}
                          checked={!product.isListed}
                          onChange={() => handleSwitchClick(product)}
                          icon={!product.isListed ? <FaEyeSlash /> : <FaEye />}
                          activeText="Unlisted"
                          inactiveText="Listed"
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      >
                        <FaPencil className="h-4 w-4" />
                      </IconButton>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of {data?.totalPages}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            ({data?.totalProducts} total products)
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === data?.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </CardFooter>
      <AlertModal
        open={modalOpen}
        handleOpen={handleModalOpen}
        heading={!selectedProduct?.isListed ? "List Product" : "Unlist Product"}
        message={`Are you sure you want to ${selectedProduct?.isListed ? 'unlist' : 'list'} ${selectedProduct?.name}?`}
        confirmText={!selectedProduct?.isListed ? "List" : "Unlist"}
        confirmColor={!selectedProduct?.isListed ? "green" : "red"}
        onConfirm={() => handleListToggle(selectedProduct?._id)}
        loading={isToggling}
        icon={!selectedProduct?.isListed ? <FaEye className="text-green-500" /> : <FaEyeSlash className="text-red-500" />}
      />
    </Card>
  );
}
