import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in Indian Rupees (Crores)
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted string in Crores (e.g., "₹5.25 Cr")
 */
export function formatCurrencyInCrores(amount) {
  if (!amount || amount === 0) return "₹0 Cr"
  
  // Convert to crores (1 crore = 1,00,00,000)
  const crores = amount / 10000000
  
  // Format with Indian number system and 2 decimal places
  return `₹${crores.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} Cr`
}

/**
 * Format currency in Indian Rupees (standard format)
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted string (e.g., "₹1,00,00,000")
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}
