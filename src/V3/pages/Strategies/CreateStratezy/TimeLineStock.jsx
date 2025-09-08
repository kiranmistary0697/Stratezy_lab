import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const timelineSteps = [
  {
    title: "Stock Bundle",
    description: "Rules to select stocks",
  },
  { title: "Trade Rule", description: "Rules to generate Buy/Sell Signals" },
  {
    title: "Market Entry & Exit",
    description: "Rules to Enter and Exit the Market",
  },
  {
    title: "Stock Entry & Exit",
    description: "Rules to Enter and Exit a Stock",
  },
  {
    title: "Trade Sequence",
    description: "Sequence of trade execution",
  },
  { title: "Portfolio Sizing", description: "Rules to size the portfolio" },
];

const TimeLineStock = ({ values, goToStep, step, isView = false }) => {
  const handleStepClick = (index) => {
    goToStep(index);
  };

  return (
    <Timeline
      sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {timelineSteps.map((stepItem, index) => {
        let iconColor = "#E0E1E4";

        switch (stepItem.title) {
          case "Stock Bundle":
            iconColor =
              Array.isArray(values?.stockBundle) &&
              values.stockBundle.length > 0 &&
              values.stockBundle[0]?.name
                ? "#0A994A"
                : "#E0E1E4";
            break;

          case "Trade Rule":
            iconColor = values.tradeRules?.buyRule?.ruleName
              ? "#0A994A"
              : "#EDA84E";
            break;

          case "Market Entry & Exit":
            iconColor =
              values.marketEntryExit?.entry?.name ||
              values.marketEntryExit?.exit?.name
                ? "#0A994A"
                : "#E0E1E4";
            break;

          case "Stock Entry & Exit":
            iconColor =
              values.stockEntryExit?.entry?.[0]?.name ||
              values.stockEntryExit?.exit?.[0]?.name
                ? "#0A994A"
                : "#E0E1E4";
            break;

          case "Trade Sequence":
            iconColor = values.tradeSequence?.[0]?.name ? "#0A994A" : "#E0E1E4";
            break;

          case "Portfolio Sizing":
            iconColor = values.portfolioSizing?.selectedPortfolio
              ? "#0A994A"
              : "#E0E1E4";
            break;

          default:
            iconColor = "#E0E1E4";
        }

        if (index === step) {
          iconColor = "#3D69D3";
        }

        return (
          <TimelineItem
            key={index}
            className={index === step ? "bg-[#F3F6FC]" : ""}
          >
            <TimelineSeparator>
              <TimelineConnector
                sx={{
                  bgcolor: iconColor,
                  visibility: index === 0 ? "hidden" : "visible",
                }}
              />
              <CheckCircleIcon fontSize="medium" sx={{ color: iconColor }} />
              <TimelineConnector
                sx={{
                  bgcolor: iconColor,
                  visibility:
                    index === timelineSteps.length - 1 ? "hidden" : "visible",
                }}
              />
            </TimelineSeparator>

            <TimelineContent
              onClick={() => handleStepClick(index)}
              sx={{
                cursor: "pointer",
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingBottom: "10px",
                paddingTop: "10px",
              }}
            >
              <div
                className={`flex justify-between  ${
                  index === step ? "text-[#3D69D3]" : "text-gray-500"
                }`}
              >
                <div className="text-base font-semibold"> {stepItem.title}</div>
                <span className="text-[#7B7F82] text-[14px]">
                  {[
                    "Market Entry & Exit",
                    "Stock Entry & Exit",
                    "Trade Sequence",
                  ].includes(stepItem.title)
                    ? "Optional"
                    : ""}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{stepItem.description}</p>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default TimeLineStock;
