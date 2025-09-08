import { Box } from "@mui/material";

const PlansHeader = () => {
  return (
    <Box className="flex flex-col gap-5 items-center px-5  max-w-[584px]">
      <Box className="subheader !text-[32px] !font-[600] ">Plans</Box>
      <p className="text-sm text-center text-stone-500">
        Simplified Investing Strategy Discovery, Creation, Backtesting, and
        Deployment Platform
      </p>
    </Box>
  );
};

export default PlansHeader;
