/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

type Props<T extends FieldValues> = {
  name: Path<T>;
} & Pick<TextFieldProps, 'label' | 'disabled' | 'type'>;

const RHFTextField = <T extends FieldValues>({ name, ...props }: Props<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          helperText={error?.message}
          error={!!error}
          size="small"
          InputLabelProps={{ shrink: field.value === 0 ? true : field.value }}
          value={field.value ?? ''}
        />
      )}
    />
  );
};

export default RHFTextField;
