import { useMemo } from "react";
import { User } from "../types/user";

export const useRoleBasedOptions = (users: User[], role: string) => {
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
