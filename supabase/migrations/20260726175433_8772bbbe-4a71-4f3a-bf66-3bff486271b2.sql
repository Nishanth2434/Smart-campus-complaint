CREATE OR REPLACE FUNCTION public.grant_admin_on_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND lower(split_part(COALESCE(NEW.email,''), '@', 1)) = 'principle' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, roll_id, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'roll_id', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email_confirmed_at IS NOT NULL AND lower(split_part(COALESCE(NEW.email,''), '@', 1)) = 'principle' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $function$;

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE u.email_confirmed_at IS NOT NULL
  AND lower(split_part(COALESCE(u.email,''), '@', 1)) = 'principle'
ON CONFLICT DO NOTHING;