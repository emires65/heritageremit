-- Create admin-specific functions that bypass RLS for admin operations
-- These functions will be called by the admin panel instead of direct table access

-- Function to get all profiles for admin panel (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_get_all_profiles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  first_name text,
  last_name text,
  phone text,
  balance numeric,
  account_number text,
  role text,
  status text,
  account_status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return all profiles without RLS restrictions
  RETURN QUERY
  SELECT 
    p.id,
    p.user_id,
    p.first_name,
    p.last_name,
    p.phone,
    p.balance,
    p.account_number,
    p.role,
    p.status,
    p.account_status,
    p.created_at
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;