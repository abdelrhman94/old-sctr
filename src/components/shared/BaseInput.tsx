'use client'

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/libs/utils";
import { ChangeEvent } from "react";

interface InputProps {
  name?: string;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  nameAr?: boolean;
  style?: string;
  accept?: string;
  multiple?: boolean;
  value?: string | number | Date | File | File[]; // controlled usage
  defaultValue?: string;          // uncontrolled usage
  onChange?: (value: string | File | File[] | undefined) => void;
}

export const BaseInput = ({
  name,
  label,
  style,
  type = "text",
  placeholder,
  nameAr = false,
  disabled = false,
  accept,
  multiple,
  value,
  defaultValue,
  onChange,
}: InputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      const val = multiple ? Array.from(files ?? []) : files?.[0];
      onChange?.(val ?? undefined);
    } else {
      onChange?.(e.target.value);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={name}
        className={cn("text-sm font-medium", nameAr ? "text-right" : "")}
      >
        {label}
      </label>

      {type === "textarea" ? (
        <Textarea
          id={name}
          name={name}
          value={value as string}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          className={cn("resize-none", nameAr ? "text-right" : "", style)}
        />
      ) : type === "file" ? (
        <Input
          id={name}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value as string}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          className={cn(nameAr ? "text-right" : "", style)}
        />
      )}
    </div>
  );
};
