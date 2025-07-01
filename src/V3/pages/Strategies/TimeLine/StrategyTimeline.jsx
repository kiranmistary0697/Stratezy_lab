import { useEffect, useState } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  timelineItemClasses,
} from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Badge from "../../../common/Badge";
import { Box, Tooltip, Typography } from "@mui/material";

const timelineSteps = [
  { title: "Stock Bundles", keywords: ["filter"], dataKeys: ["filterRule"] },
  { title: "Trade Rule", keywords: ["trade"], dataKeys: ["tradeRule"] },
  {
    title: "Market Entry & Exit",
    keywords: ["gexit", "gentry"],
    dataKeys: ["globalEntryRule", "globalExitRule"],
  },
  {
    title: "Stock Entry & Exit",
    keywords: ["entry", "exit"],
    dataKeys: ["entryRule", "exitRule"],
  },
  { title: "Trade Sequence", keywords: ["order"], dataKeys: ["orderRule"] },
  {
    title: "Portfolio Sizing",
    keywords: ["psizing"],
    dataKeys: ["psizingRule"],
  },
];

const StrategyTimeline = ({ strategy }) => {
  const [completedSteps, setCompletedSteps] = useState({});

  useEffect(() => {
    setCompletedSteps({
      "Stock Bundles": !!strategy?.strategy?.filterRule?.length,
      "Trade Rule": !!strategy?.strategy?.tradeRule?.funcName,
      "Market Entry & Exit":
        !!strategy?.strategy?.globalEntryRule?.funcName ||
        !!strategy?.strategy?.globalExitRule?.funcName,
      "Stock Entry & Exit":
        (strategy?.strategy?.entryRule?.length > 0 &&
          strategy?.strategy?.entryRule?.some((r) => r.funcName)) ||
        (strategy?.strategy?.exitRule?.length > 0 &&
          strategy?.strategy?.exitRule?.some((r) => r.funcName)),
      "Trade Sequence": !!strategy?.strategy?.orderRule?.length,
      "Portfolio Sizing": !!strategy?.strategy?.psizingRule?.funcName,
    });
  }, [strategy]);

  return (
    <div className="p-5">
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {timelineSteps.map((step, index) => {
          const isComplete = completedSteps[step.title];
          const iconColor = isComplete ? "#0A994A" : "#E0E1E4";

          return (
            <TimelineItem className="flex" key={index}>
              <TimelineSeparator>
                <TimelineConnector
                  sx={{
                    bgcolor: isComplete ? "#0A994A" : "#E0E1E4",
                    visibility: index === 0 ? "hidden" : "visible",
                  }}
                />
                <CheckCircleIcon
                  className="!size-[12px]"
                  sx={{ color: iconColor }}
                />
                <TimelineConnector
                  sx={{
                    bgcolor: isComplete ? "#0A994A" : "#E0E1E4",
                    visibility:
                      index === timelineSteps.length - 1 ? "hidden" : "visible",
                  }}
                />
              </TimelineSeparator>

              <TimelineContent>
                <div className="grid grid-cols-2 gap-4 text-xs items-center">
                  <Badge
                    isStrategyTooltip
                    variant={isComplete ? "complete" : "disable"}
                  >
                    {step.title}
                  </Badge>

                  <div className="text-gray-500 font-normal text-sm leading-5">
                    {(() => {
                      const funcNames = [];
                      const funcArgs = [];
                      step.dataKeys?.forEach((key) => {
                        const ruleData =
                          strategy?.strategy?.[key] || strategy?.[key];

                        if (!ruleData) return;

                        if (Array.isArray(ruleData)) {
                          ruleData.forEach((r) => {
                            if (r?.funcName) {
                              funcNames.push(r.funcName);
                            }

                            if (r?.funcArgs) {
                              funcArgs.push(r.funcArgs);
                            }
                          });
                        } else if (
                          typeof ruleData === "object" &&
                          ruleData?.funcName
                        ) {
                          funcNames.push(ruleData.funcName);
                          funcArgs.push(ruleData.funcArgs);
                        }
                      });

                      if (funcNames.length === 0) return "No rule";
                      if (funcNames.length === 1)
                        return `${funcNames[0]}${
                          funcArgs[0].length ? ` [${funcArgs[0]}]` : ""
                        }`;
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Inter",
                              fontWeight: 400,
                              fontSize: "14px",
                              lineHeight: "20px",
                              letterSpacing: "0%",
                            }}
                          >
                            {`${funcNames[0]}${
                              funcArgs[0].length ? ` [${funcArgs[0]}]` : ""
                            }`}
                          </Typography>
                          <Tooltip
                            title={funcNames
                              .slice(1)
                              .map(
                                (name, index) =>
                                  `${name} [${funcArgs
                                    .slice(1)
                                    [index].join(", ")}]`
                              )
                              .join("\n")}
                            placement="bottom"
                            componentsProps={{
                              tooltip: {
                                sx: {
                                  fontFamily: "inherit",
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  padding: "20px",
                                  gap: 10,
                                  borderRadius: "2px",
                                  background: "#FFFFFF",
                                  color: "#666666",
                                  boxShadow: "0px 8px 16px 0px #7B7F8229",
                                  whiteSpace: "pre-line",
                                },
                              },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#1976d2",
                                fontFamily: "Inter",
                                fontWeight: 400,
                                fontSize: "14px",
                                lineHeight: "20px",
                                letterSpacing: "0%",
                              }}
                            >
                              +{funcNames.length - 1}
                            </Typography>
                          </Tooltip>
                        </Box>
                      );
                      // return `${funcNames[0]} ...`;
                    })()}
                  </div>
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
};

export default StrategyTimeline;
