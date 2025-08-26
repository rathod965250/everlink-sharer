-- Create links table for storing shortened URLs
CREATE TABLE public.links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code TEXT NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (though we'll make it public for this use case)
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read links (for redirects)
CREATE POLICY "Anyone can view links" 
ON public.links 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to create links (no auth required)
CREATE POLICY "Anyone can create links" 
ON public.links 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to update click counts
CREATE POLICY "Anyone can update click counts" 
ON public.links 
FOR UPDATE 
USING (true);

-- Create index for faster lookups by short_code
CREATE INDEX idx_links_short_code ON public.links(short_code);

-- Create index for analytics queries
CREATE INDEX idx_links_created_at ON public.links(created_at DESC);