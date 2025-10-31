'use client';

import {useFormContext} from 'react-hook-form';
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from '@/components/ui/form';
import {Checkbox} from '@/components/ui/checkbox';
import {cn} from '@/libs/utils';

type FormCheckboxProps = {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export function FormCheckbox({
  name,
  label,
  description,
  disabled,
  className
}: FormCheckboxProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({field, fieldState}) => (
        <FormItem className={cn('flex items-center gap-3 space-y-0', className)}>
          <FormControl>
            <Checkbox
              checked={!!field.value}
              // onCheckedChange can be boolean | 'indeterminate'
              onCheckedChange={(v) => field.onChange(v === true)}
              disabled={disabled}
              aria-invalid={fieldState.invalid || undefined}
            />
          </FormControl>

          <div className="grid">
            {label && (
              <FormLabel className={cn('leading-none', fieldState.invalid && 'text-destructive')}>
                {label}
              </FormLabel>
            )}
            {description && <FormDescription>{description}</FormDescription>}
            {/* reserve space to prevent layout shift */}
            <FormMessage className="min-h-5" />
          </div>
        </FormItem>
      )}
    />
  );
}
