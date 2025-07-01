import React, { useEffect, useMemo, useState } from "react";
import { Box, useTheme } from "@mui/material";
import CapitalChart from "../../../Backtests/Chart/CapitalChart";
import { useLazyGetQuery } from "../../../../../slices/api";
import { tagTypes } from "../../../../tagTypes";
import Plot from "react-plotly.js";

const Performance = ({ data = {} }) => {
  const theme = useTheme();

  const { reqId } = data;
  const [getChartData] = useLazyGetQuery([]);
  const [preparedData, setPreparedData] = useState(null);

  useEffect(() => {
    const fetchDeployData = async () => {
      try {
        const { data } = await getChartData({
          endpoint: `command/backtest/chart?symbol=&stage=trade&id=${reqId}&substage=capital`,
          tags: [tagTypes.GET_CHART],
        }).unwrap();
        prepareData(data);
      } catch (error) {
        console.error("Failed to fetch deploy data:", error);
      }
    };

    fetchDeployData();
  }, []);

  const prepareData = (data) => {
    let seriesData = [];

    Object.keys(data).forEach((seriesName) => {
      const chartRes = data[seriesName];
      if (chartRes?.error) {
        console.error(
          `No data found for ${seriesName}: ${chartRes.error.message}`
        );
        return;
      }

      const valueMap = chartRes?.valueMap;
      if (!valueMap) return;

      const dateValues = Object.keys(valueMap)
        .map((dateStr) => {
          const date = new Date(dateStr);
          if (isNaN(date)) return null;
          return { date, value: valueMap[dateStr] };
        })
        .filter(Boolean)
        .sort((a, b) => a.date - b.date);

      if (dateValues.length) {
        const df = dateValues.map((item) => ({
          Date: item.date,
          Value: item.value,
          Series: seriesName,
          ChartType: chartRes.chartType?.toLowerCase() || "line",
          YAxis: chartRes.yaxis?.toLowerCase() || "y1",
        }));
        seriesData = seriesData.concat(df);
      }
    });

    setPreparedData(seriesData.length ? seriesData : null);
  };
  const plotData = useMemo(() => {
    if (!preparedData) return [];

    const seriesMap = new Map();

    for (const point of preparedData) {
      if (!seriesMap.has(point.Series)) {
        const chartType = point.ChartType || "line";
        const mode = chartType === "area" ? "lines" : "lines+markers";
        const fill = chartType === "area" ? "tozeroy" : "none";

        seriesMap.set(point.Series, {
          x: [],
          y: [],
          type: "scatter",
          mode,
          fill,
          name: point.Series,
          yaxis: point.YAxis === "y2" ? "y2" : "y1",
          marker: { size: 3 },
          line: { width: 1 },
        });
      }

      const series = seriesMap.get(point.Series);
      series.x.push(point.Date);
      series.y.push(point.Value);
    }

    return Array.from(seriesMap.values());
  }, [preparedData]);

  const y1Values = (preparedData || [])
    .filter((d) => d.YAxis === "y1")
    .map((d) => d.Value);
  const y2Values = (preparedData || [])
    .filter((d) => d.YAxis === "y2")
    .map((d) => d.Value);
  const y1Range = y1Values.length
    ? [Math.min(...y1Values), Math.max(...y1Values)]
    : undefined;
  const y2Range = y2Values.length
    ? [Math.min(...y2Values), Math.max(...y2Values)]
    : undefined;

  return (
    <Box className="flex flex-col gap-3.5 space-y-6  w-full  max-md:gap-3 max-md:p-4 max-md:max-w-[991px] max-sm:gap-2.5 max-sm:p-2.5 max-sm:max-w-screen-sm">
      {preparedData && (
        <Plot
          data={plotData}
          layout={{
            xaxis: {
              title: "Date",
              showgrid: true,
              gridcolor: "#e0e0e0",
            },
           yaxis: {
                title: {
                  text: "Primary Y-Axis",
                  standoff: 30,
                },
                gridcolor: "#e0e0e0",
                range: y1Range,
              },
              yaxis2: {
                title: {
                  text: "Secondary Y-Axis",
                  standoff: 30,
                },
                overlaying: "y",
                side: "right",
                range: y2Range,
              },
            legend: { orientation: "h" },
            hovermode: "x unified",
            paper_bgcolor: theme.palette.background.paper,
            plot_bgcolor: theme.palette.background.paper,
            autosize: true,
            margin: { l: 80, r: 80, t: 20, b: 40 },
          }}
          config={{
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToAdd: ["toggleSpikelines", "resetScale2d"],
          }}
          useResizeHandler
          style={{ width: "100%", height: "60vh" }}
        />
      )}
    </Box>
  );
};

export default Performance;
