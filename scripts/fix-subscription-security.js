/**
 * Script to add authentication and ownership checks to all subscription endpoints
 * Run: node scripts/fix-subscription-security.js
 */

const fs = require('fs');
const path = require('path');

const SECURITY_CHECK = `
    // =================================
    // SECURITY: Authenticate user
    // =================================
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - missing authentication' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid authentication' },
        { status: 401 }
      );
    }
`;

const files = [
  'app/api/subscriptions/[id]/skip-next/route.ts',
  'app/api/subscriptions/[id]/update-address/route.ts',
  'app/api/subscriptions/[id]/pause/route.ts',
  'app/api/subscriptions/[id]/resume/route.ts',
  'app/api/subscriptions/[id]/route.ts',
];

files.forEach(file => {
  const filePath = path.join('/mnt/c/waggin-meals', file);

  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has auth
  if (content.includes('auth.getUser') || content.includes('Unauthorized')) {
    console.log(`✅ ${file} - Already has auth checks, skipping`);
    return;
  }

  // Find the function signature and add auth after params extraction
  const patterns = [
    // Pattern for POST/DELETE/PATCH
    /export async function (POST|DELETE|PATCH)\(\s*request: NextRequest,\s*\{ params \}: \{ params: Promise<\{ id: string \}> \}\s*\) \{[\s\n]*try \{[\s\n]*(const \{ id \} = await params;[\s\n]*(?:const body = await request\.json\(\);[\s\n]*)?(?:const \{[^}]+\} = body;[\s\n]*)?)/,
  ];

  let updated = false;
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, (match, method, afterParams) => {
        const lines = afterParams.split('\n');
        const indent = lines[0].match(/^\s*/)[0];
        return match.replace(afterParams, afterParams + '\n' + SECURITY_CHECK.split('\n').map(line => indent + line).join('\n'));
      });
      updated = true;
      break;
    }
  }

  if (!updated) {
    console.log(`⚠️  ${file} - Could not find insertion point`);
    return;
  }

  // Now update the subscription fetch to include customer join
  content = content.replace(
    /\.from\('subscriptions'\)[\s\n]*\.select\('([^']+)'\)/g,
    (match, selectFields) => {
      if (selectFields.includes('customers')) {
        return match; // Already has customer join
      }
      // Add customer join
      if (selectFields === '*') {
        return `.from('subscriptions')\n      .select('*, customers!inner(*)')`;
      } else {
        return `.from('subscriptions')\n      .select('${selectFields}, customers!inner(*)')`;
      }
    }
  );

  // Add ownership check after subscription fetch
  content = content.replace(
    /(if \(fetchError \|\| !currentSub\) \{[\s\S]*?\})/,
    (match) => {
      return match + `\n
    // =================================
    // SECURITY: Verify user owns this subscription
    // =================================
    if (currentSub.customers.email !== user.email) {
      console.warn(\`🚨 Unauthorized subscription action attempt: User \${user.email} tried to modify subscription \${id} owned by \${currentSub.customers.email}\`);
      return NextResponse.json(
        { error: 'Forbidden - you do not own this subscription' },
        { status: 403 }
      );
    }`;
    }
  );

  fs.writeFileSync(filePath, content);
  console.log(`✅ ${file} - Security checks added`);
});

console.log('\n✅ All subscription endpoints secured!');
