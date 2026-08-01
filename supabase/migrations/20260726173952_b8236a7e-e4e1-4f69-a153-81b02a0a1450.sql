-- enums
CREATE TYPE public.app_role AS ENUM ('admin','student');
CREATE TYPE public.complaint_status AS ENUM ('Pending','In Progress','Resolved');
CREATE TYPE public.complaint_priority AS ENUM ('Low','Medium','High');

-- profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  roll_id text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- roles
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- complaints
CREATE TABLE public.complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('CMP-' || lpad((floor(random()*90000)+10000)::text, 5, '0')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  priority public.complaint_priority NOT NULL DEFAULT 'Medium',
  location text NOT NULL,
  status public.complaint_status NOT NULL DEFAULT 'Pending',
  assigned_to text,
  is_anonymous boolean NOT NULL DEFAULT false,
  photo_paths text[] NOT NULL DEFAULT '{}',
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.complaints TO authenticated;
GRANT ALL ON public.complaints TO service_role;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students read own complaints" ON public.complaints FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all complaints" ON public.complaints FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Students create own complaints" ON public.complaints FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students delete own unresolved complaints" ON public.complaints FOR DELETE TO authenticated USING (auth.uid() = user_id AND status <> 'Resolved');
CREATE POLICY "Admins update complaints" ON public.complaints FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- notifications
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  complaint_id uuid REFERENCES public.complaints(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- feedback
CREATE TABLE public.complaint_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL UNIQUE REFERENCES public.complaints(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.complaint_feedback TO authenticated;
GRANT ALL ON public.complaint_feedback TO service_role;
ALTER TABLE public.complaint_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own feedback" ON public.complaint_feedback FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own feedback" ON public.complaint_feedback FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own feedback" ON public.complaint_feedback FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins read all feedback" ON public.complaint_feedback FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER complaints_set_updated_at BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- notify on status change
CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'Resolved' THEN NEW.resolved_at = now(); END IF;
    INSERT INTO public.notifications (user_id, complaint_id, message)
    VALUES (NEW.user_id, NEW.id, NEW.reference || ' — "' || NEW.title || '" is now ' || NEW.status);
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER complaints_notify_status BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.notify_status_change();

-- profile creation + verified-domain admin grant
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE dom text;
BEGIN
  INSERT INTO public.profiles (id, full_name, roll_id, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'roll_id', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;

  dom := lower(split_part(COALESCE(NEW.email,''), '@', 2));
  IF NEW.email_confirmed_at IS NOT NULL AND (dom = 'mycollege' OR dom LIKE 'mycollege.%') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.grant_admin_on_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE dom text;
BEGIN
  dom := lower(split_part(COALESCE(NEW.email,''), '@', 2));
  IF NEW.email_confirmed_at IS NOT NULL AND (dom = 'mycollege' OR dom LIKE 'mycollege.%') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_confirmed AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.grant_admin_on_verification();