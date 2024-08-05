/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useMemo } from 'react';
import { User } from '../types/user';

export const getUserRoleBasedOptions = (users: User[], role: string) => {
  return useMemo(() => {
    if (!users || users.length === 0) return [];
    const filteredUsers = users.filter((user) => user.role === role);
    const options = filteredUsers.map((user) => ({
      value: user.userId,
      label: user.name,
    }));
    return [
      {
        value: 0,
        label: `Select a ${role}`,
      },
      ...options,
    ];
  }, [users, role]);
};
