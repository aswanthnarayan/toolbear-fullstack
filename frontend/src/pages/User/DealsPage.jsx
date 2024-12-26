import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { 
  UserGroupIcon, 
  BuildingStorefrontIcon,
  PhoneIcon,
  TrophyIcon 
} from "@heroicons/react/24/solid";

const DealsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 pt-[124px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <Card className="md:col-span-8 bg-[#002B5C] text-white min-h-[444px] h-full">
          <CardBody className="p-8 flex flex-col justify-between h-full">
            
          </CardBody>
        </Card>

        <div className="md:col-span-4 space-y-6 min-h-[444px]">
          {/* DEWALT Card */}
          <Card className="bg-[#FFD600] min-h-[222px]">
            <CardBody className="p-8">
             
            </CardBody>
          </Card>

          {/* EGO Card */}
          <Card className="bg-[#7AB800] min-h-[222px]">
            <CardBody className="p-8">
             
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12 mb-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <UserGroupIcon className="h-12 w-12 text-blue-500" />
          </div>
          <Typography variant="h6" className="font-bold">
            Trusted by Professionals
          </Typography>
          <Typography className="text-sm text-gray-600">
            5 Years of Industry Experience
          </Typography>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BuildingStorefrontIcon className="h-12 w-12 text-blue-500" />
          </div>
          <Typography variant="h6" className="font-bold">
            HUGE INVENTORY
          </Typography>
          <Typography className="text-sm text-gray-600">
            Vast Selection
          </Typography>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <PhoneIcon className="h-12 w-12 text-blue-500" />
          </div>
          <Typography variant="h6" className="font-bold">
            24 X 7 Customer Support
          </Typography>
          <Typography className="text-sm text-gray-600">
            Knowledgeable Sales Staffs
          </Typography>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-4">
            <TrophyIcon className="h-12 w-12 text-blue-500" />
          </div>
          <Typography variant="h6" className="font-bold">
            Market Leader
          </Typography>
          <Typography className="text-sm text-gray-600">
            Innovating with Every Tool
          </Typography>
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="text-center mt-8 mb-8">
        <Typography variant="h3" className="font-bold">
          EQUIP YOURSELF WITH THE <span className="text-red-500">BEST</span>
        </Typography>
      </div>
    </div>
  );
};

export default DealsPage;
