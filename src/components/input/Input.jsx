import React from "react";
import { Color } from "../../constants/AppResource";

const Input = ({
  name,
  value = 0,
  onChange = () => {},
  placeholder = "",
  type = "text",
  disabled = false,
  bgColor='#fff',
  ...props
}) => {
  return (
    <div className="relative w-full max-w-md ">
      {/* Input Field */}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-4 py-2 border border-switchGrayColor outline-none text-sm text-textColor  shadow-sm rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
        {...props}
        style={{backgroundColor:bgColor }}
      />
    </div>
  );
};

export default Input;
