/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { RiCloseLargeLine } from '@remixicon/react';
// For formatting dates

const PrintShopBill = ({ handleClose, id }) => {
  const handlePrint = (isCustomerBill: boolean) => {
    let invoiceUrl;
    const baseUrl = import.meta.env.VITE_BASE_URL;

    if (isCustomerBill) {
      invoiceUrl = `${baseUrl}/api/v1/invoice/rentOrder/customer/${id}`;
    } else {
      invoiceUrl = `${baseUrl}/api/v1/invoice/rentOrder/shop/${id}`;
    }
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
        <div className="modal-body d-flex h-100 gap-1">
          {/* Start Date Picker */}
          <div className="col-6">
            <button className="primary-button" type="button" onClick={() => handlePrint(true)}>
              Customer Bill
            </button>
          </div>

          {/* End Date Picker */}
          <div className="col-6">
            <button className="primary-button" type="button" onClick={() => handlePrint(false)}>
              Shop Bill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintShopBill;
