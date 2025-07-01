import { Button, Icon, IconButton, Tooltip } from "@mui/material";
import {
  Visibility,
  Edit,
  Delete,
  Share,
  CheckCircle,
} from "@mui/icons-material"; // Import required icons

const getIcon = (action) => {
  switch (action) {
    case "View":
      return "View";
    case "Backtest":
      return "Run Backtest";
    case "Deploy":
      return "Deploy";
    case "Delete":
      return <Delete />;
    case "Share":
      return <Share />;
    case "Accept":
      return <CheckCircle />;
    default:
      return null;
  }
};

const ActionButton = ({
  onClick,
  disabled,
  tabIndex,
  isWidthFixed,
  isLoader,
  label,
  iconSize,
  textColor,
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    tabIndex={tabIndex}
    variant="text"
    sx={{
      outline: "none",
      boxShadow: "none",
      "&:hover": {
        outline: "none",
        boxShadow: "none",
      },
      "&:active": {
        outline: "none",
        boxShadow: "none",
      },
      "&:focus": {
        outline: "none",
        boxShadow: "none",
      },
      color: textColor,
      display: "flex",
      gap: 1,
      alignItems: "center",
      textDecoration: "none",
      padding: "0px",
      minWidth: isWidthFixed ? "120px" : "auto",
      fontFamily: "inherit", // Inherits parent font
      fontSize: "14px",
      fontWeight: 400, // Removes MUI's bold styling
      lineHeight: "16.8px",
      letterSpacing: "0px",
      textTransform: "none", // Prevents MUI from capitalizing text
    }}
  >
    {isLoader ? (
      <CircularProgress size={20} />
    ) : label ? (
      <>
        {/* <Icon className={getIcon()} fontSize={iconSize} /> */}
        {label}
      </>
    ) : (
      <Icon className={getIcon()} fontSize={iconSize} />
    )}
  </Button>
);

export default ActionButton;
