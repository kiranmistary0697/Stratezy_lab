import React from "react";

const Toggle = ({
  id = "toggleSwitch",
  checked = false,
  onChange,
  switchColor = "#E5E7EB", // Default Blue
  dotColor = "", // Default Black
  checkedDotColor = "#3B82F6", 
}) => {
  return (
    <label
  htmlFor={id}
  className="flex items-center cursor-pointer select-none"
>
  <div className="relative">
    {/* Hidden Checkbox */}
    <input
      id={id}
      type="checkbox"
      className="peer sr-only"
      checked={checked}
      onChange={(e) => onChange && onChange(e.target.checked)}
    />

    {/* Switch Background */}
    <div
      className="h-4 rounded-full shadow-inner w-10"
      style={{ backgroundColor: checked ? '#3B82F6' : switchColor }}
    ></div>

    {/* Dot */}
    <div
      className="absolute left-0 transition shadow-md rounded-full -top-0.5 h-5 w-5 shadow-switch-1 peer-checked:translate-x-full"
      style={{
        backgroundColor: checked ? "#3B82F6" : switchColor,
        border: "2px solid white", 
      }}
    ></div>
  </div>
</label>

  );
};

export default Toggle;
