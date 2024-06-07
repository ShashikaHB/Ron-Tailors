import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { TextField } from "@mui/material";

const AddMaterialForm = ({ handleClose, handleAddMaterial }) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/material/",
        data
      );
      console.log("Material added:", response.data);
      handleClose();
      handleAddMaterial();
      // Optionally, you can update the table data here by refetching it
    } catch (err) {
      console.error("Error adding material:", err);
    }
  };

  return (
    <Box
      sx={{
        ...style,
        maxWidth: 400,
      }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Add New Material
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="color"
          control={control}
          defaultValue=""
          rules={{ required: "Color is required." }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Color"
              fullWidth
              error={!!errors.color}
              helperText={errors.color && errors.color.message}
            />
          )}
        />
        <Controller
          name="unitPrice"
          control={control}
          defaultValue=""
          rules={{
            required: "Unit price is required.",
            pattern: {
              value: /^[0-9]*$/,
              message: "Please enter a valid number.",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Unit Price"
              fullWidth
              type="number"
              error={!!errors.unitPrice}
              helperText={errors.unitPrice && errors.unitPrice.message}
            />
          )}
        />
        <Controller
          name="noOfUnits"
          control={control}
          defaultValue=""
          rules={{
            required: "Number of units is required.",
            pattern: {
              value: /^[0-9]*$/,
              message: "Please enter a valid number.",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Number of Units"
              fullWidth
              type="number"
              error={!!errors.noOfUnits}
              helperText={errors.noOfUnits && errors.noOfUnits.message}
            />
          )}
        />
        <Controller
          name="marginPercentage"
          control={control}
          defaultValue=""
          rules={{
            required: "Margin Percentage is required.",
            pattern: {
              value: /^[0-9]*$/,
              message: "Please enter a valid number.",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Profit Margin (%)"
              fullWidth
              type="number"
              error={!!errors.marginPercentage}
              helperText={
                errors.marginPercentage && errors.marginPercentage.message
              }
            />
          )}
        />
        <Controller
          name="brand"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Brand" fullWidth />
          )}
        />
        <Controller
          name="type"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField {...field} label="Type" fullWidth />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit(onSubmit)}
        >
          Add Material
        </Button>
      </form>
    </Box>
  );
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default AddMaterialForm;
