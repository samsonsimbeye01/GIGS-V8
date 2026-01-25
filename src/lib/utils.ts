import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string) {
  try {
    if (currency && typeof amount === 'number') {
      return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
    }
    return amount.toLocaleString();
  } catch {
    return `${amount.toLocaleString()} ${currency || ''}`.trim();
  }
}

export function formatDateTime(isoString: string) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString();
  } catch {
    return isoString;
  }
}

export const CURRENT_LEGAL_VERSION = '2026.01';
export const CURRENT_LEGAL_UPDATED_AT = '2026-01-18T00:00:00.000Z';
