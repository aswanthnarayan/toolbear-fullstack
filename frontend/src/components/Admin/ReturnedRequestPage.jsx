import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Chip,
} from "@material-tailwind/react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useGetReturnRequestsQuery, useHandleReturnRequestMutation } from "../../../App/features/rtkApis/adminApi";
import { Spinner } from "@material-tailwind/react";
import { AlertModal } from "../AlertModal";
import { toast } from "sonner";

const TABLE_HEAD = ["Order ID", "Customer", "Products", "Return Reason", "Date", "Status", "Actions"];

const ReturnedRequestPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  // RTK Query hooks
  const { data, isLoading } = useGetReturnRequestsQuery();
  const [handleReturnRequest] = useHandleReturnRequestMutation();

  const returnRequests = data?.returnRequests || [];

  const handleActionClick = (order, action) => {
    setSelectedOrder(order);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      await handleReturnRequest({
        orderId: selectedOrder._id,
        action: modalAction
      }).unwrap();
      
      toast.success(`Return request ${modalAction}ed successfully`);
      setModalOpen(false);
    } catch (error) {
      toast.error(error.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
          <Typography variant="h6" >
            Return Requests
          </Typography>
     
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
              ) : returnRequests.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    No return requests found
                  </td>
                </tr>
              ) : (
                returnRequests.map((order) => (
                  <tr key={order._id}>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {order._id}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {order.userId.name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {order.products.map(p => p.productId.name).join(', ')}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {order.returnReason}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {new Date(order.returnRequestedAt).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Chip
                        variant="gradient"
                        color={order.status === 'return requested' ? 'amber' : 
                               order.status === 'return approved' ? 'green' : 'red'}
                        value={order.status}
                        className="py-0.5 px-2 text-[11px] font-medium"
                      />
                    </td>
                    <td className="p-4">
                      {order.status === 'return requested' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            color="green"
                            onClick={() => handleActionClick(order, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            color="red"
                            onClick={() => handleActionClick(order, 'reject')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <AlertModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
        title={`${modalAction === 'approve' ? 'Approve' : 'Reject'} Return Request`}
        message={`Are you sure you want to ${modalAction} this return request?`}
      />
    </div>
  );
};

export default ReturnedRequestPage;