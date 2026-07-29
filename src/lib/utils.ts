import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return '';
  try {
    const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);
      return `${day}. ${month}. ${year}.`;
    }
    
    const d = new Date(String(dateStr).replace(' ', 'T'));
    if (isNaN(d.getTime())) return '';
    return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}.`;
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
