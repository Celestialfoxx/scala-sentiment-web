import React from "react";
import logo from "../assets/images/logo.svg";

import { LogoutOutlined } from "@ant-design/icons";

function TopBar(props) {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="App-title">Sentiment Analysis</span>
      {<LogoutOutlined className="logout" />}
    </header>
  );
}

export default TopBar;
