import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const TinyLineChart = ({ data }) => {
  const getLineColor = (data) => {
    return data[0].value < data[data.length - 1].value ? 'green' : 'red';
  };

  return (
    <ResponsiveContainer height={30}>
      <LineChart data={data}>
        <Line
          type="linear"
          dataKey="value"
          stroke={getLineColor(data)}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};


export default TinyLineChart;