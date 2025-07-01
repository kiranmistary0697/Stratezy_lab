import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import Plot from "react-plotly.js";
import { useLazyGetQuery } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";

const chartOptions = [
  { value: "capital", label: "Capital" },
  { value: "parameters", label: "Parameter" },
  { value: "drawdown", label: "Drawdown" },
  { value: "profits", label: "Profit" },
  { value: "avg1r", label: "avg1r" },
  { value: "opentrades", label: "opentrades" },
  { value: "totaltrades", label: "totaltrades" },
  { value: "duration", label: "duration" },
  { value: "symbol", label: "symbol" },
];

const Visualisation = ({ id }) => {
  const theme = useTheme();
  const [getChartData] = useLazyGetQuery([]);
  const [selectedOption, setSelectedOption] = useState(chartOptions[0]);
  const [chartData, setChartData] = useState([]);
  const [symbolName, setSymbolName] = useState(""); // default symbol
  const [preparedData, setPreparedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
  };

  const handleBacktest = async () => {
    if (selectedOption?.value === "symbol" && !symbolName.trim()) return;

    setLoading(true);
    try {
      const { data } = await getChartData({
        endpoint: `command/backtest/chart?symbol=${symbolName}&stage=trade&id=${id}&substage=${selectedOption?.value}`,
        tags: [tagTypes.GET_CHART],
      }).unwrap();
      prepareData(data);
    } catch (error) {
      console.error("Failed to fetch chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOption?.value !== "symbol") {
      handleBacktest();
    }
  }, [selectedOption?.value, id]);

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
    <>
      <Box className="w-full flex flex-col md:flex-row md:items-start gap-6">
        {/* Left Controls */}
        <Box className="flex flex-col md:flex-row md:space-x-8 gap-4 w-full">
          {/* Chart Type Selector */}
          <Box className="space-y-2 w-full md:w-auto">
            <Box className="flex gap-2.5 items-center">
              <label className="text-xs font-semibold text-neutral-950">
                Plot Graph
              </label>
              <InfoOutlinedIcon
                sx={{ color: "#666666", width: "17px", height: "17px" }}
              />
            </Box>
            <Select
              aria-label="Select chart type"
              value={selectedOption.value}
              onChange={(e) =>
                handleSelectChange(
                  chartOptions.find((option) => option.value === e.target.value)
                )
              }
              size="small"
              className="custom-select max-md:w-full"
            >
              {chartOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* NSE Symbol Input */}
          {selectedOption.value === "symbol" && (
            <Box className="space-y-2 w-full md:w-auto">
              <Box className="flex gap-2.5 items-center">
                <label className="text-xs font-semibold text-neutral-950">
                  NSE Symbol name
                </label>
              </Box>
              <TextField
                value={symbolName}
                onChange={(e) => setSymbolName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && symbolName.trim() !== "") {
                    handleBacktest();
                  }
                }}
                size="small"
                placeholder="Enter NSE symbol"
                aria-label="Symbol input"
                className="custom-select max-md:w-full"
              />
            </Box>
          )}
        </Box>

        {/* Description Section */}
        <Box className="flex flex-col space-y-2 w-full">
          <Box className="flex gap-2.5">
            <label className="text-xs font-semibold text-neutral-950">
              {`${selectedOption.label} Graph`}
            </label>
          </Box>
          <Typography className="text-xs font-semibold text-[#6B7280]">
            Capital Graph plots profit, average profit etc. against time to give
            a better point of view.
          </Typography>
        </Box>
      </Box>

      {/* Graph Area */}
      <Box // parent decides the height at each breakpoint
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: 280, sm: 360, md: 480, lg: 560 }, // 👈 tune as you like
        }}
      >
        {loading ? (
          <Box className="flex justify-center items-center ">
            <CircularProgress size={32} />
          </Box>
        ) : preparedData ? (
          <Plot
            data={plotData}
            layout={{
              xaxis: {
                title: {
                  text: "Date",
                  standoff: 10, // gives space between title and axis
                },
                showgrid: true,
                gridcolor: "#e0e0e0",
                automargin: true, // allow dynamic margin
              },
              yaxis: {
                title: { text: "Primary Y-Axis", standoff: 30 },
                gridcolor: "#e0e0e0",
                range: y1Range,
                automargin: true,
              },
              yaxis2: {
                title: { text: "Secondary Y-Axis", standoff: 30 },
                overlaying: "y",
                side: "right",
                range: y2Range,
                automargin: true,
              },
              legend: {
                orientation: "h",
                y: -0.3, // position legend below x-axis
                x: 0.5,
                xanchor: "center",
              },
              hovermode: "x unified",
              paper_bgcolor: theme.palette.background.paper,
              plot_bgcolor: theme.palette.background.paper,
              autosize: true,
              margin: { l: 80, r: 80, t: 20, b: 80 }, // 👈 increased bottom margin
            }}
            config={{
              responsive: true,
              displayModeBar: false,
              displaylogo: false,
              modeBarButtonsToAdd: ["toggleSpikelines", "resetScale2d"],
            }}
            useResizeHandler
            style={{ width: "100%", height: "60vh" }}
          />
        ) : (
          <div className="text-sm text-gray-600">
            No data available for chart
          </div>
        )}
      </Box>
    </>
  );
};

export default Visualisation;
