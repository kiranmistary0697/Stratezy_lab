import React from "react";
import ReactApexChart from "react-apexcharts";

const data = [
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
];

// Separate positive and negative values to create a segmented line effect

const DrawdownChart = () => {
  const seriesData = data.map((d) => d.value);

  const options = {
    chart: {
      type: "line",
      height: 400,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: data.map((d) => d.month),
      // type: "datetime",
    },
    yaxis: {
      labels: {
        offsetX: -10, // ✅ Add this for spacing from y-axis line
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 0,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: { enabled: false },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        type: "horizontal",
        colorStops: [
          { offset: 0, color: "#D73B3B", opacity: 1 }, // Red for negative
          { offset: 50, color: "#D73B3B", opacity: 1 }, // Red close to zero
          { offset: 51, color: "#21AB5B", opacity: 1 }, // Green close to zero
          { offset: 100, color: "#21AB5B", opacity: 1 }, // Green for positive
        ],
      },
    },
    annotations: {
      yaxis: [
        {
          y: 0, // Set the mid-value here (adjust as needed)
          borderColor: "#666666", // Line color
          strokeDashArray: 0, // 0 makes it a solid line
          opacity: 1, // Full visibility
          width: "100%",
        },
      ],
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
      <ReactApexChart
        options={options}
        series={[{ name: "Value", data: seriesData }]}
        type="line"
        height={500}
      />
    </div>
  );
};
export default DrawdownChart;
