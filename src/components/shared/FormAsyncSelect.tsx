'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { components, GroupBase, PropsValue } from 'react-select';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';



type Option = {
  label: string;
  value: string | number;
  nameEn?: string;
  nameAr?: string;
  typeId?: string;
  typeName?: string;
};

interface AsyncFormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  valueType?: 'string' | 'number';
  loadPage: any;
  pageSize?: number;
  defaultOptions?: boolean;
  onSelected?: (opt: Option | null) => void;
  /** changing these values forces a refetch */
  cacheUniqs?: any[];
}

export function AsyncFormSelect({
  name,
  label,
  placeholder = 'Select…',
  disabled = false,
  valueType = 'string',
  loadPage,
  pageSize = 20,
  defaultOptions = false,
  cacheUniqs,
  onSelected,
}: AsyncFormSelectProps) {
  const form = useFormContext();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);


  // Watch the form field value
  const fieldValue = form.watch(name);

  const fromUI = (v: string | null) => {
    if (v === null) return undefined;
    return valueType === 'number' ? Number(v) : v;
  };

  const findOptionByValue = async (value: string | number): Promise<Option | null> => {
    if (value == null) return null;
    try {
      const response = await loadPage('', 1);
      const opt = response.data.find((o: any) => String(o.value) === String(value));
      return opt || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // keep the select's visible option in sync with the form value
    if (fieldValue != null && fieldValue !== '' && (!selectedOption || String(selectedOption.value) !== String(fieldValue))) {
      findOptionByValue(fieldValue).then(setSelectedOption);
    } else if (fieldValue == null || fieldValue === '') {
      setSelectedOption(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldValue]);

  // Correct AsyncPaginate signature: (input, loadedOptions, { page })
  const loadOptions: LoadOptions<Option, GroupBase<Option>, { page: number }> = async (
    inputValue,
    _loaded,
    additional
  ) => {
    const page = additional?.page ?? 1;
    const res = await loadPage(inputValue, page);
    return {
      options: res.data,
      hasMore: (res.currentPage ?? 1) < (res.numberOfPages ?? 1),
      additional: { page: (res.currentPage ?? 1) + 1 },
    };
  };


  const DropdownIndicator = (props: any) => (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="size-4 opacity-60" />
    </components.DropdownIndicator>
  );

  const ClearIndicator = (props: any) => (
    <components.ClearIndicator {...props}>
      <X className="size-4 opacity-60" />
    </components.ClearIndicator>
  );

  const LoadingIndicator = (props: any) => (
    <components.LoadingIndicator {...props}>
      <Loader2 className="size-4 animate-spin" />
    </components.LoadingIndicator>
  );


  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <AsyncPaginate<Option, GroupBase<Option>, { page: number }>
              value={selectedOption as PropsValue<Option>}
              loadOptions={loadOptions}
              onChange={(opt) => {
                const option = (opt ?? null) as Option | null;
                setSelectedOption(option);
                field.onChange(option ? fromUI(String(option.value)) : undefined);
                onSelected?.(opt ?? null);
              }}
              getOptionLabel={(opt) => opt.label}
              getOptionValue={(opt) => String(opt.value)}
              additional={{ page: 1 }}
              defaultOptions={defaultOptions}     // ✅ auto-fetch first page
              cacheUniqs={cacheUniqs}             // ✅ refetch when deps change
              isDisabled={disabled}
              debounceTimeout={300}
              // Let AsyncPaginate manage its own isLoading state (don’t override)
              loadingMessage={() => 'Loading…'}
              noOptionsMessage={() =>
                disabled ? 'Select a city first…' : 'No results'
              }
              // ---- Shadcn-like look ----
              unstyled
              classNames={{
                control: (state) =>
                  [
                    'h-12 w-full rounded-md bg-[#F7F9FC] p-0',
                    'border-0 shadow-none',
                    'pl-3 pr-2',
                    'focus-within:ring-2 focus-within:ring-primary/20',
                    state.isDisabled ? 'opacity-50 pointer-events-none' : '',
                    state.menuIsOpen ? 'ring-2 ring-primary/20' : '',
                  ].join(' '),
                container: () => 'w-full',
                valueContainer: () => 'gap-2',
                placeholder: () => 'text-muted-foreground',
                singleValue: () => 'text-foreground',
                input: () => 'text-foreground',
                indicatorsContainer: () => 'gap-1 pr-2',
                dropdownIndicator: () => 'opacity-70',
                clearIndicator: () => 'opacity-70 hover:opacity-100',
                menu: () =>
                  [
                    'mt-2 rounded-xl border border-black/5 shadow-lg',
                    'bg-popover text-popover-foreground',
                  ].join(' '),
                menuList: () => 'py-1 max-h-60 overflow-auto',
                option: (state) =>
                  [
                    'px-3 py-2 text-sm cursor-pointer',
                    state.isFocused ? 'bg-accent text-accent-foreground' : '',
                    state.isSelected ? 'bg-accent/60' : '',
                  ].join(' '),
                noOptionsMessage: () => 'px-3 py-2 text-sm text-muted-foreground',
                loadingMessage: () => 'px-3 py-2 text-sm text-muted-foreground',
              }}
              // Ensure the menu isn’t clipped
              menuPortalTarget={
                typeof window !== 'undefined' ? document.body : undefined
              }
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 50 }),
              }}
              // Replace built-in indicators
              components={{
                DropdownIndicator,
                ClearIndicator,
                LoadingIndicator,
              }}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}