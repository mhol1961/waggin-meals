/**
 * Shipping Carrier Service - Real-Time Rate Integration
 *
 * Integrates with Shippo API for real-time carrier rates from USPS, UPS, FedEx
 * Falls back to zone-based rates if API is unavailable or not configured
 */

import { ShippingAddress, ShippingMethod, calculateShipping } from '@/types/shipping';

export interface CarrierRate {
  carrier: string; // 'USPS', 'UPS', 'FedEx'
  service: string; // 'Priority Mail', 'Ground', etc.
  price: number;
  estimatedDays: number;
  provider: string; // 'shippo', 'easypost', 'zone-based'
}

interface ShippoAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ShippoParcel {
  length: string;
  width: string;
  height: string;
  distance_unit: 'in' | 'cm';
  weight: string;
  mass_unit: 'lb' | 'kg';
}

interface ShippoShipmentRequest {
  address_from: ShippoAddress;
  address_to: ShippoAddress;
  parcels: ShippoParcel[];
  async: boolean;
}

interface ShippoRate {
  object_id: string;
  amount: string;
  currency: string;
  provider: string;
  servicelevel: {
    name: string;
    token: string;
  };
  estimated_days: number;
  duration_terms: string;
}

interface ShippoShipmentResponse {
  rates: ShippoRate[];
  messages: Array<{
    code: string;
    message: string;
    source: string;
  }>;
}

/**
 * Check if Shippo is configured
 */
export function isShippoConfigured(): boolean {
  return !!process.env.SHIPPO_API_KEY;
}

/**
 * Get shipping origin address from environment
 */
function getOriginAddress(): ShippoAddress {
  return {
    name: process.env.SHIPPING_ORIGIN_NAME || 'Waggin Meals',
    street1: process.env.SHIPPING_ORIGIN_STREET || '123 Main St',
    street2: process.env.SHIPPING_ORIGIN_STREET2 || '',
    city: process.env.SHIPPING_ORIGIN_CITY || 'Asheville',
    state: process.env.SHIPPING_ORIGIN_STATE || 'NC',
    zip: process.env.SHIPPING_ORIGIN_ZIP || '28801',
    country: 'US',
  };
}

/**
 * Convert ShippingAddress to Shippo format
 */
function toShippoAddress(
  address: ShippingAddress,
  name: string = 'Customer'
): ShippoAddress {
  return {
    name,
    street1: address.street,
    street2: '',
    city: address.city,
    state: address.state,
    zip: address.zipCode,
    country: address.country || 'US',
  };
}

/**
 * Create parcel dimensions for package
 */
function createParcel(totalWeight: number): ShippoParcel {
  // Default box dimensions (can be customized based on actual packaging)
  return {
    length: '12',
    width: '10',
    height: '8',
    distance_unit: 'in',
    weight: totalWeight.toFixed(2),
    mass_unit: 'lb',
  };
}

/**
 * Fetch real-time rates from Shippo API
 */
async function fetchShippoRates(
  destinationAddress: ShippingAddress,
  totalWeight: number,
  customerName: string = 'Customer'
): Promise<CarrierRate[]> {
  if (!isShippoConfigured()) {
    throw new Error('Shippo API key not configured');
  }

  const apiKey = process.env.SHIPPO_API_KEY!;
  const apiUrl = 'https://api.goshippo.com/shipments/';

  const shipmentRequest: ShippoShipmentRequest = {
    address_from: getOriginAddress(),
    address_to: toShippoAddress(destinationAddress, customerName),
    parcels: [createParcel(totalWeight)],
    async: false, // Synchronous rate request
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `ShippoToken ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Shippo API error: ${response.status} - ${errorText}`);
    }

    const data: ShippoShipmentResponse = await response.json();

    // Check for API-level errors
    if (data.messages && data.messages.length > 0) {
      const errors = data.messages.filter(m => m.source === 'Shippo');
      if (errors.length > 0) {
        console.warn('[Shippo] API warnings:', errors);
      }
    }

    // Convert Shippo rates to our format
    const carrierRates: CarrierRate[] = data.rates
      .filter(rate => parseFloat(rate.amount) > 0) // Filter out invalid rates
      .map(rate => ({
        carrier: rate.provider,
        service: rate.servicelevel.name,
        price: parseFloat(rate.amount),
        estimatedDays: rate.estimated_days || 7,
        provider: 'shippo',
      }))
      .sort((a, b) => a.price - b.price); // Sort by price

    return carrierRates;
  } catch (error) {
    console.error('[Shippo] Failed to fetch rates:', error);
    throw error;
  }
}

