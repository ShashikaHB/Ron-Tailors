/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useLazySearchRentOrderByItemQuery } from '../redux/features/rentOrder/rentOrderApiSlice';
import { ApiGetRentOrder } from '../types/rentOrder';

const NewRentReturn = () => {
  const [triggerSearchRentOrder, { data: rentOrderData }] = useLazySearchRentOrderByItemQuery();
  const [rentItemSearchQuery, setRentItemSearchQuery] = useState('');
  const [rentOrderDetails, setRentOrderDetails] = useState<ApiGetRentOrder>();

  useEffect(() => {
    if (rentOrderData) {
      setRentOrderDetails(rentOrderData);
    }
  }, [rentOrderData]);

  return (
    <div>
      <div className='d-flex flex-column gap-3'>
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
              <div className="card-body">
                <p>Customer : Mr.Isuru</p>
                <p>Rent Date : 2024-08-02</p>
                <p>Return Date : 2024-08-03</p>
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="card">
              <div className="card-header">
                <h5>Product Details</h5>
              </div>
              <div className="card-body">
                <p>Description: SB/1 Bt/Normal</p>
                <p>Color: Check Brown</p>
                <p>Size: 36</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-10 d-flex justify-content-end gap-2">
            <button type="button" className="secondary-button">
              Cancel
            </button>
            <button type="button" className="primary-button">
              Rent Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRentReturn;
