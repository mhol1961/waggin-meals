// Shipping Types and Calculator

export interface ShippingZone {
  id: string;
  name: string;
  states: string[]; // State abbreviations
  baseRate: number;
  perPoundRate: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedDays: string;
  price: number;
  isFree: boolean;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface ShippingCalculation {
  subtotal: number;
  weight: number; // total weight in pounds
  address: ShippingAddress;
  availableMethods: ShippingMethod[];
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
  qualifiesForFreeShipping: boolean;
}

// Shipping zones for Waggin Meals
export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'local',
    name: 'Local (Asheville Area)',
    states: ['NC'], // Will check city for more specific matching
    baseRate: 0, // Free local delivery
    perPoundRate: 0,
  },
  {
    id: 'zone-1',
    name: 'Zone 1 (Southeast)',
    states: ['NC', 'SC', 'GA', 'TN', 'VA', 'WV', 'KY', 'FL', 'AL', 'MS'],
    baseRate: 9.99,
    perPoundRate: 0.50,
  },
  {
    id: 'zone-2',
    name: 'Zone 2 (Mid-Atlantic & Midwest)',
    states: ['MD', 'DE', 'PA', 'NJ', 'NY', 'OH', 'IN', 'IL', 'MI', 'WI', 'MN', 'IA', 'MO'],
    baseRate: 12.99,
    perPoundRate: 0.75,
  },
  {
    id: 'zone-3',
    name: 'Zone 3 (Northeast & Plains)',
    states: ['CT', 'RI', 'MA', 'VT', 'NH', 'ME', 'ND', 'SD', 'NE', 'KS', 'OK', 'AR', 'LA', 'TX'],
    baseRate: 14.99,
    perPoundRate: 1.00,
  },
  {
    id: 'zone-4',
    name: 'Zone 4 (West)',
    states: ['MT', 'WY', 'CO', 'NM', 'AZ', 'UT', 'ID', 'NV', 'CA', 'OR', 'WA'],
    baseRate: 17.99,
    perPoundRate: 1.25,
  },
  {
    id: 'zone-5',
    name: 'Zone 5 (Alaska & Hawaii)',
    states: ['AK', 'HI'],
    baseRate: 29.99,
    perPoundRate: 2.00,
  },
];

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 165.00;

// Hybrid shipping flat rates
export const FLAT_RATE_SMALL = 9.99;   // < 2 lbs
export const FLAT_RATE_MEDIUM = 12.99;  // 2-5 lbs
export const WEIGHT_THRESHOLD_SMALL = 2;
export const WEIGHT_THRESHOLD_MEDIUM = 5;

// Local delivery cities (Asheville area)
export const LOCAL_DELIVERY_CITIES = [
  'asheville',
  'hendersonville',
  'fletcher',
  'arden',
  'black mountain',
  'weaverville',
  'candler',
  'fairview',
  'swannanoa',
  'leicester',
];

/**
 * Calculate shipping cost based on cart and destination
 */
