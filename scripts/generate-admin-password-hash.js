/**
 * Generate Admin Password Hash
 *
 * This script generates a bcrypt hash for the admin password.
 *
 * Usage:
 *   node scripts/generate-admin-password-hash.js YourPasswordHere
 *
 * The output hash should be saved in your .env.local file as ADMIN_PASSWORD_HASH
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Error: No password provided');
  console.log('\nUsage:');
  console.log('  node scripts/generate-admin-password-hash.js YourPasswordHere');
  process.exit(1);
}

if (password.length < 8) {
  console.error('❌ Error: Password must be at least 8 characters long');
  process.exit(1);
}

// Generate hash with salt rounds = 12 (good balance of security and performance)
const saltRounds = 12;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('\n✅ Password hash generated successfully!\n');
console.log('Add this to your .env.local file:\n');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
console.log('\n⚠️  IMPORTANT:');
console.log('1. Copy the hash above to your .env.local file');
console.log('2. Remove any old ADMIN_PASSWORD variable (we use ADMIN_PASSWORD_HASH now)');
console.log('3. Also add this to Netlify environment variables for production');
console.log('4. NEVER commit the .env.local file to git\n');
