import React, { useState, useEffect } from "react";
import { Tabs, message, Row, Col, Button } from "antd";
import axios from "axios";
import { SEARCH_TOPIC, BASE_URL } from "../constants";

function Home(props) {
  const [activeTab, setActiveTab] = useState("airline");
  const [data, setData] = useState(null);

  const fetchData = (option) => {
    const { type } = option;
    let url = "";

    if (type === SEARCH_KEY.all) {
        url = `${BASE_URL}/search`;
      } else if (type === SEARCH_KEY.airline) {
        url = `${BASE_URL}/search?topic=${type}`;
      } else {
        url = `${BASE_URL}/search?keywords=${keyword}`;
      }

    const opt = {
      method: "GET",
      url: url,
    };

    axios(opt)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        }
      })
      .catch((err) => {
        message.error("Fetch data failed!");
        console.error("fetch data failed: ", err.message);
      });
  };

  //handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 假设您想在组件加载时调用 fetchData
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  return <div className="home"> 
  <div className="display">
       <Tabs
         onChange={(key) => setActiveTab(key)}
         defaultActiveKey="airline"
         activeKey={activeTab}
         tabBarExtraContent={operations}
       >
         <TabPane tab="home" key="image">
           {renderPosts("image")}
         </TabPane>
         <TabPane tab="Videos" key="video">
           {renderPosts("video")}
         </TabPane>
       </Tabs>
     </div>
  </div>;
}

export default Home;
