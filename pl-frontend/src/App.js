import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('minute');
  const [plantId, setPlantId] = useState('');
  const [startDatetime, setStartDatetime] = useState('');
  const [endDatetime, setEndDatetime] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost/api/v1/op', {
        params: {
          plant_id: plantId,
          start_datetime: startDatetime,
          end_datetime: endDatetime,
          time_filter: filter,
        },
      });
      setData(response.data);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');

    const defaultStartDatetime = `${year}-${month}-${day}T00:00`;
    const defaultEndDatetime = getCurrentDateTime();

    setStartDatetime(defaultStartDatetime);
    setEndDatetime(defaultEndDatetime);

    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filter, plantId, startDatetime, endDatetime]);

  useEffect(() => {
    const interval = setInterval(fetchData, 60000); // Fetch data every minute

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Dashboard</h1>
      <div className="form-group">
        <label htmlFor="filter">Filter:</label>
        <select id="filter" className="form-control" value={filter} onChange={handleFilterChange}>
          <option value="minute">Minute</option>
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="plantId">Plant ID:</label>
        <input id="plantId" className="form-control" type="text" value={plantId} onChange={(e) => setPlantId(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="startDatetime">Start Datetime:</label>
        <input id="startDatetime" className="form-control" type="datetime-local" value={startDatetime} onChange={(e) => setStartDatetime(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="endDatetime">End Datetime:</label>
        <input id="endDatetime" className="form-control" type="datetime-local" value={endDatetime} onChange={(e) => setEndDatetime(e.target.value)} />
      </div>
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};

export default Dashboard;
