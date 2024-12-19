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
        <Card className="md:col-span-8 bg-[#002B5C] text-white h-full">
          <CardBody className="p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center mb-6">
                <img src="/bosch-logo.png" alt="BOSCH" className="h-8" />
              </div>
              <Typography variant="h4" className="text-2xl font-bold mb-6">
                DEALS ON CHECKOUT
              </Typography>
              <div className="space-y-4 mb-8">
                <Typography className="text-lg">
                  ₹ 500 off <span className="text-sm">on Selected products above ₹ 5000</span>
                </Typography>
                <Typography className="text-lg">
                  ₹ 750 off <span className="text-sm">on Selected products above ₹ 8000</span>
                </Typography>
                <Typography className="text-lg">
                  ₹ 1000 off <span className="text-sm">on Selected products above ₹ 8000</span>
                </Typography>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <Button 
                size="lg"
                color="red"
                className="bg-red-600 px-8"
                onClick={() => navigate('/products')}
              >
                SHOP NOW
              </Button>
              <img src="/bosch-tools.png" alt="Bosch tools" className="h-32" />
            </div>
          </CardBody>
        </Card>

        <div className="md:col-span-4 space-y-6">
          {/* DEWALT Card */}
          <Card className="bg-[#FFD600]">
            <CardBody className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <img src="/dewalt-logo.png" alt="DEWALT" className="h-6 mb-4" />
                  <Typography variant="h5" color="black" className="mb-2">
                    SAVE UPTO ₹ 400
                  </Typography>
                  <Typography color="black" className="text-sm mb-4">
                    On Selected Dewalt Products
                  </Typography>
                  <Button 
                    size="sm"
                    className="bg-black"
                    onClick={() => navigate('/products')}
                  >
                    SHOP NOW
                  </Button>
                </div>
                <img src="/dewalt-tools.png" alt="Dewalt tools" className="h-28" />
              </div>
            </CardBody>
          </Card>

          {/* EGO Card */}
          <Card className="bg-[#7AB800]">
            <CardBody className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <img src="/ego-logo.png" alt="EGO" className="h-6 mb-4" />
                  <Typography variant="h5" color="black" className="mb-2">
                    GET UPTO 599 off
                  </Typography>
                  <Typography color="black" className="text-sm mb-4">
                    On Selected Chainsaws and blowers
                  </Typography>
                  <Button 
                    size="sm"
                    className="bg-black"
                    onClick={() => navigate('/products')}
                  >
                    SHOP NOW
                  </Button>
                </div>
                <img src="/ego-tools.png" alt="EGO tools" className="h-28" />
              </div>
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
