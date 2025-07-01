import {
  Box,
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const stepKeywordMap = [
  { label: "Stock Bundles", keywords: ["filter"] },
  { label: "Trade Rule", keywords: ["trade"] },
  { label: "Trade Sequence", keywords: ["order"] },
  { label: "Stock Entry & Exit", keywords: ["exit", "entry"] },
  { label: "Portfolio Sizing", keywords: ["psizing"] },
  { label: "Market Entry & Exit", keywords: ["gexit", "gentry"] },
  { label: "Trade Execution", keywords: ["ulying"] },
];

const BacktestTimeLine = ({ backtestProcess }) => {
  const completed = backtestProcess?.completedStage || [];
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md")); // ≥960 px
  return (
    <Box
      className="justify-center items-center space-y-8"
      sx={{ width: "840px", textAlign: "center" }}
    >
      <div className="font-semibold   text-sm sm:text-xl    flex items-center lg:justify-center  sm:justify-start">
        {backtestProcess?.message}
      </div>

      <Stepper
        orientation={isMdUp ? "horizontal" : "vertical"}
        activeStep={stepKeywordMap.length}
        alternativeLabel={isMdUp}
      >
        {stepKeywordMap.map(({ label, keywords }, index) => {
          const isCompleted = keywords.some((k) => completed.includes(k));

          return (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    color: isCompleted ? "#0A994A" : "#BDBDBD",
                    "&.Mui-active": {
                      color: isCompleted ? "#0A994A" : "#BDBDBD",
                    },
                    "&.Mui-completed": {
                      color: isCompleted ? "#0A994A" : "#BDBDBD",
                    },
                  },
                }}
                sx={{
                  "& .MuiStepLabel-root .Mui-completed": {
                    bgcolor: isCompleted ? "#0A994A" : "#BDBDBD",
                  },
                  "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                    {
                      color: "#666666",
                    },
                  "& .MuiStepLabel-root .Mui-active": {
                    bgcolor: isCompleted ? "#0A994A" : "#BDBDBD",
                  },
                  "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                    {
                      color: "common.white",
                    },
                  "& .MuiStepLabel-root .Mui-active .MuiStepIcon-text": {
                    fill: isCompleted ? "#0A994A" : "#BDBDBD",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default BacktestTimeLine;
