import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { SubmitHandler, useFormContext, useWatch } from "react-hook-form";
import { MdOutlineClose } from "react-icons/md";
import { MaterialSchema } from "../formSchemas/materialsSchema";
import RHFTextField from "../../components/customFormComponents/customTextField/RHFTextField";
import {
  useAddNewMaterialMutation,
  useGetSingleMaterialQuery,
  useUpdateSingleMaterialMutation,
} from "../../redux/features/material/materialApiSlice";
import { toast } from "sonner";
import { Stack } from "@mui/material";
import { useEffect } from "react";

type AddMaterialFormProps = {
  handleClose: () => void;
  materialId?: number | null;
};

const AddMaterialForm = ({ handleClose, materialId }: AddMaterialFormProps) => {
  const {
    control,
    unregister,
    watch,
    reset,
    setValue,
    handleSubmit,
    getValues,
  } = useFormContext<MaterialSchema>();

  const [addNewMaterial] = useAddNewMaterialMutation();
  const [updateMaterial] = useUpdateSingleMaterialMutation();
  const { data: singleMaterial } = useGetSingleMaterialQuery(
    materialId as number
  );

  const variant = useWatch({ control, name: "variant" });

  const handleFormClose = (): void => {
    handleClose();
    reset();
  };

  const handleClear = (): void => {
    reset();
  };

  useEffect(() => {
    if (singleMaterial) {
      console.log("single Material", singleMaterial);
      setValue("materialId", 104);
      reset(singleMaterial);
    }
  }, [singleMaterial, reset]);

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch]);

  const onSubmit: SubmitHandler<MaterialSchema> = async (data) => {
    try {
      if (variant === "edit") {
        const response = await updateMaterial(data);
        if (response.error) {
          toast.error(`Material Update Failed`);
          console.log(response.error);
        } else {
          toast.success("Material Updated.");
          reset();
        }
      } else {
        const response = await addNewMaterial(data);
        if (response.error) {
          toast.error(`Material Adding Failed`);
          console.log(response.error);
        } else {
          toast.success("New material Added.");
          reset();
        }
      }
    } catch (error) {
      toast.error(`Material Action Failed. ${error.message}`);
    }
  };

  return (
    <Box
      sx={{
        ...style,
        maxWidth: 400,
        display: "flex",
      }}
    >
      <Stack sx={{ gap: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Material
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField<MaterialSchema> label="Name" name="name"></RHFTextField>
          <RHFTextField<MaterialSchema>
            label="Color"
            name="color"
          ></RHFTextField>
          <RHFTextField<MaterialSchema>
            label="Unit Price"
            name="unitPrice"
            type="number"
          ></RHFTextField>
          <RHFTextField<MaterialSchema>
            label="Available Units"
            name="noOfUnits"
            type="number"
          ></RHFTextField>
          <RHFTextField<MaterialSchema>
            label="Margin"
            name="marginPercentage"
            type="number"
          ></RHFTextField>
          <RHFTextField<MaterialSchema>
            label="Brand"
            name="brand"
          ></RHFTextField>
          <RHFTextField<MaterialSchema> label="Type" name="type"></RHFTextField>
          <Stack sx={{ flexDirection: "row" }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              //   onClick={handleSubmit(onSubmit)}
            >
              {variant === "create" ? "Add " : "Edit "}
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Stack>
        </form>
      </Stack>
      <Stack>
        <MdOutlineClose onClick={handleFormClose} />
      </Stack>
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
