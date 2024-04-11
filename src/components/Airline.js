import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BASE_URL } from "../constants";

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
  const [sentimentData, setSentimentData] = useState({ datasets: [] });
  const [overviewData, setOverviewData] = useState(null);

  useEffect(() => {
    const url = `${BASE_URL}/airline`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          // Separate the first row as overview data
          const [firstRow, ...restOfData] = data;
          setOverviewData(firstRow);

          const hours = restOfData.map((item) => item.hour ?? "Unknown");
          const averageSentiment = restOfData.map(
            (item) => item.average_sentiment
          );
          const averageSentimentComputed = restOfData.map(
            (item) => item.average_sentiment_computed
          );

          // Data for the first chart
          setChartData({
            labels: hours,
            datasets: [
              {
                label: "Average Sentiment",
                data: averageSentiment,
                backgroundColor: "rgba(255, 99, 132, 0.6)",
              },
              {
                label: "Average Sentiment Computed",
                data: averageSentimentComputed,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          });

          // Data for the second chart (only average sentiment)
          setSentimentData({
            labels: hours,
            datasets: [
              {
                label: "Average Sentiment",
                data: averageSentiment,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          });
        } else {
          console.error("Data is not an array or is empty");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const optionsSentiment = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Hour of the Day",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sentiment Value",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Sentiment Trend of the Day",
        font: {
          size: 20,
        },
      },
    },
    responsive: true,
  };

  const optionsCoparison = {
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Hour of the Day",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sentiment Value",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Real/Predicted Sentiment Comparison",
        font: {
          size: 20,
        },
      },
    },
    responsive: true,
  };

  const comment = `Based on the provided sentiment analysis data of tweets related to American airlines, it appears that the general sentiment is negative. The average sentiment values are consistently below zero throughout the hours, indicating a predominance of negative feedback or perceptions. The computed average sentiment values also reinforce this trend, as they too are in the negative range. 

  \nThe data shows minor fluctuations in sentiment over different hours, which might be associated with specific events or time-related service experiences. However, the consistently negative values across the board suggest an overall dissatisfaction among the users or customers discussing these airlines on Twitter.

  \nLooking forward, if the current trends continue without significant improvements or positive interventions by the airlines, the negative sentiment is likely to persist. However, should the airlines address the underlying issues causing this dissatisfaction, we could expect to see an upward shift in sentiment. Monitoring these trends and implementing timely and effective responses could be crucial for improving public perception.

  \nPredicting future changes precisely requires more in-depth analysis, possibly incorporating more data points over an extended period and considering external factors such as industry developments, service changes, or global events. Nonetheless, the current data underscores the importance of proactive customer service and public relations efforts to improve sentiment and perception in the social media sphere.`;
  

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

      <div style={{ marginTop: "50px" }}>
        {sentimentData && <Bar data={sentimentData} options={optionsSentiment} />}
      </div>

      <div style={{ marginTop: "50px" }}>
        {chartData && <Bar data={chartData} options={optionsCoparison} />}
      </div>

      <div className="comment">
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default Airline;
