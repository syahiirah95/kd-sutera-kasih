export function formatTimeLabel(value: string) {
  if (!value) {
    return "Choose time";
  }

  const [hoursText, minutes] = value.split(":");
  const hours = Number(hoursText);

  if (Number.isNaN(hours) || !minutes) {
    return value;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${suffix}`;
}

export function formatTimeRange(startTime: string, endTime: string) {
  if (!startTime || !endTime) {
    return "Choose your event time";
  }

  return `${formatTimeLabel(startTime)} - ${formatTimeLabel(endTime)}`;
}
