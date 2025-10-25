/**
 * Utility functions for formatting values
 * Handles Supabase DECIMAL columns (returned as strings)
 */

/**
 * Safely format a decimal value (which may be a string or number)
 * to a fixed decimal string
 */
export function formatDecimal(value: string | number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) {
    return '0.00';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return '0.00';
  }

  return num.toFixed(decimals);
}

/**
 * Safely convert a decimal value to a number
 */
export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) {
    return 0;
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return 0;
  }

  return num;
}

/**
 * Format currency (adds $ sign)
 */
export function formatCurrency(value: string | number | null | undefined): string {
  return '$' + formatDecimal(value, 2);
}
