'use client';

import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DatePicker, { DatePickerProps } from './DatePicker';

interface FormDatePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  name: string;
  label: string;
}

export default function FormDatePicker({ name, label, ...pickerProps }: FormDatePickerProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const valueAsDate =
          field.value instanceof Date
            ? field.value
            : field.value
              ? new Date(field.value)
              : undefined;

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <DatePicker
                {...pickerProps}
                value={valueAsDate}
                onChange={(d) => {
                  field.onChange(d ?? undefined);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
