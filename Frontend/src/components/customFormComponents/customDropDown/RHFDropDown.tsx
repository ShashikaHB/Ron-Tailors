import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { MenuItem, TextField, TextFieldProps } from "@mui/material";
import { Option } from "../../../types/common";

type Props<T extends FieldValues> = {
  name: Path<T>;
  options: Option[];
} & Pick<TextFieldProps, "label" | "disabled" | "type">;

const RHFDropDown = <T extends FieldValues>({
  name,
  options,
  ...props
}: Props<T>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          select
          helperText={error?.message}
          defaultValue="Sales Person"
          error={!!error}
        >
          {options?.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
};

export default RHFDropDown;
