/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useCallback, useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { DevTool } from '@hookform/devtools';
import { Modal } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetAllUsersQuery } from '../redux/features/user/userApiSlice';
import { User } from '../types/user';
import MemoizedTable from '../components/agGridTable/Table';
import SalaryGradeRenderer from '../components/agGridTable/customComponents/SalaryGradeRenderer';
import { defaultUserRegValues, userRegistrationSchema, UserRegistrationSchema } from '../forms/formSchemas/userRegistrationSchema';
import AddUserForm from '../forms/userAdd/AddUserForm';
import MarkAttendance from '../forms/markAttendance/MarkAttendance';

const UsersPage = () => {
  const [rowData, setRowData] = useState<User[]>([]);
  const { data: users, isLoading, isError } = useGetAllUsersQuery();
  const [open, setOpen] = useState(false);
  const [openAttendance, setOpenAttendance] = useState(false);

  const methods = useForm<UserRegistrationSchema>({
    mode: 'all',
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: defaultUserRegValues,
  });

  const handleOpen = useCallback((materialId: number | null) => {
    setOpen(true);
  }, []);
  const handleOpenAttendance = useCallback(() => {
    setOpenAttendance(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);
  const handleCloseAttendance = useCallback(() => setOpenAttendance(false), []);

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };

  const colDefs: ColDef<User>[] = [
    { headerName: 'User Id', field: 'userId' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Mobile No', field: 'mobile' },
    { headerName: 'Role', field: 'role' },
    { headerName: 'Salary Grade', field: 'salaryGrade', cellRenderer: SalaryGradeRenderer },
  ];

  useEffect(() => {
    if (users) {
      setRowData(users);
    }
  }, [users]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex justify-content-end mb-2 gap-2">
        <button type="button" className="primary-button" onClick={() => handleOpen(null)}>
          + New User
        </button>
        <button type="button" className="primary-button" onClick={() => handleOpenAttendance(null)}>
          Mark attendance
        </button>
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <MemoizedTable<User> rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <FormProvider {...methods}>
            <div>
              <AddUserForm handleClose={handleClose} />
              <DevTool control={methods.control} />
            </div>
          </FormProvider>
        </div>
      </Modal>
      <Modal open={openAttendance} onClose={handleCloseAttendance} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <div>
          <MarkAttendance handleClose={handleCloseAttendance} />
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
