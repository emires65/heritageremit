-- Add status column to profiles table for account activation
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'account_status') THEN
        ALTER TABLE public.profiles ADD COLUMN account_status text DEFAULT 'inactive';
    END IF;
END $$;

-- Create function to activate user account
CREATE OR REPLACE FUNCTION public.activate_user_account(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Update user account status to active
  UPDATE public.profiles 
  SET account_status = 'active' 
  WHERE user_id = target_user_id;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Create function to add manual transaction for admin
CREATE OR REPLACE FUNCTION public.add_manual_transaction(
  target_user_id uuid, 
  transaction_amount numeric, 
  transaction_description text,
  transaction_type text DEFAULT 'credit'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_account_id uuid;
  reference_num text;
BEGIN
  -- Get user's account ID (assuming first account)
  SELECT id INTO user_account_id
  FROM public.accounts
  WHERE user_id = target_user_id
  LIMIT 1;
  
  -- If no account exists, we'll use the profiles table approach
  IF user_account_id IS NULL THEN
    -- Update user balance directly in profiles
    IF transaction_type = 'credit' THEN
      UPDATE public.profiles 
      SET balance = COALESCE(balance, 0) + transaction_amount 
      WHERE user_id = target_user_id;
    ELSE
      UPDATE public.profiles 
      SET balance = COALESCE(balance, 0) - transaction_amount 
      WHERE user_id = target_user_id;
    END IF;
    
    -- Generate reference number
    reference_num := 'ADM' || EXTRACT(EPOCH FROM NOW())::BIGINT || FLOOR(RANDOM() * 1000)::TEXT;
    
    -- Insert transaction record (we'll use a simplified approach)
    INSERT INTO public.transactions (
      account_id, 
      transaction_type, 
      amount, 
      description, 
      reference_number,
      status
    ) VALUES (
      gen_random_uuid(), -- placeholder account_id
      transaction_type,
      transaction_amount,
      transaction_description,
      reference_num,
      'completed'
    );
  ELSE
    -- Standard transaction handling if accounts table is used
    reference_num := 'ADM' || EXTRACT(EPOCH FROM NOW())::BIGINT || FLOOR(RANDOM() * 1000)::TEXT;
    
    INSERT INTO public.transactions (
      account_id, 
      transaction_type, 
      amount, 
      description, 
      reference_number,
      status
    ) VALUES (
      user_account_id,
      transaction_type,
      transaction_amount,
      transaction_description,
      reference_num,
      'completed'
    );
  END IF;
END;
$$;