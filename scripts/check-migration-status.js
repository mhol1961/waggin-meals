/**
 * Migration Status Checker
 *
 * This script checks the current status of the subscription migration:
 * - Total subscribers in database
 * - Re-authorization completion rate
 * - Pending vs active subscriptions
 * - Estimated MRR from active subscriptions
 *
 * Run: node scripts/check-migration-status.js
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('🐾 Waggin\' Meals Migration Status Check\n');
  console.log('='.repeat(60));

  try {
    // Get total subscriptions
    const { count: totalCount, error: totalError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // Get active subscriptions (re-authorized)
    const { data: activeSubscriptions, error: activeError } = await supabase
      .from('subscriptions')
      .select('total')
      .eq('status', 'active');

    if (activeError) throw activeError;

    // Get pending subscriptions (not yet re-authorized)
    const { count: pendingCount, error: pendingError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending_payment');

    if (pendingError) throw pendingError;

    // Get paused subscriptions
    const { count: pausedCount, error: pausedError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'paused');

    if (pausedError) throw pausedError;

    // Calculate metrics
    const activeCount = activeSubscriptions.length;
    const completionRate = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;
    const activeMRR = activeSubscriptions.reduce((sum, sub) => sum + parseFloat(sub.total), 0);

    // Get subscriptions with expired tokens
    const { count: expiredTokenCount, error: expiredError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .lt('token_expires_at', new Date().toISOString())
      .eq('status', 'pending_payment');

    if (expiredError) throw expiredError;

    // Get recent billing history
    const { data: recentBilling, error: billingError } = await supabase
      .from('subscription_billing_history')
      .select('status, amount, attempted_at')
      .order('attempted_at', { ascending: false })
      .limit(10);

    if (billingError) throw billingError;

    const successfulCharges = recentBilling.filter(b => b.status === 'success').length;
    const failedCharges = recentBilling.filter(b => b.status === 'failed').length;

    // Display results
    console.log('\n📊 SUBSCRIPTION OVERVIEW');
    console.log('-'.repeat(60));
    console.log(`Total Subscribers:        ${totalCount}`);
    console.log(`Active (Re-authorized):   ${activeCount} (${completionRate.toFixed(1)}%)`);
    console.log(`Pending Payment:          ${pendingCount}`);
    console.log(`Paused:                   ${pausedCount}`);
    console.log(`Expired Tokens:           ${expiredTokenCount}`);

    console.log('\n💰 REVENUE METRICS');
    console.log('-'.repeat(60));
    console.log(`Active MRR:               $${activeMRR.toFixed(2)}`);
    console.log(`Average Subscription:     $${activeCount > 0 ? (activeMRR / activeCount).toFixed(2) : '0.00'}`);
    console.log(`Potential MRR (100%):     $${((activeMRR / activeCount) * totalCount).toFixed(2)}`);

    console.log('\n📈 COMPLETION PROGRESS');
    console.log('-'.repeat(60));
    const progressBar = '█'.repeat(Math.floor(completionRate / 2)) + '░'.repeat(50 - Math.floor(completionRate / 2));
    console.log(`[${progressBar}] ${completionRate.toFixed(1)}%`);

    if (completionRate < 30) {
      console.log('\n⚠️  STATUS: EARLY STAGE - Campaign just started');
      console.log('   → Monitor email open rates in GHL');
      console.log('   → Ensure portal links are working');
    } else if (completionRate < 60) {
      console.log('\n⏳ STATUS: IN PROGRESS - Good momentum');
      console.log('   → Continue monitoring daily');
      console.log('   → Send reminder emails to non-responders');
    } else if (completionRate < 80) {
      console.log('\n✅ STATUS: STRONG PROGRESS - Nearly there');
      console.log('   → Personal outreach to remaining subscribers');
      console.log('   → Focus on high-value customers');
    } else {
      console.log('\n🎉 STATUS: EXCELLENT - Migration successful!');
      console.log('   → Begin planning Shopify shutdown');
      console.log('   → Monitor automated billing cycles');
    }

    console.log('\n⚡ RECENT BILLING ACTIVITY (Last 10 Attempts)');
    console.log('-'.repeat(60));
    console.log(`Successful Charges:       ${successfulCharges}`);
    console.log(`Failed Charges:           ${failedCharges}`);

    if (recentBilling.length > 0) {
      console.log('\nRecent Transactions:');
      recentBilling.slice(0, 5).forEach(billing => {
        const statusIcon = billing.status === 'success' ? '✅' : '❌';
        const date = new Date(billing.attempted_at).toLocaleDateString();
        console.log(`  ${statusIcon} $${billing.amount} - ${billing.status} - ${date}`);
      });
    } else {
      console.log('\nNo billing attempts yet - first cycle pending');
    }

    // Urgent actions
    console.log('\n🚨 ACTION ITEMS');
    console.log('-'.repeat(60));

    if (expiredTokenCount > 0) {
      console.log(`⚠️  ${expiredTokenCount} tokens have expired`);
      console.log('   → Generate new tokens for these subscribers');
      console.log('   → Resend portal links via GHL');
    }

    if (pendingCount > totalCount * 0.5 && totalCount > 0) {
      console.log(`⚠️  ${pendingCount} subscribers still pending (>${((pendingCount / totalCount) * 100).toFixed(0)}%)`);
      console.log('   → Check GHL email delivery rates');
      console.log('   → Consider SMS outreach');
    }

    if (pausedCount > 0) {
      console.log(`⚠️  ${pausedCount} subscriptions are paused`);
      console.log('   → Review failed payment reasons');
      console.log('   → Contact these customers directly');
    }

    if (failedCharges > successfulCharges && recentBilling.length > 5) {
      console.log('⚠️  High failure rate on billing attempts');
      console.log('   → Check Authorize.net dashboard');
      console.log('   → Verify payment profiles are valid');
    }

    if (expiredTokenCount === 0 && pendingCount < 10 && completionRate > 80) {
      console.log('✅ No urgent actions - migration is going well!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Status check complete!\n');

  } catch (error) {
    console.error('❌ Error checking status:', error.message);
    process.exit(1);
  }
}

main();
