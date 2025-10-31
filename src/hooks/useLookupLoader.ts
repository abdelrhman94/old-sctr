// hooks/useLookupLoader.ts
import { useMemo } from "react";

import { PaginationResponse, makeLookupLoader } from "@/utils/makeLookupLoader";

type Option = { label: string; value: string | number };
type BasePageParams = { pageNumber: number; pageSize: number; search?: string ; };

export function useLookupLoader<
  TParams extends BasePageParams,
  TItem extends { id: any; label: string }
>(
  trigger: (params: TParams) => { unwrap(): Promise<PaginationResponse<TItem>> },
  opts: {
    pageSize?: number;
    baseParams?: Omit<TParams, "pageNumber" | "pageSize" | "search">;
    map?: (item: TItem) => Option;
    deps?: any[]; // values that should recreate the loader (e.g. selectedCityId)
  } = {}
) {
  const { deps = [], ...rest } = opts;
  // Rebuild loader when trigger or any dep changes
  return useMemo(() => makeLookupLoader<TParams, TItem>(trigger, rest), [trigger, ...deps]);
}
