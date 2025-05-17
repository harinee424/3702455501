import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import HeatMap from "react-heatmap-grid";

const App = () => {
  const [stockData, setStockData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [interval, setInterval] = useState(5); // default 5 minutes

  useEffect(() => {
    fetchStockData();
    fetchHeatmapData();
  }, [interval]);

  const fetchStockData = async () => {
    try {
      const res = await axios.get(`http://20.244.56.144/stock-service/prices?minutes=${interval}`);
      setStockData(res.data);
    } catch (err) {
      console.error("Error fetching stock data", err);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      const res = await axios.get(`http://20.244.56.144/stock-service/correlation?minutes=${interval}`);
      setHeatmapData(res.data);
    } catch (err) {
      console.error("Error fetching heatmap data", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stock Aggregation Dashboard</h1>

      <div className="mb-4">
        <label>Time Interval (minutes): </label>
        <select value={interval} onChange={(e) => setInterval(e.target.value)} className="ml-2 p-1 border">
          {[1, 5, 10, 30, 60].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Stock Prices</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockData}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="average" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Correlation Heatmap</h2>
        {heatmapData.length > 0 ? (
          <HeatMap
            xLabels={heatmapData[0].stocks}
            yLabels={heatmapData.map((row) => row.stock)}
            data={heatmapData.map((row) => row.correlations)}
          />
        ) : (
          <p>No heatmap data available.</p>
        )}
      </div>
    </div>
  );
};

export default App;
