import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Papa from 'papaparse';
import { BASE_URL } from '../constants';  // 确保这里的路径正确指向你的常量定义

const Airline = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // 构造请求的URL，这里假设BASE_URL是你的API基础路径，`/airline`是获取CSV数据的具体路径
    const url = `${BASE_URL}/airline`;
  
    // 使用axios发起GET请求获取CSV文件，设置响应类型为'blob'以正确处理二进制文件
    axios.get(url, { responseType: 'blob' })
      .then(response => {
        // 创建一个FileReader对象来读取响应的blob数据
        const reader = new FileReader();
  
        // 当FileReader完成读取操作时，这个函数会被调用
        reader.onload = () => {
          // 使用Papa.parse解析FileReader读取的结果（即CSV文件的内容）
          Papa.parse(reader.result, {
            complete: (result) => {
              // 解析完成后，result.data包含了CSV文件中的数据，这是一个数组的数组
              const csvData = result.data;
  
              // 获取标签（即第一行除了第一列之外的所有单元格），通常这些标签用于图表的x轴
              const labels = csvData[0].slice(1);
  
              // 获取数据（假设每行的第二列包含需要的数据），并将其转换为浮点数
              // 这里的数据用于图表的y轴
              const data = csvData.slice(1).map(row => parseFloat(row[1]));
  
              // 设置图表的数据，这会触发图表组件的重新渲染
              setChartData({
                labels,
                datasets: [{
                  label: 'Airline Data',  // 图表的标题
                  data,                   // 图表的数据
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',  // 图表数据的背景颜色
                }]
              });
            }
          });
        };
  
        // 读取响应的blob数据作为文本，这将触发上面定义的onload函数
        reader.readAsText(response.data);
      })
      .catch(error => {
        // 如果请求或读取过程中发生错误，这里会捕获到，并打印错误信息
        console.error('Error fetching CSV:', error);
      });
  }, []);
  

  return (
    <div className="airline-container">
      <h1>Airline Performance Analysis</h1>
      <h2>Monthly Data Overview</h2>
      {chartData && <Bar data={chartData} />}
    </div>
  );
};

export default Airline;
