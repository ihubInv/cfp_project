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
 * Format currency in Indian Rupees (Lakhs or Crores based on amount)
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted string (e.g., "₹5.25 Cr" or "₹25.50 L")
 */
export function formatCurrencyInLakhsOrCrores(amount) {
  if (!amount || amount === 0) return "₹0"
  
  // 1 Crore = 1,00,00,000 (10,000,000)
  // 1 Lakh = 1,00,000 (100,000)
  
  if (amount >= 10000000) {
    // Show in Crores
    const crores = amount / 10000000
    return `₹${crores.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    })} Cr`
  } else if (amount >= 100000) {
    // Show in Lakhs
    const lakhs = amount / 100000
    return `₹${lakhs.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} Lakh`
  } else {
    // Show in thousands or rupees
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`
  }
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
