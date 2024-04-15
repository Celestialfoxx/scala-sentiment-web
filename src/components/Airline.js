import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BASE_URL } from "../constants";
import fetchText from "./OpenAi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Airline = () => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [sentimentData, setSentimentData] = useState({ datasets: [] });
  const [varianceData, setVarianceData] = useState({ datasets: [] });
  const [overviewData, setOverviewData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [addData, setAddData] = useState("");
  const [process, setProcess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState("");
  const [openAiData, setOpenAiData] = useState("")
  const [sentimentList, setSentimentList] = useState([]);


  useEffect(() => {
    if (openAiData) {
        console.log('OpenAI Data has changed:', openAiData);
    }
}, [openAiData]);

  useEffect(() => {
    const url = `${BASE_URL}/airline`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        console.log(data);

        if (Array.isArray(data) && data.length > 0) {
          // Separate the first row as overview data
          const [firstRow, ...restOfData] = data;
          const extractedData = data.map(item => ({
            hour: item.hour ?? 'Summary', // Handle summary case with no hour
            average_sentiment: item.average_sentiment
        }));
        setSentimentList(extractedData);
        // Convert extractedData to string and call fetchText
        (async () => {
            const response = await fetchText(JSON.stringify(extractedData));
            setOpenAiData(response);
        })();


          setOverviewData(firstRow);

          const hours = restOfData.map((item) => item.hour ?? "Unknown");
          const averageSentiment = restOfData.map(
            (item) => item.average_sentiment
          );
          const averageSentimentComputed = restOfData.map(
            (item) => item.average_sentiment_computed
          );
          const squaredDifferences = restOfData.map(
            (item) => item.squared_difference
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

          setVarianceData({
            labels: hours,
            datasets: [
              {
                label: "Squared Difference (Variance)",
                data: squaredDifferences,
                borderColor: "rgba(53, 162, 235, 0.5)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
                fill: false,
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

  const lineOptions = {
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
          text: "Squared Difference (Variance)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Hourly Variance in Sentiment",
      },
    },
    responsive: true,
  };

  // when there is some change with addData, will call the backend to analyze the sentiment
  useEffect(() => {
    if (addData) {
      console.log("Submitted data:", addData);

      let url = `${BASE_URL}/oneSentiment`;

      axios
        .get(url, {
          params: { data: addData },
        })
        .then((response) => {
          console.log("Received response:", response.data);
          const sentiment = interpretSentiment(response.data);
          setAnalysisResult(
            `${addData} - The sentiment of this text is ${sentiment}.`
          );
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setAnalysisResult("Failed to fetch sentiment analysis.");
        })
        .finally(() => {
          setProcess(false);
        });
    }
  }, [addData]);

  // respond the sentiment analysis based on return value
  const interpretSentiment = (value) => {
    switch (value) {
      case -1:
        return "negative";
      case 0:
        return "neutral";
      case 1:
        return "positive";
      default:
        return "unknown"; // In case of unexpected result
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // submit add one sentiment to backend
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      alert("Please enter some text before submitting.");
      return;
    }
    setProcess(true);
    setAddData(inputValue);
  };
  return (
    <div className="airline-container">
      <h1>Airline Performance Analysis</h1>
      <div>
        <h2>Add Mock Data</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            style={{ marginRight: "10px", width: "300px", height: "40px" }} 
            rows="4"
            wrap="soft" 
          />
          <button onClick={handleSubmit}>Submit and analyze</button>
        </div>
        {process && <h2>Please wait, analyzing the data...</h2>}
        {!process && analysisResult && (
          <div>
            <h2>{analysisResult}</h2>
          </div>
        )}
      </div>
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
        {sentimentData && (
          <Bar data={sentimentData} options={optionsSentiment} />
        )}
      </div>

      <div className="comment">
        <p>
          Based on the provided sentiment analysis data of tweets related to
          American airlines, it appears that the general sentiment is negative.
          The average sentiment values are consistently below zero throughout
          the hours, indicating a predominance of negative feedback or
          perceptions. The computed average sentiment values also reinforce this
          trend, as they too are in the negative range.
          <br></br>
          <br></br>The data shows minor fluctuations in sentiment over different
          hours, which might be associated with specific events or time-related
          service experiences. However, the consistently negative values across
          the board suggest an overall dissatisfaction among the users or
          customers discussing these airlines on Twitter.
        </p>
      </div>

      <div style={{ marginTop: "50px" }}>
        {chartData && <Bar data={chartData} options={optionsCoparison} />}
      </div>

      <div className="comment">
        <p>
          Looking forward, if the current trends continue without significant
          improvements or positive interventions by the airlines, the negative
          sentiment is likely to persist. However, should the airlines address
          the underlying issues causing this dissatisfaction, we could expect to
          see an upward shift in sentiment. Monitoring these trends and
          implementing timely and effective responses could be crucial for
          improving public perception.
          <br></br>
          <br></br>Predicting future changes precisely requires more in-depth
          analysis, possibly incorporating more data points over an extended
          period and considering external factors such as industry developments,
          service changes, or global events. Nonetheless, the current data
          underscores the importance of proactive customer service and public
          relations efforts to improve sentiment and perception in the social
          media sphere.
        </p>
      </div>
      <div style={{ marginTop: "50px" }}>
        <Line data={varianceData} options={lineOptions} />
      </div>
    </div>
  );
};

export default Airline;
