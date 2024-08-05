/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useEffect, useState } from 'react';
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { TextField } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { ProductSchema } from '../formSchemas/productSchema';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import { useGetAllUsersQuery } from '../../redux/features/user/userApiSlice';
import { Roles } from '../../enums/Roles';
import Loader from '../../components/loderComponent/Loader';
import RHFSwitch from '../../components/customFormComponents/customSwitch/RHFSwitch';
import ProductType from '../../enums/ProductType';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { resetMaterials, selectMaterial, selectType, setMaterials } from '../../redux/features/product/productSlice';
import { MaterialNeededforProduct } from '../../types/material';
import Table from '../../components/agGridTable/Table';
import { useAddNewProductMutation } from '../../redux/features/product/productApiSlice';
import { setCreatedProducts } from '../../redux/features/orders/orderSlice';
import { getUserRoleBasedOptions } from '../../utils/userUtils';

type AddEditProductProps = {
  handleClose: () => void;
};

const AddEditProduct = ({ handleClose }: AddEditProductProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<ProductSchema>();

  const productType = useAppSelector(selectType);
  const selectedMaterials = useAppSelector(selectMaterial);
  const dispatch = useAppDispatch();

  const variant = useWatch({ control, name: 'variant' });

  const [material, setMaterial] = useState<MaterialNeededforProduct>({
    material: 0,
    unitsNeeded: 0,
  });

  const [addProduct] = useAddNewProductMutation();

  const { data: users = [], error, isLoading } = useGetAllUsersQuery();

  const cuttersOptions = getUserRoleBasedOptions(users, Roles.Cutter);
  const tailorOptions = getUserRoleBasedOptions(users, Roles.Tailor);
  const measurerOptions = getUserRoleBasedOptions(users, Roles.SalesPerson);

  const colDefs: ColDef<MaterialNeededforProduct>[] = [
    { headerName: 'Id', field: 'material' },
    { headerName: 'Units needed', field: 'unitsNeeded' },
  ];

  if (error) {
    toast.error('Error fetching users');
  }

  const handleClear = () => {
    reset();
    dispatch(resetMaterials());
  };

  const handleClosePopup = () => {
    reset();
    handleClose();
  };

  const handleMaterialAdd = () => {
    dispatch(setMaterials(material));
    setMaterial({
      material: 0,
      unitsNeeded: 0,
    });
  };

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        // const response = await updateMaterial(data);
        // if (response.error) {
        //   toast.error(`Material Update Failed`);
        //   console.log(response.error);
        // } else {
        //   toast.success("Material Updated.");
        //   reset();
        // }
      } else {
        const response = await addProduct(data);
        if (response.error) {
          toast.error(`Material Adding Failed`);
          console.log(response.error);
        } else {
          toast.success('New material Added.');
          dispatch(setCreatedProducts(response.data));
          reset();
          dispatch(resetMaterials());
          handleClose();
        }
      }
    } catch (error) {
      toast.error(`Material Action Failed. ${error.message}`);
    }
  };

  useEffect(() => {
    const sub = watch((value) => {
      console.log(value);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    setValue('type', productType as ProductType);
  }, [productType]);
  useEffect(() => {
    setValue('materials', selectedMaterials as MaterialNeededforProduct[]);
  }, [selectedMaterials]);

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add New {productType}</h5>
          <button className="icon-button" onClick={handleClosePopup}>
            X
          </button>
        </div>
        <div className="modal-body">
          {isLoading ? (
            <div className="d-flex justify-content-center">
              <Loader />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="d-flex gap-4">
                <div className="inputGroup">
                  <RHFTextField<ProductSchema> label="Color" name="color" />
                  <RHFTextField<ProductSchema> label="Style" name="style" />
                  <RHFTextField<ProductSchema> label="Price" name="price" type="number" />
                  <RHFTextField<ProductSchema> label="Number of Units" name="noOfUnits" type="number" disabled />
                  <RHFSwitch<ProductSchema> name="isNewRentOut" label="New Rentout" />
                </div>
                <div className="inputGroup">
                  <RHFTextField<ProductSchema> label="Rent Price" name="rentPrice" type="number" />
                  <RHFDropDown<ProductSchema> options={cuttersOptions} name="cutter" label="Cutter" />
                  <RHFDropDown<ProductSchema> options={tailorOptions} name="tailor" label="Tailor" />
                  <RHFDropDown<ProductSchema> options={measurerOptions} name="measurer" label="Measurer" />
                </div>
              </div>
              <div className="inputGroup">
                <div className="d-flex gap-4">
                  <TextField
                    type="number"
                    label="Material Code"
                    value={material.material}
                    onChange={(e) =>
                      setMaterial((prev) => ({
                        ...prev,
                        material: Number(e.target.value),
                      }))
                    }
                  />
                  <TextField
                    type="number"
                    label="Units needed"
                    value={material.unitsNeeded}
                    onChange={(e) =>
                      setMaterial((prev) => ({
                        ...prev,
                        unitsNeeded: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <button className="primary-button" type="button" onClick={() => handleMaterialAdd()}>
                  Add Material
                </button>
              </div>
              {selectedMaterials.length > 0 && (
                <div style={{ height: '25vh' }}>
                  <Table<MaterialNeededforProduct> rowData={selectedMaterials} colDefs={colDefs} pagination={false} />
                </div>
              )}
              <div className="modal-footer mt-3">
                <button className="secondary-button" type="button" onClick={() => handleClear()}>
                  Clear
                </button>

                <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
                  Add
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
