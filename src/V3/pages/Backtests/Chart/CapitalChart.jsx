import React from "react";
import Chart from "react-apexcharts";
import Typography from "@mui/material/Typography";
import alphabetStock from "../../../../../chartdata.json";
import moment from "moment";

const stockData = [
  { date: "2023-07-24", open: 121.66, high: 123.0, low: 120.98, close: 121.53 },
  {
    date: "2023-07-25",
    open: 121.36,
    high: 123.15,
    low: 121.02,
    close: 122.21,
  },
  {
    date: "2023-07-26",
    open: 130.07,
    high: 130.98,
    low: 128.32,
    close: 129.27,
  },
  { date: "2023-07-27", open: 131.67, high: 133.24, low: 128.79, close: 129.4 },
  {
    date: "2023-07-28",
    open: 130.78,
    high: 133.74,
    low: 130.57,
    close: 132.58,
  },
  {
    date: "2023-07-31",
    open: 132.73,
    high: 133.53,
    low: 131.78,
    close: 132.72,
  },
  {
    date: "2023-08-01",
    open: 130.78,
    high: 132.63,
    low: 130.68,
    close: 131.55,
  },
  {
    date: "2023-08-02",
    open: 129.45,
    high: 130.09,
    low: 127.56,
    close: 128.38,
  },
  {
    date: "2023-08-03",
    open: 127.97,
    high: 129.39,
    low: 127.42,
    close: 128.45,
  },
  {
    date: "2023-08-04",
    open: 129.28,
    high: 131.51,
    low: 127.91,
    close: 128.11,
  },
  {
    date: "2023-08-07",
    open: 129.16,
    high: 131.61,
    low: 129.02,
    close: 131.53,
  },
  { date: "2023-08-08", open: 130.62, high: 131.51, low: 129.54, close: 131.4 },
];

