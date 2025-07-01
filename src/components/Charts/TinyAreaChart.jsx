import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';

const TinyAreaChart = ({ data }) => {
  // Determine if the chart is increasing or decreasing
  const isIncreasing = data?.[data.length - 1]?.uv > data?.[0]?.uv;

  return (
    <ResponsiveContainer width={250} height={30}>
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <Area
          type="monotone"
          dataKey="uv"
          stroke={isIncreasing ? "#4CAF50" : "#CA4638"} // Green for increasing, Red for decreasing
          fill={isIncreasing ? "#d5f7d5" : "#facdcd"} // Light green or light red fill
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TinyAreaChart;
