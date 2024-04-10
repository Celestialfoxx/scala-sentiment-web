import React from "react";
import logo from "../assets/images/logo.svg";

import { LogoutOutlined } from "@ant-design/icons";

function TopBar(props) {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <span className="App-title">Sentiment Trend</span>
      {<LogoutOutlined className="logout" onClick={handleLogout} />}
    </header>
  );
}

export default TopBar;
