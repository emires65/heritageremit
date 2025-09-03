-- Add pin_hash and account_number columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS pin_hash TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT DEFAULT generate_account_number();

-- Update existing profiles that don't have account numbers
UPDATE public.profiles 
SET account_number = generate_account_number() 
WHERE account_number IS NULL;