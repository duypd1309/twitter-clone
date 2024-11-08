import { format, formatDistanceToNowStrict } from "date-fns";

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return format(date, "MMMM yyyy"); // "MMMM" cho tên tháng đầy đủ, "yyyy" cho năm
}

export function formatRelativeTime(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return formatDistanceToNowStrict(date, { addSuffix: true });
}
