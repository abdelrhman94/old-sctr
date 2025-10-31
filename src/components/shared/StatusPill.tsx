// components/shared/StatusPill.tsx
import { cn } from "@/libs/utils";
import React from "react";

type VariantMap = Record<string, string>;

type Props = {
  status?: string | null;
  isActive?: boolean | null;
  labels?: { active?: string; inactive?: string };
  variantMap?: VariantMap;
  className?: string;
  size?: "sm" | "md" | "lg";
  emptyFallback?: React.ReactNode;
};

const defaultVariants: VariantMap = {
  // status strings
  published: "bg-emerald-100 text-emerald-700",
  draft: "bg-zinc-100 text-zinc-600",
  returned: "bg-orange-100 text-orange-700",
  pending: "bg-amber-100 text-amber-700",
  // boolean
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-zinc-100 text-zinc-600",
};

const sizeCls: Record<NonNullable<Props["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-1.5 text-sm rounded-lg",
  lg: "px-6 py-2 text-sm rounded-xl",
};

function toKey(s: string) {
  return s.toLowerCase().trim();
}

export function StatusPill({
  status,
  isActive = null,
  labels,
  variantMap,
  className,
  size = "lg",
  emptyFallback = <div className="text-center">-</div>,
}: Props) {
  // Resolve label + key
  let label: string | null = null;
  let key: string | null = null;


  if (status && String(status).trim()) {
    label = String(status);
    key = toKey(label);
  } else if (typeof isActive === "boolean") {
    key = isActive ? "active" : "inactive";
    label = isActive ? labels?.active ?? "Active" : labels?.inactive ?? "Inactive";
  }

  if (!label || !key) return <>{emptyFallback}</>;

  const variants = { ...defaultVariants, ...(variantMap ?? {}) };
  let colorCls: string;
  if (key.startsWith("pending")) {
    colorCls = variants["pending"];
  } else {
    colorCls = variants[key] ?? "bg-gray-100 text-gray-700";
  }
  const base = "inline-flex items-center font-semibold leading-none";
  const sizeClasses = sizeCls[size];

  return (
    <span className={cn(base, sizeClasses, colorCls, className)}>
      {label}
    </span>
  );
}
