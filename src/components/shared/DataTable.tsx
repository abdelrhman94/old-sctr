"use client"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import React from "react"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"
import { Skeleton } from "../ui/skeleton"


type PageMeta = {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  totalRows: number;
};
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: PageMeta;
  onPageChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => void;
  onPageSizeChange?: (size: number) => void;
  filterColumnId?: string;
  isLoading?: boolean
  skeletonRows?: number
}


export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  onPageChange,
  onPageSizeChange,
  filterColumnId,
  isLoading = false,
  skeletonRows,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: onPageChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: { pageIndex: page.pageIndex, pageSize: page.pageSize },
    },
    manualPagination: true,
    pageCount: page.pageCount,
  })

  function getPageNumbers(current: number, total: number) {
    const pages: (number | "...")[] = [];
    const add = (n: number) => pages.push(n);

    if (total <= 7) {
      for (let i = 1; i <= total; i++) add(i);
      return pages;
    }
    const c = current;
    add(1);
    if (c > 3) pages.push("...");
    for (let i = Math.max(2, c - 1); i <= Math.min(total - 1, c + 1); i++) add(i);
    if (c < total - 2) pages.push("...");
    add(total);
    return pages;
  }

  const currentPageOneBased = page.pageIndex + 1;
  const pages = getPageNumbers(currentPageOneBased, page.pageCount);

  const visibleCols = table.getVisibleFlatColumns()
  const skeletonCount = (skeletonRows ?? page.pageSize) || 10

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 py-4">
        {filterColumnId && (
          <Input
            placeholder={`Filter ${filterColumnId}…`}
            value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn(filterColumnId)?.setFilterValue(e.target.value)}
            className="max-w-sm"
          />
        )}


      </div>
      
      <div className="rounded-md bg-white overflow-x-auto min-h-[400px]">
        <Table className=" min-w-max">
          <TableHeader >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: skeletonCount }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {visibleCols.map((col) => (
                    <TableCell key={`skc-${col.id}-${i}`}>
                      <Skeleton className="h-4 w-[60%]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-normal break-words">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        {page.pageCount > 1 && (<Pagination className="w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page.pageIndex > 0) table.setPageIndex(page.pageIndex - 1);
                }}
              />
            </PaginationItem>

            {pages.map((p, idx) =>
              p === "..." ? (
                <PaginationItem key={`el-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === currentPageOneBased}
                    onClick={(e) => {
                      e.preventDefault();
                      table.setPageIndex((p as number) - 1);
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page.pageIndex < page.pageCount - 1) {
                    table.setPageIndex(page.pageIndex + 1);
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>)}
        
      </div>
    </div>
  )
}
