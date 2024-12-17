import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { useGetAllCouponsQuery, useDeleteCouponMutation } from '../../../App/features/rtkApis/adminApi';
import { Spinner } from "@material-tailwind/react";
import { AlertModal } from "../../components/AlertModal";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const TABLE_HEAD = ["Code", "Description", "Discount", "Min. Purchase", "Validity", "Status", "Actions"];

const AdminCouponPage = () => {
    const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // RTK Query hooks
  const { data, isLoading } = useGetAllCouponsQuery();
  const [deleteCoupon] = useDeleteCouponMutation();

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

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <div className="mb-8 p-6">
          <div className="flex items-center justify-between">
            <Typography variant="h6" >
              Coupons List
            </Typography>
            <Button
              className="flex items-center gap-3"
              size="sm"
              onClick={() => navigate("/admin/coupons/new")}
            >
              <FaPlus className="h-4 w-4" /> Add New
            </Button>
          </div>
        </div>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
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
              {isLoading ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    <Spinner className="h-6 w-6 mx-auto" />
                  </td>
                </tr>
              ) : !data?.coupons?.length ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    No coupons found
                  </td>
                </tr>
              ) : (
                data.coupons.map((coupon) => (
                  <tr key={coupon._id}>
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
                      <div className="w-max">
                        <Chip
                          variant="gradient"
                          color={coupon.isActive ? "green" : "blue-gray"}
                          value={coupon.isActive ? "Active" : "Inactive"}
                          className="py-0.5 px-2 text-[11px] font-medium"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <Tooltip content="Delete Coupon">
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDeleteClick(coupon)}
                        >
                          <FaTrash className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <AlertModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        message={`Are you sure you want to delete the coupon "${selectedCoupon?.code}"?`}
      />
    </div>
  );
};

export default AdminCouponPage;