import React from "react";

const DataRectangle = ({ label, count, color }) => {
    // Function to format the count based on its value
    const formatCount = (count) => {
        // Check if count is greater than or equal to 1000000 (1 million)
        if (count >= 1000000) {
            // If count is greater than or equal to 1 million, format it in millions with one decimal place
            return `${(count / 1000000).toFixed(1)}M`;
        } else {
            // If count is less than 1 million, return it as is
            return count;
        }
    };

    // Log the count to the console for debugging
    console.log(count);

    // Render the data rectangle with label, count, and background color
    return (
        <div className="rounded-lg flex justify-between shadow-md" style={{ backgroundColor: color }}>
            {/* Display the label */}
            <p className="ml-2 text-2xl font-semibold text-black-800">{label}:</p>
            {/* Display the formatted count */}
            <div className="ml-2 pl-2 bg-white p-1 rounded">
                <p className="text-2xl font-bold text-black-600">{formatCount(count)}</p>
            </div>
        </div>
    );
};

export default DataRectangle;
