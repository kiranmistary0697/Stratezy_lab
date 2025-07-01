import React from "react";
import Button from "@mui/material/Button";

const HeaderButton = ({
  onClick,
  children,
  className = "",
  variant,
  disabled,
}) => {
  const variantStyles = {
    primary: { color: "#3D69D3", backgroundColor: "#FFFFFF" },
    secondary: {
      color: "#3D69D3",
      backgroundColor: "#FFFFFF",
      border: "1px solid #3D69D3",
    },
    error: {
      color: "#CD3D64",
      backgroundColor: "#FFFFFF",
      border: "1px solid #CD3D64",
    },
    Grey: { color: "#666666", backgroundColor: "#E0E1E4" },
    contained: { color: "#FFFFFF", backgroundColor: "#3D69D3" },
    greenOutlined: {
      color: "#0A994A",
      backgroundColor: "#FFFFFF",
      border: "1px solid #0A994A",
    },
    greenContained: { color: "#FFFFFF", backgroundColor: "#0A994A" },
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      disableRipple
      variant={variant === "contained" ? "contained" : "outlined"} // Use MUI variant
      sx={variantStyles[variant]} // Apply styles
      className={`${className || ""} button`}
    >
      {children}
    </Button>
  );
};

export default HeaderButton;
