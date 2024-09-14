/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField } from '@mui/material';
import { OptionCheckBox } from '../../../types/common';

type CheckBoxGroupProps = {
  options: OptionCheckBox[];
  handleCheckBoxSelect: (id: string) => void;
};

const CheckBoxGroup = ({ options, handleCheckBoxSelect }: CheckBoxGroupProps) => {
  return (
    <div>
      <FormControl>
        <FormLabel>Select Products</FormLabel>
        <FormGroup>
          {options?.map((option) => (
            <FormControlLabel
              label={option.label}
              key={option.id}
              control={<Checkbox checked={option.checked} onChange={() => handleCheckBoxSelect(option.id)} />}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
};

// CheckBoxWithInput component for rendering checkbox + input fields
export const CheckBoxWithInput = ({ option, handleCheckBoxChange, handleInputChange, disableCheckboxes }) => {
  return (
    <div className="mb-2">
      <FormControlLabel
        control={<Checkbox disabled={disableCheckboxes && !option.checked} checked={option.checked} onChange={() => handleCheckBoxChange(option.id)} />}
        label={option.label}
      />
      {option.checked && (
        <TextField
          type="number"
          label="Price"
          value={option.price}
          onChange={(e) => handleInputChange(option.id, e.target.value)}
          disabled={disableCheckboxes && !option.checked}
          size="small"
          style={{ marginLeft: '10px', width: '100px' }}
        />
      )}
    </div>
  );
};

export default CheckBoxGroup;
