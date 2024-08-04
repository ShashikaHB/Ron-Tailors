/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useLazySearchRentOrderByItemQuery } from '../redux/features/rentout/rentOutApiSlice';
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
      <div>
        <TextField
          label="Barcode"
          placeholder="Search the product by Barcode"
          value={rentItemSearchQuery}
          onChange={(e) => setRentItemSearchQuery(e.target.value)}
        />
        <button type="button" aria-label="search_customer" onClick={() => triggerSearchRentOrder(rentItemSearchQuery)}>
          <span>
            <FaSearch />
          </span>
        </button>
        <br />
        <div>
          <h2>Customer Details</h2>
          <p>Customer : Mr.Isuru</p>
          <p>Rent Date : 2024-08-02</p>
          <p>Return Date : 2024-08-03</p>
        </div>
        <div>
          <h2>Product Details</h2>
          <p>Description: SB/1 Bt/Normal</p>
          <p>Color: Check Brown</p>
          <p>Size: 36</p>
        </div>
        <div className="d-flex">
          <button type="button" className="secondary-btn">
            Cancel
          </button>
          <button type="button" className="primary-btn">
            Rent Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewRentReturn;
