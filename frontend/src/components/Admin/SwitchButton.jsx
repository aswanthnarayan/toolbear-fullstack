import { Switch } from "@material-tailwind/react";
import { useState } from "react";

export function SwitchButton({ beforeToggleColor = 'bg-gray-200', afterToggleColor = 'bg-[#2ec946]', beforeText = 'Off', afterText = 'On' }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="flex items-center space-x-3">
      <Switch
        id="custom-switch-component"
        ripple={false}
        checked={isChecked}
        onChange={handleToggle}
        className={`h-full w-full ${isChecked ? afterToggleColor : beforeToggleColor}`}
        containerProps={{
          className: `w-11 h-6 ${beforeToggleColor}`,
        }}
        circleProps={{
          className: "before:hidden left-0.5 border-none",
        }}
      />
      <span className="text-sm">{isChecked ? afterText : beforeText}</span>
    </div>
  );
}
