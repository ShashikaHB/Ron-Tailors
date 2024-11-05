/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string; // Add the label prop
} & Omit<DatePickerProps<Date, false>, 'name' | 'value'>; // Adjusted the type arguments

const RHFDatePicker = <T extends FieldValues>({ name, label, ...props }: Props<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={label}
            value={field.value ?? null}
            onChange={(date) => {
              if (date) {
                // Set the date to midnight UTC
                const utcMidnight = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
                field.onChange(utcMidnight);
              } else {
                field.onChange(null);
              }
            }}
            {...props}
            slotProps={{
              textField: {
                size: 'small',
                InputProps: {
                  inputComponent: (inputProps) => <input {...inputProps} value={field.value ? format(field.value, 'yyyy/MM/dd') : ''} />,
                },
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default RHFDatePicker;
