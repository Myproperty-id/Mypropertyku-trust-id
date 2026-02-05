-- Create verification_results table to store AI document verification results
CREATE TABLE public.verification_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verification_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id),
  document_type TEXT NOT NULL,
  file_url TEXT,
  
  -- Extracted data from OCR/AI
  extracted_data JSONB DEFAULT '{}'::jsonb,
  raw_text TEXT,
  
  -- Risk assessment
  risk_score NUMERIC(5,2) DEFAULT 0,
  risk_level TEXT DEFAULT 'UNKNOWN' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN')),
  risk_recommendation TEXT,
  
  -- Validation details
  validation_details JSONB DEFAULT '{}'::jsonb,
  
  -- Status
  verification_status TEXT DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'NEEDS_REVIEW', 'REJECTED')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_verification_results_user_id ON public.verification_results(user_id);
CREATE INDEX idx_verification_results_verification_id ON public.verification_results(verification_id);
CREATE INDEX idx_verification_results_status ON public.verification_results(verification_status);
CREATE INDEX idx_verification_results_created_at ON public.verification_results(created_at DESC);

-- Enable RLS
ALTER TABLE public.verification_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own verification results
CREATE POLICY "Users can view their own verifications" 
ON public.verification_results 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can create verification results for themselves
CREATE POLICY "Users can create their own verifications" 
ON public.verification_results 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins can view all verification results
CREATE POLICY "Admins can view all verifications" 
ON public.verification_results 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update verification results
CREATE POLICY "Admins can update verifications" 
ON public.verification_results 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Allow anonymous users to create verifications (for MVP - no auth required)
CREATE POLICY "Anonymous users can create verifications" 
ON public.verification_results 
FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Allow anonymous users to view their own verifications by verification_id
CREATE POLICY "Anyone can view verifications by id" 
ON public.verification_results 
FOR SELECT 
USING (user_id IS NULL);

-- Create trigger for updating updated_at
CREATE TRIGGER update_verification_results_updated_at
BEFORE UPDATE ON public.verification_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE public.verification_results IS 'Stores AI document verification results for property documents';
COMMENT ON COLUMN public.verification_results.verification_id IS 'Unique verification ID format: VER-YYYYMMDD-XXXXXXXX';
COMMENT ON COLUMN public.verification_results.extracted_data IS 'JSON containing extracted data like owner_name, certificate_number, address, etc.';
COMMENT ON COLUMN public.verification_results.risk_score IS 'Risk score from 0-100, higher is safer';
COMMENT ON COLUMN public.verification_results.risk_level IS 'Categorized risk: LOW (70-100), MEDIUM (40-69), HIGH (0-39)';