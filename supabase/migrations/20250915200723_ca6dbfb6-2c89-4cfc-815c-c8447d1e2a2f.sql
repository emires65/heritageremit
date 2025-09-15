-- Create functions to allow admins to update transaction dates
-- These functions will allow updating dates for all transaction types

CREATE OR REPLACE FUNCTION public.update_transaction_date(
  table_name text,
  transaction_id uuid,
  new_date timestamp with time zone
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Validate table name to prevent SQL injection
  IF table_name NOT IN ('transactions', 'deposits', 'withdrawals') THEN
    RAISE EXCEPTION 'Invalid table name. Must be one of: transactions, deposits, withdrawals';
  END IF;

  -- Update the created_at date based on table
  IF table_name = 'transactions' THEN
    UPDATE public.transactions 
    SET created_at = new_date 
    WHERE id = transaction_id;
  ELSIF table_name = 'deposits' THEN
    UPDATE public.deposits 
    SET created_at = new_date 
    WHERE id = transaction_id;
  ELSIF table_name = 'withdrawals' THEN
    UPDATE public.withdrawals 
    SET created_at = new_date 
    WHERE id = transaction_id;
  END IF;
  
  -- Check if update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found in table %', table_name;
  END IF;
END;
$$;