#!/usr/bin/env python3
import re
import sys

def fix_apostrophes_in_file(filepath):
    """Fix apostrophes in JSX/TSX files by converting single-quoted strings to double-quoted"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Pattern to match object property values in single quotes that contain apostrophes
        # Matches: quote: '...', desc: '...', q: '...', a: '...' where ... contains apostrophes
        patterns = [
            (r"(quote|desc|q|a|title|tagline|label|name|perfectFor|ingredients|servingSize):\s*'([^']*?(?:'s|'t|'re|'ll|'ve|'d|'m)[^']*?)'", r'\1: "\2"'),
        ]

        for pattern, replacement in patterns:
            # Find all matches
            matches = list(re.finditer(pattern, content))
            if matches:
                print(f"Found {len(matches)} matches in {filepath}")
                for match in matches:
                    old_str = match.group(0)
                    # Extract the key and value
                    key = match.group(1)
                    value = match.group(2)
                    # Convert to double quotes
                    new_str = f'{key}: "{value}"'
                    content = content.replace(old_str, new_str, 1)

        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed {filepath}")
            return True
        else:
            print(f"No changes needed in {filepath}")
            return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

if __name__ == "__main__":
    files = [
        "/mnt/c/waggin-meals/app/monthly-wag-box/page.tsx",
        "/mnt/c/waggin-meals/app/smart-bundles/page.tsx",
        "/mnt/c/waggin-meals/app/nutrition-services/page.tsx",
        "/mnt/c/waggin-meals/app/page.tsx",
        "/mnt/c/waggin-meals/app/hero-variations/diagnostic-detective/page.tsx",
        "/mnt/c/waggin-meals/app/hero-variations/premium-experience/page.tsx",
        "/mnt/c/waggin-meals/app/hero-variations/science-educator/page.tsx",
        "/mnt/c/waggin-meals/app/hero-variations/triple-threat/page.tsx",
    ]

    for filepath in files:
        fix_apostrophes_in_file(filepath)