/**
 * Get hybrid shipping rates (flat rate for small/medium, zone-based for large)
 */
function getHybridRates(
  subtotal: number,
  totalWeight: number,
  address: ShippingAddress
): ShippingMethod[] {
  const calculation = calculateShipping(subtotal, totalWeight, address);
  return calculation.availableMethods;
}

/**
 * Get shipping rates with automatic fallback
 *
 * Tries Shippo API first, falls back to zone-based rates if unavailable
 */
export async function getShippingRates(
  subtotal: number,
  totalWeight: number,
  address: ShippingAddress,
  customerName?: string
): Promise<{
  methods: ShippingMethod[];
  provider: 'shippo' | 'zone-based';
  freeShippingQualified: boolean;
}> {
  const freeShippingQualified = subtotal >= 165.00;

  // Try Shippo if configured
  if (isShippoConfigured()) {
    try {
      const carrierRates = await fetchShippoRates(address, totalWeight, customerName);

      // Convert carrier rates to ShippingMethod format
      const methods: ShippingMethod[] = carrierRates.map(rate => ({
        id: `${rate.carrier}-${rate.service}`.toLowerCase().replace(/\s+/g, '-'),
        name: `${rate.carrier} ${rate.service}`,
        description: `Delivery via ${rate.carrier}`,
        estimatedDays: `${rate.estimatedDays} business days`,
        price: freeShippingQualified ? 0 : rate.price,
        isFree: freeShippingQualified,
      }));

      // Always add local pickup option
      methods.unshift({
        id: 'local-pickup',
        name: 'Local Pickup',
        description: 'Pick up at our Asheville location',
        estimatedDays: 'Same day / Next day',
        price: 0,
        isFree: true,
      });

      return {
        methods,
        provider: 'shippo',
        freeShippingQualified,
      };
    } catch (error) {
      console.warn('[Shipping] Shippo API failed, falling back to zone-based rates:', error);
      // Fall through to zone-based rates
    }
  }

  // Fallback to hybrid rates (flat + zone-based)
  const hybridMethods = getHybridRates(subtotal, totalWeight, address);
  return {
    methods: hybridMethods,
    provider: 'zone-based',
    freeShippingQualified,
  };
}

/**
 * Calculate shipping for checkout
 * Returns selected method and total cost
 */
export async function calculateCheckoutShipping(
  subtotal: number,
  items: Array<{ weight?: string; quantity: number }>,
  address: ShippingAddress,
  preferredMethodId?: string
): Promise<{
  selectedMethod: ShippingMethod;
  allMethods: ShippingMethod[];
  provider: 'shippo' | 'zone-based';
}> {
  // Calculate total weight
  const { parseWeight } = await import('@/types/shipping');
  let totalWeight = 0;
  for (const item of items) {
    const quantity = item.quantity || 1;
    if (item.weight) {
      const itemWeight = parseWeight(item.weight);
      totalWeight += itemWeight * quantity;
    } else {
      totalWeight += 1 * quantity;
    }
  }

  // Ensure minimum weight
  if (totalWeight < 1) {
    totalWeight = 1;
  }

  // Get available shipping methods
  const { methods, provider, freeShippingQualified } = await getShippingRates(
    subtotal,
    totalWeight,
    address
  );

  // Select method
  let selectedMethod: ShippingMethod;
  if (preferredMethodId) {
    const preferred = methods.find(m => m.id === preferredMethodId);
    selectedMethod = preferred || methods[0];
  } else {
    // Auto-select cheapest method (excluding pickup)
    const shippingMethods = methods.filter(m => m.id !== 'local-pickup');
    selectedMethod = shippingMethods.length > 0
      ? shippingMethods.reduce((prev, curr) => prev.price < curr.price ? prev : curr)
      : methods[0];
  }

  return {
    selectedMethod,
    allMethods: methods,
    provider,
  };
}

/**
 * Validate shipping address
 * Can be extended with address verification API
 */
export function validateShippingAddress(address: ShippingAddress): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!address.street || address.street.trim().length === 0) {
    errors.push('Street address is required');
  }

  if (!address.city || address.city.trim().length === 0) {
    errors.push('City is required');
  }

  if (!address.state || address.state.trim().length === 0) {
    errors.push('State is required');
  }

  if (!address.zipCode || !/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
    errors.push('Valid ZIP code is required (e.g., 12345 or 12345-6789)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
