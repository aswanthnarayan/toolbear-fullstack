import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import { useForm } from 'react-hook-form';
import CustomInput from '../../components/CustomInput';
import { useCreateCouponMutation } from '../../../App/features/rtkApis/adminApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AddCouponPage = () => {
  const navigate = useNavigate();
  const [createCoupon, { isLoading ,error: createError } ] = useCreateCouponMutation();

  const { 
    register, 
    handleSubmit,
    setError,
    formState: { errors },
    watch,
    setValue 
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
      if (error.data?.field === 'code') {
        setError("code", {
          type: "manual",
          message: error.data.message
        });
      } else {
        toast.error(error.data?.message || 'Failed to create coupon');
      }
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
              <CustomInput
                size="lg"
                label="Coupon Code"
                error={errors.code?.message}
                {...register("code", {
                  required: 'Coupon code is required',
                  minLength: 3,
                  maxLength: 10,
                  validate:{
                    notEmpty: (value) =>
                      value.trim() !== "" || "Coupon code cannot be empty or spaces only",
                    Alphanumeric: (value) => {
                      const regex = /^[A-Za-z0-9]+$/;
                      return regex.test(value) || 'Coupon code must be alphanumeric';
                    },
                  },
                })}
              />

              <CustomInput
                size="lg"
                label="Description"
                error={errors.description?.message}
                {...register("description", {
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters"
                  },
                  maxLength: {
                    value: 100,
                    message: "Description must not exceed 500 characters"
                  },
                  validate: {
                    notEmpty: (value) =>
                      value.trim() !== "" || "Description cannot be empty or spaces only",
                    firstThreeNotSpecial: (value) =>
                      /^[a-zA-Z]{3}/.test(value.trim()) || "The first three characters must be letters",
                  }
                })}
              />

              <div className="w-72">
                <Select
                  label="Discount Type"
                  value={discountType}
                  onChange={(value) => setValue('discountType', value)}
                >
                  <Option value="percentage">Percentage</Option>
                  <Option value="fixed">Fixed Amount</Option>
                </Select>
              </div>

              <CustomInput
                type="number"
                size="lg"
                label={`Discount ${discountType === 'percentage' ? 'Percentage' : 'Amount'}`}
                error={errors.discountAmount?.message}
                {...register("discountAmount", {
                  required: 'Discount amount is required',
                  min: {
                    value: 0,
                    message: 'Discount must be positive'
                  },
                  max: {
                    value: discountType === 'percentage' ? 100 : 100000,
                    message: discountType === 'percentage' ? 'Percentage cannot exceed 100%' : 'Amount too high'
                  }
                })}
              />

              <CustomInput
                type="number"
                size="lg"
                label="Minimum Purchase Amount"
                error={errors.minimumPurchase?.message}
                {...register("minimumPurchase", {
                  required: 'Minimum purchase amount is required',
                  min: {
                    value: 0,
                    message: 'Amount must be positive'
                  }
                })}
              />

              <CustomInput
                type="number"
                size="lg"
                label="Maximum Discount Amount"
                error={errors.maxDiscount?.message}
                {...register("maxDiscount", {
                  required: 'Maximum discount amount is required',
                  min: {
                    value: 0,
                    message: 'Amount must be positive'
                  },
                  validate: {
                    notMoreThanMinPurchase: (value) => {
                      const minPurchase = watch('minimumPurchase');
                      return (
                        !minPurchase || 
                        Number(value) <= Number(minPurchase) || 
                        'Maximum discount cannot be more than minimum purchase amount'
                      );
                    }
                  }
                })}
              />

              <CustomInput
                type="datetime-local"
                size="lg"
                label="Start Date"
                error={errors.startDate?.message}
                step="60"
                {...register("startDate", {
                  required: 'Start date is required',
                  validate: value => 
                    new Date(value) >= new Date() || 'Start date cannot be in the past'
                })}
              />

              <CustomInput
                type="datetime-local"
                size="lg"
                label="Expiry Date"
                error={errors.expiryDate?.message}
                step="60"
                {...register("expiryDate", {
                  required: 'Expiry date is required',
                  validate: value => 
                    !startDate || new Date(value) > new Date(startDate) || 
                    'Expiry date must be after start date'
                })}
              />

            </div>

            <Button 
              className="mt-6" 
              fullWidth 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" /> Creating...
                </div>
              ) : (
                'Create Coupon'
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddCouponPage;