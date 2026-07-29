import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '';
  try {
    const d = new Date(String(dateStr).replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `${day}. ${month}. ${year}.`;
  } catch(e) {
    return '';
  }
}

export function calculateReadTime(htmlContent: string | null | undefined) {
  if (!htmlContent) return 1;
  const text = htmlContent.replace(/<[^>]*>?/gm, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
