-- Fix user_roles RLS policy
-- Date: 2025-11-03
-- Purpose: Ensure authenticated users can read their own role

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
DROP POLICY IF EXISTS "Service role can manage roles" ON user_roles;

-- Recreate the SELECT policy for authenticated users
CREATE POLICY "Users can view own role"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Recreate service role policy for full management
CREATE POLICY "Service role can manage roles"
  ON user_roles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Ensure RLS is enabled
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Verify the policy by checking current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'user_roles';
