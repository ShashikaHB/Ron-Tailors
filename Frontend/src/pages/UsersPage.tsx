/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { useGetAllUsersQuery } from '../redux/features/user/userApiSlice';
import { User } from '../types/user';
import MemoizedTable from '../components/agGridTable/Table';

const UsersPage = () => {
  const [rowData, setRowData] = useState<User[]>([]);
  const { data: users, isLoading, isError } = useGetAllUsersQuery();

  const defaultColDef: ColDef = {
    flex: 1,
    resizable: true,
  };

  const colDefs: ColDef<User>[] = [
    { headerName: 'User Id', field: 'userId' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'Mobile No', field: 'mobile' },
    { headerName: 'Role', field: 'role' },
    { headerName: 'Active Status', field: 'isActive' },
  ];

  useEffect(() => {
    if (users) {
      setRowData(users);
    }
  }, [users]);

  return (
    <div className="h-100 d-flex flex-column gap-3">
      <div className="d-flex justify-content-end mb-2">
        {/* <button type="button" className="primary-button" onClick={() => handleOpen(null)}>
          + New Material
        </button> */}
      </div>
      <div className="flex-grow-1 overflow-hidden">
        <MemoizedTable<User> rowData={rowData} colDefs={colDefs} defaultColDef={defaultColDef} />
      </div>
    </div>
  );
};

export default UsersPage;
