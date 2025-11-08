import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncContactToGHL, GHLSyncResult } from '@/lib/ghl-service';

/**
 * Newsletter Subscription Endpoint with GHL Integration
 *
 * This endpoint handles newsletter signups from:
 * - Footer newsletter form
 * - Homepage modal
 * - Blog page signup
 *
 * Functionality:
 * 1. Validates input (firstName, email, source)
 * 2. Saves to newsletter_subscribers table in Supabase
 * 3. Syncs contact to GoHighLevel with appropriate tags
 * 4. Tags applied: newsletter-{source}, lead-nurture, email-marketing
 *
 * Tag Accumulation Strategy:
 * If subscriber later becomes a customer or consultation client,
 * their newsletter tags will be preserved and new tags added.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, email, source = 'footer' } = body;

    // Validation
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!firstName || !firstName.trim()) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanFirstName = firstName.trim();
    const cleanSource = source.trim();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if already subscribed
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id, status, email, first_name')
      .eq('email', cleanEmail)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error checking existing subscriber:', checkError);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    let subscriberId: string;

    if (existing) {
      // Already exists
      if (existing.status === 'active') {
        // Already subscribed - still sync to GHL to ensure tags are up to date
        subscriberId = existing.id;
      } else {
        // Was unsubscribed, re-subscribe
        const { data: updated, error: updateError } = await supabase
          .from('newsletter_subscribers')
          .update({
            first_name: cleanFirstName,
            status: 'active',
            source: cleanSource,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
          })
          .eq('id', existing.id)
          .select('id')
          .single();

        if (updateError) {
          console.error('Error resubscribing:', updateError);
          return NextResponse.json(
            { error: 'Failed to resubscribe' },
            { status: 500 }
          );
        }

        subscriberId = updated.id;
      }
    } else {
      // New subscriber
      const { data: created, error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({
          email: cleanEmail,
          first_name: cleanFirstName,
          status: 'active',
          source: cleanSource,
          subscribed_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating subscriber:', insertError);
        return NextResponse.json(
          { error: 'Failed to subscribe' },
          { status: 500 }
        );
      }

      subscriberId = created.id;
    }

    // Sync to GoHighLevel with tags
    const tags = [
      `newsletter-${cleanSource}`, // Source tracking (newsletter-footer, newsletter-modal, newsletter-blog)
      'lead-nurture',              // General nurture sequence
      'email-marketing',           // Email campaign eligible
    ];

    const ghlResult: GHLSyncResult = await syncContactToGHL({
      email: cleanEmail,
      firstName: cleanFirstName,
      tags,
    });

    // Log GHL sync result to database (non-blocking)
    if (ghlResult.success && ghlResult.contactId) {
      supabase
        .from('newsletter_subscribers')
        .update({
          ghl_contact_id: ghlResult.contactId,
          ghl_tags: tags,
          ghl_last_sync_at: new Date().toISOString(),
          ghl_sync_error: null,
        })
        .eq('id', subscriberId)
        .then(({ error }) => {
          if (error) console.error('Failed to log GHL sync:', error);
        });
    } else if (!ghlResult.success) {
      // Log GHL error (non-blocking)
      supabase
        .from('newsletter_subscribers')
        .update({
          ghl_sync_error: ghlResult.error || 'Unknown GHL error',
          ghl_last_sync_at: new Date().toISOString(),
        })
        .eq('id', subscriberId)
        .then(({ error }) => {
          if (error) console.error('Failed to log GHL error:', error);
        });

      console.error('GHL sync failed:', ghlResult.error);
      // Don't fail the request - subscriber is saved to database
    }

    return NextResponse.json({
      success: true,
      message: existing?.status === 'active'
        ? 'You are already subscribed! Tags updated in our system.'
        : 'Successfully subscribed to newsletter!',
      ghlSynced: ghlResult.success,
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
