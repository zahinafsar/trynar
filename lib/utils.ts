import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTokenAmount(amount: number): string {
  if (amount < 1000000) {
    return amount.toString();
  } else {
    return `${amount / 1000000}M`;
  }
}