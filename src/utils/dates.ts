import { format, parseISO } from "date-fns";

export function toLocalMidnightString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}T00:00:00`;
}

export function formatToDDMMYYYY(
  dateInput: string | Date | null | undefined,
  formatStr: string = "dd/MM/yyyy"
): string {
  if (!dateInput) return "-";

  try {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    return format(date, formatStr);
  } catch (error) {
    console.error("Invalid date:", dateInput, error);
    return "-";
  }
}