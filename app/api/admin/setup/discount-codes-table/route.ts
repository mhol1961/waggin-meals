import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // Check admin authentication
  const adminAuth = await checkAdminAuth();
  if (!adminAuth.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First check if table already exists
    const { error: checkError } = await supabase
      .from('discount_codes')
      .select('id')
      .limit(1);

    if (!checkError) {
      return NextResponse.json({
        success: true,
        message: 'Table discount_codes already exists!',
        alreadyExists: true,
      });
    }

    // Table doesn't exist, create it using raw SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS discount_codes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        discount_type TEXT NOT NULL,
        discount_value DECIMAL(10,2) NOT NULL,
        usage_limit INTEGER,
        usage_count INTEGER DEFAULT 0,
        minimum_purchase DECIMAL(10,2),
        starts_at TIMESTAMP WITH TIME ZONE,
        expires_at TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
      CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
      CREATE INDEX IF NOT EXISTS idx_discount_codes_expires ON discount_codes(expires_at);

      CREATE TRIGGER IF NOT EXISTS update_discount_codes_updated_at
        BEFORE UPDATE ON discount_codes
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `;

    // Execute the SQL - this requires the service role key
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });

    if (error) {
      console.error('SQL execution error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to create table. Please create it manually in Supabase SQL Editor.',
        details: error.message,
        sqlFile: 'supabase/migrations/20251102_create_discount_codes.sql',
      }, { status: 500 });
    }

    // Verify table was created
    const { error: verifyError } = await supabase
      .from('discount_codes')
      .select('id')
      .limit(1);

    if (verifyError) {
      return NextResponse.json({
        success: false,
        error: 'Table creation uncertain. Please verify in Supabase dashboard.',
        sqlFile: 'supabase/migrations/20251102_create_discount_codes.sql',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Table discount_codes created successfully!',
    });

  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'An unexpected error occurred',
      details: error instanceof Error ? error.message : 'Unknown error',
      manualInstructions: {
        step1: 'Go to your Supabase dashboard',
        step2: 'Navigate to SQL Editor',
        step3: 'Copy contents of: supabase/migrations/20251102_create_discount_codes.sql',
        step4: 'Paste and run the SQL',
      },
    }, { status: 500 });
  }
}
