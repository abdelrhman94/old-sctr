'use client';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UserType } from '@/enums/enums';
import { useRouter } from '@/i18n/navigation';
import { userRegisterSchema } from '@/schemas';
import { useRegisterMutation } from '@/store/api/authApi';
import { selectCurrentStep, setStep } from '@/store/slices/registrationStepsSlice';
import { RootState } from '@/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import CreateAccountStep from './CreateAccountStep';
import PersonalDetailsContinueStep from './PersonalDetailsContinueStep';
import PersonalDetailsStep from "./PersonalDetailsStep";


type UserRegisterFormData = z.infer<typeof userRegisterSchema>;

type Props = {
  selectedUserType: UserType;
  personalStep?: number; // default 2
  createStep?: number;
};
export default function PersonalDetailsWizard({ selectedUserType, personalStep = 2,
  createStep = 3, }: Props) {
  const dispatch = useDispatch();
  const currentStep = useSelector(selectCurrentStep);
  const router = useRouter();
  const [subStep, setSubStep] = useState<number>(1);


  const [register, { isLoading: registerLoading }] = useRegisterMutation();

  const retrieveData = useSelector((state: RootState) => state.registrationData);
  const orgId = useSelector((state: RootState) => state.registration.tempOrgId);




  const form = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      idNumber: retrieveData.identityValidation?.idNumber ?? "",
      dateOfBirth: retrieveData.identityValidation?.dob ?? undefined,
      email: "",
      organizationId: orgId ?? null,
      password: "",
      confirmPassword: "",
      userType: selectedUserType,
      firstNameAr: retrieveData.identityValidation?.firstNameAr ?? "",
      secondNameAr: retrieveData.identityValidation?.secondNameAr ?? "",
      familyNameAr: retrieveData.identityValidation?.familyNameAr ?? "",
      firstNameEn: retrieveData.identityValidation?.firstNameEn ?? "",
      secondNameEn: retrieveData.identityValidation?.secondNameEn ?? "",
      familyNameEn: retrieveData.identityValidation?.familyNameEn ?? "",
      address1: "",
      address2: "",
      postalCode: undefined,
      region: undefined,
      city: undefined,
      mobileNumber: "",
      jobTitle: undefined,
      jobTitleText: "",
      department: "",
      currentSite: "",
      termApproved: false,
    }
  });

  useEffect(() => {
    form.setValue('userType', selectedUserType, { shouldDirty: true });
  }, [form, selectedUserType]);

  const onSubmit = async (data: any) => {

    try {
      const response = await register(data).unwrap();
      toast.success(response?.message);
      router.push(`/otp?email=${data.email}`);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (currentStep !== personalStep) setSubStep(1);
  }, [currentStep, personalStep]);

  const goNextFromSubStep1 = async () => {
    const ok = await form.trigger([
      'firstNameEn',
      'secondNameEn',
      'familyNameEn',
      'firstNameAr',
      'secondNameAr',
      'familyNameAr',
    ]);
    if (ok) setSubStep(2);
  };

  const goNextFromSubStep2 = async () => {
    const ok = await form.trigger([
      'currentSite',
      'jobTitleText',
      'department',
      'address1',
      'region',
      'city',
      'postalCode',
      'mobileNumber',
      'termApproved',
    ]);
    if (ok) {
      dispatch(setStep(createStep));
    }
  };

  return (
    <div className="relative min-h-[300px] mt-5">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-8">
            {currentStep === personalStep && subStep === 1 && (
              <>
                <h2 className='text-secondary font-medium text-3xl my-4'>Personal Details</h2>
                <PersonalDetailsStep />
                <Button type="button" className='w-full py-6' onClick={goNextFromSubStep1}>
                  Next
                </Button>
              </>
            )}
            {currentStep === personalStep && subStep === 2 && (
              <>
                <h2 className='text-secondary font-medium text-3xl my-4'>Personal Details</h2>
                <PersonalDetailsContinueStep />
                <Button type="button" className='w-full py-6' onClick={goNextFromSubStep2}>Next</Button>
              </>
            )}
            {currentStep === createStep && (
              <>
                <h2 className='text-secondary font-medium text-3xl my-4'>Create Account</h2>
                <CreateAccountStep />
                <Button type="submit" className='w-full py-6' isLoading={registerLoading}>confirm</Button>
              </>
            )}
          </form>
        </Form>
      </FormProvider>

    </div>

  );
}
