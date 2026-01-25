-- Create table for partner inquiries/notifications
CREATE TABLE public.partner_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can submit inquiries)
CREATE POLICY "Anyone can submit partner inquiries" 
ON public.partner_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admins to view all inquiries
CREATE POLICY "Admins can view all partner inquiries" 
ON public.partner_inquiries 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Create policy for admins to update inquiries
CREATE POLICY "Admins can update partner inquiries" 
ON public.partner_inquiries 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partner_inquiries_updated_at
BEFORE UPDATE ON public.partner_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for efficient querying
CREATE INDEX idx_partner_inquiries_category ON public.partner_inquiries(category);
CREATE INDEX idx_partner_inquiries_status ON public.partner_inquiries(status);