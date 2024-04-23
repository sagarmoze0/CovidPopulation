// eslint-disable-next-line no-unused-vars
import { Chart, LinearScale, CategoryScale, LineController, LineElement, PointElement, Title, Ticks, scales } from 'chart.js/auto'; // Importing necessary Chart.js components

import React from 'react';
import { Line } from 'react-chartjs-2'; // Importing Line component from react-chartjs-2 library

const LineChart = ({ data }) => {
  // Check if data is available
  if (!data || !data.timeline) {
    return <p>No historical data available</p>;
  }

  // Destructure data.timeline object
  const { cases, deaths, recovered } = data.timeline;
  // Extract dates from the cases object
  const dates = Object.keys(cases);
  // Extract unique years from the dates
  const uniqueYears = [...new Set(dates.map(date => date.split('/')[2]))];
  // Map data points for each unique year for cases, deaths, and recovered
  const casesValues = uniqueYears.map(year => {
    const yearCases = dates.filter(date => date.endsWith(`/${year}`));
    return yearCases.reduce((acc, date) => acc + cases[date], 0) || 0;
  });
  const deathsValues = uniqueYears.map(year => {
    const yearDeaths = dates.filter(date => date.endsWith(`/${year}`));
    return yearDeaths.reduce((acc, date) => acc + deaths[date], 0) || 0;
  });
  const recoveredValues = uniqueYears.map(year => {
    const yearRecovered = dates.filter(date => date.endsWith(`/${year}`));
    return yearRecovered.reduce((acc, date) => acc + recovered[date], 0) || 0;
  });

  const casesValuesInMillions = casesValues.map(value => value / 1000000);
  const deathsValuesInMillions = deathsValues.map(value => value / 1000000);
  const recoveredValuesInMillions = recoveredValues.map(value => value / 1000000);
  // Define chart data
  const chartData = {
    labels: uniqueYears,
    datasets: [
      {
        label: 'Cases',
        data: casesValuesInMillions,
        borderColor: '#9CA8FF', // Line color for cases
        fill: false,
      },
      {
        label: 'Deaths',
        data: deathsValuesInMillions,
        borderColor: '#FF4D57', // Line color for deaths
        fill: false,
      },
      {
        label: 'Recovered',
        data: recoveredValuesInMillions,
        borderColor: '#47D928', // Line color for recovered
        fill: false,
      },
    ],
  };
  
  // Chart options to customize the appearance
  const options = {
    scales: {
      x:{
        title:{
          display: true,
          text:'Year'
        }
      },
      y: {
        ticks: {
          // Callback function to format ticks as millions
          callback: function (value) {
            return value + 'M';
          },
        },
        title:{
          display: true,
          text:'COVID cases, recoveries & deaths' // Title for the y-axis
        },
      },
    },
  };

  // Render the Line component from react-chartjs-2 with chartData and options
  return <Line data={chartData} options={options} />;

};

export default LineChart;
