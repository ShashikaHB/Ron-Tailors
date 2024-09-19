/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { RiCloseLargeLine } from '@remixicon/react';
import { FormControl, Select, MenuItem } from '@mui/material';
import { useState } from 'react';
import { format } from 'date-fns'; // For formatting dates
import SimpleDatePicker from '../../components/customFormComponents/simpleDatePicker/SimpleDatePicker';
import ProductType from '../../enums/ProductType';

const PrintMeasurement = ({ handleClose }) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [itemType, setItemType] = useState<ProductType>(ProductType.Coat); // Track selected item type

  // Handle date change for the start date
  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
  };

  // Handle date change for the end date
  const handleEndDateChange = (date: Date) => {
    setEndDate(date);
  };

  // Handle item type change
  const handleItemTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setItemType(event.target.value as ProductType);
  };

  const handlePrint = () => {
    const formattedStartDate = format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = format(endDate, 'yyyy-MM-dd');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const invoiceUrl = `${baseUrl}/api/v1/invoice/measurements?startDate=${formattedStartDate}&endDate=${formattedEndDate}&itemType=${encodeURIComponent(itemType)}`;
    window.open(invoiceUrl, '_blank');
    handleClose();
  };
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Print Measurements</h5>
          <button aria-label="close-btn" className="icon-button" type="button" onClick={handleClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body d-flex h-100 flex-column gap-3">
          {/* Start Date Picker */}
          <div className="col-4">
            <SimpleDatePicker label="Start Date" onDateChange={handleStartDateChange} />
          </div>

          {/* End Date Picker */}
          <div className="col-4">
            <SimpleDatePicker label="End Date" onDateChange={handleEndDateChange} />
          </div>

          {/* Product Type Dropdown */}
          <FormControl sx={{ minWidth: 200 }} size="small">
            <Select
              value={itemType}
              onChange={handleItemTypeChange}
              displayEmpty
              sx={{
                backgroundColor: 'white',
                color: 'black',
              }}
            >
              <MenuItem value="" disabled>
                Select Item Type
              </MenuItem>
              {Object.values(ProductType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Print Button */}
          <button className="primary-button" type="button" onClick={handlePrint}>
            Print Measurement
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintMeasurement;
