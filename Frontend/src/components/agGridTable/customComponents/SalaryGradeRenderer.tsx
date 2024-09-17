/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useState } from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import { toast } from 'sonner';
import salaryGradeOptions, { restrictedRoles } from '../../../consts/salary';
import { useUpdateUserSalaryGradeMutation } from '../../../redux/features/user/userApiSlice';

type SalaryGradeRendererProps = {
  data: any;
};

const SalaryGradeRenderer = ({ data }: SalaryGradeRendererProps) => {
  const { userId, role, salaryGrade } = data; // Extract relevant fields from row data
  const [grade, setGrade] = useState(salaryGrade || '');
  const [updateSalaryGrade] = useUpdateUserSalaryGradeMutation();

  //   const handleSalaryGradeChange = () => {};

  // Function to handle salary grade change
  const handleSalaryGradeChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newGrade = event.target.value as string;
    setGrade(newGrade);

    // Check if the role allows salary grade changes
    if (restrictedRoles.includes(role)) {
      toast.error(`Cannot update salary grade for role: ${role}`);
    }

    // Trigger the update only if a valid grade is selected
    if (newGrade) {
      try {
        const response = await updateSalaryGrade({ userId, salaryGrade: newGrade }).unwrap();
        if (response) {
          toast.success(`Salary grade updated to ${newGrade}`);
        }
      } catch (error) {
        console.error(error);
        toast.error('Error updating salary grade');
      }
    }
  };

  return (
    <div>
      {restrictedRoles.includes(role) ? (
        <p style={{ color: 'gray' }}>N/A</p>
      ) : (
        <FormControl sx={{ minWidth: 120 }} size="small">
          <Select
            value={grade}
            onChange={handleSalaryGradeChange}
            displayEmpty
            sx={{
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            {salaryGradeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value} disabled={!option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
};

export default SalaryGradeRenderer;
