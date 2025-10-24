import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession } from '@/lib/admin-auth';

/**
 * POST /api/admin/login
 *
 * Authenticates admin users and creates a session
 *
 * Request body:
 * - username: Admin username
 * - password: Admin password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = await verifyAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session
    await setAdminSession(username);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
