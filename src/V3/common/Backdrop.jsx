import React from "react";
import MuiBackdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types";

const Backdrop = ({ open }) => (
  <MuiBackdrop sx={{ color: "#fff", zIndex: 1111111 }} open={open}>
    <CircularProgress color="inherit" />
  </MuiBackdrop>
);

Backdrop.propTypes = {
  open: PropTypes.bool,
};

export default Backdrop;
