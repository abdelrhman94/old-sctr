'use client';

import { ChevronDown, Loader2, X } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { components, GroupBase, PropsValue } from 'react-select';
import { AsyncPaginate, LoadOptions } from 'react-select-async-paginate';

// ---- Types ----
export type Option = {
  label: string;
  value: string | number;
  nameEn?: string;
  nameAr?: string;
};

export type PageResult = {
  data: Option[];
  currentPage: number;
  numberOfPages: number;
};

type LoadPageFn = (
  search: string,
  page: number,
  pageSize?: number
) => Promise<PageResult>;

type CommonProps = {
  placeholder?: string;
  disabled?: boolean;
  valueType?: 'string' | 'number';
  loadPage: LoadPageFn;
  pageSize?: number;
  defaultOptions?: boolean;
  cacheUniqs?: any[];
  debounceMs?: number;
  emptyLabel?: string;
  loadingLabel?: string;
  className?: string;
  menuZIndex?: number;
};

type StandaloneProps = CommonProps & {
  /** Controlled/semicontrolled API for reusability outside RHF */
  value?: string | number | null | undefined;
  onChange?: (
    value: string | number | undefined,
    option: Option | null
  ) => void;
  /** If true and a value is provided, the component resolves the label by calling loadPage once. */
  resolveLabel?: boolean;
  /** Optional label element when used standalone */
  label?: React.ReactNode;
};

export function AsyncPaginateSelect({
  label,
  value,
  onChange,
  resolveLabel = true,
  placeholder = 'Select…',
  disabled = false,
  valueType = 'string',
  loadPage,
  pageSize = 20,
  defaultOptions = false,
  cacheUniqs,
  debounceMs = 300,
  emptyLabel = 'No results',
  loadingLabel = 'Loading…',
  className,
  menuZIndex = 50
}: StandaloneProps) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const lastResolvedValueRef = useRef<string | number | null | undefined>(undefined);

  const fromUI = (v: string | null) => {
    if (v === null) return undefined;
    return valueType === 'number' ? Number(v) : v;
  };

  // Resolve option by value to show the correct label (one-time per value)
  useEffect(() => {
    let cancelled = false;

    async function run() {
      // No value → clear
      if (value == null || value === '') {
        setSelectedOption(null);
        lastResolvedValueRef.current = value;
        return;
      }

      // If already resolved for this value, skip
      if (lastResolvedValueRef.current === value) return;

      // If we already have a matching option, skip fetch
      if (selectedOption && String(selectedOption.value) === String(value)) {
        lastResolvedValueRef.current = value;
        return;
      }

      if (!resolveLabel) {
        // If not resolving, just keep the value internally as a ghost option
        setSelectedOption((prev) => {
          if (prev && String(prev.value) === String(value)) return prev;
          return { label: String(value), value }; // placeholder label
        });
        lastResolvedValueRef.current = value;
        return;
      }

      try {
        const res = await loadPage('', 1, pageSize);
        if (cancelled) return;
        const opt = res.data.find((o) => String(o.value) === String(value)) ?? null;
        setSelectedOption(opt);
        lastResolvedValueRef.current = value;
      } catch {
        // swallow; keep whatever we had
        lastResolvedValueRef.current = value;
      }
    }

    run();

    return () => {
      cancelled = true;
    };
    // re-run if value or cacheUniqs change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, resolveLabel, pageSize, ...(cacheUniqs ?? [])]);

  // AsyncPaginate signature: (input, loadedOptions, { page })
  const loadOptions: LoadOptions<Option, GroupBase<Option>, { page: number }> =
    useMemo(
      () =>
        async (inputValue, _loaded, additional) => {
          const page = additional?.page ?? 1;
          const res = await loadPage(inputValue, page, pageSize);
          return {
            options: res.data,
            hasMore: (res.currentPage ?? 1) < (res.numberOfPages ?? 1),
            additional: { page: (res.currentPage ?? 1) + 1 },
          };
        },
      [loadPage, pageSize]
    );

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
    <div className={className}>
      {label ? <label className="mb-2 block text-sm font-medium">{label}</label> : null}

      <AsyncPaginate<Option, GroupBase<Option>, { page: number }>
        value={selectedOption as PropsValue<Option>}
        loadOptions={loadOptions}
        onChange={(opt) => {
          const option = (opt ?? null) as Option | null;
          setSelectedOption(option);
          const nextValue = option ? fromUI(String(option.value)) : undefined;
          onChange?.(nextValue, option);
        }}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => String(opt.value)}
        additional={{ page: 1 }}
        defaultOptions={defaultOptions}
        cacheUniqs={cacheUniqs}
        isDisabled={disabled}
        debounceTimeout={debounceMs}
        loadingMessage={() => loadingLabel}
        noOptionsMessage={() => (disabled ? 'Disabled…' : emptyLabel)}
        // ---- shadcn-like look (unstyled) ----
        unstyled
        classNames={{
          control: (state) =>
            [
              'h-10 w-full rounded-md bg-[#F7F9FC] p-0',
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
        // menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: menuZIndex }),
        }}
        components={{
          DropdownIndicator,
          ClearIndicator,
          LoadingIndicator,
        }}
        placeholder={placeholder}
      />
    </div>
  );
}