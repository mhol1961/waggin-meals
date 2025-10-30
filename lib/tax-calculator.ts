/**
 * Tax Calculator Service
 *
 * Calculates sales tax for orders based on shipping address.
 * Supports state-level, county-level, and ZIP-level tax rates.
 *
 * Usage:
 *   const tax = await calculateTax(subtotal, shippingAddress);
 *   const breakdown = await getTaxBreakdown(items, shippingAddress);
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// =============================================
// TypeScript Interfaces
// =============================================

export interface ShippingAddress {
  address: string;
  address2?: string;
  city: string;
  state: string; // 2-letter state code
  zip: string;
  country?: string;
}

export interface TaxRate {
  id: string;
  state_code: string;
  state_name: string;
  county?: string;
  zip_code?: string;
  tax_rate: number; // Decimal (e.g., 0.0725 for 7.25%)
  is_active: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  is_taxable?: boolean; // Future: support tax-exempt items
}

export interface TaxBreakdown {
  subtotal: number;
  tax_rate: number; // Decimal (e.g., 0.0725)
  tax_rate_percentage: string; // Formatted (e.g., "7.25%")
  tax_amount: number;
  total: number;
  items: Array<{
    title: string;
    price: number;
    quantity: number;
    item_subtotal: number;
    item_tax: number;
    is_taxable: boolean;
  }>;
  applied_tax_rate: {
    state: string;
    county?: string;
    zip_code?: string;
    rate: number;
  };
}

export interface TaxCalculationResult {
  success: boolean;
  tax_amount: number;
  tax_rate: number;
  tax_rate_percentage: string;
  error?: string;
}

// =============================================
// Core Tax Calculation Functions
// =============================================

/**
 * Get tax rate for a given address
 * Looks up tax rate in order of specificity:
 * 1. ZIP code level (most specific)
 * 2. County level
 * 3. State level (fallback)
 */
export async function getTaxRate(
  state: string,
  zip?: string,
  county?: string
): Promise<{ rate: number; source: TaxRate | null }> {
  const stateCode = state.toUpperCase();

  try {
    // Try ZIP-level lookup first (most specific)
    if (zip) {
      const { data: zipRate, error: zipError } = await supabase
        .from('tax_rates')
        .select('*')
        .eq('state_code', stateCode)
        .eq('zip_code', zip)
        .eq('is_active', true)
        .single();

      if (!zipError && zipRate) {
        return { rate: Number(zipRate.tax_rate), source: zipRate };
      }
    }

    // Try county-level lookup
    if (county) {
      const { data: countyRate, error: countyError } = await supabase
        .from('tax_rates')
        .select('*')
        .eq('state_code', stateCode)
        .eq('county', county)
        .eq('is_active', true)
        .single();

      if (!countyError && countyRate) {
        return { rate: Number(countyRate.tax_rate), source: countyRate };
      }
    }

    // Fallback to state-level lookup
    const { data: stateRate, error: stateError } = await supabase
      .from('tax_rates')
      .select('*')
      .eq('state_code', stateCode)
      .is('zip_code', null)
      .is('county', null)
      .eq('is_active', true)
      .single();

    if (!stateError && stateRate) {
      return { rate: Number(stateRate.tax_rate), source: stateRate };
    }

    // No tax rate found - default to 0 (no tax)
    console.warn(`No tax rate found for state: ${stateCode}`);
    return { rate: 0, source: null };
  } catch (error) {
    console.error('Error fetching tax rate:', error);
    return { rate: 0, source: null };
  }
}

/**
 * Calculate tax amount for a given subtotal and shipping address
 * Returns the tax amount rounded to 2 decimal places
 */
