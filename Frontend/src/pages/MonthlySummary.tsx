/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { ColDef } from 'ag-grid-community';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import MemoizedTable from '../components/agGridTable/Table';
import { useGetAllMonthlySummaryQuery } from '../redux/features/user/userApiSlice';
import { User } from '../types/user';
import WorkDataRenderer from '../components/agGridTable/customComponents/WorkDataRenderer';
import SimpleDatePicker from '../components/customFormComponents/simpleDatePicker/SimpleDatePicker';
import { useAppDispatch } from '../redux/reduxHooks/reduxHooks';
import { setLoading } from '../redux/features/common/commonSlice';

const MonthlySummary = () => {
  const [rowData, setRowData] = useState<any>([]);
  const [selectedMonth, setSelectedMonth] = useState<any>(format(new Date(), 'yyyy-MM'));
  const { data: monthlySummaryData, isLoading, isError } = useGetAllMonthlySummaryQuery(selectedMonth);

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };

  const colDefs: ColDef<any>[] = [
    { headerName: 'Name', field: 'user.name' },
    { headerName: 'Role', field: 'user.role' },
    { headerName: 'Work In Month', cellRenderer: WorkDataRenderer, autoHeight: true },
    { headerName: 'Days Worked', field: 'daysWorked' },
    { headerName: 'Salary', field: 'totalSalary' },
    { headerName: 'Bonus', field: 'bonus' },
  ];

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  useEffect(() => {
    if (monthlySummaryData) {
      setRowData(monthlySummaryData);
    }
  }, [monthlySummaryData]);

  const handleMonthSelect = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM'); // Format the date as 'YYYY-MM'
    setSelectedMonth(formattedDate);
  };

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="col-2">
        <SimpleDatePicker views={['month', 'year']} label="Select Month" onDateChange={handleMonthSelect} />
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <MemoizedTable<User> rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
    </div>
  );
};

export default MonthlySummary;
