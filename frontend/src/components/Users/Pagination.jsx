import React from 'react';
import { IconButton, Button } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useSelector } from 'react-redux';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-4 justify-center mt-8">
      <IconButton
        size="sm"
        variant={isDarkMode ? "text" : "outlined"}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`rounded-full ${currentTheme.text} ${!isDarkMode && 'border-gray-300'} ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
        }`}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={`px-2 ${currentTheme.text}`}>...</span>
            ) : (
              <Button
                size="sm"
                variant={currentPage === page ? "filled" : "text"}
                onClick={() => handlePageChange(page)}
                className={`rounded-full w-10 h-10 p-0 min-w-0 ${
                  currentPage === page 
                    ? `${currentTheme.button} ${currentTheme.buttonHover}`
                    : `${currentTheme.text} ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`
                }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      <IconButton
        size="sm"
        variant={isDarkMode ? "text" : "outlined"}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`rounded-full ${currentTheme.text} ${!isDarkMode && 'border-gray-300'} ${
          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
        }`}
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>
  );
};

export default Pagination;