import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import crypto from "crypto";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateShortCode(prefix = "") {
  const raw = crypto.randomBytes(4).toString("hex"); // 8 chars
  return prefix ? `${prefix}-${raw}` : raw;
}
