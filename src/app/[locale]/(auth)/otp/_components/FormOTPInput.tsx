'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { cn } from '@/libs/utils';
import { useFormContext } from 'react-hook-form';

interface FormOTPInputProps {
  name: string;
  label: string;
  length?: number;              // default 6
  className?: string;
  nameAr?: boolean;
}

const FormOTPInput = ({
  name,
  label,
  length = 6,
  className,
  nameAr = false,
}: FormOTPInputProps) => {
  const form = useFormContext();

  // shared styles to get the look in your screenshot
  const slotClass =
    'h-12 w-12 md:h-14 md:w-14 rounded-2xl border border-muted-foreground/20 ' +
    'bg-white text-2xl md:text-3xl font-medium leading-none text-center ' +
    'shadow-sm ' +
    // remove spinners and keep caret centered
    '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ' +
    // focus/selected states
    'focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ' +
    'data-[state=selected]:ring-2 data-[state=selected]:ring-primary/40 data-[state=selected]:ring-offset-2';

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const value: string = typeof field.value === 'string' ? field.value : '';

        return (
          <FormItem className={cn('space-y-2', className)}>
            <FormControl>
              {/* Wrapper controls overall spacing */}
              <div className={cn('flex items-center', nameAr ? 'justify-end' : 'justify-start')}>
                <InputOTP
                  name={field.name}
                  value={value}
                  onChange={(v) => field.onChange(v.replace(/\D/g, '').slice(0, length))}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  maxLength={length}
                  // helps iOS/Android SMS auto-fill
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="\d*"
                >
                  <InputOTPGroup className="flex gap-4">
                    <InputOTPSlot index={0} className={slotClass} />
                    <InputOTPSlot index={1} className={slotClass} />
                    <InputOTPSlot index={2} className={slotClass} />
                    <InputOTPSlot index={3} className={slotClass} />
                    <InputOTPSlot index={4} className={slotClass} />
                    <InputOTPSlot index={5} className={slotClass} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormOTPInput;
