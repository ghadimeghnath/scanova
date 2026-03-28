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
 
/** Format paise → ₹ string, e.g. 49900 → "₹499" */
export function formatPrice(paise) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
 
/** Generate sequential order number SCNV-00001 */
export function generateOrderNumber(count) {
  return `SCNV-${String(count).padStart(5, "0")}`;
}
 
/** Validate Indian phone number */
export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""));
}
 
/** Validate pincode */
export function isValidPincode(pin) {
  return /^\d{6}$/.test(pin);
}
 
/** Validate email */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
 
