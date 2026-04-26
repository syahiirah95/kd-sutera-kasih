"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { type BookingAvailabilityRecord } from "@/lib/supabase/booking-data";
import { cn } from "@/lib/utils";

type AvailabilityVenue = {
  name: string;
  operatingHours?: string;
  slug: string;
};

type BookingAvailabilityCalendarProps = {
  bookings: BookingAvailabilityRecord[];
  hideHeaderCopy?: boolean;
  initialVenueSlug?: string;
  reserveWholeDayOnBookedDate?: boolean;
  title?: string;
  venues: AvailabilityVenue[];
};

type TimeInterval = {
  end: number;
  start: number;
};

type DayAvailability = {
  bookings: BookingAvailabilityRecord[];
  freeIntervals: TimeInterval[];
  occupiedIntervals: TimeInterval[];
  status: "available" | "partial" | "unavailable";
};

const MONTH_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DEFAULT_DAY_START = 9 * 60;
const DEFAULT_DAY_END = 23 * 60;
const CALENDAR_PILL_BASE_CLASS =
  "inline-flex h-7 items-center justify-center rounded-full border px-3 text-[11px] font-semibold leading-none shadow-[0_8px_20px_rgba(184,111,41,0.16)] transition-transform duration-200 will-change-transform hover:scale-[1.03]";

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseTimeLabelToMinutes(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);

  if (!match) {
    return null;
  }

  const [, hourText, minuteText, periodText] = match;
  const hourValue = Number.parseInt(hourText, 10);
  const minuteValue = Number.parseInt(minuteText, 10);

  if (!Number.isFinite(hourValue) || !Number.isFinite(minuteValue)) {
    return null;
  }

  const normalizedHour = hourValue % 12;
  const offset = periodText.toUpperCase() === "PM" ? 12 * 60 : 0;

  return normalizedHour * 60 + minuteValue + offset;
}

function formatMinutes(minutes: number) {
  const normalized = Math.max(0, minutes);
  const hour24 = Math.floor(normalized / 60) % 24;
  const minute = normalized % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function parseOperatingHours(operatingHours?: string): TimeInterval {
  const match = operatingHours?.match(/(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)/i);
  const start = match ? parseTimeLabelToMinutes(match[1]) : null;
  const end = match ? parseTimeLabelToMinutes(match[2]) : null;

  return {
    end: end ?? DEFAULT_DAY_END,
    start: start ?? DEFAULT_DAY_START,
  };
}

function parseDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function parseBookingTimeSlot(value: string): TimeInterval | null {
  const [startText, endText] = value.split("-").map((segment) => segment.trim());
  const start = startText ? parseTimeLabelToMinutes(startText) : null;
  const end = endText ? parseTimeLabelToMinutes(endText) : null;

  if (start === null || end === null || end <= start) {
    return null;
  }

  return { end, start };
}

function mergeIntervals(intervals: TimeInterval[]) {
  if (intervals.length === 0) {
    return [];
  }

  const sortedIntervals = [...intervals].sort((left, right) => left.start - right.start);
  const merged: TimeInterval[] = [sortedIntervals[0]];

  for (const interval of sortedIntervals.slice(1)) {
    const current = merged[merged.length - 1];

    if (interval.start <= current.end) {
      current.end = Math.max(current.end, interval.end);
      continue;
    }

    merged.push({ ...interval });
  }

  return merged;
}

function subtractIntervals(baseInterval: TimeInterval, blockedIntervals: TimeInterval[]) {
  if (blockedIntervals.length === 0) {
    return [baseInterval];
  }

  const freeIntervals: TimeInterval[] = [];
  let cursor = baseInterval.start;

  for (const interval of blockedIntervals) {
    const intervalStart = Math.max(interval.start, baseInterval.start);
    const intervalEnd = Math.min(interval.end, baseInterval.end);

    if (intervalEnd <= baseInterval.start || intervalStart >= baseInterval.end) {
      continue;
    }

    if (intervalStart > cursor) {
      freeIntervals.push({ end: intervalStart, start: cursor });
    }

    cursor = Math.max(cursor, intervalEnd);
  }

  if (cursor < baseInterval.end) {
    freeIntervals.push({ end: baseInterval.end, start: cursor });
  }

  return freeIntervals;
}

function createCalendarDays(visibleMonth: Date) {
  const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      inMonth: date.getMonth() === visibleMonth.getMonth(),
      label: date.getDate(),
      value: toDateValue(date),
    };
  });
}