export function calculateShipping(
  subtotal: number,
  totalWeight: number, // in pounds
  address: ShippingAddress
): ShippingCalculation {
  // Check if qualifies for free shipping
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  // Find applicable shipping zone
  const zone = findShippingZone(address);

  // Calculate shipping methods
  const availableMethods: ShippingMethod[] = [];

  // Local Pickup (always available)
  availableMethods.push({
    id: 'local-pickup',
    name: 'Local Pickup',
    description: 'Pick up at our Asheville location',
    estimatedDays: 'Same day / Next day',
    price: 0,
    isFree: true,
  });

  // Check for local delivery
  const isLocalDelivery = isLocalAddress(address);
  if (isLocalDelivery) {
    availableMethods.push({
      id: 'local-delivery',
      name: 'Local Delivery',
      description: 'Free delivery in Asheville area',
      estimatedDays: '1-2 business days',
      price: 0,
      isFree: true,
    });
  }

  // Standard shipping - Hybrid model
  let standardShippingCost = 0;
  let shippingDescription = '';

  if (qualifiesForFreeShipping) {
    standardShippingCost = 0;
    shippingDescription = 'Free shipping on orders $165+';
  } else if (totalWeight < WEIGHT_THRESHOLD_SMALL) {
    // Small items: flat rate
    standardShippingCost = FLAT_RATE_SMALL;
    shippingDescription = 'Flat rate for small items (< 2 lbs)';
  } else if (totalWeight < WEIGHT_THRESHOLD_MEDIUM) {
    // Medium items: flat rate
    standardShippingCost = FLAT_RATE_MEDIUM;
    shippingDescription = 'Flat rate for medium items (2-5 lbs)';
  } else {
    // Large items: zone-based
    standardShippingCost = zone.baseRate + ((totalWeight - WEIGHT_THRESHOLD_MEDIUM) * zone.perPoundRate);
    shippingDescription = `Zone-based pricing to ${zone.name}`;
  }

  availableMethods.push({
    id: 'standard',
    name: qualifiesForFreeShipping ? 'Standard Shipping (FREE!)' : 'Standard Shipping',
    description: shippingDescription,
    estimatedDays: getEstimatedDeliveryDays(zone.id),
    price: standardShippingCost,
    isFree: qualifiesForFreeShipping,
  });

  return {
    subtotal,
    weight: totalWeight,
    address,
    availableMethods,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountUntilFreeShipping,
    qualifiesForFreeShipping,
  };
}

/**
 * Find shipping zone for address
 */
function findShippingZone(address: ShippingAddress): ShippingZone {
  const state = address.state.toUpperCase();

  // Check if local first
  if (isLocalAddress(address)) {
    return SHIPPING_ZONES[0]; // Local zone
  }

  // Find zone by state
  for (const zone of SHIPPING_ZONES) {
    if (zone.states.includes(state)) {
      return zone;
    }
  }

  // Default to most expensive zone if state not found
  return SHIPPING_ZONES[SHIPPING_ZONES.length - 1];
}

/**
 * Check if address qualifies for local delivery
 */
function isLocalAddress(address: ShippingAddress): boolean {
  const state = address.state.toUpperCase();
  const city = address.city.toLowerCase().trim();

  if (state !== 'NC') {
    return false;
  }

  return LOCAL_DELIVERY_CITIES.some(localCity =>
    city.includes(localCity) || localCity.includes(city)
  );
}

/**
 * Get estimated delivery days for zone
 */
function getEstimatedDeliveryDays(zoneId: string): string {
  switch (zoneId) {
    case 'local':
      return '1-2 business days';
    case 'zone-1':
      return '2-4 business days';
    case 'zone-2':
      return '3-5 business days';
    case 'zone-3':
      return '4-6 business days';
    case 'zone-4':
      return '5-7 business days';
    case 'zone-5':
      return '7-10 business days';
    default:
      return '5-7 business days';
  }
}

/**
 * Format shipping price for display
 */
export function formatShippingPrice(price: number, isFree: boolean): string {
  if (isFree || price === 0) {
    return 'FREE';
  }
  return `$${price.toFixed(2)}`;
}

/**
 * Get weight from cart items
 * Assumes weight is in format like "800g", "1.6kg", "16 oz"
 */
export function parseWeight(weightString: string): number {
  const cleaned = weightString.toLowerCase().trim();

  // Parse grams
  if (cleaned.includes('g') && !cleaned.includes('kg')) {
    const grams = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    return grams * 0.00220462; // Convert to pounds
  }

  // Parse kilograms
  if (cleaned.includes('kg')) {
    const kg = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    return kg * 2.20462; // Convert to pounds
  }

  // Parse ounces
  if (cleaned.includes('oz')) {
    const oz = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
    return oz * 0.0625; // Convert to pounds
  }

  // Parse pounds
  if (cleaned.includes('lb')) {
    return parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  }

  // Default: assume it's already in pounds or return 1 lb default
  const num = parseFloat(cleaned.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 1 : num;
}
