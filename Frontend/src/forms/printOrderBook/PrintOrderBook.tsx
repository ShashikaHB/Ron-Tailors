/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { RiCloseLargeLine } from '@remixicon/react';
import { useState } from 'react';
import { format } from 'date-fns'; // For formatting dates
import SimpleDatePicker from '../../components/customFormComponents/simpleDatePicker/SimpleDatePicker';

const PrintOrderBook = ({ handleClose }) => {
  const [date, setDate] = useState<Date>(new Date());

  // Handle date change for the start date
  const handleDateSelection = (deliveryDate: Date) => {
    setDate(deliveryDate);
  };

  const handlePrint = () => {
    const formattedDeliveryDate = format(date, 'yyyy-MM-dd');
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const invoiceUrl = `${baseUrl}/api/v1/invoice/orderBook?date=${formattedDeliveryDate}`;
    window.open(invoiceUrl, '_blank');
    handleClose();
  };
  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Print Order Book</h5>
          <button aria-label="close-btn" className="icon-button" type="button" onClick={handleClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body d-flex h-100 flex-column gap-3">
          {/* Start Date Picker */}
          <div className="col-4">
            <SimpleDatePicker label="Delivery Date" onDateChange={handleDateSelection} />
          </div>

          {/* Print Button */}
          <button className="primary-button" type="button" onClick={handlePrint}>
            Print Order Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintOrderBook;
