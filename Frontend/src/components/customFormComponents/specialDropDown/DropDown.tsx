/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

type DropdownOption = {
  label: string; // Text displayed to the user
  value: string | number; // Value returned on selection
};

type DropdownProps = {
  label: string; // Label for the dropdown
  options: DropdownOption[]; // List of options
  value: string | number; // Currently selected value
  onChange: (event: React.ChangeEvent<{ value: unknown }>) => void; // Change handler
  placeholder?: string; // Optional placeholder
  size?: 'small' | 'medium'; // Optional size
  sx?: object; // Optional styles
};

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange, placeholder, size = 'medium', sx }) => {
  return (
    <FormControl sx={sx} size={size}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange}>
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options?.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
