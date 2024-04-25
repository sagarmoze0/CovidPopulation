// eslint-disable-next-line no-unused-vars
import { Chart, LinearScale, CategoryScale, LineController, LineElement, PointElement, Title, Ticks, scales } from 'chart.js/auto';

import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({ data, startDate, endDate }) => {
    // Check if historical data is available
    if (!data || !data.timeline) {
        return <p>No historical data available</p>;
    }

    // Extract data from historical data
    const { cases, deaths, recovered } = data.timeline;
    const dates = Object.keys(cases);

    // Filter data based on selected date range
    const filteredDates = dates.filter(date => {
        const currentDate = new Date(date);
        return currentDate >= startDate && currentDate <= endDate;
    });

    // Extract unique years from the filtered dates
    const uniqueYears = [...new Set(filteredDates.map(date => date.split('/')[2]))];

    // Map data points for each unique year
    const casesValues = uniqueYears.map(year => {
        const yearCases = filteredDates.filter(date => date.endsWith(`/${year}`));
        return yearCases.reduce((acc, date) => acc + cases[date], 0) || 0;
    });
    const deathsValues = uniqueYears.map(year => {
        const yearDeaths = filteredDates.filter(date => date.endsWith(`/${year}`));
        return yearDeaths.reduce((acc, date) => acc + deaths[date], 0) || 0;
    });
    const recoveredValues = uniqueYears.map(year => {
        const yearRecovered = filteredDates.filter(date => date.endsWith(`/${year}`));
        return yearRecovered.reduce((acc, date) => acc + recovered[date], 0) || 0;
    });

    // Prepare chart data
    const chartData = {
        labels: uniqueYears,
        datasets: [
            {
                label: 'Cases',
                data: casesValues,
                borderColor: '#9CA8FF',
                fill: false,
            },
            {
                label: 'Deaths',
                data: deathsValues,
                borderColor: '#FF4D57',
                fill: false,
            },
            {
                label: 'Recovered',
                data: recoveredValues,
                borderColor: '#47D928',
                fill: false,
            },
        ],
    };
    const options={
        scales:
        {
            x:{
                title:{
                    display: true,
                    text:'years'
                }
            },
            y:{
                title:{
                    display: true,
                    text:'cases, recoveries, deaths',
                    padding: { top: 20, bottom: 10 }                }
            }
        }
    }

    // Render Line chart component
    return <Line data={chartData} options={options}/>;
};

export default LineChart;
