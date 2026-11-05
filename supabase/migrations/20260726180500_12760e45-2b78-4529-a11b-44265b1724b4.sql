-- status change: history + student notification + auto-Assigned
CREATE OR REPLACE FUNCTION public.notify_status_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  -- assigning staff to a pending complaint moves it to Assigned
  IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to
     AND COALESCE(NEW.assigned_to, '') <> ''
     AND NEW.status = 'Pending' AND OLD.status = 'Pending' THEN
    NEW.status := 'Assigned';
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'Resolved' THEN NEW.resolved_at = now(); END IF;

    INSERT INTO public.notifications (user_id, complaint_id, message)
    VALUES (NEW.user_id, NEW.id, NEW.reference || ' — "' || NEW.title || '" is now ' || NEW.status);

    INSERT INTO public.complaint_status_history (complaint_id, old_status, new_status, changed_by, note)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid(),
            CASE WHEN COALESCE(NEW.assigned_to,'') <> '' THEN 'Assigned to ' || NEW.assigned_to ELSE '' END);
  END IF;
  RETURN NEW;
END; $function$;

DROP TRIGGER IF EXISTS complaints_status_change ON public.complaints;
CREATE TRIGGER complaints_status_change
BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.notify_status_change();

DROP TRIGGER IF EXISTS complaints_set_updated_at ON public.complaints;
CREATE TRIGGER complaints_set_updated_at
BEFORE UPDATE ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- new complaint: history entry + notify every admin
CREATE OR REPLACE FUNCTION public.on_complaint_created()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $function$
BEGIN
  INSERT INTO public.complaint_status_history (complaint_id, old_status, new_status, changed_by, note)
  VALUES (NEW.id, NULL, NEW.status, NEW.user_id, 'Complaint submitted');

  INSERT INTO public.notifications (user_id, complaint_id, message)
  SELECT ur.user_id, NEW.id,
         'New complaint ' || NEW.reference || ' (' || NEW.category || ') — "' || NEW.title || '"'
  FROM public.user_roles ur
  WHERE ur.role = 'admin';

  RETURN NEW;
END; $function$;

DROP TRIGGER IF EXISTS complaints_created ON public.complaints;
CREATE TRIGGER complaints_created
AFTER INSERT ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.on_complaint_created();