import { Switch } from "@material-tailwind/react";

export function SwitchButton({ 
  checked = false, 
  onChange,
  activeColor = 'bg-red-500',
  inactiveColor = 'bg-green-500',
  activeText = 'Blocked',
  inactiveText = 'Active',
  disabled = false,
  id
}) {
  return (
    <div className="flex items-center space-x-3">
      <Switch
        id={id || "custom-switch-component"}
        ripple={false}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={`h-full w-full ${checked ? activeColor : inactiveColor}`}
        containerProps={{
          className: `w-11 h-6`,
        }}
        circleProps={{
          className: "before:hidden left-0.5 border-none",
        }}
      />
      <span className={`text-sm font-medium ${checked ? 'text-red-500' : 'text-green-500'}`}>
        {checked ? activeText : inactiveText}
      </span>
    </div>
  );
}
