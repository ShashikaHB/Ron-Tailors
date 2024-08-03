import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { OptionCheckBox } from "../../../types/common";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

type Props<T extends FieldValues> = {
  name: Path<T>;
  options?: OptionCheckBox[];
  label: string;
};

const RHFRadioButtonGrp = <T extends FieldValues>({
  name,
  options,
  label,
}: Props<T>) => {
  const { control } = useFormContext<T>();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormControl {...field} error={!!error}>
          <FormLabel>{label}</FormLabel>
          <RadioGroup>
            {options?.map((option) => (
              <FormControlLabel
                key={option.id}
                label={option.label}
                control={<Radio checked={field.value === option.id} />}
                value={option.id}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    ></Controller>
  );
};

export default RHFRadioButtonGrp;
