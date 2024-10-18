/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Option } from '../types/common';
import { User } from '../types/user';

const attendanceMarkingRoles = ['Sales Person', 'Altering', 'Ironing', 'Cleaning'];

const getUserRoleBasedOptions = (users: User[], role?: string): Option[] => {
  if (!users || users.length === 0) return [];
  const filteredUsers = role ? users.filter((user) => user.role === role) : users; // If role is empty, return all users
  const options = filteredUsers.map((user) => ({
    value: user.userId,
    label: user.name,
  }));
  return [
    {
      value: 0,
      label: `Select a ${role || 'user'}`,
    },
    ...options,
  ];
};

export const getAttendanceMarkingUsers = (users: User[]): Option[] => {
  if (!users || users.length === 0) return [];

  // Filter users based on whether their role is included in the roles array
  const filteredUsers = users.filter((user) => attendanceMarkingRoles.includes(user.role));

  // Map the filtered users to an array of options
  const options = filteredUsers.map((user) => ({
    value: user.userId,
    label: user.name,
  }));

  return [
    {
      value: 0,
      label: `Select a User`,
    },
    ...options,
  ];
};

export default getUserRoleBasedOptions;
