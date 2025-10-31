'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

type Option = {
  label: string;
  value?: string | number;
  id?: string | number;
  nameEn?: string;
  nameAr?: string;
};

interface FormSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  valueType?: 'string' | 'number';
  emptyLabel?: string;
  loadingLabel?: string;
  readingId?: boolean;
}

export function FormSelect({
  name,
  label,
  options,
  placeholder = 'Select…',
  disabled = false,
  valueType = 'string',
  loading = false,
  emptyLabel = 'No results',
  loadingLabel = 'Loading…',
  readingId = false
}: FormSelectProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // shadcn Select works with strings; convert both ways
        const toUI = (v: unknown) =>
          v === undefined || v === null ? '' : String(v);

        const fromUI = (v: string) =>
          valueType === 'number' ? Number(v) : v;



        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Select
                value={toUI(field.value)}
                onValueChange={(val) => field.onChange(fromUI(val))}
                disabled={disabled || loading}
              >
                <SelectTrigger className="
      !h-12 w-full rounded-md
       border-0 shadow-none
      bg-[#F7F9FC] p-3
      focus:ring-2 focus:ring-primary/20 data-[state=open]:ring-2
    ">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-black/5 shadow-lg" position="popper" align="start">
                  {loading ? (
                    // Loading sentinel (non-empty value, disabled)
                    <SelectItem value="__loading" disabled>
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {loadingLabel}
                      </span>
                    </SelectItem>
                  ) : options.length > 0 ? (
                    options.map((opt, index) => (
                      <SelectItem key={opt.id ?? opt.value ?? index} value={String(readingId ? opt.id : opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))
                  ) : (
                    // Empty sentinel (non-empty value, disabled)
                    <SelectItem value="__empty" disabled>
                      {emptyLabel}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
