import { useState, useEffect } from "react";
import axios from "axios";
import DataRectangle from "./Data"; // Importing components
import LineChart from "./LineChart";
import PieChart from "./PieChart";

const HistoricalData = () => {
    // State variables for managing data, loading state, and errors
    const [country, setCountry] = useState(null);
    const [selecteCountry, setSelectCountry] = useState('usa');
    const [historicalData, setHistoricalData] = useState(null);
    const [loading, setLoading] = useState(true);
    /* eslint-disable no-unused-vars */
    const [error, setError] = useState(null);
   

    useEffect(() => {
        // Fetching country data when the component mounts
        const fetchCountry = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://restcountries.com/v3.1/all`);
                setCountry(response.data); // Setting country data
                setLoading(false);
            } catch (error) {
                setError(error.message); // Handling errors
                setLoading(false);
            }
        };
        fetchCountry();
    }, []);

    useEffect(() => {
        // Fetching historical data when the selected country changes
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://disease.sh/v3/covid-19/historical/${selecteCountry}?lastdays=1500`);
                setHistoricalData(response.data); // Setting historical data
                setLoading(false);
            } catch (error) {
                setError(error.message); // Handling errors
                setLoading(false);
            }
        };
        fetchData();
    }, [selecteCountry]);

    const handleCountry = (e) => {
        // Handling country selection
        setSelectCountry(e.target.value);
    };

    // Calculating total cases, recoveries, and deaths from historical data
    let totalCases = 0;
    let totalRecoveries = 0;
    let totalDeaths = 0;
   
    if (historicalData && historicalData.timeline) {
        const { timeline } = historicalData;

        Object.values(timeline.cases).forEach((cases) => {
            totalCases += cases;
        });

        Object.values(timeline.recovered).forEach((recovered) => {
            totalRecoveries += recovered;
        });

        Object.values(timeline.deaths).forEach((deaths) => {
            totalDeaths += deaths;
        });
    }
    
    // JSX for rendering the component
      return (
        <div className="container mx-auto py-8">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center">COVID-19 and Population Dashboard</h1>

            {/* Country selection */}
            <div className="flex flex-col items-center mb-8">
                <h2 className="mb-2">ISO code of the country: {selecteCountry.toUpperCase()}</h2>
                {loading && <p>Loading...</p>}
                <select className="border rounded-lg font-semibold px-4 py-2 mb-4" value={selecteCountry} onChange={handleCountry}>
                    <option value="">Select country</option>
                    {country && country.map((countries) => (
                        <option key={countries.cca2} value={countries.cca2.toLowerCase()}>
                            {countries.name.common}
                        </option>
                    ))}
                </select>
            </div>

            {/* Data rectangles section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <DataRectangle label="Total Cases" count={totalCases} color="#9CA8FF" />
                <DataRectangle label="Recoveries" count={totalRecoveries} color="#47D928" />
                <DataRectangle label="Deaths" count={totalDeaths} color="#FF4D57" />
            </div>

            {/* Charts section */}
            <div className="flex flex-col md:flex-row md:justify-between md:space-x-10">
                <div className="w-full md:w-2/4">
                    <h2 className="mb-5 text-center">Line Chart</h2>
                    {historicalData ? <LineChart data={historicalData} /> : <p>Loading historical data...</p>}
                </div>
                <div className="w-full md:w-1/5">
                    <h2 className="mb-5 text-center">Pie Chart</h2>
                    {historicalData ? <PieChart data={historicalData} /> : <p>Loading historical data...</p>}
                </div>
            </div>
        </div>
    );
}    
export default HistoricalData;
