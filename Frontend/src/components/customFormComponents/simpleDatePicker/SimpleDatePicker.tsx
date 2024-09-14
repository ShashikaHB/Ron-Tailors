/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import React, { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type SimpleDatePickerProps = {
  onDateChange: (date: Date | null) => void;
  label: string; // Function prop to pass selected date back to the parent
};

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({ onDateChange, label }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate); // Store the selected date in the state
    onDateChange(newDate); // Pass the selected date to the parent
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={selectedDate}
        onChange={handleDateChange} // Capture the selected date
        slotProps={{ textField: { size: 'small' } }}
      />
    </LocalizationProvider>
  );
};

export default SimpleDatePicker;
