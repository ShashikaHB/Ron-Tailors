/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { useEffect, useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import SimpleDatePicker from '../../customFormComponents/simpleDatePicker/SimpleDatePicker';
import { useUpdateFitOnDataMutation } from '../../../redux/features/orders/orderApiSlice';
import { useAppDispatch } from '../../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../../redux/features/common/commonSlice';

type FitOnRendererProps = {
  data: any;
};

type FitOnData = {
  fitOnNumber: number;
  date: Date;
  isChecked: boolean;
};

const FitOnRenderer = ({ data }: FitOnRendererProps) => {
  const [updateFitOn, { data: responseData, isLoading: updatingFitOn }] = useUpdateFitOnDataMutation();

  const dispatch = useAppDispatch();

  const [fitOnData, setFitOnData] = useState<FitOnData[]>([]);

  // Handle date change for the start date
  const handleDateChange = (date: Date, fitOnNumber: number) => {
    const updatedFitOnData = fitOnData.map((item) => (item.fitOnNumber === fitOnNumber ? { ...item, date } : item));
    setFitOnData(updatedFitOnData);
  };
  const handleCheckBoxChange = async (fitOnNumber: number) => {
    const updatedFitOnData = fitOnData.map((item) => (item.fitOnNumber === fitOnNumber ? { ...item, isChecked: !item.isChecked } : item));

    const fitOnObj = updatedFitOnData.find((item) => item.fitOnNumber === fitOnNumber);
    const response = await updateFitOn({ ...fitOnObj, salesOrderId: data.salesOrderId });

    setFitOnData(updatedFitOnData);
  };

  const handleAddFitOn = async () => {
    setFitOnData((prevData) => [...prevData, { fitOnNumber: Number(data?.fitOnRounds?.length) + 1, date: new Date(), isChecked: false }]);
    const response = await updateFitOn({
      fitOnNumber: Number(data?.fitOnRounds?.length) + 1,
      date: new Date(),
      isChecked: false,
      salesOrderId: data.salesOrderId,
    });
  };

  const handleRemoveFitOn = (fitOnNumber: number) => {
    const updatedFitOnData = fitOnData.filter((item) => item.fitOnNumber !== fitOnNumber);
    setFitOnData(updatedFitOnData);
  };
  useEffect(() => {
    const transFormedData = (data?.fitOnRounds ?? []).map((item: FitOnData) => ({ ...item, date: new Date(item.date) }));
    setFitOnData(transFormedData);
  }, [data?.fitOnRounds]);

  useEffect(() => {
    dispatch(setLoading(updatingFitOn));
  }, [updatingFitOn]);

  return (
    <div>
      <div className="mt-2">
        <button type="button" className="primary-button-sm" onClick={() => handleAddFitOn()}>
          + Add FitOn
        </button>
      </div>
      {fitOnData?.length > 0 &&
        fitOnData.map((item) => {
          return (
            <div key={item.fitOnNumber}>
              <div>FitOn Round: {item.fitOnNumber}</div>
              <div>
                <SimpleDatePicker disabled={item.isChecked} date={item.date} onDateChange={(date) => handleDateChange(date, item.fitOnNumber)} />
              </div>
              <div>
                <FormGroup>
                  <FormControlLabel
                    disabled={item.isChecked}
                    control={<Checkbox checked={item.isChecked} onChange={(e) => handleCheckBoxChange(item.fitOnNumber)} />}
                    label={item.isChecked ? 'Notification Sent' : 'Send Notification'}
                  />
                </FormGroup>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FitOnRenderer;
