-- Create storage buckets for property images and legal documents
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('property-images', 'property-images', true),
  ('legal-documents', 'legal-documents', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for property-images bucket (public read, authenticated upload)
CREATE POLICY "Property images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for legal-documents bucket (private, owner access only, admin access)
CREATE POLICY "Users can view their own legal documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'legal-documents' AND
  (auth.uid()::text = (storage.foldername(name))[1] OR has_role(auth.uid(), 'admin'))
);

CREATE POLICY "Authenticated users can upload legal documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'legal-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own legal documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'legal-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own legal documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'legal-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);