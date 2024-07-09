import { SubmitHandler, useFormContext, useWatch } from "react-hook-form";
import {
  MaterialSchema,
  defaultMaterialValues,
} from "../formSchemas/materialsSchema";
import RHFTextField from "../../components/customFormComponents/customTextField/RHFTextField";
import {
  useAddNewMaterialMutation,
  useGetSingleMaterialQuery,
  useUpdateSingleMaterialMutation,
} from "../../redux/features/material/materialApiSlice";
import { toast } from "sonner";
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
    reset(defaultMaterialValues);
  };

  const handleClear = (): void => {
    reset(defaultMaterialValues);
  };

  useEffect(() => {
    if (singleMaterial) {
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
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add New Material</h5>
          <button onClick={handleFormClose}>X</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputGroup">
              <RHFTextField<MaterialSchema>
                label="Name"
                name="name"
              ></RHFTextField>
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
              <RHFTextField<MaterialSchema>
                label="Type"
                name="type"
              ></RHFTextField>
            </div>
            <div className="modal-footer">
              {variant === "create" && (
                <button
                  className="secondary-button"
                  onClick={handleClear}
                  type="button"
                >
                  Clear
                </button>
              )}
              <button
                className="primary-button"
                type="submit"
                onClick={() => console.log("btn clicked")}
              >
                {variant === "create" ? "Add " : "Edit "}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMaterialForm;