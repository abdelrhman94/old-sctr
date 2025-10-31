import FormDatePicker from "@/components/shared/FormDatePicker";
import { FormInput } from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { identityValidationSchema } from '@/schemas/authSchema';
import { useIdentityValidationMutation } from '@/store/api/authApi';
import { setStep } from "@/store/slices/registrationStepsSlice";
import { setIdentityValidationData } from "@/store/slices/registrationUserDataSlice";
import { toLocalMidnightString } from "@/utils/dates";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useDispatch } from "react-redux";
import { z } from "zod";

type IdentityValidationFormData = z.infer<typeof identityValidationSchema>;

type VerifyProps = {
  nextStep?: number; // 1-based index of the step to go to after success
};

const VerifyIdentityStepInner = ({ nextStep }: VerifyProps) => {
  const dispatch = useDispatch();
  const [recaptchaError, setRecaptchaError] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [identityValidation, { isLoading }] = useIdentityValidationMutation();

  const form = useForm<IdentityValidationFormData>({
    resolver: zodResolver(identityValidationSchema),
    defaultValues: {
      idNumber: '',
      dateofbirth: undefined,

    },
  });


  const onSubmit: SubmitHandler<IdentityValidationFormData> = async (data, e) => {
    // e?.preventDefault();
    // if (!recaptchaToken) {
    //   setRecaptchaError(true);
    //   return;
    // }
    try {
      const payload = {
        ...data,
        dateofbirth: data.dateofbirth ? toLocalMidnightString(new Date(data.dateofbirth)) : undefined,
      };
      const response = await identityValidation(payload as any).unwrap();
      toast.success(response?.message);
      dispatch(setIdentityValidationData(response.data));
      dispatch(setStep(nextStep ?? 2));
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };


  // const handleRecaptchaVerification = async () => {
  //   if (!executeRecaptcha) {
  //     toast.error("Recaptcha is not available");
  //     return;
  //   }

  //   const token = await executeRecaptcha("form_submit");
  //   if (token) {
  //     setRecaptchaToken(token);
  //     setRecaptchaError(false);
  //   }
  // };



  return (

    <div className="relative min-h-[300px] mt-5">
      <AnimatePresence mode="wait">
        <motion.div
          key="create_account"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          transition={{ duration: 0.3 }}
          className=" w-full"
        >
          <h2 className='text-secondary font-medium text-3xl my-1'>Verify Identity</h2>

          <FormProvider {...form}>
            <Form {...form} >
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-8">
                <FormInput name="idNumber" label="ID Number" type="text" placeholder="" />
                <FormDatePicker
                  placeholder=""
                  name="dateofbirth"
                  label="Date of Birth"
                  minDate={new Date(1900, 0, 1)}
                  maxDate={new Date()}
                  displayFormat="dd/MM/yyyy"
                />
                {recaptchaError && (
                  <span className="text-red-600 my-2">
                    Please verify you are not a robot
                  </span>
                )}
                <Button type="submit" className="w-full py-6" isLoading={isLoading} >
                  Check
                </Button>
              </form>
            </Form>
          </FormProvider>
        </motion.div>
      </AnimatePresence>
    </div>

  )
}

export default VerifyIdentityStepInner