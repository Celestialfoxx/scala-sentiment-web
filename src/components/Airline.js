import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { BASE_URL } from '../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Airline = () => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    const url = `${BASE_URL}/airline`;

    axios.get(url)
      .then(response => {
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          // Separate the first row as overview data
          const [firstRow, ...restOfData] = data;
          setOverviewData(firstRow);

          const hours = restOfData.map(item => item.hour ?? 'Unknown');
          const averageSentiment = restOfData.map(item => item.average_sentiment);
          const averageSentimentComputed = restOfData.map(item => item.average_sentiment_computed);

          setChartData({
            labels: hours,
            datasets: [
              {
                label: 'Average Sentiment',
                data: averageSentiment,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
              },
              {
                label: 'Average Sentiment Computed',
                data: averageSentimentComputed,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
              }
            ]
          });
        } else {
          console.error('Data is not an array or is empty');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="airline-container">
      <h1>Airline Performance Analysis</h1>
      <h2>Overview</h2>
      {overviewData && (
        <table>
          <thead>
            <tr>
              <th>Average Sentiment</th>
              <th>Average Sentiment Computed</th>
              <th>Absolute Difference</th>
              <th>Squared Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{overviewData.average_sentiment}</td>
              <td>{overviewData.average_sentiment_computed}</td>
              <td>{overviewData.abs_difference}</td>
              <td>{overviewData.squared_difference}</td>
            </tr>
          </tbody>
        </table>
      )}

      <h2>Monthly Data Overview</h2>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default Airline;
