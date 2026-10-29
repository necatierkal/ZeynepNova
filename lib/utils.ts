import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind classes safely with clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats monetary amounts in Turkish Lira (TRY)
 * e.g. 1450.50 -> "1.450,50 ₺"
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "0,00 ₺";
  }
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Formats a date string in Turkish locale with Europe/Istanbul timezone
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Istanbul",
  }).format(d);
}

/**
 * Generates a clean URL slug from Turkish text
 * e.g. "Işıltılı Safir Yüzük" -> "isiltili-safir-yuzuk"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Generates a clean and unique SKU for jewelry products
 * e.g. ZN-KLY-0012
 */
export function generateSKU(categoryPrefix: string, sequence: number): string {
  const cleanPrefix = categoryPrefix.toUpperCase().slice(0, 3) || "GEN";
  const padded = String(sequence).padStart(4, "0");
  return `ZN-${cleanPrefix}-${padded}`;
}
