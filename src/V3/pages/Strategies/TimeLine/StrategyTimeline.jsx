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
            <TimelineItem
              key={index}
              sx={{
                display: "flex",
              }}
            >
              <TimelineSeparator
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "16px",
                }}
              >
                <TimelineConnector
                  sx={{
                    bgcolor: isComplete ? "#0A994A" : "#E0E1E4",
                    visibility: index === 0 ? "hidden" : "visible",
                    width: "2px",
                  }}
                />
                <CheckCircleIcon
                  sx={{
                    color: iconColor,
                    fontSize: "12px",
                    margin: "4px 0",
                  }}
                />
                <TimelineConnector
                  sx={{
                    bgcolor: isComplete ? "#0A994A" : "#E0E1E4",
                    visibility:
                      index === timelineSteps.length - 1 ? "hidden" : "visible",
                    width: "2px",
                  }}
                />
              </TimelineSeparator>

              <TimelineContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="grid grid-cols-2 text-xs items-center w-full"
                  style={{ gap: "2px" }}
                >
                  {/* Badge Column - Left aligned with constant width */}
                  <div className="flex justify-start">
                    <div
                      className="w-[120px] min-w-[120px] max-w-[120px] h-6 flex justify-center items-center text-[10px] font-medium rounded-full border text-center overflow-hidden"
                      style={{
                        width: "120px",
                        minWidth: "120px",
                        maxWidth: "120px",
                        backgroundColor: isComplete ? "#e8f5e8" : "#f3f4f6",
                        borderColor: isComplete ? "#0A994A" : "#d1d5db",
                        color: isComplete ? "#0A994A" : "#6b7280",
                      }}
                      title={step.title} // Show full text on hover
                    >
                      <span className="truncate px-2">{step.title}</span>
                    </div>
                  </div>

                  {/* Function Names Column - Left aligned with fixed width */}
                  <div className="w-[200px] min-w-[200px] max-w-[200px] text-gray-500 font-normal text-sm leading-5 flex justify-start items-center">
                    <div
                      className="w-full text-left truncate"
                      title={(() => {
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
                        return funcNames
                          .map(
                            (name, index) =>
                              `${name} [${funcArgs[index].join(", ")}]`
                          )
                          .join(", ");
                      })()}
                    >
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
                        return funcNames
                          .map(
                            (name, index) =>
                              `${name} [${funcArgs[index].join(", ")}]`
                          )
                          .join(", ");
                      })()}
                    </div>
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
