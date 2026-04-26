create or replace function public.kd_sutera_kasih_submit_booking_mock_payment(
  p_booking_id uuid,
  p_payment_target text default 'full',
  p_payment_method text default null
)
returns public.kd_sutera_kasih_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_payment_target text := lower(coalesce(p_payment_target, 'full'));
  target_booking public.kd_sutera_kasih_bookings%rowtype;
  updated_booking public.kd_sutera_kasih_bookings%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication is required to submit payment.';
  end if;

  if normalized_payment_target not in ('deposit', 'full') then
    raise exception 'Invalid payment target.';
  end if;

  select *
  into target_booking
  from public.kd_sutera_kasih_bookings booking
  where booking.id = p_booking_id
  limit 1;

  if target_booking.id is null then
    raise exception 'Booking not found.';
  end if;

  if target_booking.user_id <> current_user_id and not public.kd_sutera_kasih_is_admin(current_user_id) then
    raise exception 'You can only submit payment for your own booking.';
  end if;

  update public.kd_sutera_kasih_bookings
  set
    payment_method = coalesce(nullif(trim(p_payment_method), ''), payment_method),
    deposit_status = case
      when normalized_payment_target = 'deposit' then 'paid'
      else deposit_status
    end,
    full_payment_status = case
      when normalized_payment_target = 'full' then 'paid'
      else full_payment_status
    end
  where id = p_booking_id
  returning * into updated_booking;

  return updated_booking;
end;
$$;

grant execute on function public.kd_sutera_kasih_submit_booking_mock_payment(uuid, text, text) to authenticated;
