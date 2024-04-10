import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import CSVReader from 'react-csv-reader';

const Chart = (props) => {
  const [data, setData] = useState(null);

  const handleData = (csvData) => {
    // Assuming your CSV has headers and the first column represents labels
    const labels = csvData[0].slice(1); // Exclude the first column as labels
    const datasets = [];

    // Iterate through CSV rows starting from the second row
    for (let i = 1; i < csvData.length; i++) {
      const row = csvData[i];
      const dataset = {
        label: row[0], // First column as dataset label
        data: row.slice(1).map((value) => parseFloat(value)), // Exclude the first column as data points
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`, // Random color for each dataset
      };
      datasets.push(dataset);
    }

    // Construct chart data
    const chartData = {
      labels,
      datasets,
    };

    setData(chartData);
  };

  return (
    <div>
      {/* <CSVReader onFileLoaded={handleData} /> */}
      {data && <Bar data={data} />}
    </div>
  );
};

export default Chart;
