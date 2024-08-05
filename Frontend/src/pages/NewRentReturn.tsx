/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useLazySearchRentOrderByItemQuery } from '../redux/features/rentOrder/rentOrderApiSlice';
import { ApiGetRentOrder } from '../types/rentOrder';

const NewRentReturn = () => {
  const [triggerSearchRentOrder, { data: rentOrderData }] = useLazySearchRentOrderByItemQuery({});
  const [rentItemSearchQuery, setRentItemSearchQuery] = useState('');
  const [rentOrderDetails, setRentOrderDetails] = useState<ApiGetRentOrder>();

  useEffect(() => {
    if (rentOrderData) {
      setRentOrderDetails(rentOrderData);
    }
  }, [rentOrderData]);

  return (
    <div>
      <div className="d-flex flex-column gap-3">
        <div className="row">
          <div className="col-6 d-flex align-items-end gap-2">
            <TextField
              label="Barcode"
              placeholder="Search the product by Barcode"
              value={rentItemSearchQuery}
              onChange={(e) => setRentItemSearchQuery(e.target.value)}
            />
            <button className="icon-button" type="button" aria-label="search_customer" onClick={() => triggerSearchRentOrder(rentItemSearchQuery)}>
              <span>
                <FaSearch />
              </span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-5">
            <div className="card">
              <div className="card-header">
                <h5>Customer Details</h5>
              </div>
              {rentOrderDetails ? (
                <div className="card-body">
                  <p>Customer :{rentOrderDetails?.customer?.name}</p>
                  <p>Rent Date :{format(rentOrderDetails?.rentDate as Date, 'MM/dd/yyyy')}</p>
                  <p>Return Date :{format(rentOrderDetails?.returnDate as Date, 'MM/dd/yyyy')}</p>
                </div>
              ) : (
                <div className="card-body">No data available</div>
              )}
            </div>
          </div>
          <div className="col-5">
            <div className="card">
              <div className="card-header">
                <h5>Product Details</h5>
              </div>
              {rentOrderData ? (
                rentOrderData?.rentOrderDetails?.map((item, index) => (
                  <div key={index} className="card-body">
                    <p>Description:{item.description}</p>
                    <p>Color: {item.color}</p>
                    <p>Size: {item.size}</p>
                    {rentOrderData?.rentOrderDetails?.length > 1 && rentOrderData?.rentOrderDetails?.length - 1 !== index && (
                      <div style={{ borderTop: '1px solid black' }} />
                    )}
                  </div>
                ))
              ) : (
                <div className="card-body">No data Available</div>
              )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-10 d-flex justify-content-end gap-2">
            <button type="button" className="secondary-button">
              Cancel
            </button>
            <button type="button" className="primary-button" disabled={!rentOrderData}>
              Rent Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRentReturn;
