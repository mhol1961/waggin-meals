/**
 * Authorize.net Configuration Diagnostic Tool
 *
 * This script checks for common configuration issues that cause auth failures.
 * Run: node scripts/diagnose-authorizenet.js
 */

require('dotenv').config({ path: '.env.local' });

console.log('\n=== AUTHORIZE.NET CONFIGURATION DIAGNOSTIC ===\n');

// Check all possible environment variable names
const envVarChecks = [
  { name: 'AUTHORIZENET_API_LOGIN_ID', value: process.env.AUTHORIZENET_API_LOGIN_ID },
  { name: 'AUTHORIZE_NET_API_LOGIN_ID', value: process.env.AUTHORIZE_NET_API_LOGIN_ID },
  { name: 'NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID', value: process.env.NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID },
  { name: 'AUTHORIZENET_TRANSACTION_KEY', value: process.env.AUTHORIZENET_TRANSACTION_KEY },
  { name: 'AUTHORIZE_NET_TRANSACTION_KEY', value: process.env.AUTHORIZE_NET_TRANSACTION_KEY },
  { name: 'AUTHORIZENET_ENVIRONMENT', value: process.env.AUTHORIZENET_ENVIRONMENT },
  { name: 'AUTHORIZE_NET_ENVIRONMENT', value: process.env.AUTHORIZE_NET_ENVIRONMENT },
  { name: 'NEXT_PUBLIC_AUTHORIZENET_ENVIRONMENT', value: process.env.NEXT_PUBLIC_AUTHORIZENET_ENVIRONMENT },
  { name: 'AUTHORIZENET_PUBLIC_CLIENT_KEY', value: process.env.AUTHORIZENET_PUBLIC_CLIENT_KEY },
  { name: 'NEXT_PUBLIC_AUTHORIZENET_PUBLIC_CLIENT_KEY', value: process.env.NEXT_PUBLIC_AUTHORIZENET_PUBLIC_CLIENT_KEY },
];

console.log('📋 ENVIRONMENT VARIABLES CHECK:\n');

let hasIssues = false;

envVarChecks.forEach(check => {
  const status = check.value ? '✅' : '❌';
  const displayValue = check.value
    ? (check.name.includes('KEY') ? `${check.value.substring(0, 8)}...${check.value.slice(-4)}` : check.value)
    : 'NOT SET';

  console.log(`${status} ${check.name.padEnd(50)} = ${displayValue}`);

  if (!check.value && !check.name.startsWith('NEXT_PUBLIC') && !check.name.includes('AUTHORIZE_NET_')) {
    hasIssues = true;
  }
});

console.log('\n');

// Check what the code actually reads
console.log('🔧 CODE CONFIGURATION (what lib/authorizenet-service.ts reads):\n');

const codeReadsApiLoginId = process.env.AUTHORIZENET_API_LOGIN_ID;
const codeReadsTransactionKey = process.env.AUTHORIZENET_TRANSACTION_KEY;
const codeReadsEnvironment = process.env.AUTHORIZENET_ENVIRONMENT || 'sandbox';

console.log(`API Login ID:     ${codeReadsApiLoginId ? `✅ ${codeReadsApiLoginId}` : '❌ NOT SET'}`);
console.log(`Transaction Key:  ${codeReadsTransactionKey ? `✅ ${codeReadsTransactionKey.substring(0, 8)}...${codeReadsTransactionKey.slice(-4)}` : '❌ NOT SET'}`);
console.log(`Environment:      ${codeReadsEnvironment ? `✅ ${codeReadsEnvironment}` : '⚠️  Defaulting to "sandbox"'}`);

console.log('\n');

// Detect issues
console.log('🚨 DETECTED ISSUES:\n');

let issueCount = 0;

// Issue 1: Missing required variables
if (!codeReadsApiLoginId) {
  issueCount++;
  console.log(`${issueCount}. AUTHORIZENET_API_LOGIN_ID is NOT SET`);
  console.log('   → The code cannot read your API Login ID');
  console.log('   → Check if you set AUTHORIZE_NET_API_LOGIN_ID instead (with underscore)');
}

if (!codeReadsTransactionKey) {
  issueCount++;
  console.log(`${issueCount}. AUTHORIZENET_TRANSACTION_KEY is NOT SET`);
  console.log('   → The code cannot read your Transaction Key');
  console.log('   → Check if you set AUTHORIZE_NET_TRANSACTION_KEY instead (with underscore)');
}

// Issue 2: Duplicate variables with different values
if (process.env.AUTHORIZENET_API_LOGIN_ID && process.env.AUTHORIZE_NET_API_LOGIN_ID) {
  if (process.env.AUTHORIZENET_API_LOGIN_ID !== process.env.AUTHORIZE_NET_API_LOGIN_ID) {
    issueCount++;
    console.log(`${issueCount}. DUPLICATE API Login ID with DIFFERENT values:`);
    console.log(`   → AUTHORIZENET_API_LOGIN_ID = ${process.env.AUTHORIZENET_API_LOGIN_ID}`);
    console.log(`   → AUTHORIZE_NET_API_LOGIN_ID = ${process.env.AUTHORIZE_NET_API_LOGIN_ID}`);
    console.log('   → Code uses AUTHORIZENET_API_LOGIN_ID (no underscore in "AUTHORIZENET")');
  }
}

