import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangeSelector = ({ startDate, endDate, onDateRangeChange }) => {
    // State variables for selected start and end dates
    const [selectedStartDate, setSelectedStartDate] = useState(startDate);
    const [selectedEndDate, setSelectedEndDate] = useState(endDate);

    // Handler function for start date change
    const handleStartDateChange = (date) => {
        setSelectedStartDate(date); // Update selected start date
        onDateRangeChange(date, selectedEndDate); // Call parent function with updated start date and current end date
    };

    // Handler function for end date change
    const handleEndDateChange = (date) => {
        setSelectedEndDate(date); // Update selected end date
        onDateRangeChange(selectedStartDate, date); // Call parent function with current start date and updated end date
    };

    return (
        <div>
            {/* Date picker for selecting start date */}
            <DatePicker
                selected={selectedStartDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                placeholderText="Start Date"
            />
            {/* Date picker for selecting end date */}
            <DatePicker
                selected={selectedEndDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                placeholderText="End Date"
                minDate={selectedStartDate} // Minimum selectable date is the selected start date
            />
        </div>
    );
};

export default DateRangeSelector;
