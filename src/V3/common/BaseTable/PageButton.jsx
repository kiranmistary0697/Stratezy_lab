import React from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";

const PageButton = ({
  children,
  onClick = () => {},
  isActive,
  isArrowButton = false,
}) => (
  <Button
    className="p-1 m-0"
    variant={`${isActive || isArrowButton ? "contained" : "outlined"}`}
    size="small"
    onClick={onClick}
    disabled={isArrowButton && isActive}
  >
    {children}
  </Button>
);

PageButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
  isArrowButton: PropTypes.bool,
};

export default PageButton;
