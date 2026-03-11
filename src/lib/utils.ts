import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNowStrict } from "date-fns";
import { de } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value: Date | string, dateFormat = "dd. MMM yyyy, HH:mm") {
  return format(new Date(value), dateFormat, { locale: de });
}

export function formatDate(value: Date | string, dateFormat = "dd. MMMM yyyy") {
  return format(new Date(value), dateFormat, { locale: de });
}

export function formatCountdown(value: Date | string) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: false, locale: de });
}

export function initials(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName]
    .filter(Boolean)
    .map((value) => value?.[0]?.toUpperCase())
    .join("")
    .slice(0, 2);
}

export function absoluteUrl(path: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}

export function groupBy<T>(items: T[], getKey: (item: T) => string) {
  return items.reduce<Record<string, T[]>>((accumulator, item) => {
    const key = getKey(item);
    accumulator[key] = accumulator[key] ?? [];
    accumulator[key].push(item);
    return accumulator;
  }, {});
}

export function serializeSearchParams(values: Record<string, string | number | boolean | null | undefined>) {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  return params.toString();
}
