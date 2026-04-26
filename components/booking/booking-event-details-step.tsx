"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { type BookingFormData } from "@/components/booking/booking-request-types";
import { ContextHelp } from "@/components/help/context-help";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { EVENT_TYPES, OPERATING_HOURS } from "@/lib/constants/booking";

type BookingEventDetailsStepProps = {
  formData: BookingFormData;
  selectedDateUnavailable: boolean;
  selectedTimeRange: string;
  timeRangeIsValid: boolean;
  today: string;
  unavailableDateValues: ReadonlySet<string>;
  updateField: (field: keyof BookingFormData, value: string) => void;
  venueOptions: ReadonlyArray<{
    label: string;
    slug: string;
    state: string;
  }>;
};

const MONTH_FORMATTER = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
});
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function formatDateLabel(value: string) {
  if (!value) {
    return "Select date";
  }

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function formatTimeLabel(value: string) {
  const [hourValue, minuteValue] = value.split(":").map(Number);
  const hour = hourValue ?? 0;
  const minute = minuteValue ?? 0;
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

function createTimeOptions(start: string, end: string) {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const startTotal = (startHour ?? 0) * 60 + (startMinute ?? 0);
  const endTotal = (endHour ?? 0) * 60 + (endMinute ?? 0);
  const options: string[] = [];

  for (let total = startTotal; total <= endTotal; total += 30) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    options.push(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  }

  return options;
}

function BookingDatePicker({
  id,
  min,
  onChange,
  unavailableDateValues,
  value,
}: Readonly<{
  id: string;
  min: string;
  onChange: (value: string) => void;
  unavailableDateValues: ReadonlySet<string>;
  value: string;
}>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = parseDateValue(value || min);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const days = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const startOffset = firstDay.getDay();
    const gridStart = new Date(firstDay);
    gridStart.setDate(firstDay.getDate() - startOffset);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);

      return {
        inMonth: date.getMonth() === visibleMonth.getMonth(),
        label: date.getDate(),
        value: toDateValue(date),
      };
    });
  }, [visibleMonth]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        className="flex h-9 w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(255,250,244,0.78)_100%)] pl-3 pr-3 text-left text-[13px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] outline-none transition hover:border-[#c9a27e]/60 focus:border-primary/50 focus:ring-2 focus:ring-ring"
        id={id}
        onClick={() => {
          if (!isOpen && rootRef.current) {
            const rect = rootRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            setOpenUp(spaceBelow < 270 && spaceAbove > spaceBelow);
          }

          setIsOpen((current) => !current);
        }}
        type="button"
      >
        <span>{formatDateLabel(value)}</span>
        <CalendarDays className="size-3.5 shrink-0 text-[#34261d]" />
      </button>
      {isOpen ? (
        <div
          className={`absolute right-0 z-50 w-64 rounded-[var(--radius-sm)] border border-[#c9a27e]/55 bg-[#fffaf4] p-2.5 shadow-[0_14px_30px_rgba(114,76,43,0.16)] ${
            openUp ? "bottom-full mb-1" : "mt-1"
          }`}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-foreground">
              {MONTH_FORMATTER.format(visibleMonth)}
            </p>
            <div className="flex items-center gap-1">
              <button
                className="inline-flex size-6 items-center justify-center rounded-md text-[#8d542d] transition hover:bg-[#fff2de]"
                onClick={() =>
                  setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
                }
                type="button"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <button
                className="inline-flex size-6 items-center justify-center rounded-md text-[#8d542d] transition hover:bg-[#fff2de]"
                onClick={() =>
                  setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
                }
                type="button"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold text-muted-foreground">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const isSelected = day.value === value;
              const isDisabled = day.value < min || unavailableDateValues.has(day.value);

              return (
                <button
                  className={`h-7 rounded-md text-xs transition ${
                    isSelected
                      ? "bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] font-semibold text-white shadow-[0_6px_16px_rgba(184,111,41,0.22)]"
                      : day.inMonth
                        ? "text-foreground hover:bg-[#fff2de] hover:text-[#8d542d]"
                        : "text-muted-foreground/60 hover:bg-[#fff2de]"
                  } disabled:pointer-events-none disabled:opacity-30`}
                  disabled={isDisabled}
                  key={day.value}
                  onClick={() => {
                    onChange(day.value);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BookingTimePicker({
  id,
  max,
  min,
  onChange,
  value,
}: Readonly<{
  id: string;
  max: string;
  min: string;
  onChange: (value: string) => void;
  value: string;
}>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const options = useMemo(() => createTimeOptions(min, max), [max, min]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        className="flex h-9 w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(255,250,244,0.78)_100%)] pl-3 pr-3 text-left text-[13px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] outline-none transition hover:border-[#c9a27e]/60 focus:border-primary/50 focus:ring-2 focus:ring-ring"
        id={id}
        onClick={() => {
          if (!isOpen && rootRef.current) {
            const rect = rootRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            setOpenUp(spaceBelow < 190 && spaceAbove > spaceBelow);
          }

          setIsOpen((current) => !current);
        }}
        type="button"
      >
        <span>{formatTimeLabel(value)}</span>
        <Clock3 className="size-3.5 shrink-0 text-[#34261d]" />
      </button>
      {isOpen ? (
        <div
          className={`booking-layout-preview-scroll absolute z-50 max-h-44 w-full overflow-y-auto rounded-[var(--radius-sm)] border border-[#c9a27e]/55 bg-[#fffaf4] p-1 shadow-[0_14px_30px_rgba(114,76,43,0.16)] ${
            openUp ? "bottom-full mb-1" : "mt-1"
          }`}
        >
          {options.map((option) => {
            const isSelected = option === value;

            return (
              <button
                className={`block w-full rounded-md px-3 py-1.5 text-left text-[13px] leading-5 transition ${
                  isSelected
                    ? "bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] font-semibold text-white shadow-[0_6px_16px_rgba(184,111,41,0.2)]"
                    : "text-[#34261d] hover:bg-[linear-gradient(135deg,rgba(255,242,222,0.95)_0%,rgba(246,226,207,0.9)_100%)] hover:text-[#8d542d]"
                }`}
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                type="button"
              >
                {formatTimeLabel(option)}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function BookingEventDetailsStep({
  formData,
  selectedDateUnavailable,
  selectedTimeRange,
  timeRangeIsValid,
  today,
  unavailableDateValues,
  updateField,
  venueOptions,
}: BookingEventDetailsStepProps) {
  return (
    <section className="space-y-3">
      <div className="grid gap-2.5 md:grid-cols-2">
        <div className="grid gap-2.5">
          <div className="grid gap-1.5">
            <Label className="text-[13px]" htmlFor="venue-slug">Event hall</Label>
            <Select
              className="h-9 rounded-[var(--radius-sm)] text-sm"
              id="venue-slug"
              value={formData.venueSlug}
              onChange={(event) => updateField("venueSlug", event.target.value)}
            >
              {venueOptions.map((venue) => (
                <option key={venue.slug} value={venue.slug}>
                  {venue.label} - {venue.state}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[13px]" htmlFor="event-type">Event type</Label>
            <Select
              className="h-9 rounded-[var(--radius-sm)] text-sm"
              id="event-type"
              value={formData.eventType}
              onChange={(event) => updateField("eventType", event.target.value)}
            >
              {EVENT_TYPES.map((eventType) => (
                <option key={eventType.id} value={eventType.id}>
                  {eventType.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-[13px]" htmlFor="guest-count">Guest count</Label>
            <Input
              className="h-9 rounded-[var(--radius-sm)] px-3 text-sm"
              id="guest-count"
              placeholder="80"
              value={formData.guestCount}
              onChange={(event) => updateField("guestCount", event.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2.5">
          <div className="grid gap-1.5">
            <Label className="text-[13px]" htmlFor="event-date">Event date</Label>
            <BookingDatePicker
              id="event-date"
              min={today}
              unavailableDateValues={unavailableDateValues}
              value={formData.eventDate}
              onChange={(value) => updateField("eventDate", value)}
            />
            {selectedDateUnavailable ? (
              <p className="text-[11px] font-semibold text-destructive">
                This hall already has a pending or approved booking on that date. Please choose another date.
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5 rounded-[var(--radius-sm)] border border-border/70 bg-white/45 p-3">
            <div className="flex items-center gap-2">
              <Label className="mb-0 text-[13px]">Time slot</Label>
              <ContextHelp
                label="Time slot help"
                tooltip="A suggested slot is already filled for you."
                title="Time slot"
                description="We start with a recommended time range so the booking flow stays fast. You can still adjust the start and end time whenever you want."
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {formData.eventDate
                ? `Selected slot: ${selectedTimeRange}`
                : "Pick a date to confirm availability for this time slot."}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <BookingTimePicker
                id="start-time"
                max={OPERATING_HOURS.end}
                min={OPERATING_HOURS.start}
                value={formData.startTime}
                onChange={(value) => updateField("startTime", value)}
              />
              <BookingTimePicker
                id="end-time"
                max={OPERATING_HOURS.end}
                min={OPERATING_HOURS.start}
                value={formData.endTime}
                onChange={(value) => updateField("endTime", value)}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Operating hours: {OPERATING_HOURS.label}
            </p>
          </div>
        </div>
      </div>
      {!timeRangeIsValid ? (
        <p className="text-xs text-destructive">
          End time needs to be later than start time before you continue.
        </p>
      ) : null}
    </section>
  );
}
