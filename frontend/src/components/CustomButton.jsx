import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "@material-tailwind/react";
import { useSelector } from 'react-redux';

const CustomButton = ({
  text = "Click Me",
  icon = null,
  variant = "filled",
  iconSize = 20,
  className = "",
  onClick,
  disabled = false,
  color = "blue",
  height = "h-10",
  width = "w-auto",
}) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const theme = useSelector((state) => state.theme.theme);
  const currentTheme = isDarkMode ? theme.dark : theme.light;

  const getButtonClass = () => {
    let baseClass = `flex items-center justify-center gap-2 ${height} ${width}`;
    
    if (variant === "filled") {
      baseClass += ` ${currentTheme.primary} ${currentTheme.text}`;
    } else if (variant === "outlined") {
      baseClass += ` border-2 ${currentTheme.text} hover:${currentTheme.hover}`;
    } else if (variant === "text") {
      baseClass += ` ${currentTheme.text} hover:${currentTheme.hover}`;
    }
    
    return `${baseClass} ${className}`;
  };
  
  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      color={color}
      className={getButtonClass()}
    >
      {icon && (
        <span
          className="flex-shrink-0"
          style={{ width: iconSize, height: iconSize }}
        >
          <img src={icon} alt="icon" style={{ width: "100%", height: "100%" }} />
        </span>
      )}
      <p className='text-md md:text-lg'>{text}</p>
    </Button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  variant: PropTypes.oneOf(["filled", "gradient", "outlined", "text"]),
  iconSize: PropTypes.number,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
};

export default CustomButton;
