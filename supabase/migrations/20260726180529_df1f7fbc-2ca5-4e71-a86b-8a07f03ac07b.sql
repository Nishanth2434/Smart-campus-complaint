REVOKE ALL ON FUNCTION public.notify_status_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.on_complaint_created() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.next_complaint_reference() FROM PUBLIC, anon;