-- Assign admin role to the user who needs admin access
INSERT INTO public.user_roles (user_id, role)
VALUES ('d5e66c13-1f76-4062-885d-1fdcc7fc091a'::uuid, 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;