-- Update the add_manual_transaction function to accept custom date
CREATE OR REPLACE FUNCTION public.add_manual_transaction(
  target_user_id uuid, 
  transaction_amount numeric, 
  transaction_description text, 
  transaction_type text DEFAULT 'credit'::text,
  transaction_date timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  user_account_id uuid;
  reference_num text;
  final_date timestamp with time zone;
BEGIN
  -- Use provided date or current timestamp
  final_date := COALESCE(transaction_date, now());
  
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
    reference_num := 'ADM' || EXTRACT(EPOCH FROM final_date)::BIGINT || FLOOR(RANDOM() * 1000)::TEXT;
    
    -- Insert transaction record with custom date
    INSERT INTO public.transactions (
      account_id, 
      transaction_type, 
      amount, 
      description, 
      reference_number,
      status,
      created_at
    ) VALUES (
      target_user_id, -- Using user_id as account_id for compatibility
      transaction_type,
      transaction_amount,
      transaction_description,
      reference_num,
      'completed',
      final_date
    );
  ELSE
    -- Standard transaction handling if accounts table is used
    reference_num := 'ADM' || EXTRACT(EPOCH FROM final_date)::BIGINT || FLOOR(RANDOM() * 1000)::TEXT;
    
    INSERT INTO public.transactions (
      account_id, 
      transaction_type, 
      amount, 
      description, 
      reference_number,
      status,
      created_at
    ) VALUES (
      user_account_id,
      transaction_type,
      transaction_amount,
      transaction_description,
      reference_num,
      'completed',
      final_date
    );
  END IF;
END;
$function$;