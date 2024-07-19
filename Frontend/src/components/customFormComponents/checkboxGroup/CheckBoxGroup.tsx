import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { OptionCheckBox } from "../../../types/common";

type CheckBoxGroupProps = {
  options: OptionCheckBox[];
  handleCheckBoxSelect: (id: string) => void;
};

const CheckBoxGroup = ({
  options,
  handleCheckBoxSelect,
}: CheckBoxGroupProps) => {
  return (
    <div>
      <FormControl>
        <FormLabel>Select Products</FormLabel>
        <FormGroup>
          {options?.map((option) => (
            <FormControlLabel
              label={option.label}
              key={option.id}
              control={
                <Checkbox
                  checked={option.checked}
                  onChange={() => handleCheckBoxSelect(option.id)}
                />
              }
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default CheckBoxGroup;
