import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data, startDate, endDate }) => {
  if (!data || !data.timeline) {
    return <p>No historical data available</p>;
  }

  const { cases, deaths, recovered } = data.timeline;

  // Filter data based on selected date range
  const filteredCases = Object.entries(cases).filter(([date]) => {
    const currentDate = new Date(date);
    return currentDate >= startDate && currentDate <= endDate;
  });

  const totalCases = filteredCases.reduce((acc, [_, value]) => acc + value, 0);

  // Filter recovered and deaths data similarly

  const totalDeaths = Object.entries(deaths).filter(([date]) => {
    const currentDate = new Date(date);
    return currentDate >= startDate && currentDate <= endDate;
  }).reduce((acc, [_, value]) => acc + value, 0);

  const totalRecovered = Object.entries(recovered).filter(([date]) => {
    const currentDate = new Date(date);
    return currentDate >= startDate && currentDate <= endDate;
  }).reduce((acc, [_, value]) => acc + value, 0);

  const chartData = {
    labels: ['Cases', 'Recovered', 'Deaths'],
    datasets: [{
      data: [totalCases, totalRecovered, totalDeaths],
      backgroundColor: ['#E6E69E', '#47D928', '#FF4D57'],
    }]
  };

  return <Pie data={chartData} />;
};

export default PieChart;