export async function calculateTax(
  amount: number,
  shippingAddress: ShippingAddress
): Promise<TaxCalculationResult> {
  try {
    // Validate inputs
    if (!shippingAddress.state) {
      return {
        success: false,
        tax_amount: 0,
        tax_rate: 0,
        tax_rate_percentage: '0.00%',
        error: 'State is required for tax calculation',
      };
    }

    // Get tax rate
    const { rate, source } = await getTaxRate(
      shippingAddress.state,
      shippingAddress.zip,
      undefined // County not currently parsed from address
    );

    // Calculate tax
    const taxAmount = Math.round(amount * rate * 100) / 100; // Round to 2 decimal places

    return {
      success: true,
      tax_amount: taxAmount,
      tax_rate: rate,
      tax_rate_percentage: `${(rate * 100).toFixed(2)}%`,
    };
  } catch (error) {
    console.error('Tax calculation error:', error);
    return {
      success: false,
      tax_amount: 0,
      tax_rate: 0,
      tax_rate_percentage: '0.00%',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Calculate itemized tax breakdown for cart items
 * Useful for detailed receipts and order confirmations
 */
export async function getTaxBreakdown(
  items: CartItem[],
  shippingAddress: ShippingAddress
): Promise<TaxBreakdown | null> {
  try {
    // Get tax rate
    const { rate, source } = await getTaxRate(
      shippingAddress.state,
      shippingAddress.zip,
      undefined
    );

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate tax for each item
    const itemsWithTax = items.map((item) => {
      const isTaxable = item.is_taxable !== false; // Default to taxable
      const itemSubtotal = item.price * item.quantity;
      const itemTax = isTaxable
        ? Math.round(itemSubtotal * rate * 100) / 100
        : 0;

      return {
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        item_subtotal: Math.round(itemSubtotal * 100) / 100,
        item_tax: itemTax,
        is_taxable: isTaxable,
      };
    });

    // Calculate total tax
    const taxAmount = itemsWithTax.reduce((sum, item) => sum + item.item_tax, 0);
    const total = subtotal + taxAmount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax_rate: rate,
      tax_rate_percentage: `${(rate * 100).toFixed(2)}%`,
      tax_amount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      items: itemsWithTax,
      applied_tax_rate: {
        state: shippingAddress.state,
        county: source?.county,
        zip_code: source?.zip_code,
        rate: rate,
      },
    };
  } catch (error) {
    console.error('Error calculating tax breakdown:', error);
    return null;
  }
}

// =============================================
// Admin Functions (CRUD operations for tax rates)
// =============================================

/**
 * Get all tax rates with optional filtering
 */
export async function getAllTaxRates(filters?: {
  state_code?: string;
  is_active?: boolean;
}): Promise<TaxRate[]> {
  try {
    let query = supabase.from('tax_rates').select('*').order('state_code', { ascending: true });

    if (filters?.state_code) {
      query = query.eq('state_code', filters.state_code.toUpperCase());
    }

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as TaxRate[];
  } catch (error) {
    console.error('Error fetching tax rates:', error);
    return [];
  }
}

/**
 * Get a single tax rate by ID
 */
export async function getTaxRateById(id: string): Promise<TaxRate | null> {
  try {
    const { data, error } = await supabase
      .from('tax_rates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as TaxRate;
  } catch (error) {
    console.error('Error fetching tax rate:', error);
    return null;
  }
}

/**
 * Create a new tax rate
 */
export async function createTaxRate(taxRate: {
  state_code: string;
  state_name: string;
  county?: string;
  zip_code?: string;
  tax_rate: number;
  notes?: string;
  is_active?: boolean;
}): Promise<{ success: boolean; data?: TaxRate; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('tax_rates')
      .insert([
        {
          ...taxRate,
          state_code: taxRate.state_code.toUpperCase(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as TaxRate };
  } catch (error) {
    console.error('Error creating tax rate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Update an existing tax rate
 */
export async function updateTaxRate(
  id: string,
  updates: Partial<Omit<TaxRate, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; data?: TaxRate; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('tax_rates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: data as TaxRate };
  } catch (error) {
    console.error('Error updating tax rate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a tax rate (soft delete by setting is_active to false)
 */
export async function deleteTaxRate(
  id: string,
  hardDelete: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    if (hardDelete) {
      const { error } = await supabase.from('tax_rates').delete().eq('id', id);
      if (error) throw error;
    } else {
      // Soft delete
      const { error } = await supabase
        .from('tax_rates')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting tax rate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Bulk import tax rates from array
 * Useful for importing from CSV or other sources
 */
export async function bulkImportTaxRates(
  taxRates: Array<{
    state_code: string;
    state_name: string;
    county?: string;
    zip_code?: string;
    tax_rate: number;
    notes?: string;
  }>
): Promise<{ success: boolean; imported: number; errors: string[] }> {
  const errors: string[] = [];
  let imported = 0;

  for (const rate of taxRates) {
    const result = await createTaxRate(rate);
    if (result.success) {
      imported++;
    } else {
      errors.push(
        `Failed to import rate for ${rate.state_code}: ${result.error}`
      );
    }
  }

  return {
    success: errors.length === 0,
    imported,
    errors,
  };
}

// =============================================
// Helper Functions
// =============================================

/**
 * Format tax rate as percentage string
 */
export function formatTaxRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

/**
 * Parse tax rate from percentage string (e.g., "7.25%" -> 0.0725)
 */
export function parseTaxRate(percentage: string): number {
  const cleaned = percentage.replace('%', '').trim();
  const value = parseFloat(cleaned);
  return value / 100;
}

/**
 * Validate US state code
 */
export function isValidStateCode(stateCode: string): boolean {
  const validStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];
  return validStates.includes(stateCode.toUpperCase());
}

/**
 * Get state name from state code
 */
export function getStateName(stateCode: string): string {
  const stateNames: Record<string, string> = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
    MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
    NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
    OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
    SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
    VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
  };
  return stateNames[stateCode.toUpperCase()] || stateCode;
}
