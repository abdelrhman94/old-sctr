'use client';

import { loginSchema } from "@/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { FormInput } from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Link, useRouter } from "@/i18n/navigation";
import { useLoginMutation } from "@/store/api/authApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",

    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();
      const userData = {
        userName: response.data.userName,
        roles: response.data.roles,
        email: response.data.email,
        nationalId: response.data.nationalId,
        firstNameEn: response.data.firstNameEn,
        secondNameEn: response.data.secondNameEn,
        familyNameEn: response.data.familyNameEn,
        firstNameAr: response.data.firstNameAr,
        secondNameAr: response.data.secondNameAr,
        familyNameAr: response.data.familyNameAr
      };

      dispatch(
        loginSuccess({
          user: userData,
          token: response.data.token,
          refreshToken: response.data.refreshToken
        })
      );
      router.push("/dashboard");
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
          <FormInput name="password" label="Password" type="password" placeholder="••••••••" />
          <Link href="/forgot-password" className="text-[#000000DE] font-medium text-sm flex justify-end ">Forget Password</Link>
          <Button type="submit" className="w-full py-6" isLoading={isLoading}>
            Login
          </Button>
        </form>
      </Form>
    </FormProvider>
  );
}
