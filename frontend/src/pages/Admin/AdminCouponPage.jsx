import React, { useState, useEffect } from "react";
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
import { FaMagnifyingGlass, FaTrash, FaPlus } from "react-icons/fa6";
import { useGetAllCouponsQuery, useDeleteCouponMutation } from "../../../App/features/rtkApis/adminApi";
import CustomInput from "../../components/CustomInput";
import { AlertModal } from "../../components/AlertModal";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const TABLE_HEAD = ["Code", "Description", "Discount", "Min. Purchase", "Validity", "Status", "Actions"];

const AdminCoupons = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // RTK Query hooks
  const { data, isLoading, isFetching } = useGetAllCouponsQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery
  });
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDeleteClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCoupon(selectedCoupon._id).unwrap();
      toast.success('Coupon deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.data?.message || 'Error deleting coupon');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const isActive = (expiryDate) => {
    const currentDate = new Date();
    return new Date(expiryDate) > currentDate;
  };

  const handlePrevPage = () => {
    if (data?.hasPrevPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Coupons List
            </Typography>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <div className="relative">
              <CustomInput
                label=""
                type="text"
                placeholder="Search coupons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-0 focus:border-gray-300 hover:border-gray-400 transition-colors"
              />
              <FaMagnifyingGlass className="absolute right-3 top-[35%] text-gray-400" />
            </div>
          </div>
          <Button
            className="flex items-center gap-3"
            size="sm"
            onClick={() => navigate("/admin/coupons/new")}
          >
            <FaPlus className="h-4 w-4" /> Add New
          </Button>
        </div>
      </CardHeader>

      <CardBody className="overflow-y-auto px-0 pt-0 h-[calc(100vh-290px)] mt-4">
        {(isLoading || isFetching) ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-8 w-8" />
          </div>
        ) : !data?.coupons?.length ? (
          <div className="text-center text-gray-500 py-4">
            No coupons found
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
              {data.coupons.map((coupon, index) => (
                <tr key={coupon._id} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {coupon.code}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {coupon.description}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {coupon.discountType === 'percentage' ? `${coupon.discountAmount}%` : `₹${coupon.discountAmount}`}
                      {coupon.maxDiscount > 0 && <span className="text-xs"> (Max: ₹{coupon.maxDiscount})</span>}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      ₹{coupon.minimumPurchase}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {formatDate(coupon.startDate)} - {formatDate(coupon.expiryDate)}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium w-fit
                      ${isActive(coupon.expiryDate) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                    `}>
                      {isActive(coupon.expiryDate) ? "Active" : "Expired"}
                    </div>
                  </td>
                  <td className="p-4">
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => handleDeleteClick(coupon)}
                      className="hover:bg-red-50"
                    >
                      <FaTrash className="h-4 w-4" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {data?.currentPage || 1} of {data?.totalPages || 1}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            ({data?.totalCoupons || 0} total coupons)
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePrevPage}
            disabled={!data?.hasPrevPage || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNextPage}
            disabled={!data?.hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      </CardFooter>

      <AlertModal
        open={showDeleteModal}
        handleOpen={() => setShowDeleteModal(false)}
        heading="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${selectedCoupon?.code}"?`}
        confirmText="Delete"
        confirmColor="red"
        onConfirm={handleDeleteConfirm}
        loading={isDeleting}
      />
    </Card>
  );
};

export default AdminCoupons;