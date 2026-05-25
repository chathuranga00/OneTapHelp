-- SOS audio recordings bucket (public read for uploaded evidence URLs)

insert into storage.buckets (id, name, public)
values ('sos-recordings', 'sos-recordings', true)
on conflict (id) do nothing;

-- Authenticated users can upload into their own folder
create policy "sos_recordings_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'sos-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "sos_recordings_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'sos-recordings'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "sos_recordings_select_public"
  on storage.objects for select
  to public
  using (bucket_id = 'sos-recordings');
