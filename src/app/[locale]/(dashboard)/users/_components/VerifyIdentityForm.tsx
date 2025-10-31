import FormDatePicker from '@/components/shared/FormDatePicker';
import { FormInput } from '@/components/shared/FormInput';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { identityValidationSchema } from '@/schemas/authSchema';
import { useIdentityValidationMutation } from '@/store/api/authApi';
import { setIdentityValidationData } from '@/store/slices/registrationUserDataSlice';
import { toLocalMidnightString } from '@/utils/dates';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { z } from "zod";

type IdentityValidationFormData = z.infer<typeof identityValidationSchema>;
const VerifyIdentityForm = () => {
  const dispatch = useDispatch();
  const [identityValidation, { isLoading }] = useIdentityValidationMutation();
  const form = useForm<IdentityValidationFormData>({
    resolver: zodResolver(identityValidationSchema),
    defaultValues: {
      idNumber: '',
      dateofbirth: undefined,

    },
  });

  const onSubmit: SubmitHandler<IdentityValidationFormData> = async (data, e) => {
    try {
      const payload = {
        ...data,
        dateofbirth: data.dateofbirth ? toLocalMidnightString(new Date(data.dateofbirth)) : undefined,
      };
      const response = await identityValidation(payload as any).unwrap();
      toast.success(response?.message);
      dispatch(setIdentityValidationData(response.data));

    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="create_sub_user"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="relative  flex items-center justify-center">
          <h2 className="text-secondary font-medium text-3xl my-1 text-center md:text-left">
            Verify Identity
          </h2>
        </div>
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
              <Button type="submit" className="w-full py-6" isLoading={isLoading} >
                Check
              </Button>
            </form>
          </Form>
        </FormProvider>
      </motion.div>
    </AnimatePresence>
  )
}

export default VerifyIdentityForm