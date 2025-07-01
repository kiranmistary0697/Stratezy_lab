import React from 'react';
import Plot from 'react-plotly.js';

const ChartComponent = ({ preparedData, preparePlotData }) => {
    if (!preparedData || preparedData.length === 0) {
        return <div>No data available for chart</div>;
    }

    return (
        <Plot
            data={preparePlotData(preparedData)}
            layout={{
                title: 'Multi-Axis Chart',
                xaxis: { title: 'Date', showgrid: true, gridcolor: '#e0e0e0' },
                yaxis: { title: 'Primary Y-Axis', gridcolor: '#e0e0e0' },
                yaxis2: { title: 'Secondary Y-Axis', overlaying: 'y', side: 'right' },
                legend: { orientation: 'h' },
                hovermode: 'x unified',
                paper_bgcolor: '#fff',
                plot_bgcolor: '#fff',
            }}
            useResizeHandler
            style={{ width: '100%', height: '600px' }}
        />
    );
};

export default ChartComponent;
