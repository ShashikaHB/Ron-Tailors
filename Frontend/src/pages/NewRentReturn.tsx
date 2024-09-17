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
import { toast } from 'sonner';
import { useLazySearchRentOrderByItemQuery, useRentReturnMutation } from '../redux/features/rentOrder/rentOrderApiSlice';
import StakeOptions from '../enums/StakeOptions';

const NewRentReturn = () => {
  const [triggerSearchRentOrder, { data }] = useLazySearchRentOrderByItemQuery({});
  const [returnRent, { data: rentReturnData }] = useRentReturnMutation();
  const [rentItemSearchQuery, setRentItemSearchQuery] = useState('');
  const [rentOrderDetails, setRentOrderDetails] = useState(null);

  const handleReset = () => {
    setRentOrderDetails(null);
    setRentItemSearchQuery('');
  };

  const handleRentItemSearch = () => {
    if (rentItemSearchQuery.trim()) {
      triggerSearchRentOrder(rentItemSearchQuery);
    }
  };

  const handleRentReturn = async () => {
    try {
      const result = await returnRent(data.rentOrder?.rentOrderId as string);
      if (result?.data?.success) {
        toast.success('Rent return successful!');
        handleReset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data?.rentOrder) {
      setRentOrderDetails(data?.rentOrder);
    } else {
      handleReset();
    }
  }, [data]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleRentItemSearch();
    }
  };

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
              onKeyDown={handleKeyPress}
            />
            <button className="icon-button" type="button" aria-label="search_customer" onClick={handleRentItemSearch}>
              <span>
                <FaSearch />
              </span>
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <div className="card">
              <div className="card-header">
                <h5>Product Details</h5>
              </div>
              {rentOrderDetails ? (
                rentOrderDetails?.rentOrderDetails?.map((item, index) => (
                  <div key={index} className="card-body">
                    <p>Item Id:&nbsp;{item.rentItemId}</p>
                    <p>Description:&nbsp;{item.description}</p>
                    <p>Color: &nbsp;{item.color}</p>
                    <p>Size: &nbsp;{item.size}</p>
                    <p>
                      Stake Option: &nbsp;
                      {rentOrderDetails.stakeOption === StakeOptions.NIC
                        ? rentOrderDetails.stakeOption
                        : `${rentOrderDetails.stakeOption} - ${rentOrderDetails.stakeAmount}`}
                    </p>
                    {rentOrderDetails?.rentOrderDetails?.length > 1 && rentOrderDetails?.rentOrderDetails?.length - 1 !== index && (
                      <div style={{ borderTop: '1px solid black' }} />
                    )}
                  </div>
                ))
              ) : (
                <div className="card-body">No data Available</div>
              )}
            </div>
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-end gap-2">
                <button type="button" className="secondary-button">
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-button"
                  disabled={!rentOrderDetails || rentOrderDetails.orderStatus === 'Completed'}
                  onClick={handleRentReturn}
                >
                  Rent Return
                </button>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card">
              <div className="card-header">
                <h5>Customer Details</h5>
              </div>
              {rentOrderDetails ? (
                <div className="card-body">
                  <p>Customer :&nbsp;{rentOrderDetails?.customer?.name}</p>
                  <p>Rent Date :&nbsp;{format(rentOrderDetails?.rentDate as Date, 'MM/dd/yyyy')}</p>
                  <p>Return Date :&nbsp;{format(rentOrderDetails?.returnDate as Date, 'MM/dd/yyyy')}</p>
                  <br />
                </div>
              ) : (
                <div className="card-body">No data available</div>
              )}
            </div>
          </div>
        </div>
        {data?.relatedItems?.length > 0 && (
          <div className="row">
            <div className="col-10">
              <div className="card">
                <div className="card-header">
                  <h5>Other Rented Items</h5>
                </div>
                <div className="card-body">
                  {data.relatedItems.map((relatedItem, index) => (
                    <div key={index}>
                      <p>Item Id:&nbsp;{relatedItem.rentItemId}</p>
                      <p>Description:&nbsp;{relatedItem.description}</p>
                      <p>Color: &nbsp;{relatedItem.color}</p>
                      <p>Size: &nbsp;{relatedItem.size}</p>
                      {relatedItem !== data.relatedItems[data.relatedItems.length - 1] && (
                        <div style={{ borderTop: '1px solid black', marginBottom: '10px' }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRentReturn;
