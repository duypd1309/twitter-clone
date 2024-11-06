const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
});

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "N/A";
  return dateFormatter.format(date);
}
