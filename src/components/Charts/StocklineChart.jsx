import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const StocklineChart = () => {
  const [chartWidth, setChartWidth] = useState(960); // Initial width
  const chartRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth);
      }
    };

    // Set initial width on mount and add resize event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const createGraph = async () => {
    // Fetch data from CSV and parse it
    const data = await d3.csv(
      "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv"
    );

    const parseTime = d3.timeParse("%Y-%m-%d");
    data.forEach((d) => {
      d.date = parseTime(d.date);
      d.value = +d.value;
    });

    // Set the dimensions and margins of the graph
    const margin = { top: 20, right: 30, bottom: 50, left: 70 };
    const width = chartWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Remove any existing SVG (to avoid duplicates on re-renders)
    d3.select("#chart-container").selectAll("svg").remove();

    // Append the SVG object to the chart-container div
    const svg = d3
      .select("#chart-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add X and Y axes
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    x.domain(d3.extent(data, (d) => d.date));
    y.domain([0, d3.max(data, (d) => d.value)]);

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0)) // Remove small ticks
      .call((g) =>
        g.selectAll("path").attr("stroke", "#ccc") // Match X-axis line color to grid
      )
      .call((g) =>
        g.selectAll("text").attr("fill", "currentColor") // Match text color
      );

    // Y-axis with horizontal grid lines
    svg
      .append("g")
      .call(d3.axisLeft(y).tickSize(0)) // Remove small ticks
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width) // Extend the tick lines horizontally
          .attr("stroke-opacity", 0.1) // Light stroke for grid lines
      )
      .call((g) => g.select(".domain").remove()) // Remove the Y-axis domain line
      .call((g) =>
        g.selectAll("text").attr("fill", "currentColor") // Match text color
      );

    // Add the line
    const valueLine = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    svg
      .append("path")
      .data([data])
      .attr("fill", "none")
      .attr("stroke", "#3F51B5")
      .attr("stroke-width", 1.5)
      .attr("d", valueLine);
  };

  useEffect(() => {
    createGraph();
  }, [chartWidth]); // Re-run the graph creation whenever chartWidth changes

  return (
    <div
      id="chart-container"
      ref={chartRef}
      className="text-center w-[100%]"
    >
      {/* The chart will be rendered inside this div */}
    </div>
  );
};

export default StocklineChart;
