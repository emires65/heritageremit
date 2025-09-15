-- Fix the ambiguous column reference in authenticate_admin function
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
  -- Get the stored password hash for the username (explicitly qualify column names)
  SELECT admin_users.id, admin_users.username, admin_users.password_hash 
  INTO admin_record
  FROM public.admin_users 
  WHERE admin_users.username = username_param;
  
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