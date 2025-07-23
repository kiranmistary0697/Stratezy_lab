import { Box } from "@mui/material";
import HeaderButton from "../../common/Table/HeaderButton";

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
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/210b8daf015b06103be81ff1712af0dbe8cd7159f8f97a1788ce3745ee166757?placeholderIfAbsent=true&apiKey=1f17ac0e4ad64f5ca0e3026152f5a7de"
            alt="Info"
            className="object-contain shrink-0 aspect-square w-[17px]"
          />
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
