import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label?: string; // Add the label prop
} & Omit<DatePickerProps<Date, false>, "name" | "value">; // Adjusted the type arguments

const RHFDatePicker = <T extends FieldValues>({
  name,
  label,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, ...rest } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={label} // Use the label prop
            value={value ?? null} // Handle null values for controlled component
            {...rest}
            {...props}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default RHFDatePicker;
