'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { INPUT_BASE_CLASSES } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/libs/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

export interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  displayFormat?: string; // default "PPP"
}

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  minDate = new Date(1900, 0, 1),
  maxDate = new Date(),
  className,
  displayFormat = 'PPP',
}: DatePickerProps) {
  // const fromYear = minDate.getFullYear();
  // const toYear = maxDate.getFullYear();

  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(INPUT_BASE_CLASSES, 'w-full h-12 justify-between text-left font-normal', !value && 'text-muted-foreground', className)}
        >
          {value ? format(value, displayFormat) : <span>{placeholder}</span>}
          <CalendarIcon className="ms-2 size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          className=''
          selected={value}
          onSelect={(d) => {
            if (d) {
              const local = new Date(d);
              local.setHours(0, 0, 0, 0);
              onChange(local);
            } else {
              onChange(undefined);
            }
            setOpen(false);
          }}
          disabled={(d) => d < minDate || d > maxDate}
          captionLayout="dropdown"

        />
      </PopoverContent>
    </Popover>
  );
}
