import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, LinearScale, CategoryScale, PointElement);

const LineChart = () => {
  const [dataOptions, setDataOptions] = useState({
    labels: [], // x-axis labels
    datasets: [
      {
        label: 'ZigZag Line',
        data: [], // y-axis values
        borderColor: 'red',
        borderWidth: 1,
        tension: 0.3, // Low tension for sharper zig-zags
        fill: false, // No fill under the line
        
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      title: {
        display: false, // Hide title
      },
      tooltip: {
        enabled: false, // Disable tooltips
      },
    },
    elements: {
      point: {
        radius: 0, // Remove data point markers
      },
    },
    hover: {
      mode: null, // Disable hover effects
    },
    scales: {
      x: {
        display: false, // Hide x-axis
      },
      y: {
        display: false, // Hide y-axis
      },
    },
    animation: {
      duration: 0, // Disable animations
    },
  };

  // Generate zig-zag data points
  useEffect(() => {
    const zigZagData = [];
    const labels = [];
    for (let i = 0; i < 60; i++) {
      labels.push(i);
      zigZagData.push(i % 2 === 0 ? Math.random() * 10 : Math.random() * -10);
    }

    setDataOptions({
      labels,
      datasets: [
        {
          ...dataOptions.datasets[0],
          data: zigZagData,
        },
      ],
    });
  }, []);

  return (
    <div style={{height: '30px',width:"100%" }}>
      <Line data={dataOptions} options={options} />
    </div>
  );
};

export default LineChart;
