import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Spinner,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "../../../App/features/rtkApis/adminApi";
import OrderUpdateSelect from "./OrderUpdateSelect";
import CustomInput from "../CustomInput";
import { AlertModal } from "../AlertModal";
import { useNavigate } from "react-router-dom";
import { Chip } from "@material-tailwind/react";

const TABLE_HEAD = ["Order ID", "Customer", "Products", "Total", "Date", "Status", "Actions"];
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const ITEMS_PER_PAGE = 10;
  const navigate = useNavigate();

  // RTK Query hooks
  const { data, isLoading, isFetching, error } = useGetAllOrdersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleModalOpen = () => setModalOpen(!modalOpen);

  const handleStatusUpdate = async (_id, newStatus) => {    
    try {
      await updateStatus({ _id, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
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
              Orders List
            </Typography>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <div className="relative">
              <CustomInput
                label=""
                type="text"
                placeholder="Search orders..."
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
            onClick={() => navigate("/admin/orders/return")}
          >
            Returned Requests
          </Button>
        </div>
      </CardHeader>

      <CardBody className="overflow-y-auto px-0 pt-0 h-[calc(100vh-290px)] mt-4">
        {(isLoading || isFetching) ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            {error?.data?.message || 'Failed to fetch orders'}
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
              {data?.orders?.map((order) => (
                <tr key={order._id} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {order._id}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {order.address.fullName}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {order.address.phone}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {order.products.map(item => item.productId?.name || 'Product Unavailable').join(", ")}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      ₹{order.totalAmount}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <div className={`
                      px-2 py-1 rounded-full text-xs font-medium w-fit
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {order.status}
                    </div>
                  </td>
                  <td className="p-4">
                    {!['return requested', 'return approved', 'return rejected'].includes(order.status) ? (
                      <OrderUpdateSelect 
                        order={order}
                        onUpdateStatus={handleStatusUpdate}
                      />
                    ) : (
                      <Chip
                        variant="gradient"
                        color={
                          order.status === 'return requested' ? 'amber' : 
                          order.status === 'return approved' ? 'green' : 'red'
                        }
                        value={order.status}
                        className="py-0.5 px-2 text-[11px] font-medium"
                      />
                    )}
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
            Page {data?.currentPage} of {data?.totalPages}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            ({data?.totalOrders} total orders)
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
            disabled={!data?.hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      </CardFooter>

      <AlertModal
        open={modalOpen}
        handleOpen={handleModalOpen}
        heading={modalAction === 'cancel' ? "Cancel Order" : "Update Order"}
        message={`Are you sure you want to ${modalAction === 'cancel' ? 'cancel' : 'update'} this order?`}
        confirmText={modalAction === 'cancel' ? "Cancel Order" : "Update"}
        confirmColor={modalAction === 'cancel' ? "red" : "blue"}
        onConfirm={() => {
          if (modalAction === 'cancel') {
            handleCancelOrder(selectedOrder?._id);
          }
        }}
        loading={isUpdating}
      />
    </Card>
  );
};

export default AdminOrders;