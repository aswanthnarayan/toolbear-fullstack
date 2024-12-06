import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const CustomSelect = forwardRef(({
  label = "Label",
  options = [],
  value = "",
  onChange,
  placeholder = "Select an option",
  className = "",
  name = "",
  id = "",
  error = "",
  ...rest
}, ref) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const getSelectClasses = () => {
    const baseClasses = 'rounded border border-gray-300 px-3 py-2 w-full focus:outline-none focus:ring-2 appearance-none';
    const themeClasses = `${currentTheme.search.bg} ${currentTheme.search.text} border-${isDarkMode ? 'gray-600' : 'gray-300'}`;
    const focusClasses = error 
      ? 'border-red-500 focus:ring-red-500' 
      : `focus:${currentTheme.search.ring} focus:${currentTheme.search.focusBg}`;
    
    return `${baseClasses} ${themeClasses} ${focusClasses} ${className}`;
  };

  return (
    <div className="mt-2 relative">
      <label 
        htmlFor={id} 
        className={`block text-sm font-semibold mb-1 ${currentTheme.text}`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          ref={ref}
          value={value}
          onChange={onChange}
          className={getSelectClasses()}
          {...rest}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom arrow icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

CustomSelect.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  error: PropTypes.string,
};

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;