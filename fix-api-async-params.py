#!/usr/bin/env python3
import re
import glob

# Fix all API route handlers to use async params for Next.js 15
files = glob.glob('/mnt/c/waggin-meals/app/api/admin/*/[id]/route.ts')

for filepath in files:
    print(f"Processing {filepath}...")

    with open(filepath, 'r') as f:
        content = f.read()

    original = content

    # Fix the type signature: { params: { id: string } } -> { params: Promise<{ id: string }> }
    content = re.sub(
        r'\{ params \}: \{ params: \{ id: string \} \}',
        '{ params }: { params: Promise<{ id: string }> }',
        content
    )

    # For each handler function (GET, PATCH, DELETE), add await params after auth check
    # Match function declarations and add the await after the auth block
    def add_await_params(match):
        func_type = match.group(1)  # GET, PATCH, or DELETE
        indent = match.group(2)
        rest_of_function = match.group(3)

        # Add the await params line after the closing brace of the auth check
        # Look for the pattern: if (!authenticated) { return ... }
        auth_pattern = r'(if \(!authenticated\) \{[^}]+\})\s+'
        auth_match = re.search(auth_pattern, rest_of_function)

        if auth_match:
            before_auth = rest_of_function[:auth_match.end()]
            after_auth = rest_of_function[auth_match.end():]

            # Add await params line
            await_line = f'\n{indent}  // Await params in Next.js 15\n{indent}  const {{ id }} = await params;\n{indent}\n'
            rest_of_function = before_auth + await_line + after_auth

        return f'export async function {func_type}(\n{indent}request: NextRequest,\n{indent}{{ params }}: {{ params: Promise<{{ id: string }}> }}\n{indent}) {{{rest_of_function}'

    # Match and fix each handler
    content = re.sub(
        r'export async function (GET|PATCH|DELETE)\(\s+(  )request: NextRequest,\s+\{ params \}: \{ params: Promise<\{ id: string \}> \}\s+\) \{(.+?)(?=export async function|\Z)',
        add_await_params,
        content,
        flags=re.DOTALL
    )

    # Replace params.id with just id
    content = re.sub(r'params\.id\b', 'id', content)

    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"  ✓ Fixed {filepath}")
    else:
        print(f"  - No changes needed for {filepath}")

print("\nDone!")
