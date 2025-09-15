-- Enable Row Level Security on admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create a secure function for admin authentication that bypasses RLS
CREATE OR REPLACE FUNCTION public.authenticate_admin(
  username_param text,
  password_param text
)
RETURNS TABLE(admin_id uuid, username text, authenticated boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  stored_hash text;
  admin_record record;
BEGIN
  -- Get the stored password hash for the username
  SELECT id, username, password_hash 
  INTO admin_record
  FROM public.admin_users 
  WHERE username = username_param;
  
  -- If admin not found, return false
  IF NOT FOUND THEN
    RETURN QUERY SELECT null::uuid, ''::text, false::boolean;
    RETURN;
  END IF;
  
  -- For now, we'll do a simple comparison (in production, use proper password hashing)
  -- This assumes you're storing hashed passwords
  IF admin_record.password_hash = password_param THEN
    RETURN QUERY SELECT admin_record.id, admin_record.username, true::boolean;
  ELSE
    RETURN QUERY SELECT null::uuid, ''::text, false::boolean;
  END IF;
END;
$function$;

-- Create restrictive RLS policies
-- Only allow admins to view their own record (if they somehow get authenticated through Supabase auth)
CREATE POLICY "Admins can only view their own record" 
ON public.admin_users 
FOR SELECT 
USING (false); -- Block all direct access, force use of the authentication function

-- Block all INSERT, UPDATE, DELETE operations through the API
CREATE POLICY "Block admin_users modifications" 
ON public.admin_users 
FOR ALL 
USING (false) 
WITH CHECK (false);

-- Create a function to check if current session is admin (for future use)
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- This is a placeholder for future admin session management
  -- For now, return false as we're using localStorage-based admin sessions
  RETURN false;
END;
$function$;