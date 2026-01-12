-- ============================================
-- SECURITY HARDENING MIGRATION
-- Comprehensive RLS fixes for all sensitive tables
-- ============================================

-- 1. PROFILES TABLE - Block anonymous access completely
-- Drop existing policies to recreate with proper security
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Profiles: Users can only view their own profile (authenticated only)
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Profiles: Admins can view all profiles (authenticated only)
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Profiles: Users can insert their own profile (authenticated only)
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Profiles: Users can update their own profile (authenticated only)
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 2. AUDIT_LOGS TABLE - Admin-only read access, no client writes
-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Only system can insert audit logs" ON audit_logs;

-- Audit logs: Only admins can read (authenticated only)
CREATE POLICY "Admins can view all audit logs"
ON audit_logs FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Audit logs: No one can insert via client (service_role or SECURITY DEFINER only)
CREATE POLICY "Only system can insert audit logs"
ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (false);

-- Ensure anon role has no access to audit_logs
REVOKE ALL ON audit_logs FROM anon;

-- 3. USER_ROLES TABLE - Prevent admin enumeration
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- User roles: Users can only see their own roles (authenticated only)
CREATE POLICY "Users can view their own roles"
ON user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- User roles: Admins can manage all roles (authenticated only)
CREATE POLICY "Admins can manage all roles"
ON user_roles FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure anon role has no access to user_roles
REVOKE ALL ON user_roles FROM anon;

-- 4. Ensure anon has no access to profiles
REVOKE ALL ON profiles FROM anon;

-- 5. Ensure verification_requests has proper restrictions
REVOKE ALL ON verification_requests FROM anon;

-- 6. Create validation function for property price (server-side validation)
CREATE OR REPLACE FUNCTION validate_property_price()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate price is positive and within reasonable bounds
  IF NEW.price IS NULL OR NEW.price <= 0 THEN
    RAISE EXCEPTION 'Price must be a positive number';
  END IF;
  
  IF NEW.price > 999999999999999 THEN
    RAISE EXCEPTION 'Price exceeds maximum allowed value';
  END IF;
  
  -- Validate other numeric fields are positive if provided
  IF NEW.land_size IS NOT NULL AND NEW.land_size < 0 THEN
    RAISE EXCEPTION 'Land size cannot be negative';
  END IF;
  
  IF NEW.building_size IS NOT NULL AND NEW.building_size < 0 THEN
    RAISE EXCEPTION 'Building size cannot be negative';
  END IF;
  
  IF NEW.bedrooms IS NOT NULL AND NEW.bedrooms < 0 THEN
    RAISE EXCEPTION 'Bedrooms cannot be negative';
  END IF;
  
  IF NEW.bathrooms IS NOT NULL AND NEW.bathrooms < 0 THEN
    RAISE EXCEPTION 'Bathrooms cannot be negative';
  END IF;
  
  IF NEW.floors IS NOT NULL AND NEW.floors < 0 THEN
    RAISE EXCEPTION 'Floors cannot be negative';
  END IF;
  
  IF NEW.year_built IS NOT NULL AND (NEW.year_built < 1800 OR NEW.year_built > 2100) THEN
    RAISE EXCEPTION 'Year built must be between 1800 and 2100';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for property validation
DROP TRIGGER IF EXISTS validate_property_before_insert ON properties;
CREATE TRIGGER validate_property_before_insert
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION validate_property_price();