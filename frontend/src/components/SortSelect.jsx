import React from 'react';
import { Select, Option } from '@material-tailwind/react';

const SortSelect = ({ onSortChange, currentSort }) => {
  return (
    <div className="w-48">
      <Select
        label="Sort by"
        value={currentSort}
        onChange={(value) => onSortChange(value)}
        className="bg-white"
      >
        <Option value="newest">Newest First</Option>
        <Option value="a-z">Name: A to Z</Option>
        <Option value="z-a">Name: Z to A</Option>
        <Option value="price-low-high">Price: Low to High</Option>
        <Option value="price-high-low">Price: High to Low</Option>
      </Select>
    </div>
  );
};

export default SortSelect;