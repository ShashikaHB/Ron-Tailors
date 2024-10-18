/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { TextField } from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { RiCloseLargeLine } from '@remixicon/react';
import { toast } from 'sonner';
import { RentItemDetailTypes } from '../../enums/RentItemDetails';
import { useLazySearchRentItemQuery } from '../../redux/features/product/productApiSlice';
import { RentItemDetails } from '../../types/rentItem';
import ProductType from '../../enums/ProductType';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../redux/features/common/commonSlice';
import { selectedRentItemId } from '../../redux/features/orders/orderSlice';

const initialRentItemDetails: RentItemDetails = {
  rentItemId: 0,
  color: '',
  size: undefined,
  description: '',
  handLength: '',
  notes: '',
  itemType: ProductType.Coat,
};

type SelectRentItemProps = {
  handleClose: () => void;
  onRentItemSelection: (rentItemId, rentData) => void;
};

const SelectRentItem = ({ handleClose, onRentItemSelection }: SelectRentItemProps) => {
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [rentItemDetails, setRentItemDetails] = useState<RentItemDetails>(initialRentItemDetails);

  const dispatch = useAppDispatch();

  const storedRentItemId = useAppSelector(selectedRentItemId);

  const [triggerProductSearch, { data: rentItem, isLoading: rentItemLoading }] = useLazySearchRentItemQuery();

  const handleSearchProduct = () => {
    triggerProductSearch(productSearchQuery);
  };

  useEffect(() => {
    dispatch(setLoading(rentItemLoading));
  }, [rentItemLoading]);

  useEffect(() => {
    if (rentItem) {
      setRentItemDetails((prevDetails) => ({
        ...prevDetails,
        description: rentItem.description,
        color: rentItem.color,
        size: rentItem.size,
        itemType: rentItem.itemType,
        rentItemId: rentItem.rentItemId,
        amount: 0,
      }));
    }
  }, [rentItem]);

  const handleRentItemAdd = () => {
    // setRowData((prev) => [...prev, rentItemDetails]);
    onRentItemSelection(storedRentItemId, rentItemDetails);
    setRentItemDetails(initialRentItemDetails);
    setProductSearchQuery('');
    handleClose();
  };

  const handleKeyPressProductSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleSearchProduct();
    }
  };

  const handleKeyPressAddItem = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      handleRentItemAdd();
    }
  };

  const handleRentItemDetailsChange = (key: string, value: string | number) => {
    switch (key) {
      case RentItemDetailTypes.handLength:
        setRentItemDetails((prevDetails) => ({ ...prevDetails, handLength: value as string }));
        break;
      case RentItemDetailTypes.notes:
        setRentItemDetails((prevDetails) => ({ ...prevDetails, notes: value as string }));
        break;
      case RentItemDetailTypes.amount:
        setRentItemDetails((prevDetails) => ({ ...prevDetails, amount: value as number }));
        break;
      default:
        toast.error(`No key found for ${key} in Rent item details`);
        break;
    }
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target instanceof HTMLInputElement) {
      const value = event.target.valueAsNumber;
      handleRentItemDetailsChange(RentItemDetailTypes.amount, value);
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Select Rent Item</h5>
          <button aria-label="close-btn" className="icon-button" type="button" onClick={handleClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-12 d-flex gap-2 mb-3 align-items-end">
              <TextField
                label="Search Product"
                placeholder="Search the product by barcode"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                onKeyDown={handleKeyPressProductSearch}
              />
              <button className="icon-button" type="button" aria-label="search_product" onClick={() => handleSearchProduct()}>
                <span>
                  <FaSearch />
                </span>
              </button>
            </div>
            <div className="col-12 mb-3 d-flex">
              <div className="row gap-2 mx-0 g-0">
                <div className="col">
                  <TextField label="Color" value={rentItemDetails.color} inputProps={{ readOnly: true }} />
                </div>
                <div className="col">
                  <TextField label="Size" type="number" value={rentItemDetails.size ?? ''} inputProps={{ readOnly: true }} />
                </div>
                <div className="col">
                  <TextField label="Description" value={rentItemDetails.description} inputProps={{ readOnly: true }} />
                </div>
                <div className="col">
                  <TextField
                    label="Hand length"
                    value={rentItemDetails.handLength}
                    onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.handLength, e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-12 mb-3 d-flex gap-4">
              <div className="row gap-2 mx-0 g-0 w-100">
                <div className="col-12">
                  <TextField
                    className="w-100"
                    label="Notes"
                    value={rentItemDetails.notes}
                    onChange={(e) => handleRentItemDetailsChange(RentItemDetailTypes.notes, e.target.value)}
                    onKeyDown={handleKeyPressAddItem}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <button
              className="secondary-button mx-2"
              type="button"
              onClick={() => {
                setRentItemDetails(initialRentItemDetails);
              }}
            >
              Clear
            </button>
            <button className="primary-button" type="button" onClick={handleRentItemAdd}>
              Save Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRentItem;
