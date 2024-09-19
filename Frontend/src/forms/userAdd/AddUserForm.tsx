/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { RiCloseLargeLine } from '@remixicon/react';
import { useEffect } from 'react';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import RHFDropDown from '../../components/customFormComponents/customDropDown/RHFDropDown';
import { defaultUserRegValues, userRegistrationSchema, UserRegistrationSchema } from '../formSchemas/userRegistrationSchema';
import { RolesAdmin } from '../../enums/Roles';
import { useRegisterMutation } from '../../redux/features/auth/authApiSlice';
import { useAppDispatch } from '../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../redux/features/common/commonSlice';

type AddMaterialFormProps = {
  handleClose: () => void;
};

const roles = [
  {
    value: RolesAdmin.Admin,
    label: 'Admin',
  },
  {
    value: RolesAdmin.SalesPerson,
    label: 'Sales Person',
  },
  {
    value: RolesAdmin.Cutter,
    label: 'Cutter',
  },
  {
    value: RolesAdmin.Tailor,
    label: 'Tailor',
  },
  {
    value: RolesAdmin.IroningPerson,
    label: 'Ironing Person',
  },
  {
    value: RolesAdmin.AlteringPerson,
    label: 'AlteringPerson',
  },
  {
    value: RolesAdmin.Cleaning,
    label: 'Cleaning Staff',
  },
];

const AddUserForm = ({ handleClose }: AddMaterialFormProps) => {
  const { control, unregister, watch, reset, setValue, handleSubmit, getValues } = useFormContext<UserRegistrationSchema>();

  const dispatch = useAppDispatch();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleFormClose = (): void => {
    handleClose();
    reset(defaultUserRegValues);
  };

  useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading]);

  const validate = () => {
    const formData = getValues();
    const validationResult = userRegistrationSchema.safeParse(formData);
    console.log(validationResult);
  };

  const handleClear = (): void => {
    reset(defaultUserRegValues);
  };

  const onSubmit: SubmitHandler<UserRegistrationSchema> = async (data) => {
    try {
      const response = await registerUser(data).unwrap();
      if (response.success) {
        toast.success('New user created!');
        reset();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title"> Add User</h5>
          <button type="button" aria-label="close-btn" className="icon-button" onClick={handleFormClose}>
            <RiCloseLargeLine size={18} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="inputGroup">
              <RHFTextField<UserRegistrationSchema> label="Name" name="name" />
              <RHFTextField<UserRegistrationSchema> label="Mobile" name="mobile" />
              <RHFTextField<UserRegistrationSchema> label="Password" name="password" />
              <RHFTextField<UserRegistrationSchema> label="Confirm Password" name="confirmPassword" />
              <RHFDropDown<UserRegistrationSchema> label="Role" name="role" options={roles} />
            </div>
            <div className="modal-footer mt-3">
              <button className="secondary-button" onClick={handleClear} type="button">
                Clear
              </button>

              <button className="primary-button" type="submit" onClick={() => console.log('btn clicked')}>
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserForm;
