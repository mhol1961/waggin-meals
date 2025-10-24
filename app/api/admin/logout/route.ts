import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/admin-auth';

/**
 * POST /api/admin/logout
 *
 * Logs out the admin user by clearing the session
 */
export async function POST(request: NextRequest) {
  try {
    await clearAdminSession();

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Error in admin logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
