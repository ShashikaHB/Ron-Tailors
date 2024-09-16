/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { useEffect, useState } from 'react';
import { SubmitHandler, useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { ColDef } from 'ag-grid-community';
import { RiCloseLargeLine } from '@remixicon/react';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { defaultProductValues, productSchema, ProductSchema } from '../formSchemas/productSchema';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import { useGetAllUsersQuery } from '../../redux/features/user/userApiSlice';
import { Roles } from '../../enums/Roles';
import Loader from '../../components/loderComponent/Loader';
import RHFSwitch from '../../components/customFormComponents/customSwitch/RHFSwitch';
import ProductType from '../../enums/ProductType';
import { useAppDispatch, useAppSelector } from '../../redux/reduxHooks/reduxHooks';
import { removeMaterials, resetMaterials, selectMaterial, selectType } from '../../redux/features/product/productSlice';
import { GetMaterial, MaterialNeededforProduct } from '../../types/material';
import Table from '../../components/agGridTable/Table';
import { useLazyGetSingleProductQuery, useUpdateSingleProductMutation } from '../../redux/features/product/productApiSlice';
import getUserRoleBasedOptions from '../../utils/userUtils';
import SimpleActionButton from '../../components/agGridTable/customComponents/SimpleActionButton';
import { useGetAllMaterialsQuery } from '../../redux/features/material/materialApiSlice';
import getAvailableMaterialOptions from '../../utils/materialUtils';
import { selectProductId } from '../../redux/features/common/commonSlice';

type AddEditProductProps = {
  handleClose: () => void;
};

const AddEditProduct = ({ handleClose }: AddEditProductProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues, clearErrors } = useFormContext<ProductSchema>();

  const productType = useAppSelector(selectType);
  const selectedMaterials = useAppSelector(selectMaterial);
  const [selectedMaterialRowData, setSelectedMaterialRowData] = useState<any>([]);
  const productId = useAppSelector(selectProductId);
  const dispatch = useAppDispatch();

  const variant = useWatch({ control, name: 'variant' });

  const [updateProduct] = useUpdateSingleProductMutation();

  const { data: users = [], isLoading } = useGetAllUsersQuery();
  const { data: materials, isLoading: materialLoading } = useGetAllMaterialsQuery();
  const [triggerGetProduct, { data: productData, isLoading: productDataLoading }] = useLazyGetSingleProductQuery();

  const materialOptions = getAvailableMaterialOptions(materials as GetMaterial[]);

  const [material, setMaterial] = useState<MaterialNeededforProduct>({
    material: materialOptions[0]?.value,
    unitsNeeded: 0,
  });

  const cuttersOptions = getUserRoleBasedOptions(users, Roles.Cutter);
  const tailorOptions = getUserRoleBasedOptions(users, Roles.Tailor);
  const measurerOptions = getUserRoleBasedOptions(users, Roles.SalesPerson);

  const handleRemove = (id: number) => {
    dispatch(removeMaterials(id));
  };

  const colDefs: ColDef<MaterialNeededforProduct>[] = [
    { headerName: 'Material Id', field: 'material' },
    { headerName: 'Units needed', field: 'unitsNeeded' },
    {
      headerName: '',
      cellRenderer: SimpleActionButton,
      cellRendererParams: {
        handleRemove,
        idField: 'material',
      },
    },
  ];

  const handleClear = () => {
    reset();
    dispatch(resetMaterials());
  };

  const handleClosePopup = () => {
    reset();
    handleClose();
  };

  const handleMaterialAdd = () => {
    // dispatch(setMaterials(material));
    setSelectedMaterialRowData([...selectedMaterialRowData, material]);
    setMaterial({
      material: '',
      unitsNeeded: 0,
    });
  };

  // Map the data from API to match the form structure
  const mapProductData = (productData) => {
    const mappedMaterials =
      productData?.materials?.map((material) => ({
        material: material?.material?.materialId || '', // Use material._id if available
        unitsNeeded: material?.unitsNeeded || 0, // Default to 0 if not available
      })) || defaultProductValues.materials; // Default to empty array if materials not present

    return {
      ...defaultProductValues, // Start with default values
      ...productData, // Override with productData if available
      materials: mappedMaterials,
      measurement: productData?.measurement?.measurementId || defaultProductValues.measurement, // Ensure correct format for measurement
      cutter: productData?.cutter?.userId || defaultProductValues.cutter,
      tailor: productData?.tailor?.userId || defaultProductValues.tailor,
      measurer: productData?.measurer?.userId || defaultProductValues.measurer,
      variant: 'edit',
    };
  };

  const materialAddEnabled = material.material !== '0' && material.unitsNeeded > 0;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the form submission
      if (materialAddEnabled) {
        handleMaterialAdd();
      }
    }
  };

  const validate = () => {
    const formData = getValues();
    const validationResult = productSchema.safeParse(formData);
    console.log(validationResult);
  };

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    try {
      if (variant === 'edit') {
        const response = await updateProduct(data);
        if (response) {
          toast.success('Product Updated.');
          reset();
          dispatch(resetMaterials());
        }
      }
    } catch (e) {
      console.log(e);
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
    setValue('itemType', productType as ProductType);
  }, [productType]);

  useEffect(() => {
    const mappedData = mapProductData(productData);
    reset(mappedData);
    setSelectedMaterialRowData(mappedData.materials);
  }, [productData]);

  useEffect(() => {
    if (productId) {
      triggerGetProduct(productId);
    }
  }, [productId]);

  useEffect(() => {
    setValue('materials', selectedMaterialRowData as MaterialNeededforProduct[]);
  }, [selectedMaterialRowData]);

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">
            Add New
            {` ${productType}`}
          </h5>
          <button aria-label="close-btn" type="button" className="icon-button" onClick={handleClosePopup}>
            <RiCloseLargeLine size={18} />
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
                <h5 className="modal-title pt-1">Materials</h5>
                <div className="d-flex gap-4 align-items-end mb-3">
                  <div className="col-4">
                    <FormControl fullWidth size="small">
                      <InputLabel id="material-select-label">Material</InputLabel>
                      <Select
                        labelId="material-select-label"
                        value={material?.material || '0'} // Set value to the selected material, default to 0
                        label="Material"
                        onChange={(e) =>
                          setMaterial((prev) => ({
                            ...prev,
                            material: e.target.value,
                          }))
                        }
                      >
                        {/* Map through the materialOptions */}
                        {materialOptions?.map((option, index) => (
                          <MenuItem key={index} value={option.value} disabled={option.value === '0'}>
                            {option.label} {/* Display option label */}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <TextField
                    label="Units needed"
                    value={material.unitsNeeded}
                    type="number"
                    onChange={(e) =>
                      setMaterial((prev) => ({
                        ...prev,
                        unitsNeeded: Number(e.target.value),
                      }))
                    }
                    onKeyDown={handleKeyPress}
                  />
                  <button className="primary-button" type="button" disabled={!materialAddEnabled} onClick={() => handleMaterialAdd()}>
                    Add
                  </button>
                </div>
              </div>

              <div style={{ height: '25vh' }}>
                <Table<MaterialNeededforProduct> rowData={selectedMaterialRowData} colDefs={colDefs} pagination={false} />
              </div>

              <div className="modal-footer mt-3">
                <button className="secondary-button" type="button" onClick={() => handleClear()}>
                  Clear Product
                </button>

                <button className="primary-button" type="submit">
                  Update Product
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
