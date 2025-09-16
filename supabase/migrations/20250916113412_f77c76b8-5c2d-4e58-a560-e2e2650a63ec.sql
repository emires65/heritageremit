-- Add admin bypass policy for profiles table
-- This allows admin users to view all profiles for management purposes

-- Check if user is admin from admin_users table based on their email
CREATE OR REPLACE FUNCTION public.is_admin_user(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the provided email exists in admin_users table
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE username = user_email
  );
END;
$$;

-- Create admin bypass policy for profiles SELECT
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Allow if user is viewing their own profile OR if they are an admin
  auth.uid() = user_id OR 
  is_admin_user(auth.jwt() ->> 'email')
);

-- Create admin bypass policy for profiles UPDATE (so admins can fund accounts, etc.)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (
  -- Allow if user is updating their own profile OR if they are an admin
  auth.uid() = user_id OR 
  is_admin_user(auth.jwt() ->> 'email')
);

-- Also update the existing policies to be more specific
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate user policies with proper names to avoid conflicts
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);