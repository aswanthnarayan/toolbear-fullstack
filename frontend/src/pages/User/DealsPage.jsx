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
import { useSelector } from 'react-redux';
import PopularContainer from '../../components/Users/PopularContainer';
import { Toaster } from 'sonner';
import CustomSpinner from "../../components/utils/CustomSpinner";

const DealsPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;
  const { data: bannersData, isLoading: isLoadingBanners } = useGetBannersQuery();

  if (isLoadingBanners) {
    return (
      <CustomSpinner/>
    );
  }

  // Create a copy of the array before sorting
  const sortedBanners = bannersData?.banners ? [...bannersData.banners].sort((a, b) => a.position - b.position) : [];

  return (
    <div className={`${currentTheme.primary} min-h-screen`}>
      <Toaster position="top-right" richColors />
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
                      className={`w-fit ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
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
            <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-[#FFD600]'} h-[214px] overflow-hidden`}>
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
                        className={`w-fit ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                      >
                        Shop Now
                      </Button>
                    </div>
                  </CardBody>
                </Link>
              ) : (
                <CardBody className="h-full flex items-center justify-center">
                  <Typography variant="h5" className={currentTheme.text}>
                    Featured Brand Coming Soon
                  </Typography>
                </CardBody>
              )}
            </Card>

            {/* Third Banner */}
            <Card className={`${isDarkMode ? 'bg-gray-800' : 'bg-[#7AB800]'} h-[214px] overflow-hidden`}>
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
                        className={`w-fit ${currentTheme.button} ${currentTheme.buttonHover} text-black`}
                      >
                        Shop Now
                      </Button>
                    </div>
                  </CardBody>
                </Link>
              ) : (
                <CardBody className="h-full flex items-center justify-center">
                  <Typography variant="h5" className={currentTheme.text}>
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
              <UserGroupIcon className={`h-12 w-12 ${currentTheme.accent}`} />
            </div>
            <Typography variant="h6" className={`font-bold ${currentTheme.text}`}>
              Trusted by Professionals
            </Typography>
            <Typography className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              5 Years of Industry Experience
            </Typography>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BuildingStorefrontIcon className={`h-12 w-12 ${currentTheme.accent}`} />
            </div>
            <Typography variant="h6" className={`font-bold ${currentTheme.text}`}>
              HUGE INVENTORY
            </Typography>
            <Typography className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Vast Selection
            </Typography>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <PhoneIcon className={`h-12 w-12 ${currentTheme.accent}`} />
            </div>
            <Typography variant="h6" className={`font-bold ${currentTheme.text}`}>
              24 X 7 Customer Support
            </Typography>
            <Typography className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Knowledgeable Sales Staffs
            </Typography>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <TrophyIcon className={`h-12 w-12 ${currentTheme.accent}`} />
            </div>
            <Typography variant="h6" className={`font-bold ${currentTheme.text}`}>
              Market Leader
            </Typography>
            <Typography className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Innovating with Every Tool
            </Typography>
          </div>
        </div>

        {/* Popular Items Section */}
        <PopularContainer />

        {/* Bottom Tagline */}
        <div className="text-center mt-8 mb-8">
          <Typography variant="h3" className={`font-bold ${currentTheme.text}`}>
            EQUIP YOURSELF WITH THE <span className={currentTheme.accent}>BEST</span>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
