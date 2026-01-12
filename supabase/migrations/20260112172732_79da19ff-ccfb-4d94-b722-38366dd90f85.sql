-- 1. Drop the permissive INSERT policy on audit_logs
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- 2. Revoke direct INSERT permission from authenticated users
REVOKE INSERT ON audit_logs FROM authenticated;

-- 3. Create a restrictive policy that denies all authenticated user inserts
-- Only service_role or SECURITY DEFINER functions can insert
CREATE POLICY "Only system can insert audit logs"
ON audit_logs
FOR INSERT
TO authenticated
WITH CHECK (false);