if (process.env.AUTHORIZENET_ENVIRONMENT && process.env.AUTHORIZE_NET_ENVIRONMENT) {
  if (process.env.AUTHORIZENET_ENVIRONMENT !== process.env.AUTHORIZE_NET_ENVIRONMENT) {
    issueCount++;
    console.log(`${issueCount}. ENVIRONMENT MISMATCH:`);
    console.log(`   → AUTHORIZENET_ENVIRONMENT = ${process.env.AUTHORIZENET_ENVIRONMENT}`);
    console.log(`   → AUTHORIZE_NET_ENVIRONMENT = ${process.env.AUTHORIZE_NET_ENVIRONMENT}`);
    console.log('   → Code uses AUTHORIZENET_ENVIRONMENT');
  }
}

// Issue 3: Environment value validation
if (codeReadsEnvironment !== 'sandbox' && codeReadsEnvironment !== 'production') {
  issueCount++;
  console.log(`${issueCount}. INVALID ENVIRONMENT VALUE: "${codeReadsEnvironment}"`);
  console.log('   → Must be exactly "sandbox" or "production" (lowercase)');
}

// Issue 4: Sandbox credentials with production mode or vice versa
if (codeReadsApiLoginId) {
  const isSandboxLoginId = codeReadsApiLoginId.length < 10; // Sandbox IDs are shorter
  const isProductionMode = codeReadsEnvironment === 'production';

  if (isSandboxLoginId && isProductionMode) {
    issueCount++;
    console.log(`${issueCount}. SANDBOX/PRODUCTION MISMATCH:`);
    console.log('   → Your API Login ID looks like a SANDBOX credential');
    console.log(`   → But AUTHORIZENET_ENVIRONMENT is set to "${codeReadsEnvironment}"`);
    console.log('   → Sandbox credentials cannot authenticate with production endpoint');
  }
}

// Issue 5: Transaction key format
if (codeReadsTransactionKey) {
  if (codeReadsTransactionKey.length < 10) {
    issueCount++;
    console.log(`${issueCount}. TRANSACTION KEY LOOKS TOO SHORT:`);
    console.log(`   → Length: ${codeReadsTransactionKey.length} characters`);
    console.log('   → Authorize.net transaction keys are typically 16+ characters');
    console.log('   → Did you copy the entire key?');
  }

  if (codeReadsTransactionKey.includes(' ') || codeReadsTransactionKey.includes('\n')) {
    issueCount++;
    console.log(`${issueCount}. TRANSACTION KEY CONTAINS WHITESPACE:`);
    console.log('   → Your key has spaces or line breaks');
    console.log('   → This will cause authentication to fail');
    console.log('   → Remove all spaces/newlines from the key');
  }
}

// Issue 6: Client-side vs server-side mismatch
const clientApiLoginId = process.env.NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID;
const clientEnvironment = process.env.NEXT_PUBLIC_AUTHORIZENET_ENVIRONMENT;

if (clientApiLoginId && codeReadsApiLoginId && clientApiLoginId !== codeReadsApiLoginId) {
  issueCount++;
  console.log(`${issueCount}. CLIENT/SERVER API LOGIN ID MISMATCH:`);
  console.log(`   → Server: ${codeReadsApiLoginId}`);
  console.log(`   → Client: ${clientApiLoginId}`);
  console.log('   → These must match exactly');
}

if (clientEnvironment && codeReadsEnvironment && clientEnvironment !== codeReadsEnvironment) {
  issueCount++;
  console.log(`${issueCount}. CLIENT/SERVER ENVIRONMENT MISMATCH:`);
  console.log(`   → Server: ${codeReadsEnvironment}`);
  console.log(`   → Client: ${clientEnvironment}`);
  console.log('   → These must match exactly');
}

if (issueCount === 0) {
  console.log('✅ No configuration issues detected in local environment\n');
  console.log('⚠️  If payment is still failing, the issue is likely:');
  console.log('   1. Netlify environment variables are different from local .env.local');
  console.log('   2. IP restrictions on your Authorize.net account (blocking Netlify IPs)');
  console.log('   3. API permissions disabled in Authorize.net dashboard');
  console.log('   4. You\'re using the wrong Authorize.net account (test vs production)');
} else {
  console.log(`\n❌ Found ${issueCount} configuration issue(s)\n`);
}

console.log('\n=== RECOMMENDED FIXES ===\n');

console.log('1. IN NETLIFY:');
console.log('   Go to: Site Settings → Environment Variables');
console.log('   Ensure these are set (NO UNDERSCORE in "AUTHORIZENET"):');
console.log('   • AUTHORIZENET_API_LOGIN_ID');
console.log('   • AUTHORIZENET_TRANSACTION_KEY');
console.log('   • AUTHORIZENET_PUBLIC_CLIENT_KEY');
console.log('   • AUTHORIZENET_ENVIRONMENT');
console.log('   • NEXT_PUBLIC_AUTHORIZENET_API_LOGIN_ID (same as above)');
console.log('   • NEXT_PUBLIC_AUTHORIZENET_PUBLIC_CLIENT_KEY (same as above)');
console.log('   • NEXT_PUBLIC_AUTHORIZENET_ENVIRONMENT (same as above)');
console.log('\n');

console.log('2. VERIFY IN AUTHORIZE.NET DASHBOARD:');
console.log('   • Account → Settings → API Credentials & Keys');
console.log('   • Copy the API Login ID and Transaction Key EXACTLY as shown');
console.log('   • Check if "API Access" is enabled');
console.log('   • Check if there are IP restrictions (Settings → Security Settings)');
console.log('\n');

console.log('3. AFTER UPDATING NETLIFY:');
console.log('   • Trigger a new deployment (git push or manual redeploy)');
console.log('   • Environment variable changes require a rebuild');
console.log('\n');

console.log('4. TEST CONNECTION:');
console.log('   • Visit: https://your-site.netlify.app/api/test-authorizenet');
console.log('   • (If you create this test endpoint with the code below)');
console.log('\n');

console.log('=== END DIAGNOSTIC ===\n');
