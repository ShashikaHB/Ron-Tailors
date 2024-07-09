import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import React from "react";
import { ProductType } from "../../../enums/ProductType";

const CheckBoxGroup = () => {
  const options = [
    {
      id: ProductType.Shirt,
      label: "Shirt",
    },
    {
      id: ProductType.Coat,
      label: "Coat",
    },
    {
      id: ProductType.Trouser,
      label: "Trouser",
    },
    {
      id: ProductType.WestCoat,
      label: "West Coat",
    },
    {
      id: ProductType.Cravat,
      label: "Cravat",
    },
    {
      id: ProductType.Bow,
      label: "Bow",
    },
    {
      id: ProductType.Tie,
      label: "Tie",
    },
  ];
  return (
    <div>
      <FormControl>
        <FormLabel>Select Products</FormLabel>
        <FormGroup>
          {options?.map((option) => (
            <FormControlLabel
              label={option.label}
              key={option.id}
              control={<Checkbox />}
            />
          ))}
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default CheckBoxGroup;
