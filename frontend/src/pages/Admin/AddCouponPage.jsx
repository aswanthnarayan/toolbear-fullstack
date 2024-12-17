import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { useForm, Controller } from 'react-hook-form';
import CustomInput from '../../components/CustomInput';
import { useCreateCouponMutation } from '../../../App/features/rtkApis/adminApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AddCouponPage = () => {
  const navigate = useNavigate();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const { 
    control, 
    handleSubmit,
    formState: { errors },
    watch 
  } = useForm({
    defaultValues: {
      code: '',
      description: '',
      discountType: 'percentage',
      discountAmount: '',
      minimumPurchase: '',
      maxDiscount: '',
      startDate: '',
      expiryDate: '',
    }
  });

  const discountType = watch('discountType');
  const startDate = watch('startDate');

  const onSubmit = async (data) => {
    try {
      const formattedData = {
        ...data,
        code: data.code.toUpperCase(),
        discountAmount: Number(data.discountAmount),
        minimumPurchase: Number(data.minimumPurchase),
        maxDiscount: Number(data.maxDiscount),
      };

      await createCoupon(formattedData).unwrap();
      toast.success('Coupon created successfully');
      navigate('/admin/coupons');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create coupon');
    }
  };

  return (
    <div className="mt-1 mb-8 flex flex-col gap-3">
        
          <Typography variant="h6" className=''>
            Add New Coupon
          </Typography>
      
      <Card>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <form className="mt-8 mb-2 w-full max-w-screen-lg px-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4 flex flex-col gap-6">
              <Controller
                name="code"
                control={control}
                rules={{ 
                  required: 'Coupon code is required',
                  pattern: {
                    value: /^[A-Za-z0-9]+$/,
                    message: 'Only letters and numbers are allowed'
                  }
                }}
                render={({ field }) => (
                  <CustomInput
                    size="lg"
                    label="Coupon Code"
                    error={errors.code?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <CustomInput
                    size="lg"
                    label="Description"
                    error={errors.description?.message}
                    {...field}
                  />
                )}
              />

              <div className="w-72">
                <Controller
                  name="discountType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Discount Type"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    >
                      <Option value="percentage">Percentage</Option>
                      <Option value="fixed">Fixed Amount</Option>
                    </Select>
                  )}
                />
              </div>

              <Controller
                name="discountAmount"
                control={control}
                rules={{
                  required: 'Discount amount is required',
                  min: {
                    value: 0,
                    message: 'Discount must be positive'
                  },
                  max: {
                    value: discountType === 'percentage' ? 100 : 100000,
                    message: discountType === 'percentage' ? 'Percentage cannot exceed 100%' : 'Amount too high'
                  }
                }}
                render={({ field }) => (
                  <CustomInput
                    type="number"
                    size="lg"
                    label={`Discount ${discountType === 'percentage' ? 'Percentage' : 'Amount'}`}
                    error={errors.discountAmount?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="minimumPurchase"
                control={control}
                rules={{
                  required: 'Minimum purchase amount is required',
                  min: {
                    value: 0,
                    message: 'Amount must be positive'
                  }
                }}
                render={({ field }) => (
                  <CustomInput
                    type="number"
                    size="lg"
                    label="Minimum Purchase Amount"
                    error={errors.minimumPurchase?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="maxDiscount"
                control={control}
                rules={{
                  required: 'Maximum discount amount is required',
                  min: {
                    value: 0,
                    message: 'Amount must be positive'
                  }
                }}
                render={({ field }) => (
                  <CustomInput
                    type="number"
                    size="lg"
                    label="Maximum Discount Amount"
                    error={errors.maxDiscount?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="startDate"
                control={control}
                rules={{
                  required: 'Start date is required',
                  validate: value => 
                    new Date(value) >= new Date() || 'Start date cannot be in the past'
                }}
                render={({ field }) => (
                  <CustomInput
                    type="datetime-local"
                    size="lg"
                    label="Start Date"
                    error={errors.startDate?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                name="expiryDate"
                control={control}
                rules={{
                  required: 'Expiry date is required',
                  validate: value => 
                    !startDate || new Date(value) > new Date(startDate) || 
                    'Expiry date must be after start date'
                }}
                render={({ field }) => (
                  <CustomInput
                    type="datetime-local"
                    size="lg"
                    label="Expiry Date"
                    error={errors.expiryDate?.message}
                    {...field}
                  />
                )}
              />

            </div>

            <Button 
              className="mt-6" 
              fullWidth 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Coupon'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddCouponPage;