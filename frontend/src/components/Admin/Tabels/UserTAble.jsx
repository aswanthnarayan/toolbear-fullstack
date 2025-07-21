import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Spinner,
} from "@material-tailwind/react";
import { FaMagnifyingGlass, FaUserPlus } from "react-icons/fa6";
import { SwitchButton } from "../SwitchButton";
import { useGetUsersQuery, useToggleBlockUserMutation } from "../../../../App/features/rtkApis/adminApi"; 
import { AlertModal } from "../../AlertModal";
import { FaUserLock, FaUserCheck } from "react-icons/fa";
import CustomInput from "../../CustomInput";

const TABLE_HEAD = ["Name & Email", "Phone", "DOJ", "provider", "Block/Unblock"];

export function UserTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  // RTK Query hooks
  const { data, isLoading, isFetching, error } = useGetUsersQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchQuery
  });

  const [toggleBlock, { isLoading: isToggling }] = useToggleBlockUserMutation();

  const handleModalOpen = () => setModalOpen(!modalOpen);

  const handleBlockToggle = async (userId) => {
    try {
      await toggleBlock(userId).unwrap();
      handleModalOpen();
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to toggle user block status:', error);
    }
  };

  const handleSwitchClick = (user) => {
    setSelectedUser(user);
    handleModalOpen();
  };

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
              Users List
            </Typography>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="w-full md:w-72 ml-auto">
            <div className="relative">
              <CustomInput
                label=""
                type="text"
                placeholder="Search by Name or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-0 focus:border-gray-300 hover:border-gray-400 transition-colors"
              />
              <FaMagnifyingGlass className="absolute right-3 top-[35%] text-gray-400" />
            </div>
          </div>
         
        </div>
      </CardHeader>

      <CardBody className="overflow-y-auto px-0 pt-0 h-[calc(100vh-290px)] mt-4">
        {(isLoading || isFetching) ? (
          <div className="flex justify-center items-center h-full">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">
            {error?.data?.message || 'Failed to fetch users'}
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
              {data?.users.map((user) => (
                <tr key={user._id} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.name}
                      </Typography>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal opacity-70"
                      >
                        {user.email}
                      </Typography>
                    </div>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {user.phone}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {user.provider}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <SwitchButton
                      id={user._id}
                      checked={user.isBlocked}
                      onChange={() => handleSwitchClick(user)}
                      activeText="Blocked"
                      inactiveText="Active"
                      disabled={isLoading || isToggling}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>

      <AlertModal
        open={modalOpen}
        handleOpen={handleModalOpen}
        heading={selectedUser?.isBlocked ? "Unblock User" : "Block User"}
        message={`Are you sure you want to ${selectedUser?.isBlocked ? 'unblock' : 'block'} ${selectedUser?.name}?`}
        confirmText={selectedUser?.isBlocked ? "Unblock" : "Block"}
        confirmColor={selectedUser?.isBlocked ? "green" : "red"}
        onConfirm={() => handleBlockToggle(selectedUser?._id)}
        loading={isToggling}
        icon={selectedUser?.isBlocked ? <FaUserCheck className="text-green-500" /> : <FaUserLock className="text-red-500" />}
      />

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <div className="flex items-center gap-2">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {data?.currentPage} of {data?.totalPages}
          </Typography>
          <Typography variant="small" color="blue-gray" className="font-normal">
            ({data?.totalUsers} total users)
          </Typography>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            disabled={!data?.hasPrevPage || isLoading}
            onClick={handlePrevPage}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            disabled={!data?.hasNextPage || isLoading}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
