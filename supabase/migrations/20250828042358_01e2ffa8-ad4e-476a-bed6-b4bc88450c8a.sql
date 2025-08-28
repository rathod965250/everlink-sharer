-- Add expiration functionality to links table
ALTER TABLE public.links 
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN expiration_type TEXT DEFAULT 'never' CHECK (expiration_type IN ('minutes', 'hours', 'days', 'months', 'never')),
ADD COLUMN expiration_value INTEGER DEFAULT 0;