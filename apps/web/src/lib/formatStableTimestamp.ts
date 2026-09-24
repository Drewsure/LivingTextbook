const pad = (value: number) => String(value).padStart(2, "0");

/** Review evidence uses a deterministic UTC format during SSR and in browsers. */
export function formatStableTimestamp(value: string | undefined): string {
  if (!value) return "Timestamp unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid timestamp";

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}

export function formatStableTime(value: string | undefined): string {
  if (!value) return "Time unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid time";
  return `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}
