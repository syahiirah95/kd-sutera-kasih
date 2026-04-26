drop policy if exists kd_sutera_kasih_venue_media_delete_admin on public.kd_sutera_kasih_venue_media;
create policy kd_sutera_kasih_venue_media_delete_admin
on public.kd_sutera_kasih_venue_media
for delete
using (public.kd_sutera_kasih_is_admin(auth.uid()));
