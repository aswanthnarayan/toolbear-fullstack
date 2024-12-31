import React from 'react';
import { Select, Option } from '@material-tailwind/react';
import { useSelector } from 'react-redux';

const SortSelect = ({ onSortChange, currentSort }) => {
  const { isDarkMode, theme } = useSelector((state) => state.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  return (
    <div className="w-48">
      <Select
        label="Sort by"
        value={currentSort}
        onChange={(value) => onSortChange(value)}
        className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${currentTheme.text}`}
        labelProps={{
          className: `${currentTheme.text}`,
        }}
        menuProps={{
          className: `${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${currentTheme.text}`,
        }}
      >
        <Option value="newest" className={`${currentTheme.text} ${currentTheme.hover}`}>
          Newest First
        </Option>
        <Option value="a-z" className={`${currentTheme.text} ${currentTheme.hover}`}>
          Name: A to Z
        </Option>
        <Option value="z-a" className={`${currentTheme.text} ${currentTheme.hover}`}>
          Name: Z to A
        </Option>
        <Option value="price-low-high" className={`${currentTheme.text} ${currentTheme.hover}`}>
          Price: Low to High
        </Option>
        <Option value="price-high-low" className={`${currentTheme.text} ${currentTheme.hover}`}>
          Price: High to Low
        </Option>
      </Select>
    </div>
  );
};

export default SortSelect;