import React, { useEffect, useRef } from 'react';
import { Chart, LineController, LineElement, LinearScale, PointElement, CategoryScale } from 'chart.js';
import { Color } from '../../constants/AppResource';

Chart.register(LineController, LineElement, LinearScale, PointElement, CategoryScale);

const ProgressLineChart = ({ data,title='' }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const totalDuration = 10;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx) =>
      ctx.index === 0
        ? ctx.chart.scales.y.getPixelForValue(100)
        : ctx.chart
            .getDatasetMeta(ctx.datasetIndex)
            .data[ctx.index - 1].getProps(['y'], true).y;

    const animation = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        },
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        },
      },
    };

    const chartTitle = title 

    const customPlugin = {
      id: 'dotTitlePlugin',
      beforeDraw(chart) {
        const { width, height, ctx } = chart;
        const x = width - 100; // Position X: 50 pixels from the right edge
        const y = 5; // Position Y: 20 pixels from the top
        ctx.fillStyle = Color.darkPurple; // Dot color
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw the title next to the dot
        ctx.fillStyle = Color.placeholderGray;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(chartTitle, x + 10, y);

      
      },
    };

    const config = {
      type: 'line',
      data: {
        datasets: [
          {
            borderColor: Color.darkPurple,
            borderWidth: 1,
            radius: 0,
            data: data,
          },
        ],
      },
      options: {
        animation,
        interaction: {
          intersect: false,
        },
        plugins: {
          legend: false,
        },
        scales: {
          x: {
            type: 'linear',
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: true,
            },
            border: {
              display: false,
            },
          },
        },
      },
      plugins: [customPlugin], // Add the custom plugin here
    };

    const chart = new Chart(chartRef.current, config);

    return () => {
      chart.destroy(); // Cleanup on component unmount
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default ProgressLineChart;
