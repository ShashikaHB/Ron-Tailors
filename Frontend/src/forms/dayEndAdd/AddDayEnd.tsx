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
import {
  useAddCustomTransactionCategoryMutation,
  useGetSingleDayEndRecordsQuery,
  useUpdateCashInHandMutation,
} from '../../redux/features/transaction/transactionApiSlice';
import SimpleDatePicker from '../../components/customFormComponents/simpleDatePicker/SimpleDatePicker';
import stores from '../../consts/stores';
import Stores from '../../enums/Stores';

type AddDayEndProps = {
  handleClose: () => void;
};

const AddDayEnd = ({ handleClose }: AddDayEndProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedStore, setSelectedStore] = useState<any>(Stores.Kegalle);
  const [countedCash, setCountedCash] = useState<any>(0);

  const { data: dailySummaryData, isLoading } = useGetSingleDayEndRecordsQuery({ selectedDate, selectedStore });

  const [addDayEnd] = useUpdateCashInHandMutation();

  const [addTransactionCategory] = useAddCustomTransactionCategoryMutation();

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
    }
  };

  useEffect(() => {
    setCountedCash(dailySummaryData?.countedCash);
  }, [dailySummaryData]);

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add Day End</h5>
          <button type="button" aria-label="close-btn" className="icon-button" onClick={handleFormClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div>
            <div className="inputGroup">
              <SimpleDatePicker label="From Date" onDateChange={handleDateChange} />
            </div>
            <div>
              <FormControl sx={{ m: 1, maxWidth: 165 }} size="small">
                <Select value={selectedStore} onChange={handleStoreChange}>
                  {stores.map((option) => (
                    <MenuItem key={option.value} value={option.value} disabled={!option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField label="Total Income" value={dailySummaryData?.totalIncome} disabled />
              <TextField label="Total Expense" value={dailySummaryData?.totalExpense} disabled />
              <TextField label="Cash Income" value={dailySummaryData?.cashIncome} disabled />
              <TextField label="Cash In Hand" value={dailySummaryData?.cashInHand} disabled />
              <TextField label="Difference" value={dailySummaryData?.cashInHand} disabled />
              <TextField label="Counted Cash" value={countedCash} onChange={(e) => setCountedCash(e?.target.value)} />
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
