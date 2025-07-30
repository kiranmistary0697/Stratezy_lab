import { Box, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import HeaderButton from "../../common/Table/HeaderButton";
import { BACKTEST_HEADER_TOOLTIP } from "../../../constants/CommonText";

const BacktestHeader = ({ fetchAllData }) => {
  return (
    <Box
      className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-screen max-md:max-w-full"
      sx={{ alignItems: "center" }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box className="flex gap-2.5 items-center text-center md:text-left">
          <div className="font-semibold text-xl">Backtests</div>
          <Tooltip
            title={BACKTEST_HEADER_TOOLTIP}
            componentsProps={{
              tooltip: {
                sx: {
                  maxWidth: 450,
                  padding: "16px",
                  background: "#FFFFFF",
                  color: "#666666",
                  boxShadow: "0px 8px 16px 0px #7B7F8229",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                },
              },
            }}
            placement="right-end"
          >
            <InfoOutlinedIcon
              sx={{
                color: "#666666",
                width: "17px",
                height: "17px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </Box>

        <Box>
          <HeaderButton variant="contained" onClick={fetchAllData}>
            Refresh
          </HeaderButton>
        </Box>
      </Box>
    </Box>
  );
};

export default BacktestHeader;
