'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/libs/utils';
import { useFormContext } from 'react-hook-form';

type Option = {
  label: string;
  value?: string | number;
  id?: string | number;
};

interface FormChecklistInlineProps {
  name: string;
  label: string;
  description?: string;
  options: Option[];
  className?: string;
  valueType?: 'string' | 'number';
  readingId?: boolean;
  disabled?: boolean;
  loading?: boolean;
  skeletonItems?: number;
}

export function FormChecklist({
  name,
  label,
  description,
  options,
  className,
  valueType = 'string',
  readingId = false,
  disabled = false,
  loading = false,
  skeletonItems = 6,
}: FormChecklistInlineProps) {
  const form = useFormContext();

  const toWire = (v: string | number) =>
    valueType === 'number' ? Number(v) : String(v);

  const keyOf = (opt: Option) =>
    readingId ? opt.id ?? opt.value : opt.value ?? opt.id;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const current: (string | number)[] = Array.isArray(field.value) ? field.value : [];

        const isChecked = (v: string | number) =>
          current.some((x) => String(x) === String(v));

        const toggle = (v: string | number, checked: boolean) => {
          const next = checked
            ? Array.from(new Set([...current, v]))
            : current.filter((x) => String(x) !== String(v));
          field.onChange(next);
        };

        return (
          <FormItem className={cn('w-full', className)}>
            <FormLabel >{label}</FormLabel>
            {description && (
              <FormDescription className="mt-0.5 text-[15px]">
                {description}
              </FormDescription>
            )}

            <FormControl>
              {loading ? (
                // Skeleton list
                <ul className="mt-1 space-y-1">
                  {Array.from({ length: skeletonItems }).map((_, i) => (
                    <li key={i}>
                      <div className="flex items-center gap-3 py-1.5 pl-1 pr-2">
                        <Skeleton className="h-5 w-5 rounded-[6px]" aria-hidden />
                        <Skeleton className="h-4 w-40" aria-hidden />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="mt-1 space-y-1">
                  {options.map((opt, i) => {
                    const raw = keyOf(opt);
                    if (raw == null) return null;
                    const v = toWire(raw as string | number);
                    const id = `${name}-${i}`;

                    return (
                      <li key={String(v)}>
                        <label
                          htmlFor={id}
                          className={cn(
                            'flex items-center gap-3 rounded-md',
                            'py-1.5 pl-1 pr-2',
                            'hover:bg-muted/40'
                          )}
                        >
                          <Checkbox
                            id={id}
                            className="h-5 w-5 rounded-[6px]"
                            checked={isChecked(v)}
                            onCheckedChange={(c) => toggle(v, Boolean(c))}
                            disabled={disabled}
                          />
                          <span className="text-[15px] leading-6">{opt.label}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
