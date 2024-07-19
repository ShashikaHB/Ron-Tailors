import React from "react";
import AddEditOrder from "../forms/orderAddEdit/AddEditOrder";
import { FormProvider, useForm } from "react-hook-form";
import { DevTool } from "@hookform/devtools";
import {
  OrderSchema,
  defaultOrderValues,
  orderSchema,
} from "../forms/formSchemas/orderSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import NewRentOut from "../forms/newRentOut/NewRentOut";

const NewRentOutOrder = () => {
  const methods = useForm<OrderSchema>({
    mode: "all",
    resolver: zodResolver(orderSchema),
    defaultValues: defaultOrderValues,
  });
  return (
    <>
      <FormProvider {...methods}>
        <div>
          <NewRentOut></NewRentOut>
          <DevTool control={methods.control} />
        </div>
      </FormProvider>
    </>
  );
};

export default NewRentOutOrder;
