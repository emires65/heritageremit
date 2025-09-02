-- Add role column to profiles table
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Add balance to profiles table  
ALTER TABLE public.profiles ADD COLUMN balance NUMERIC DEFAULT 0.00;

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deposits table
CREATE TABLE public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  method TEXT,
  reference_number TEXT NOT NULL DEFAULT generate_reference_number(),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create withdrawals table
CREATE TABLE public.withdrawals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  method TEXT,
  account_details JSONB,
  reference_number TEXT NOT NULL DEFAULT generate_reference_number(),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view their own deposits" 
ON public.deposits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deposits" 
ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own withdrawals" 
ON public.withdrawals FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own withdrawals" 
ON public.withdrawals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

-- Function to update user balance
CREATE OR REPLACE FUNCTION public.update_user_balance(user_id_param UUID, amount_param NUMERIC, operation TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF operation = 'add' THEN
    UPDATE public.profiles 
    SET balance = COALESCE(balance, 0) + amount_param 
    WHERE user_id = user_id_param;
  ELSIF operation = 'subtract' THEN
    UPDATE public.profiles 
    SET balance = COALESCE(balance, 0) - amount_param 
    WHERE user_id = user_id_param;
  END IF;
END;
$$;