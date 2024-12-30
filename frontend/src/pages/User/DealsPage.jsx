import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useNavigate, Link } from "react-router-dom";
import { 
  UserGroupIcon, 
  BuildingStorefrontIcon,
  PhoneIcon,
  TrophyIcon 
} from "@heroicons/react/24/solid";
import { useGetBannersQuery } from '../../../App/features/rtkApis/adminApi';

const DealsPage = () => {
  const navigate = useNavigate();
  const { data: bannersData, isLoading: isLoadingBanners } = useGetBannersQuery();

  if (isLoadingBanners) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[124px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Create a copy of the array before sorting
  const sortedBanners = bannersData?.banners ? [...bannersData.banners].sort((a, b) => a.position - b.position) : [];

  return (
    <div className="container mx-auto p-4 pt-[124px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Banner */}
        <Card className="md:col-span-8 bg-[#002B5C] h-[444px] overflow-hidden">
          {sortedBanners[0] ? (
            <Link to={`/brand/${sortedBanners[0].brandId?._id}`} className="h-full">
              <CardBody className="p-0 h-full relative">
                <img
                  src={sortedBanners[0].imageUrl}
                  alt={sortedBanners[0].brandId?.name || "Featured Brand"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 p-8 flex flex-col justify-end">
                  <Typography variant="h2" className="text-white mb-2">
                    {sortedBanners[0].brandId?.name || "Featured Brand"}
                  </Typography>
                  <Typography variant="lead" className="text-white/80 mb-4">
                    {sortedBanners[0].brandId?.description || "Explore our collection of quality tools"}
                  </Typography>
                  <Button 
                    size="lg" 
                    color="yellow"
                    className="w-fit hover:shadow-lg hover:shadow-yellow-500/40"
                  >
                    Shop Now
                  </Button>
                </div>
              </CardBody>
            </Link>
          ) : (
            <CardBody className="h-full flex items-center justify-center">
              <Typography variant="h3" className="text-white">
                Featured Brand Coming Soon
              </Typography>
            </CardBody>
          )}
        </Card>

        <div className="md:col-span-4 grid grid-rows-2 gap-6 h-[444px]">
          {/* Second Banner */}
          <Card className="bg-[#FFD600] h-[214px] overflow-hidden">
            {sortedBanners[1] ? (
              <Link to={`/brand/${sortedBanners[1].brandId?._id}`} className="h-full">
                <CardBody className="p-0 h-full relative">
                  <img
                    src={sortedBanners[1].imageUrl}
                    alt={sortedBanners[1].brandId?.name || "Featured Brand"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 p-6 flex flex-col justify-end">
                    <Typography variant="h4" className="text-white mb-2">
                      {sortedBanners[1].brandId?.name || "Featured Brand"}
                    </Typography>
                    <Button 
                      size="sm" 
                      color="white"
                      className="w-fit hover:shadow-lg"
                    >
                      Shop Now
                    </Button>
                  </div>
                </CardBody>
              </Link>
            ) : (
              <CardBody className="h-full flex items-center justify-center">
                <Typography variant="h5">
                  Featured Brand Coming Soon
                </Typography>
              </CardBody>
            )}
          </Card>

          {/* Third Banner */}
          <Card className="bg-[#7AB800] h-[214px] overflow-hidden">
            {sortedBanners[2] ? (
              <Link to={`/brand/${sortedBanners[2].brandId?._id}`} className="h-full">
                <CardBody className="p-0 h-full relative">
                  <img
                    src={sortedBanners[2].imageUrl}
                    alt={sortedBanners[2].brandId?.name || "Featured Brand"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 p-6 flex flex-col justify-end">
                    <Typography variant="h4" className="text-white mb-2">
                      {sortedBanners[2].brandId?.name || "Featured Brand"}
                    </Typography>
                    <Button 
                      size="sm" 
                      color="white"
                      className="w-fit hover:shadow-lg"
                    >
                      Shop Now
                    </Button>
                  </div>
                </CardBody>
              </Link>
            ) : (
              <CardBody className="h-full flex items-center justify-center">
                <Typography variant="h5">
                  Featured Brand Coming Soon
                </Typography>
              </CardBody>
            )}
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
