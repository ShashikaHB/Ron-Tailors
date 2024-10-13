/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import { FormControl, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useUpdateProductStatusMutation } from '../../../redux/features/product/productApiSlice';
import { statusOptions } from '../../../consts/products';
import { getStatusColor } from '../../../utils/productUtils';
import { useAppDispatch } from '../../../redux/reduxHooks/reduxHooks';
import { setLoading, setProductId } from '../../../redux/features/common/commonSlice';
import { ProductCategory } from '../../../enums/ProductType';

type SalesOrderDetailsRendererProps = {
  data: any;
  handleOpenMeasurement: (id: number) => void;
  handleOpenProductEdit: (id: number) => void;
};

const SalesOrderDetailsRenderer = ({ data, handleOpenMeasurement, handleOpenProductEdit }: SalesOrderDetailsRendererProps) => {
  const { orderDetails } = data ?? '';

  const [updateStatus, { isLoading: updatingOrderDetails }] = useUpdateProductStatusMutation();
  const dispatch = useAppDispatch();

  // Initialize a state to store product statuses
  const [productStatuses, setProductStatuses] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    dispatch(setLoading(updatingOrderDetails));
  }, [updatingOrderDetails]);

  // Populate initial statuses when data changes
  useEffect(() => {
    const initialStatuses: { [key: number]: string } = {};
    orderDetails?.forEach((order: any) => {
      order.products.forEach((product: any) => {
        initialStatuses[product.productId] = product.status;
      });
    });
    setProductStatuses(initialStatuses); // Set the initial statuses
  }, [orderDetails]);

  // Function to handle status change
  const handleStatusChange = async (productId: number, newStatus: string) => {
    try {
      const response = await updateStatus({ status: newStatus, productId }).unwrap();
      if (response.success) {
        toast.success(`Status updated to ${newStatus}`);
        setProductStatuses((prevStatuses) => ({
          ...prevStatuses,
          [productId]: newStatus, // Update local state
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {orderDetails?.map((order: any, index: number) => {
        const { products, description, category } = order;
        return (
          <div key={index}>
            <div>
              Description: {description}: {category !== ProductCategory.General && `(${category})`}
            </div>
            {products?.map((product: any) => {
              const { productId, itemType } = product;
              const productStatus = productStatuses[productId] || ''; // Retrieve the status from the local state

              const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
                const newStatus = event.target.value as string;
                await handleStatusChange(productId, newStatus); // Update status for this product only
              };

              return (
                <div className="d-flex gap-2 mx-3" key={productId}>
                  <p>{itemType}</p>
                  {/* <button
                    type="button"
                    aria-label="measurement-btn"
                    className="icon-button"
                    onClick={() => {
                      handleOpenMeasurement(productId);
                      dispatch(setProductId(productId));
                    }}
                  >
                    M
                  </button> */}
                  <button
                    type="button"
                    aria-label="edit-btn"
                    className="icon-button"
                    onClick={() => {
                      handleOpenProductEdit(productId);
                      dispatch(setProductId(productId));
                    }}
                  >
                    P
                  </button>
                  <FormControl sx={{ m: 1, maxWidth: 165 }} size="small">
                    <Select
                      value={productStatus}
                      onChange={handleChange}
                      sx={{
                        backgroundColor: getStatusColor(productStatus),
                        color: 'black',
                      }}
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              );
            })}
            {index !== orderDetails.length - 1 && <div style={{ borderTop: '1.25px solid black', margin: '10px 0' }} />}
          </div>
        );
      })}
    </div>
  );
};

export default SalesOrderDetailsRenderer;
