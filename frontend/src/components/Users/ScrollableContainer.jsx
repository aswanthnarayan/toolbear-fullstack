import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ScrollableContainer = ({ children, scrollAmount = 300 }) => {
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScroll = (container) => {
    if (container) {
      setShowLeftButton(container.scrollLeft > 0);
      setShowRightButton(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const scroll = (direction) => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(() => checkScroll(container), 300);
    }
  };

  useEffect(() => {
    const container = document.querySelector('.scroll-container');
    if (container) {
      container.addEventListener('scroll', () => checkScroll(container));
      checkScroll(container);
      return () => container.removeEventListener('scroll', () => checkScroll(container));
    }
  }, []);

  return (
    <div className="relative group">
      <div 
        className="scroll-container overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="flex space-x-6 pb-4 px-2">
          {children}
        </div>
      </div>

      {showLeftButton && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 group-hover:-translate-x-4 backdrop-blur-sm"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
        </button>
      )}
      
      {showRightButton && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white/90 hover:bg-white rounded-full p-2.5 shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 group-hover:translate-x-4 backdrop-blur-sm"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6 text-gray-800" />
        </button>
      )}
    </div>
  );
};

export default ScrollableContainer;