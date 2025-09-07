-- Enable real-time for transaction tables to support live updates
-- This allows the frontend to receive instant notifications when transactions are added/updated

-- Enable replica identity and add tables to realtime publication for real-time updates
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.deposits REPLICA IDENTITY FULL;
ALTER TABLE public.withdrawals REPLICA IDENTITY FULL;

-- Add tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deposits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.withdrawals;