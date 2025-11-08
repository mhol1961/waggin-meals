// Enhanced Product Types for Detailed Product Information

export interface GuaranteedAnalysis {
  protein: {
    min: string;      // e.g., "8%"
    dryMatter: string; // e.g., "30%" - calculated on dry matter basis
  };
  fat: {
    min: string;
    dryMatter: string;
  };
  fiber: {
    max: string;
    dryMatter: string;
  };
  moisture: {
    max: string;
  };
  calories: {
    perCup: string;   // e.g., "264 kcal/cup"
    perGram: string;  // e.g., "1.2 kcal/g"
  };
}

export interface NutritionalHighlights {
  keyNutrients: string[];  // e.g., ["B12", "Iron", "Zinc"]
  benefits: string[];      // e.g., ["Supports muscle growth", "Boosts immune system"]
}

export interface SourceInformation {
  protein: string;         // e.g., "Grass-fed beef from NC farms"
  vegetables: string;      // e.g., "Locally-sourced organic vegetables from NC, TN, GA"
  quality: string;         // e.g., "Human-grade, USDA-inspected"
}

export interface CarbBenefits {
  name: string;            // "Rice" or "Sweet Potato"
  type: string;            // e.g., "Complex carbohydrate" or "Grain-free carbohydrate"
  benefits: string[];      // List of specific benefits
  bestFor: string[];       // List of conditions this carb is ideal for
}

export interface HealthRecommendations {
  idealFor: string[];      // List of dog types/conditions this product is ideal for
  notRecommendedFor?: string[]; // List of conditions to avoid this product for
  feedingGuidance: string; // General feeding advice
}

export interface EnhancedProduct {
  // Existing Product fields
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  collection: string;
  tags: string[];
  status: 'active' | 'draft';
  weight?: string;
  sku?: string;
  inStock: boolean;
  stockQty?: number;
  hasVariants?: boolean;

  // Enhanced fields
  detailedDescription?: string;  // Longer, more comprehensive description
  ingredients: string;           // Full ingredient list
  guaranteedAnalysis: GuaranteedAnalysis;
  nutritionalHighlights: NutritionalHighlights;
  sourceInformation: SourceInformation;
  carbBenefits: CarbBenefits;
  healthRecommendations: HealthRecommendations;
}

// Helper function to calculate dry matter basis
export function calculateDryMatter(asFedPercentage: number, moisturePercentage: number): string {
  const dryMatterBasis = (asFedPercentage / (100 - moisturePercentage)) * 100;
  return `${dryMatterBasis.toFixed(1)}%`;
}

// Example usage:
// const protein = calculateDryMatter(8, 74); // 8% protein as fed, 74% moisture
// Returns: "30.8%" on dry matter basis
