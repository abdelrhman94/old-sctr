'use client';

import { resetPasswordSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { FormInput } from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { useQueryState } from "nuqs";
import toast from "react-hot-toast";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const [codeQuery] = useQueryState("code");
  const [emailQuery] = useQueryState("email");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailQuery ?? "",
      token: codeQuery ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const response = await resetPassword(data).unwrap();
      toast.success(response?.message);
      router.push("/login");
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
          <FormInput name="newPassword" label="New Password" type="password" placeholder="••••••••" />
          <FormInput name="confirmPassword" label="Confirm New Password" type="password" placeholder="••••••••" />
          <Button type="submit" className="w-full py-6" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
