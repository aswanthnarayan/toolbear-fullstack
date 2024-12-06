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
import { useGetAllCategoriesQuery, useToggleListCategoryMutation } from "../../../../App/features/rtkApis/adminApi";
import { AlertModal } from "../../AlertModal";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import CustomInput from "../../CustomInput";

const TABLE_HEAD = ["Image", "Category Name", "Description", "Created At", "Offer %", "List/UnList", "Edit"];

export function CategoryTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // RTK Query hooks
  const { data, isLoading, isFetching, error } = useGetAllCategoriesQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery
  });


  const [toggleList, { isLoading: isToggling }] = useToggleListCategoryMutation();

  const handleModalOpen = () => setModalOpen(!modalOpen);

  const handleListToggle = async (id) => {
    try {
      console.log('Toggling category:', id);
      const result = await toggleList(id).unwrap();
      console.log('Toggle result:', result);
      handleModalOpen();
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to toggle category list status:', error);
    }
  };

  const handleSwitchClick = (category) => {
    console.log('Selected category:', category);
    setSelectedCategory(category);
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

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Category List
            </Typography>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <div className="relative">
              <CustomInput
                label=""
                type="text"
                placeholder="Search categories..."
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
            onClick={() => navigate("/admin/categories/new")}
          >
            Add Category
          </Button>
        </div>
      </CardHeader>

      <CardBody className="overflow-y-auto px-0 pt-0 h-[calc(100vh-290px)] mt-4">
        {isLoading || isFetching ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            {error?.data?.message || 'Failed to fetch categories'}
          </div>
        ) : (
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.categories.map((category) => {
                
                return (
                  <tr key={category._id} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {category.name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal max-w-xs truncate">
                        {category.desc} 
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                   {new Date(category.createdAt).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {category.offerPercentage}%
                      </Typography>
                    </td>
                    <td className="p-4">
                      <SwitchButton
                        id={category._id}
                        checked={!category.isListed}
                        onChange={() => handleSwitchClick(category)}
                        activeText="Unlisted"
                        inactiveText="Listed"
                        disabled={isLoading || isToggling}
                      />
                    </td>
                    <td className="p-4">
                      <IconButton
                        variant="text"
                        color="blue"
                        onClick={() => navigate(`/admin/categories/edit/${category._id}`)}
                      >
                        <FaPencil color="black" className="h-4 w-4" />
                      </IconButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardBody>

      {/* Confirmation Modal */}
      <AlertModal
        open={modalOpen}
        handleOpen={handleModalOpen}
        heading={selectedCategory?.isListed ? "Unlist Category" : "List Category"}
        message={`Are you sure you want to ${selectedCategory?.isListed ? 'unlist' : 'list'} ${selectedCategory?.name}?`}
        confirmText={selectedCategory?.isListed ? "Unlist" : "List"}
        confirmColor={selectedCategory?.isListed ? "red" : "green"}
        onConfirm={() => handleListToggle(selectedCategory?._id)}
        loading={isToggling}
        icon={selectedCategory?.isListed ? <FaEyeSlash className="text-red-500" /> : <FaEye className="text-green-500" />}
      />

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {data?.currentPage} of {data?.totalPages}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            ({data?.totalCategories} total categories)
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
    </Card>
  );
}
