-- Add status column to profiles table for user blocking functionality
ALTER TABLE public.profiles 
ADD COLUMN status text DEFAULT 'active' NOT NULL;

-- Add check constraint to ensure valid status values
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_status_check 
CHECK (status IN ('active', 'blocked'));

-- Create index for better performance when filtering by status
CREATE INDEX idx_profiles_status ON public.profiles(status);

-- Create function to fund user account (admin only)
CREATE OR REPLACE FUNCTION public.fund_user_account(target_user_id uuid, amount numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update user balance
  UPDATE public.profiles 
  SET balance = COALESCE(balance, 0) + amount 
  WHERE user_id = target_user_id;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Create function to toggle user status (admin only)
CREATE OR REPLACE FUNCTION public.toggle_user_status(target_user_id uuid, new_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate status
  IF new_status NOT IN ('active', 'blocked') THEN
    RAISE EXCEPTION 'Invalid status. Must be active or blocked';
  END IF;
  
  -- Update user status
  UPDATE public.profiles 
  SET status = new_status 
  WHERE user_id = target_user_id;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;