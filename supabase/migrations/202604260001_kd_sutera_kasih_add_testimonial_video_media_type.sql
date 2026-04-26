do $$
begin
  if exists (select 1 from pg_type where typname = 'kd_sutera_kasih_venue_media_type') then
    alter type public.kd_sutera_kasih_venue_media_type add value if not exists 'testimonial_video';
  end if;
end $$;
