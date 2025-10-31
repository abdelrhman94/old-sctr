"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

const FormBooleanSelect = ({
  name,
  label,
  placeholder = 'Select…',
  disabled,
}: {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
}) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              value={typeof field.value === 'boolean' ? String(field.value) : ''}
              onValueChange={(val) => field.onChange(val === 'true')}
              disabled={disabled}
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
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormBooleanSelect