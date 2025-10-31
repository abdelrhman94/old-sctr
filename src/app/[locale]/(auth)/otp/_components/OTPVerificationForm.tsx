import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "@/i18n/navigation";
import { verifySchema } from "@/schemas/authSchema";
import { useConfirmEmailMutation, useResendConfirmEmailMutation } from "@/store/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryState } from "nuqs";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import FormOTPInput from "./FormOTPInput";
import { useEffect, useState } from "react";

type VerifyFormData = z.infer<typeof verifySchema>;

export default function OTPVerificationForm() {
  const router = useRouter();
  const [email] = useQueryState("email");
  const [confirmEmail, { isLoading: isConfirmLoading }] = useConfirmEmailMutation();
  const [resendConfirmEmail, { isLoading: isResendLoading }] = useResendConfirmEmailMutation();

  const form = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
      email: email ?? '',
    },
  });

  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const onResend = async () => {
    form.reset()
    try {
      const response = await resendConfirmEmail(email ?? '').unwrap();
      toast.success(response?.message);
      // restart timer
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";
      toast.error(errorMessage);
    }
  }

  const onSubmit = async (data: VerifyFormData) => {
    try {
      const response = await confirmEmail(data).unwrap();
      router.push('/success');
    } catch (error) {
      const errorMessage =
        (error as { data?: { message?: string } })?.data?.message ?? (error as { message?: string })?.message ??
        "Something went wrong";

      toast.error(errorMessage);
    }
  }

  return (
    <FormProvider {...form}>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 my-8">
          <FormOTPInput
            name="code"
            label=""
            length={6}
          />
          <div className="flex items-center gap-3">
            <p className='text-[#000000B2] font-light text-sm my-1'>I didn’t receive a code.</p>
            <Button type="button" className="!p-0" variant="link" onClick={onResend} isLoading={isResendLoading} disabled={!canResend}>{canResend ? "Resend" : `Resend in ${timeLeft}s`}</Button>
          </div>
          <Button type="submit" className="w-full py-6 " isLoading={isConfirmLoading}>
            Verify
          </Button>
        </form>
      </Form>
    </FormProvider>
  )
}