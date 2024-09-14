/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import { capitalize } from 'lodash';
import { Option } from '../../../types/common';

type Props<T extends FieldValues> = {
  name: Path<T>;
  options: Option[];
} & Pick<TextFieldProps, 'label' | 'disabled' | 'type' | 'size'>;

const RHFDropDown = <T extends FieldValues>({ name, options, ...props }: Props<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField {...field} {...props} select helperText={error?.message} error={!!error} size="small">
          {options?.map((option, index) => (
            <MenuItem key={index} value={option.value} disabled={option.value === 0 || option.value === ''}>
              {capitalize(option.label)}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default RHFDropDown;
