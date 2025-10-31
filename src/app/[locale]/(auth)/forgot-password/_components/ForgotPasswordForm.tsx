'use client';

import { forgotPasswordSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { FormInput } from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForgotPasswordMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();
      toast.success(response?.message);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  };

  return (
    <FormProvider {...form}>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-8">
          <FormInput name="email" label="Email Address" type="email" placeholder="you@example.com" />
          <Button type="submit" className="w-full py-6" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
