# Favicon Generation TODO

## Current Status
Logo exists at: `public/images/logo-waggin-meals.png`

## What's Needed
Next.js 15 expects favicon files in the `app/` directory:

1. **app/icon.png** - Main favicon (32x32 or 512x512)
2. **app/apple-icon.png** - Apple touch icon (180x180)
3. **app/favicon.ico** - Legacy browser support (optional)

## How to Create

### Option 1: Online Tool (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload `public/images/logo-waggin-meals.png`
3. Download generated icons
4. Place in `app/` directory

### Option 2: Manual (If you have ImageMagick)
```bash
# Create icon.png (512x512)
convert public/images/logo-waggin-meals.png -resize 512x512 app/icon.png

# Create apple-icon.png (180x180)
convert public/images/logo-waggin-meals.png -resize 180x180 app/apple-icon.png

# Create favicon.ico (32x32)
convert public/images/logo-waggin-meals.png -resize 32x32 app/favicon.ico
```

### Option 3: Use Existing Logo (Quick Fix)
```bash
# Copy logo as-is (Next.js will resize)
cp public/images/logo-waggin-meals.png app/icon.png
cp public/images/logo-waggin-meals.png app/apple-icon.png
```

## Priority
**Medium** - Not blocking, but improves brand recognition in browser tabs

## Impact
- Professional appearance in browser tabs
- Better bookmarking experience
- Shows in mobile home screen shortcuts
- Improves brand consistency
