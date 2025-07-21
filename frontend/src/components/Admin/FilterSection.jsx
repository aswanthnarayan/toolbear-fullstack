import React from 'react';
import {
  Select,
  Option,
  Input,
  Button,
} from "@material-tailwind/react";

export const FilterSection = ({ 
  filterType, 
  startDate, 
  endDate, 
  onFilterChange, 
  onStartDateChange, 
  onEndDateChange, 
  onApplyFilter 
}) => {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
      <Select 
        label="Filter Type" 
        value={filterType}
        onChange={onFilterChange}
      >
        <Option value="daily">Daily</Option>
        <Option value="weekly">Weekly</Option>
        <Option value="monthly">Monthly</Option>
        <Option value="yearly">Yearly</Option>
        <Option value="custom">Custom Date</Option>
      </Select>

      {filterType === 'custom' && (
        <>
          <Input 
            type="date" 
            label="Start Date" 
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
          <Input 
            type="date" 
            label="End Date" 
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={onApplyFilter}
              className="bg-blue-500"
            >
              Apply Filter
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterSection;
