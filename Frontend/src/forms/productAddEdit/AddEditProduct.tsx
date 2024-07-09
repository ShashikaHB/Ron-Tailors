import React, { useCallback, useState } from "react";
import { OrderSchema } from "../formSchemas/orderSchema";
import { useFormContext } from "react-hook-form";
import RHFTextField from "../../components/customFormComponents/customTextField/RHFTextField";
import { ProductSchema } from "../formSchemas/productSchema";

type AddEditProductProps = {
  handleClose: () => void;
};

const AddEditProduct = ({ handleClose }: AddEditProductProps) => {
  const {
    control,
    unregister,
    watch,
    reset,
    setValue,
    handleSubmit,
    getValues,
    clearErrors,
  } = useFormContext<OrderSchema>();

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add New Product</h5>
          <button onClick={handleClose}>X</button>
        </div>
        <div className="modal-body">
          <form>
            <div className="inputGroup">
              <RHFTextField<ProductSchema>
                label="Color"
                name="color"
              ></RHFTextField>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" type="button">
                Clear
              </button>

              <button
                className="primary-button"
                type="submit"
                onClick={() => console.log("btn clicked")}
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
