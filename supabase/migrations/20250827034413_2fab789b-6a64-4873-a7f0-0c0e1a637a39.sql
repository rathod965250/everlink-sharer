-- Add user_id column to links table
ALTER TABLE public.links ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update RLS policies to be user-specific
DROP POLICY IF EXISTS "Anyone can create links" ON public.links;
DROP POLICY IF EXISTS "Anyone can view links" ON public.links;
DROP POLICY IF EXISTS "Anyone can update click counts" ON public.links;

-- Allow public to view links for redirect functionality
CREATE POLICY "Public can view links for redirect" 
ON public.links 
FOR SELECT 
USING (true);

-- Allow public to update click counts for redirect functionality
CREATE POLICY "Public can update click counts" 
ON public.links 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow authenticated users to create their own links
CREATE POLICY "Users can create their own links" 
ON public.links 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own links (for analytics)
CREATE POLICY "Users can view their own links" 
ON public.links 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to delete their own links
CREATE POLICY "Users can delete their own links" 
ON public.links 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create profiles table for additional user data
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();