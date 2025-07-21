import React, { useState, useEffect } from 'react';
import { Carousel, IconButton, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useGetBrandByIdQuery } from '../../../App/features/rtkApis/adminApi';
import { useGetAllCategoriesOfBrandQuery } from '../../../App/features/rtkApis/userApi';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RelatedProducts from './RelatedProducts';
import ScrollableContainer from './ScrollableContainer';
import CustomSpinner from '../utils/CustomSpinner';

const BrandStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeAccordion, setActiveAccordion] = useState(1);
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const { data: brand, isLoading: brandLoading, error: brandError } = useGetBrandByIdQuery(id, {
    skip: !id
  });

  const { data: categories, isLoading: categoriesLoading } = useGetAllCategoriesOfBrandQuery(id, {
    skip: !id
  });

  // console.log(categories);
  

  useEffect(() => {
    if (!id) {
      navigate('/brands');
    }
  }, [id, navigate]);

  const handleAccordionClick = (value) => {
    setActiveAccordion(activeAccordion === value ? 0 : value);
  };

  if (brandLoading || categoriesLoading) {
    return (
     <CustomSpinner/>
    );
  }

  if (brandError || !brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-yellow-500">Error loading brand information. Please try again later.</p>
      </div>
    );
  }

  // Convert about object to array for mapping
  const aboutSections = Object.entries(brand.about).map(([key, section]) => ({
    title: section.title,
    content: section.desc
  }));

  return (
    <div 
      className={`min-h-screen pt-[112px] ${currentTheme.bg}`} 
      style={{ backgroundColor: brand.base_color }}
    >
      {/* Brand Logo and Name Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-12">
          <img
            src={brand.logo.imageUrl}
            alt={brand.name}
            className="w-32 h-32 object-contain rounded-lg"
          />
          <div>
            <p className={`${currentTheme.textGray} text-lg`}>{brand.desc}</p>
          </div>
        </div>

        {/* Banner Carousel */}
        {brand.bannerImages?.length > 0 && (
          <div className="mb-12">
            <Carousel
              className="rounded-xl"
              autoplay={true}
              loop={true}
              prevArrow={({ handlePrev }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handlePrev}
                  className="!absolute top-2/4 left-4 -translate-y-2/4"
                >
                  <ChevronLeftIcon strokeWidth={2} className="w-6 h-6" />
                </IconButton>
              )}
              nextArrow={({ handleNext }) => (
                <IconButton
                  variant="text"
                  color="white"
                  size="lg"
                  onClick={handleNext}
                  className="!absolute top-2/4 right-4 -translate-y-2/4"
                >
                  <ChevronRightIcon strokeWidth={2} className="w-6 h-6" />
                </IconButton>
              )}
            >
              {brand.bannerImages.map((banner, index) => (
                <img
                  key={index}
                  src={banner.imageUrl}
                  alt={`${brand.name} Banner ${index + 1}`}
                  className="h-[500px] w-full object-cover"
                />
              ))}
            </Carousel>
          </div>
        )}

        {/* Special Offer Banner */}
        {brand.offerPercentage > 0 && (
          <div className={`${currentTheme.secondary} rounded-lg p-8 text-center mb-12`}>
            <h2 className={`text-3xl font-bold ${currentTheme.text} mb-4`}>Special Offer!</h2>
            <p className={`text-xl ${currentTheme.textGray}`}>
              Get up to {brand.offerPercentage}% off on all {brand.name} products
            </p>
          </div>
        )}

        {/* Categories Slider Section */}
        <div className="relative px-4 py-8">
          <h2 className={`text-2xl font-bold mb-6 ${currentTheme.text}`}>Shop by Category</h2>
          
          <ScrollableContainer>
            {categories?.map((category) => (
              <Link 
                key={category._id} 
                to={`/category/${category._id}?brand=${id}`}
                className="flex-none group"
              >
                <div className={`w-52 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 ${currentTheme.cardBg}`}>
                  <div className="h-52 overflow-hidden relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300 z-10"></div>
                    <img
                      src={category.image || 'https://via.placeholder.com/200'} 
                      alt={category.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className={`text-lg font-semibold truncate ${currentTheme.text} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm mt-1 ${currentTheme.textSecondary} opacity-75 group-hover:opacity-100 transition-opacity duration-300`}>
                      {category.description || 'Explore products'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </ScrollableContainer>
        </div>

        {/* About Section with Accordion */}
        {aboutSections.length > 0 && (
          <div className={`${currentTheme.secondary} rounded-lg p-6 mb-12`}>
            <h2 className={`text-2xl font-bold text-center ${currentTheme.text} mb-6`}>Know more about {brand.name}</h2>
            {aboutSections.map((section, index) => (
              <Accordion
                key={index}
                open={activeAccordion === index + 1}
                className="mb-2 rounded-lg border border-blue-gray-100 px-4"
              >
                <AccordionHeader
                  onClick={() => handleAccordionClick(index + 1)}
                  className={`border-b-0 transition-colors ${currentTheme.text}`}
                >
                  {section.title}
                </AccordionHeader>
                <AccordionBody className={`pt-0 text-base font-normal ${currentTheme.textGray}`}>
                  {section.content}
                </AccordionBody>
              </Accordion>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandStore;
