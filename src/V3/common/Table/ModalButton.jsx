import React from "react";

const ModalButton = ({
  variant = "primary",
  onClick,
  children,
  className = "",
  type = "button",
  endIcon,
  disabled,
  onEndIconClick, // Separate handler for the end icon
}) => {
  const baseStyles =
    "flex-1 px-5 py-4 text-sm  min-h-10 cursor-pointer h-[49px] max-sm:w-full";

  const variantStyles = {
    primary: "text-white !bg-[#3D69D3]",
    secondary: "text-blue-600 !bg-[#FFFFFF] border !border-[#3D69D3]",
    error: "text-[#CD3D64] !bg-[#FFFFFF] border !border-[#CD3D64]",
    Grey: "text-[#666666] !bg-[#E0E1E4]",
    greenOutlined: " text-[#0A994A] !bg-[#FFFFFF] border !border-[#0A994A]",
    primaryOutlined: "text-[#3D69D3] !bg-[#FFFFFF] border !border-[#3D69D3]",
  };

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`flex items-center justify-center ${baseStyles} ${variantStyles[variant]} ${className} `}
    >
      {children}
      {endIcon && (
        <span
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the main button's onClick
            if (onEndIconClick) onEndIconClick(e);
          }}
          className="cursor-pointer"
        >
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default ModalButton;
