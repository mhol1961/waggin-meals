# Product Label Images - Pending Removal

**Date**: November 6, 2025
**Status**: Pending Christie's Approval
**Reference Image**: `/public/images/product-label-to-be-removed-on-all-products.png`

## Background

Some products still have label images visible on product pages. These appear to be ingredient/nutrition labels that may need to be removed if Christie confirms.

## Current Status

- **Label images removed**: The white ingredient text labels (3rd thumbnail) were removed from 11 products on November 6, 2025
- **Remaining label images**: Some products still show label images (unclear/unreadable labels)
- **Awaiting confirmation**: Need Christie to verify if these remaining label images should also be removed

## Reference

See `product-label-to-be-removed-on-all-products.png` for an example of the type of label image that may need removal.

## Action Items

**IF Christie confirms removal is needed:**
1. Identify all products with label images
2. Determine which image in each product's image array is the label
3. Remove those images from the Supabase database
4. Verify removal on product pages

## Previous Removal (Completed November 6, 2025)

Successfully removed white ingredient label images (3rd image) from:
- Chicken & Rice Farm Meal
- Chicken & Sweet Potato Farm Meal
- Turkey & Rice Farm Meal
- Turkey & Sweet Potato Farm Meal
- Beef & Rice Farm Meal
- Beef & Sweet Potato Farm Meal
- Pup-a-loaf
- Chicken Superfood Cakes
- Prince Jax Stew
- Bone & Veggie Broth
- Meatball Dog Treats

Each product now has 2 images instead of 3.

## Script for Future Removal

If Christie confirms, use this Node.js script pattern (adapt as needed):

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function removeLabels() {
  // Query products with label images
  const { data: products } = await supabase
    .from('products')
    .select('id, handle, title, images');

  // Identify and remove label images
  for (const product of products) {
    // Logic to identify which image is the label
    // Update product with label removed
  }
}

removeLabels();
```

---

**Note**: This document serves as a reference for potential future work. No action should be taken until Christie explicitly confirms which label images need to be removed.
