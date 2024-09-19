/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { FormControl, Select, MenuItem } from '@mui/material';
import { RiCloseLargeLine } from '@remixicon/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { allUsers } from '../../redux/features/auth/authSlice';
import { getAttendanceMarkingUsers } from '../../utils/userUtils';
import { useMarkAttendanceMutation } from '../../redux/features/user/userApiSlice';
import { setLoading } from '../../redux/features/common/commonSlice';

type MarkAttendanceProps = {
  handleClose: () => void;
};

const MarkAttendance = ({ handleClose }: MarkAttendanceProps) => {
  const dispatch = useAppDispatch();

  const [selectedUser, setSelectedUser] = useState<any>(0);

  const [markAttendance, { data, isLoading }] = useMarkAttendanceMutation();

  const users = useAppSelector(allUsers);

  const userOptions = getAttendanceMarkingUsers(users);

  const handleMarkAttendance = async () => {
    const response = await markAttendance({ userId: selectedUser, date: new Date() });

    if (response.data.success) {
      toast.success('Attendance Recorded');
      handleClose();
    }
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Mark Employee Attendance</h5>
          <button type="button" aria-label="close-btn" className="icon-button" onClick={handleClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body d-flex">
          <div>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                displayEmpty
                sx={{
                  backgroundColor: 'white',
                  color: 'black',
                }}
              >
                {userOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} disabled={!option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <button className="primary-button mx-2" type="button" onClick={handleMarkAttendance} disabled={selectedUser === 0}>
              Mark Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
