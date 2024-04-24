import React from "react";

const DataRectangle = ({ label, count, color }) => {
    // Function to format count number
    const formatCount = (count) => {
        // If count is greater than or equal to 1 million, display it in millions with one decimal place
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else {
            // Otherwise, display the count as it is
            return count;
        }
    };

    // Output the formatted count to the console for debugging
    console.log('count', count);

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
