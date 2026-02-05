-- Fix overly permissive RLS policies for verification_results
-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anonymous users can create verifications" ON public.verification_results;
DROP POLICY IF EXISTS "Anyone can view verifications by id" ON public.verification_results;

-- Create more secure policies for anonymous access
-- Anonymous users can create verifications only when user_id is NULL
-- This is intentionally permissive for MVP to allow unauth verification
-- In production, require authentication
CREATE POLICY "Allow public verification creation" 
ON public.verification_results 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Anonymous users can only view verifications where user_id is NULL
-- This limits access to only anonymous verifications
CREATE POLICY "Allow viewing anonymous verifications" 
ON public.verification_results 
FOR SELECT 
USING (user_id IS NULL);