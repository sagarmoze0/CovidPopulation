import { useState, useEffect } from "react";
import axios from "axios";
import DataRectangle from "./Data";
import LineChart from "./LineChart";
import PieChart from "./PieChart";
import DateRangeSelector from "./DateRangePicker ";

const HistoricalData = () => {
    // State variables
    const [country, setCountry] = useState(null);
    const [selecteCountry, setSelectCountry] = useState('usa');
    const [historicalData, setHistoricalData] = useState(null);
    const [loading, setLoading] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(new Date('2020-01-01'));
    const [endDate, setEndDate] = useState(new Date('2023/12/31'));
    const [filteredData, setFilteredData] = useState(null);

    // Function to format date
    const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    // Fetch country data on component mount
    useEffect(() => {
        const fetchCountry = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://restcountries.com/v3.1/all`);
                setCountry(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchCountry();
    }, []);

    // Fetch historical data based on selected country and date range
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const startDateStr = formatDate(startDate);
                const endDateStr = formatDate(endDate);
                const response = await axios.get(`https://disease.sh/v3/covid-19/historical/${selecteCountry}?lastdays=1500&start_date=${startDateStr}&end_date=${endDateStr}`);
                const data = response.data;
                let filteredData = data;
                if (startDate && endDate) {
                    filteredData = filterDataByDateRange(data, startDate, endDate);
                }
                setHistoricalData(data);
                setFilteredData(filteredData);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [selecteCountry, startDate, endDate]);

    // Function to handle country selection
    const handleCountry = (e) => {
        setSelectCountry(e.target.value);
    };

    // Function to handle date range selection
    const handleDate = (newStart, newEnd) => {
        setStartDate(newStart);
        setEndDate(newEnd);
    };

    // Function to calculate total deaths
    const calculateTotalDeaths = () => {
        let totalDeaths = 0;
        if (filteredData && filteredData.timeline && filteredData.timeline.deaths) {
            const { deaths } = filteredData.timeline;
            totalDeaths = Object.values(deaths).reduce((acc, curr) => acc + curr, 0);
        }
        return totalDeaths;
    };

    // Function to calculate total recoveries
    const calculateTotalRecoveries = () => {
        let totalRecoveries = 0;
        if (filteredData && filteredData.timeline && filteredData.timeline.recovered) {
            const { recovered } = filteredData.timeline;
            totalRecoveries = Object.values(recovered).reduce((acc, curr) => acc + curr, 0);
        }
        return totalRecoveries;
    };

    // Function to calculate total cases
    const calculateTotalCases = () => {
        let totalCases = 0;
        if (filteredData && filteredData.timeline && filteredData.timeline.cases) {
            const { cases } = filteredData.timeline;
            totalCases = Object.values(cases).reduce((acc, curr) => acc + curr, 0);
        }
        return totalCases;
    };

    // Function to filter data by date range
    const filterDataByDateRange = (data, startDate, endDate) => {
        const filteredData = {
            timeline: {
                cases: {},
                deaths: {},
                recovered: {}
            }
        };
        const timeline = data.timeline;
        for (let date in timeline.cases) {
            const currentDate = new Date(date);
            if (currentDate >= startDate && currentDate <= endDate) {
                filteredData.timeline.cases[date] = timeline.cases[date];
                filteredData.timeline.deaths[date] = timeline.deaths[date];
                filteredData.timeline.recovered[date] = timeline.recovered[date];
            }
        }
        return filteredData;
    };

    // Render
    return (
        <div className="container mx-auto py-8 px-10">
            {/* Page Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">COVID-19 and Population Dashboard</h1>

            {/* Country Selector and Date Selector */}
            <div className="flex flex-col items-center mb-8">
                {/* Country Selector */}
                <div className="w-full sm:w-1/2">
                    <h2 className="font-semibold mb-2">ISO Code Of Country: {selecteCountry.toUpperCase()}</h2>
                    {loading && <p>Loading...</p>}
                    <select className="font-semibold border rounded-lg px-4 py-2 mb-4 w-full" value={selecteCountry} onChange={handleCountry}>
                        <option>United States</option>
                        {country && country.map((countries) => (
                            <option key={countries.cca2} value={countries.cca2.toLowerCase()}>
                                {countries.name.common}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Date Selector */}
                <div className="w-full sm:w-1/2">
                    <h2 className="font-semibold">Select Date Range</h2>
                    <DateRangeSelector
                        startDate={startDate}
                        endDate={endDate}
                        onDateRangeChange={handleDate}
                    />
                </div>
            </div>

            {/* Data Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {/* Total Cases */}
                <div className="flex items-center ml-6">
                    {historicalData ? (
                        <DataRectangle label="Total Cases" count={calculateTotalCases()} color="#9CA8FF" />
                    ) : (
                        <p>Loading historical data...</p>
                    )}
                </div>
                {/* Recoveries */}
                <div className="flex items-center ml-6">
                    {historicalData ? (
                        <DataRectangle label="Recoveries" count={calculateTotalRecoveries()} color="#47D928" />
                    ) : (
                        <p>Loading historical data...</p>
                    )}
                </div>
                {/* Deaths */}
                <div className="flex items-center ml-6">
                    {historicalData ? (
                        <DataRectangle label="Deaths" count={calculateTotalDeaths()} color="#FF4D57" />
                    ) : (
                        <p>Loading historical data...</p>
                    )}
                </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:space-x-10">
                {/* Line Chart */}
                <div className="w-full md:w-2/4">
                    <p className="text-center mb-2">Line Chart</p>
                    <div className="h-400px md:h-300px">
                        {historicalData ? (
                            <LineChart data={historicalData} startDate={startDate} endDate={endDate} />
                        ) : (
                            <p>Loading historical data...</p>
                        )}
                    </div>
                </div>
                {/* Pie Chart */}
                <div className="justify-centre w-1/2 justify-centre md:w-1/6">
                    <p className="text-center mb-2">Pie Chart</p>
                    {historicalData ? (
                        <PieChart data={historicalData} startDate={startDate} endDate={endDate} />
                    ) : (
                        <p>Loading historical data...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoricalData;
