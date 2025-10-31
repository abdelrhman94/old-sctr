// utils/makeLookupLoader.ts
type Option = { label: string; value: string | number };

export interface PaginationResponse<T> {
  code?: number;
  message?: string;
  data: T[];
  totalRowsCount: number;
  pageNumber: number;
  pageSize: number;
  currentPage: number;
  numberOfPages: number;
}

type BasePageParams = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  // plus any endpoint-specific params like parentId, language, etc.
};

type TriggerFn<TParams, TItem> = (params: TParams) => {
  unwrap(): Promise<PaginationResponse<TItem>>;
};

interface MakeLoaderOpts<TParams extends BasePageParams, TItem> {
  pageSize?: number;
  baseParams?: Omit<TParams, "pageNumber" | "pageSize" | "search">;
  map?: (item: TItem) => Option;
}

export function makeLookupLoader<
  TParams extends BasePageParams,
  TItem extends { id: any; label: string }
>(
  trigger: TriggerFn<TParams, TItem>,
  { pageSize = 10, baseParams, map }: MakeLoaderOpts<TParams, TItem> = {}
) {
  const toOption = map ?? ((x: TItem) => ({ label: x.label, value: x.id }));

  return async function load(search: string, page: number) {
    const result = await trigger({
      ...(baseParams as any),
      pageNumber: 1, // <-- use caller’s page
      pageSize,
      search
    } as TParams).unwrap();

    return {
      ...result,
      data: result.data.map(toOption)
    } as PaginationResponse<Option>;
  };
}
