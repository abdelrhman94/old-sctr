'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/libs/utils";
import { useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  nameAr?: boolean;
  style?: string;
  accept?: string;
  multiple?: boolean;
  // optional extras for number inputs
  min?: number;
  max?: number;
  step?: number | "any";
}

export const FormInput = ({
  name,
  label,
  style,
  type = "text",
  placeholder,
  nameAr = false,
  disabled = false,
  accept,
  multiple,
  min,
  max,
  step = "any",
}: FormInputProps) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className={nameAr ? "justify-end" : ""}>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                className={cn("resize-none", nameAr ? "text-right" : "", style)}
              />
            ) : type === "file" ? (
              <Input
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                onChange={(e) => {
                  const files = e.target.files;
                  const value = multiple ? Array.from(files ?? []) : files?.[0];
                  field.onChange(value ?? undefined);
                }}
              />
            ) : type === "number" ? (
              <Input
                // keep controlled value as string for the DOM, convert onChange
                value={field.value ?? ""}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                type="number"
                placeholder={placeholder}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                inputMode="decimal" // numeric keyboard on mobile
                className={cn(nameAr ? "text-right" : "", "no-spinners", style)}
                onChange={(e) => {
                  // Convert to number for RHF state (so the submitted value is a number)
                  const raw = e.target.value;
                  const num = raw === "" ? undefined : Number(raw);
                  field.onChange(num);
                }}
              />
            ) : (
              <Input
                {...field}
                className={cn(nameAr ? "text-right" : "", style)}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
