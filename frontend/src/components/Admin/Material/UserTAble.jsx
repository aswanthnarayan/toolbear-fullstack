import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { FaMagnifyingGlass, FaUserPlus } from "react-icons/fa6";
import { SwitchButton } from "../SwitchButton";
import mockUsers from '../Users.json';

const TABLE_HEAD = ["Name & Email", "Phone", "DOJ", "Status", "Block/Unblock", "View"];

export function UserTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const TABLE_ROWS = mockUsers.users;
  const ITEMS_PER_PAGE = 10;
  
  // Filter users based on search query
  const filteredUsers = TABLE_ROWS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
          <div className="w-full md:w-72">
            <Input
              label="Search by Name or Email"
              icon={<FaMagnifyingGlass className="h-5 w-5" />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
          <Button
            className="flex items-center gap-3"
            size="sm"
          >
            <FaUserPlus className="h-4 w-4" /> Filters
          </Button>
        </div>
      </CardHeader>

      <CardBody className="overflow-y-auto px-0 pt-0 h-[calc(100vh-290px)] mt-4">
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
            {filteredUsers
              .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
              .map((user, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {user.name}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-normal opacity-70">
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
                      {user.doj}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color={user.status === 'Active' ? 'green' : 'red'}
                      className="font-medium"
                    >
                      {user.status}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <SwitchButton />
                  </td>
                  <td className="p-4">
                    <Button size="sm" variant="outlined">View</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </CardBody>

      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page {currentPage} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
