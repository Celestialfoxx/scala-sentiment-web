import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Papa from 'papaparse';
import { BASE_URL } from '../constants';

const GetCSV = (props) => {
  const [data, setData] = useState(null);
  const {topic} = props;

  useEffect(() => {
    let url = `${BASE_URL}/${topic}`
    axios.get(url)
      .then(response => {
        const csvData = response.data;
        Papa.parse(csvData, {
          complete: (result) => {
            const csvData = result.data;
            const labels = csvData[0].slice(1); // Exclude the first column for labels
            const datasets = [];
            
            for (let i = 1; i < csvData.length; i++) {
              const row = csvData[i];
              const dataset = {
                label: row[0], // First column as dataset label
                data: row.slice(1).map((value) => parseFloat(value)), // Exclude the first column and parse to float
                backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
              };
              datasets.push(dataset);
            }

            const chartData = {
              labels,
              datasets,
            };

            setData(chartData);
          }
        });
      })
      .catch(error => console.error('Error fetching CSV:', error));
  }, []);

  return (
    <div>
      {data && <Bar data={data} />}
    </div>
  );
};

export default GetCSV;
