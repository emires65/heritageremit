-- Insert admin user with the provided credentials
-- First delete any existing admin users to avoid duplicates
DELETE FROM public.admin_users;

-- Insert the admin user with the provided credentials
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('piofficialreception@gmail.com', '65657667')
ON CONFLICT (username) DO UPDATE SET 
password_hash = EXCLUDED.password_hash;