function getBadgeClassName(status: DayAvailability["status"]) {
  if (status === "available") {
    return `${CALENDAR_PILL_BASE_CLASS} border-success/45 bg-[linear-gradient(135deg,#78a979_0%,#5f8a65_56%,#a8cfa7_100%)] text-white shadow-[0_8px_20px_rgba(95,138,101,0.18)]`;
  }

  if (status === "partial") {
    return `${CALENDAR_PILL_BASE_CLASS} border-[#c8893e]/55 bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] text-white shadow-[0_8px_20px_rgba(184,111,41,0.22)]`;
  }

  return `${CALENDAR_PILL_BASE_CLASS} border-[#ff1f2d]/60 bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] text-white shadow-[0_0_16px_rgba(255,31,45,0.16),0_8px_20px_rgba(224,0,18,0.16)]`;
}

function getDayLabel(status: DayAvailability["status"]) {
  if (status === "available") {
    return "Available";
  }

  if (status === "partial") {
    return "Partial";
  }

  return "Unavailable";
}

export function BookingAvailabilityCalendar({
  bookings,
  hideHeaderCopy = false,
  initialVenueSlug,
  reserveWholeDayOnBookedDate = false,
  title = "Availability Calendar",
  venues,
}: BookingAvailabilityCalendarProps) {
  const todayValue = useMemo(() => toDateValue(new Date()), []);
  const [selectedVenueSlug, setSelectedVenueSlug] = useState(initialVenueSlug ?? venues[0]?.slug ?? "");
  const venueSlugSet = useMemo(() => new Set(venues.map((venue) => venue.slug)), [venues]);
  const validBookings = useMemo(
    () =>
      bookings.filter(
        (booking) => venueSlugSet.has(booking.venueSlug) && booking.status !== "rejected",
      ),
    [bookings, venueSlugSet],
  );
  const venueDatesBySlug = useMemo(() => {
    const nextMap = new Map<string, string[]>();

    for (const booking of validBookings) {
      const currentDates = nextMap.get(booking.venueSlug) ?? [];
      currentDates.push(booking.eventDate);
      nextMap.set(booking.venueSlug, currentDates);
    }

    nextMap.forEach((dates, slug) => {
      nextMap.set(
        slug,
        [...new Set(dates)].sort((left, right) => parseDateValue(left).getTime() - parseDateValue(right).getTime()),
      );
    });

    return nextMap;
  }, [validBookings]);

  function getPreferredDateForVenue(venueSlug?: string) {
    const venueDates = venueSlug ? venueDatesBySlug.get(venueSlug) ?? [] : [];
    const upcomingDate = venueDates.find((dateValue) => dateValue >= todayValue);

    return upcomingDate ?? venueDates[venueDates.length - 1] ?? todayValue;
  }

  const [selectedDate, setSelectedDate] = useState(() => getPreferredDateForVenue(initialVenueSlug ?? venues[0]?.slug ?? ""));
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const preferredDate = parseDateValue(getPreferredDateForVenue(initialVenueSlug ?? venues[0]?.slug ?? ""));
    return new Date(preferredDate.getFullYear(), preferredDate.getMonth(), 1);
  });

  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.slug === selectedVenueSlug) ?? venues[0] ?? null,
    [selectedVenueSlug, venues],
  );
  const operatingWindow = parseOperatingHours(selectedVenue?.operatingHours);

  const bookingsByDate = useMemo(() => {
    const filteredBookings = validBookings.filter((booking) => booking.venueSlug === selectedVenue?.slug);
    const nextMap = new Map<string, BookingAvailabilityRecord[]>();

    for (const booking of filteredBookings) {
      const currentEntries = nextMap.get(booking.eventDate) ?? [];
      currentEntries.push(booking);
      nextMap.set(booking.eventDate, currentEntries);
    }

    return nextMap;
  }, [selectedVenue?.slug, validBookings]);

  const availabilityByDate = useMemo(() => {
    const nextMap = new Map<string, DayAvailability>();

    bookingsByDate.forEach((dayBookings, dateValue) => {
      const occupiedIntervals = mergeIntervals(
        dayBookings
          .map((booking) => parseBookingTimeSlot(booking.timeSlotLabel))
          .filter((interval): interval is TimeInterval => Boolean(interval)),
      );
      const freeIntervals = reserveWholeDayOnBookedDate && dayBookings.length > 0
        ? []
        : subtractIntervals(operatingWindow, occupiedIntervals);

      nextMap.set(dateValue, {
        bookings: [...dayBookings].sort((left, right) => left.timeSlotLabel.localeCompare(right.timeSlotLabel)),
        freeIntervals,
        occupiedIntervals,
        status:
          occupiedIntervals.length === 0
            ? "available"
            : reserveWholeDayOnBookedDate || freeIntervals.length === 0
              ? "unavailable"
              : "partial",
      });
    });

    return nextMap;
  }, [bookingsByDate, operatingWindow, reserveWholeDayOnBookedDate]);

  const calendarDays = useMemo(() => createCalendarDays(visibleMonth), [visibleMonth]);
  const selectedDayAvailability =
    availabilityByDate.get(selectedDate) ?? {
      bookings: [],
      freeIntervals: [operatingWindow],
      occupiedIntervals: [],
      status: "available" as const,
    };

  function handleVenueChange(nextVenueSlug: string) {
    const preferredDate = getPreferredDateForVenue(nextVenueSlug);
    const preferredMonth = parseDateValue(preferredDate);

    setSelectedVenueSlug(nextVenueSlug);
    setSelectedDate(preferredDate);
    setVisibleMonth(new Date(preferredMonth.getFullYear(), preferredMonth.getMonth(), 1));
  }

  return (
    <Card className="overflow-hidden rounded-[var(--radius-sm)] border-white/75 bg-white/72 shadow-[0_18px_46px_rgba(114,76,43,0.12)]">
      {!hideHeaderCopy ? (
        <CardHeader className="border-b border-border/70 px-5 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 font-display text-2xl">
                <CalendarDays className="size-5 text-primary" />
                {title}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Dates with pending or approved bookings are marked here. Partial-day bookings still leave bookable windows.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Past dates stay visible for reference, but they are no longer bookable.
              </p>
              {reserveWholeDayOnBookedDate ? (
                <p className="mt-1 text-xs font-semibold text-[#9b5f20]">
                  Booking page rule: once a hall has a pending or approved booking on a date, that hall date is locked for new requests.
                </p>
              ) : null}
            </div>
          </div>
        </CardHeader>
      ) : null}
      <CardContent className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(16rem,0.95fr)]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <button
              className="inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-white/72 text-[#8d542d] transition hover:border-[#c8893e]/70 hover:bg-white hover:text-[#5f3f2f]"
              onClick={() =>
                setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
              type="button"
            >
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
              {MONTH_FORMATTER.format(visibleMonth)}
            </p>
            <button
              className="inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-white/72 text-[#8d542d] transition hover:border-[#c8893e]/70 hover:bg-white hover:text-[#5f3f2f]"
              onClick={() =>
                setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
              type="button"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day) => {
              const dayAvailability =
                availabilityByDate.get(day.value) ?? {
                  bookings: [],
                  freeIntervals: [operatingWindow],
                  occupiedIntervals: [],
                  status: "available" as const,
                };
              const isSelected = selectedDate === day.value;
              const isPast = day.value < todayValue;

              return (
                <button
                  key={day.value}
                  className={cn(
                    "min-h-[4.7rem] rounded-[var(--radius-sm)] border px-2 py-1.5 text-left transition",
                    isSelected
                      ? "border-[#c8893e]/60 bg-[linear-gradient(135deg,rgba(255,247,235,0.98)_0%,rgba(246,226,207,0.92)_100%)] shadow-[0_10px_24px_rgba(184,111,41,0.12)]"
                      : "border-border/70 bg-white/72 hover:border-[#c8893e]/45 hover:bg-white",
                    !day.inMonth && "opacity-55",
                    isPast && "opacity-70",
                  )}
                  onClick={() => setSelectedDate(day.value)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground">{day.label}</span>
                    <span
                      className={cn(
                        "inline-flex size-2 shrink-0 rounded-full",
                        dayAvailability.status === "available"
                          ? "bg-[#5f8a65]"
                          : dayAvailability.status === "partial"
                            ? "bg-[#c8893e]"
                            : "bg-[#e00012]",
                      )}
                    />
                  </div>
                  <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                    {dayAvailability.status === "available"
                      ? "Open"
                      : dayAvailability.status === "partial"
                        ? "Partial"
                        : "Booked"}
                  </p>
                  {dayAvailability.status === "partial" ? (
                    <p className="mt-0.5 line-clamp-2 text-[9px] leading-3.5 text-[#9b5f20]">
                      {dayAvailability.freeIntervals
                        .slice(0, 1)
                        .map((interval) => `${formatMinutes(interval.start)} - ${formatMinutes(interval.end)}`)
                        .join(", ")}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className={getBadgeClassName("available")}>Available</span>
            <span className={getBadgeClassName("partial")}>Partial Day</span>
            <span className={getBadgeClassName("unavailable")}>Unavailable</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border/70 bg-white/72 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.84)]">
            <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">Hall</p>
            <div className="min-w-0 flex-1">
              <Select
                className="h-10 !w-full rounded-lg border-[#c9a27e]/45 bg-white/80 px-3 text-sm font-semibold text-[#5f3f2f]"
                value={selectedVenueSlug}
                onChange={(event) => handleVenueChange(event.target.value)}
              >
                {venues.map((venue) => (
                  <option key={venue.slug} value={venue.slug}>
                    {venue.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(180deg,#fffdf9_0%,#fff6ec_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.84)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className={getBadgeClassName(selectedDayAvailability.status)}>
              {getDayLabel(selectedDayAvailability.status)}
            </span>
            <p className="text-sm font-semibold text-foreground">{DATE_FORMATTER.format(new Date(`${selectedDate}T00:00:00`))}</p>
          </div>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">Operating hours</p>
              <p className="mt-1 text-muted-foreground">
                {selectedVenue?.operatingHours ?? `${formatMinutes(operatingWindow.start)} - ${formatMinutes(operatingWindow.end)}`}
              </p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">
                <Clock3 className="size-4" />
                Available for booking
              </p>
              {selectedDayAvailability.freeIntervals.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedDayAvailability.freeIntervals.map((interval) => (
                    <span
                      className={getBadgeClassName("available")}
                      key={`${interval.start}-${interval.end}`}
                    >
                      {formatMinutes(interval.start)} - {formatMinutes(interval.end)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-muted-foreground">No remaining booking window on this date.</p>
              )}
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b5f20]">Booked slots</p>
              {selectedDayAvailability.bookings.length > 0 ? (
                <div className="mt-2 space-y-2">
                  {selectedDayAvailability.bookings.map((booking) => (
                    <div
                      className="rounded-[var(--radius-sm)] border border-border/70 bg-white/72 px-3 py-2"
                      key={`${booking.venueSlug}-${booking.eventDate}-${booking.timeSlotLabel}-${booking.status}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">{booking.timeSlotLabel}</p>
                        <span className={cn(getBadgeClassName(booking.status === "pending" ? "partial" : "unavailable"), "capitalize")}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        This slot is already held for {booking.venueName}.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-muted-foreground">No pending or approved booking on this date yet.</p>
              )}
            </div>

            {selectedDate < todayValue ? (
              <p className="rounded-[var(--radius-sm)] border border-border/70 bg-white/72 px-3 py-2 text-xs text-muted-foreground">
                This is a past booking date shown for reference only. New bookings should use a future date.
              </p>
            ) : null}
          </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
