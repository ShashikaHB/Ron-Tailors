/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { FormControl, FormControlLabel, FormGroup, FormLabel, Checkbox, FormHelperText } from '@mui/material';
import { OptionCheckBox } from '../../../types/common';

type Props<T extends FieldValues> = {
  name: Path<T>;
  options?: OptionCheckBox[];
  label: string;
};

const RHFCheckBox = <T extends FieldValues>({ name, options, label }: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <FormControl error={!!error}>
          <FormLabel>{label}</FormLabel>
          <FormGroup>
            {options?.map((option) => (
              <FormControlLabel
                label={option.label}
                key={option.id}
                control={<Checkbox checked={value.includes(option.id)} />}
                onChange={() => {
                  if (value.includes(option.id)) {
                    onChange((value as string[]).filter((item: string) => item !== option.id));
                  } else {
                    onChange([...value, option.id]);
                  }
                }}
              />
            ))}
          </FormGroup>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default RHFCheckBox;
