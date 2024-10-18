/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { RiCloseLargeLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FormControl, MenuItem, Select, TextField } from '@mui/material';
import { useGetSingleDayEndRecordsQuery, useUpdateCashInHandMutation } from '../../redux/features/transaction/transactionApiSlice';
import SimpleDatePicker from '../../components/customFormComponents/simpleDatePicker/SimpleDatePicker';
import stores from '../../consts/stores';
import Stores from '../../enums/Stores';
import { useAppDispatch } from '../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../redux/features/common/commonSlice';

type AddDayEndProps = {
  handleClose: () => void;
};

const AddDayEnd = ({ handleClose }: AddDayEndProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedStore, setSelectedStore] = useState<any>(Stores.Kegalle);
  const [countedCash, setCountedCash] = useState<any>(0);

  const dispatch = useAppDispatch();

  const { data: dailySummaryData, isLoading: loadingDayRecord } = useGetSingleDayEndRecordsQuery({ selectedDate, selectedStore });

  const [addDayEnd, { isLoading: dayEndLoading }] = useUpdateCashInHandMutation();

  const handleStoreChange = (event: any) => {
    setSelectedStore(event.target.value as string);
  };

  const handleFormClose = (): void => {
    handleClose();
  };

  const handleClear = (): void => {};

  const handleDateChange = (date: Date) => {
    setSelectedDate(date); // Trigger a new fetch when the fromDate changes
  };

  const handleCashInHandUpdate = async () => {
    const response = await addDayEnd({ date: selectedDate, countedCash, store: selectedStore });

    if (response) {
      toast.success('Daily summary updated successfully!');
      dispatch(setLoading(false));
      handleClose();
    }
  };

  useEffect(() => {
    dispatch(setLoading(loadingDayRecord));
  }, [loadingDayRecord]);
  useEffect(() => {
    dispatch(setLoading(dayEndLoading));
  }, [dayEndLoading]);

  useEffect(() => {
    setCountedCash(dailySummaryData?.countedCash);
  }, [dailySummaryData]);

  return (
    <div className="modal-dialog modal-dialog-centered add-day-end-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add Day End</h5>
          <button type="button" aria-label="close-btn" className="icon-button" onClick={handleFormClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="d-flex flex-column gap-3">
            <div className="inputGroup">
              <SimpleDatePicker label="From Date" onDateChange={handleDateChange} />
            </div>
            <div className="row">
              <div className="col-12">
                <FormControl size="small">
                  <Select value={selectedStore} onChange={handleStoreChange}>
                    {stores.map((option) => (
                      <MenuItem key={option.value} value={option.value} disabled={!option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="row g-0 gap-2">
              <div className="col">
                <TextField label="Total Income" value={dailySummaryData?.totalIncome} disabled />
              </div>
              <div className="col">
                <TextField label="Total Expense" value={dailySummaryData?.totalExpense} disabled />
              </div>
            </div>
            <div className="row g-0 gap-2">
              <div className="col">
                <TextField label="Cash Income" value={dailySummaryData?.cashIncome} disabled />
              </div>
              <div className="col">
                <TextField label="Cash In Hand" value={dailySummaryData?.cashInHand} disabled />
              </div>
            </div>
            <div className="row g-0 gap-2">
              <div className="col">
                <TextField label="Difference" value={dailySummaryData?.cashInHand} disabled />
              </div>
              <div className="col">
                <TextField label="Counted Cash" value={countedCash} onChange={(e) => setCountedCash(e?.target.value)} />
              </div>
            </div>
            <div className="modal-footer mt-3">
              <button className="primary-button" type="button" onClick={handleCashInHandUpdate}>
                Process Day End
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDayEnd;
