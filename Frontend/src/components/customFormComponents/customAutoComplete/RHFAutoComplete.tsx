import { Autocomplete, Box, Checkbox, TextField } from "@mui/material";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { OptionCheckBox } from "../../../types/common";

type Props<T extends FieldValues> = {
  name: Path<T>;
  options?: OptionCheckBox[];
  label: string;
};

const RHFAutoComplete = <T extends FieldValues>({
  name,
  options,
  label,
}: Props<T>) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, ref, value }, fieldState: { error } }) => (
        <Autocomplete
          options={options || []}
          value={value.map((id: string) =>
            options?.find((item: OptionCheckBox) => item.id === id)
          )}
          onChange={(_, newValue) =>
            onChange(newValue.map((item: OptionCheckBox) => item.id))
          }
          multiple
          getOptionLabel={(option: OptionCheckBox) =>
            options?.find((item) => item.id === option.id)?.label ?? ""
          }
          isOptionEqualToValue={(option, newValue) => option.id === newValue.id}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!error}
              label={label}
              helperText={error?.message}
              inputRef={ref}
            ></TextField>
          )}
          renderOption={(props, option, { selected }) => {
            return (
              <Box component={"li"} {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlankIcon />}
                  checkedIcon={<CheckBoxIcon />}
                  checked={selected}
                ></Checkbox>
                {option.label}
              </Box>
            );
          }}
        />
      )}
    ></Controller>
  );
};

export default RHFAutoComplete;
