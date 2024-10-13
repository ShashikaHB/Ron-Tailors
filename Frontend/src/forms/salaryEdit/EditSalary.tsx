/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */

import { SubmitHandler, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { defaultSalaryValues, SalarySchema } from '../formSchemas/salarySchema';
import { useGetSalaryQuery, useUpdateSalaryMutation } from '../../redux/features/common/commonApiSlice';
import RHFTextField from '../../components/customFormComponents/customTextField/RHFTextField';
import { useAppDispatch } from '../../redux/reduxHooks/reduxHooks';
import { setLoading } from '../../redux/features/common/commonSlice';

const EditSalary = () => {
  const { control, reset, setValue, handleSubmit } = useFormContext<SalarySchema>();

  const dispatch = useAppDispatch();

  const { data: salaryData, isLoading: salaryLoading } = useGetSalaryQuery();
  const [updateSalary, { isLoading: updatingSalary }] = useUpdateSalaryMutation();

  useEffect(() => {
    dispatch(setLoading(salaryLoading));
  }, [salaryLoading]);
  useEffect(() => {
    dispatch(setLoading(updatingSalary));
  }, [updatingSalary]);

  useEffect(() => {
    if (salaryData) {
      reset(salaryData);
    } else {
      reset(defaultSalaryValues);
    }
  }, [salaryData, reset]);

  const onSubmit: SubmitHandler<SalarySchema> = async (data) => {
    try {
      const response = await updateSalary(data);
      if (response.error) {
        console.log(response.error);
      }
    } catch (e) {
      toast.error(`Action Failed. ${e.message}`);
    }
  };

  return (
    <div className="row">
      <div className="col-12 mb-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5>Sales Person Salaries</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Grade A" name="salesPerson.gradeA" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Grade B" name="salesPerson.gradeB" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Grade C" name="salesPerson.gradeC" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Ironing salesPerson" name="salesPerson.ironingSalesMen" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Altering salesPerson" name="salesPerson.alteringSalesMen" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Bonus per Day" name="salesPerson.bonus" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card h-100">
                <div className="card-header">
                  <h5>Cleaning Staff Salaries</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Grade A" name="cleaningStaff.gradeA" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Grade B" name="cleaningStaff.gradeB" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Grade C" name="cleaningStaff.gradeC" />
                    </div>
                    <div className="col-6 mb-3">
                      <RHFTextField<SalarySchema> label="Bonus per Day" name="cleaningStaff.bonus" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="primary-button" type="submit">
              Update Salary Values
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSalary;