const CapitalChart = ({ selectedOption , chartData }) => {
  
  
  const sample = stockData.map((day) => moment(day.date).format("MM YYYY"));
  const sqnData = [5, 15, 25, 35, 50, 65, 80];
  const sharpeRatioData = [3, 10, 22, 30, 45, 60, 75];
  const avgRData = [1, 5, 20, 45, 100, 200, 500];
  const expectancyData = [2, 8, 18, 28, 40, 55, 70];
  const stdDevProfitData = [4, 12, 26, 38, 55, 70, 85];
  const stdDevExpectancyData = [3, 9, 20, 33, 47, 62, 77];
  const seriesMap = {
   capital: [
  {
    name: "Total Capital",
    data: Object.values(chartData?.accountVal?.valueMap || {}),
    color: "#21AB5B",
  },
  {
    name: "Net Profit",
    data: Object.values(chartData?.NetProfit?.valueMap || {}),
    color: "#9B51E0",
  },
  {
    name: "Uninvested Capital",
    data: Object.values(chartData?.UnInvestedCapital?.valueMap || {}),
    color: "#FF885E",
  },
],

    parameter: [
      {
        name: "SQN",
        data: sqnData,
        color: "#21AB5B",
      },
      {
        name: "Sharpe Ratio",
        data: sharpeRatioData,
        color: "#9B51E0",
      },
      {
        name: "AvgR",
        data: avgRData,
        color: "#FF885E",
      },
      {
        name: "Expectancy",
        data: expectancyData,
        color: "#3D69D3",
      },
      {
        name: "Std Dev Profit",
        data: stdDevProfitData,
        color: "#FFD93D",
      },
      {
        name: "Std Dev Expectancy",
        data: stdDevExpectancyData,
        color: "#26C6DA",
      },
    ],
    drawdown: [
      { month: "Jan 2024", value: -8 },
      { month: "Feb 2024", value: -5 },
      { month: "Mar 2024", value: -6 },
      { month: "Apr 2024", value: -4 },
      { month: "May 2024", value: -3 },
      { month: "May 2024", value: -1 },
      { month: "Jun 2024", value: -0 },
      { month: "Jun 2024", value: 7 },
      { month: "Jul 2024", value: 10 },
      { month: "Aug 2024", value: 8 },
      { month: "Sep 2024", value: 5 },
      { month: "Oct 2024", value: 12 },
      { month: "Nov 2024", value: 13 },
      { month: "Dec 2024", value: 11 },
    ],
    profit: [
      {
        name: "Accuracy",
        data: alphabetStock.map((day) => day.low),
        color: "#4D96FF",
      },
      {
        name: "avg Profit(%)",
        data: alphabetStock.map((day) => day.high),
        color: "#FF6B6B",
      },
      {
        name: "drawdown",
        data: alphabetStock.map((day) => day.open),
        color: "#21AB5B",
      },
      {
        name: "AnProfit",
        data: alphabetStock.map((day) => day.open),
        color: "#D73B3B",
      },
    ],
    avg1: [
      {
        name: "",
        data: alphabetStock.map((day) => day.low),
        color: "#4D96FF",
      },
    ],
    opentrades: [
      {
        name: "",
        data: alphabetStock.map((day) => day.high),
        color: "#4D96FF",
      },
    ],
    totaltrades: [
      {
        name: "",
        data: alphabetStock.map((day) => day.low),
        color: "#4D96FF",
      },
    ],
    duration: [
      {
        name: "",
        data: alphabetStock.map((day) => day.high),
        color: "#4D96FF",
      },
    ],
  };

  // Select series based on selectedOption
  const selectedSeries = seriesMap[selectedOption] || [];

  const legendMap = {
    capital: [
      { label: "Total Capital", color: "#21AB5B" },
      { label: "Net Profit", color: "#9B51E0" },
      { label: "Uninvested Capital", color: "#FF885E" },
    ],
    parameter: [
      { label: "SQN", color: "#21AB5B" },
      { label: "Sharpe Ratio", color: "#9B51E0" },
      { label: "AvgR", color: "#FF885E" },
      { label: "Expectancy", color: "#3D69D3" },
      { label: "Std Dev Profit", color: "#FFD93D" },
      { label: "Std Dev Expectancy", color: "#26C6DA" },
    ],
    profit: [
      { label: "Accuracy", color: "#4D96FF" },
      { label: "avg Profit(%)", color: "#FF6B6B" },
      { label: "drawdown", color: "#21AB5B" },
      { label: "AnProfit", color: "#D73B3B" },
    ],
  };

  const selectedLegend = legendMap[selectedOption] || [];

  const options = {
    chart: {
      type: "line",
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: sample,
      // labels: {
      //   offsetY: 10, // ⬅️ this adds vertical space between x-axis line and labels
      // },
    },
    yaxis:
      selectedOption === "parameter"
        ? [
            {
              title: {
                text: "Linear Axis",
                offsetX: -10,
              },
            },
            {
              opposite: true,
              // logarithmic: true,
              title: {
                text: "Log Axis",
              },
            },
          ]
        : {
            labels: {
              formatter: (value) => value.toFixed(2),
              offsetX: -10, // Adds horizontal space between y-axis labels and axis line
            },
          },

    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      x: {
        formatter: (value) => moment(value, "MM YYYY").format("MMMM Do, YYYY"), // Formats as "April 10th, 2024"
      },
      y: {
        formatter: function (value, { seriesIndex, w }) {
          return value !== null && value !== undefined
            ? `<span style="color: ${w.config.series[seriesIndex].color};">${value}</span>`
            : "";
        },
      },
    },
    legend: {
      show: false, // Custom legend will be used
    },
    grid: {
      show: true,
      borderColor: "#90A4AE",
      strokeDashArray: 0,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: undefined,
        opacity: 0.5,
      },
      column: {
        colors: undefined,
        opacity: 0.5,
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Chart
        options={options}
        series={selectedSeries}
        type="line"
        height={500}
      />

      {/* Custom Legend */}
      <div style={{ display: "flex", marginTop: 10 }}>
        {selectedLegend.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 10px",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: item.color,
                marginRight: 5,
                borderRadius: "50%",
              }}
            ></div>
            <Typography className="text-[#0A0A0A]" variant="body2">
              {item.label}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapitalChart;
