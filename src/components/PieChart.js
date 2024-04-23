import React from 'react';
import { Pie } from 'react-chartjs-2'; // Importing Pie component from react-chartjs-2 library

const PieChart = ({ data }) => {
  // Check if data is available
  if (!data || !data.timeline) {
    return <p>No historical data available</p>;
  }

  // Destructure data.timeline object
  const { cases, deaths, recovered } = data.timeline;
  
  // Calculate total cases, deaths, and recovered
  const totalCases = Object.values(cases).reduce((acc, curr) => acc + curr, 0);
  const totalDeaths = Object.values(deaths).reduce((acc, curr) => acc + curr, 0);
  const totalRecovered = Object.values(recovered).reduce((acc, curr) => acc + curr, 0);

  // Define chart data
  const chartData = {
    labels: ['Cases'], // Label for the pie chart
    datasets: [{
      data: [totalCases, totalRecovered, totalDeaths], // Data values for cases, recovered, and deaths
      backgroundColor: ['#E6E69E', '#47D928', '#FF4D57'], // Background colors for each section
    }]
  };

  // Render the Pie component from react-chartjs-2 with chartData
  return <Pie data={chartData} />;
};

export default PieChart;
