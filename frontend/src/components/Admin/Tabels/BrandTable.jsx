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
import { useGetAllBrandsQuery, useToggleListBrandMutation } from "../../../../App/features/rtkApis/adminApi";
import { AlertModal } from "../../AlertModal";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import CustomInput from "../../CustomInput";

const TABLE_HEAD = ["Logo", "Brand Name", "Description", "Created At", "Offer %", "List/UnList", "Edit"];

export function BrandTable() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // RTK Query hooks
  const { data, isLoading, isFetching, error } = useGetAllBrandsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery
  });

  const [toggleList, { isLoading: isToggling }] = useToggleListBrandMutation();

  const handleModalOpen = () => setModalOpen(!modalOpen);

  const handleListToggle = async (id) => {
    try {
      await toggleList(id).unwrap();
      handleModalOpen();
      setSelectedBrand(null);
    } catch (error) {
      console.error('Failed to toggle brand list status:', error);
    }
  };

  const handleSwitchClick = (brand) => {
    setSelectedBrand(brand);
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
              Brand List
            </Typography>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <div className="relative">
              <CustomInput
                label=""
                type="text"
                placeholder="Search brands..."
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
            onClick={() => navigate("/admin/brands/new")}
          >
            Add Brand
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
            {error?.data?.message || 'Failed to fetch brands'}
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
              {data?.brands.map((brand) => (
                <tr key={brand._id} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <img
                      src={brand.logo.imageUrl}
                      alt={brand.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {brand.name}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal max-w-xs truncate">
                      {brand.desc}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {brand.offerPercentage}%
                    </Typography>
                  </td>
                  <td className="p-4">
                    <SwitchButton
                      id={brand._id}
                      checked={!brand.isListed}
                      onChange={() => handleSwitchClick(brand)}
                      activeText="Unlisted"
                      inactiveText="Listed"
                      disabled={isLoading || isToggling}
                    />
                  </td>
                  <td className="p-4">
                    <IconButton
                      variant="text"
                      color="blue"
                      onClick={() => navigate(`/admin/brands/edit/${brand._id}`)}
                    >
                      <FaPencil color="black" className="h-4 w-4" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>

      {/* Confirmation Modal */}
      <AlertModal
        open={modalOpen}
        handleOpen={handleModalOpen}
        heading={selectedBrand?.isListed ? "Unlist Brand" : "List Brand"}
        message={`Are you sure you want to ${selectedBrand?.isListed ? 'unlist' : 'list'} ${selectedBrand?.name}?`}
        confirmText={selectedBrand?.isListed ? "Unlist" : "List"}
        confirmColor={selectedBrand?.isListed ? "red" : "green"}
        onConfirm={() => handleListToggle(selectedBrand?._id)}
        loading={isToggling}
        icon={selectedBrand?.isListed ? <FaEyeSlash className="text-red-500" /> : <FaEye className="text-green-500" />}
      />

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {data?.currentPage} of {data?.totalPages}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            ({data?.totalBrands} total brands)
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
