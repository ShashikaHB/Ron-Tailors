/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ICellRendererParams } from 'ag-grid-community';
import { toast } from 'sonner';
import { CircularProgress, FormControl, MenuItem, Select } from '@mui/material';
import { useUpdateProductStatusMutation } from '../../../redux/features/product/productApiSlice';
import { statusOptions } from '../../../consts/products';
import { getStatusColor } from '../../../utils/productUtils';

const SalesOrderDetailsRenderer = (props: ICellRendererParams) => {
  const { orderDetails } = props?.data ?? '';

  const [updateStatus, { data: updateStatusData, isLoading: loading }] = useUpdateProductStatusMutation();

  // Function to handle status change
  const handleStatusChange = async (productId: number, newStatus: string) => {
    try {
      updateStatus({ status: newStatus, productId }).then((res) => {
        if (res.success) {
          toast.success(`Status updated to ${newStatus}`);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {orderDetails?.map((order: any, index: number) => {
        const { products, description } = order;
        return (
          <div key={index}>
            <div>Description: {description}</div>
            {products?.map((product: any) => {
              const { productId, status, type } = product;
              const handleChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
                const newStatus = event.target.value as string;
                await handleStatusChange(productId, newStatus);
              };
              return (
                <div className="d-flex gap-2 mx-3" key={productId}>
                  <p>{type}</p>
                  <FormControl sx={{ m: 1, maxWidth: 165 }} size="small">
                    <Select
                      value={status}
                      onChange={handleChange}
                      disabled={loading}
                      sx={{
                        backgroundColor: getStatusColor(status),
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
                  {loading && <CircularProgress size={24} />}
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
