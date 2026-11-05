CREATE POLICY "Users upload own complaint photos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'complaint-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users read own complaint photos" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'complaint-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins read all complaint photos" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'complaint-photos' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Users delete own complaint photos" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'complaint-photos' AND (storage.foldername(name))[1] = auth.uid()::text);