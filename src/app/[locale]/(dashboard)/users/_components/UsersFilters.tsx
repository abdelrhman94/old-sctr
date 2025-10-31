import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/libs/utils";
import { Lookups } from "@/models/lookups.model";
import { useGetLookupByNameQuery } from "@/store/api/lookups.Api";
import { format, isValid } from "date-fns";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { useQueryStates } from "nuqs";
import { useState } from "react";

export default function UsersFilters({
  date, accountType, userStatus, setQuery, onChanged,
}: {
  date: Date | null;
  accountType: number | null;
  userStatus: number | null;
  setQuery: ReturnType<typeof useQueryStates>[1];
  onChanged?: () => void;
}) {
  const displayDate =
    date && isValid(date) ? format(date, "dd-MM-yyyy") : "Pick a date";
  const [open, setOpen] = useState(false)

  const { data: userTypesLookup, isLoading: userTypesLoading } = useGetLookupByNameQuery({ name: 'EnumAppUserType' });
  type BoolOrNull = boolean | null;
  const selectToStatus = (v: string): BoolOrNull =>
    v === "-1" ? null : v === "1";
  const statusToSelect = (v: BoolOrNull): "-1" | "1" | "2" =>
    v === null ? "-1" : v ? "1" : "2";

  return (
    <div className="rounded-xl border bg-white p-3 flex items-center gap-4">
      {/* Icon + label */}
      <div className="flex items-center gap-2 px-2">
        <span className="text-sm font-medium">Filter By</span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 border-l pl-4 ">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="justify-start w-44 px-3 border rounded-md">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className={cn(!date && "text-muted-foreground")}>{displayDate}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date ?? undefined}
              onSelect={(d) => {
                setQuery({ date: d ?? null, page: 1 });
                onChanged?.();
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/*  Account Type */}
      <div className="border-l pl-4">
        <Select
          value={accountType?.toString() ?? ""}
          onValueChange={(val) => {
            setQuery({ accountType: val === "-1" ? null : Number(val), page: 1 });
            onChanged?.();
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Account Type" />
          </SelectTrigger>
          <SelectContent>
            {/* "All" sentinel */}
            <SelectItem value="-1">All Statuses</SelectItem>

            {/* Loading */}
            {userTypesLoading && (
              <SelectItem value="__loading" disabled>
                Loading…
              </SelectItem>
            )}

            {/* Success with options */}
            {!userTypesLoading &&
              (userTypesLookup?.data?.EnumAppUserType?.length ? (
                userTypesLookup.data.EnumAppUserType.map((item: Lookups) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                // Empty state
                <SelectItem value="__empty" disabled>
                  No types found
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/*  Status */}
      <div className="border-l pl-4">
        <Select
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          value={statusToSelect(userStatus)}
          onValueChange={(val) => {
            setQuery({ userStatus: selectToStatus(val), page: 1 });
            onChanged?.();
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-1">All Statuses</SelectItem>
            <SelectItem value="1">Active</SelectItem>
            <SelectItem value="2">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset */}
      <div className="ml-auto border-l pl-4">
        <Button
          variant="ghost"
          className="text-red-600 hover:text-red-700"
          onClick={() => {
            setQuery({ date: null, accountType: null, userStatus: null, search: "", page: 1 });
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filter
        </Button>
      </div>
    </div>
  );
}
