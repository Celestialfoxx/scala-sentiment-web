import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";
import Chart from "./Chart";
import { SEARCH_KEY, BASE_URL } from "../constants";
import Airline from "./Airline";

const { TabPane } = Tabs;

function Home(props) {
  const [activeTab, setActiveTab] = useState("home");
//   const [data, setData] = useState(null);

//   const fetchData = (option) => {
//     const { type } = option;
//     let url = "";

//     if (type === SEARCH_KEY.all) {
//         url = `${BASE_URL}/home`;
//       } else if (type === SEARCH_KEY.airline) {
//         url = `${BASE_URL}/`;
//       } else {
//         url = `${BASE_URL}/search?keywords=${type}`;
//       }

//     const opt = {
//       method: "GET",
//       url: url,
//     };

//     axios(opt)
//       .then((res) => {
//         if (res.status === 200) {
//           setData(res.data);
//         }
//       })
//       .catch((err) => {
//         message.error("Fetch data failed!");
//         console.error("fetch data failed: ", err.message);
//       });
//   };

  //handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 假设您想在组件加载时调用 fetchData
//   useEffect(() => {
//     fetchData(activeTab);
//   }, [activeTab]);

  return <div className="home"> 
  <div className="display">
    <Chart />
       <Tabs
         onChange={(key) => setActiveTab(key)}
         defaultActiveKey="home"
         activeKey={activeTab}
       >
         <TabPane tab="Home" key="home">
           <h1 className="header">Sentiment Analysis Trend</h1>
           <h2 className="intro">Select the topics you are interested in to see the trends in public emotions</h2>
         </TabPane>
         <TabPane tab="Airline" key="airline">
           <Airline />
         </TabPane>
       </Tabs>
     </div>
  </div>;
}

export default Home;
