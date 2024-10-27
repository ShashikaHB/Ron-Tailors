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
import { useAppDispatch } from '../redux/reduxHooks/reduxHooks';
import { setLoading } from '../redux/features/common/commonSlice';

const NewRentReturn = () => {
  const [triggerSearchRentOrder, { data, isLoading: searchRentOrder }] = useLazySearchRentOrderByItemQuery({});
  const [returnRent, { data: rentReturnData, isLoading: rentReturnLoading }] = useRentReturnMutation();
  const [rentItemSearchQuery, setRentItemSearchQuery] = useState('');
  const [rentOrderData, setRentOrderData] = useState(null);

  const dispatch = useAppDispatch();

  const handleReset = () => {
    setRentOrderData(null);
    setRentItemSearchQuery('');
  };

  const handleRentItemSearch = () => {
    if (rentItemSearchQuery.trim()) {
      triggerSearchRentOrder(rentItemSearchQuery);
    }
  };

  const handleRentReturn = async () => {
    try {
      const result = await returnRent(rentItemSearchQuery);
      if (result?.data?.success) {
        toast.success('Rent return successful!');
        handleReset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch(setLoading(searchRentOrder));
  }, [searchRentOrder]);
  useEffect(() => {
    dispatch(setLoading(rentReturnLoading));
  }, [rentReturnLoading]);

  useEffect(() => {
    if (data) {
      setRentOrderData(data);
    } else {
      handleReset();
    }
  }, [data]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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

        {rentOrderData ? (
          <div className="row">
            <div className="col-6">
              <div className="card">
                {(rentOrderData?.rentOrderDetails || [])
                  .filter((item) => item.rentItemId === rentItemSearchQuery)
                  .map((item, index) => (
                    <div key={index} className="card-body">
                      <p className="font-weight-bold">Barcode:&nbsp;{item.rentItemId}</p>
                      <p>Description:&nbsp;{item.description}</p>
                      <p>Color: &nbsp;{item.color}</p>
                      <p>Size: &nbsp;{item.size}</p>
                      <p className="font-weight-bold">
                        {rentOrderData?.stakeOption === StakeOptions.NIC
                          ? `${rentOrderData?.stakeOption} Available - ${rentOrderData?.nicNumber}`
                          : `${rentOrderData?.stakeOption} - ${rentOrderData?.stakeAmount}`}
                      </p>
                    </div>
                  ))}
              </div>
              <h5 className="mt-3 d-flex justify-content-center font-weight-bold">Order Balance - {rentOrderData?.balance}</h5>
              <div className="row mt-3">
                <div className="col-12 d-flex justify-content-end gap-2">
                  <button type="button" className="secondary-button">
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    disabled={!rentOrderData || rentOrderData.orderStatus === 'Completed'}
                    onClick={handleRentReturn}
                  >
                    Rent Return
                  </button>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="card mb-4">
                {rentOrderData && (
                  <div className="card-body">
                    <p>Rent Order :&nbsp;{rentOrderData?.rentOrderId}</p>
                    <p>Customer :&nbsp;{rentOrderData?.customer?.name}</p>
                    <p>Rent Date :&nbsp;{format(rentOrderData?.rentDate, 'MM/dd/yyyy')}</p>
                    <p>Return Date :&nbsp;{format(rentOrderData?.returnDate, 'MM/dd/yyyy')}</p>
                  </div>
                )}
              </div>
              <div className="card">
                {rentOrderData?.rentOrderDetails?.map((item, index) => {
                  const statusStyle = {
                    fontWeight: 'bold',
                    color: item.status === 'Available' ? 'green' : 'red',
                  };
                  return (
                    <div key={index} className="card-body">
                      <div className="d-flex">
                        <p>{item.rentItemId}&nbsp;|&nbsp;</p>
                        <p style={statusStyle}>{item.status}</p>
                      </div>
                      <p className="rent-item-detail">{item.description}</p>
                      <div className="d-flex gap-2 font-weight-bold">
                        <p className="rent-item-detail">Color:&nbsp;{item.color}&nbsp;|</p>
                        <p className="rent-item-detail">Size:&nbsp;{item.size}&nbsp;|</p>
                        <p className="rent-item-detail">Hand Length:&nbsp;{item.handLength}</p>
                      </div>
                      <p className="rent-item-detail pb-2">
                        Notes:&nbsp;
                        {item.notes}
                      </p>
                      {rentOrderData?.rentOrderDetails?.length > 1 && rentOrderData?.rentOrderDetails?.length - 1 !== index && (
                        <div style={{ borderTop: '1px solid black' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center card" style={{ height: '50vh' }}>
            <h5>No data available</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewRentReturn;
