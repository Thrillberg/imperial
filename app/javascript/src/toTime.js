import { DateTime, Interval } from "luxon";

export default function(date) {
  const rawDate = DateTime.fromISO(date);
  const now = DateTime.now();
  const interval = Interval.fromDateTimes(rawDate, now)
  const intervalInSeconds = interval.length("seconds");

  if (!date) {
    return ""
  }

  if (intervalInSeconds < 60) {
    const number = Math.floor(interval.length("seconds"));
    const second = number === 1 ? " second" : " seconds";
    return number + second + " ago";
  } else if (intervalInSeconds < 3600) {
    const number = Math.floor(interval.length("minutes"));
    const minute = number === 1 ? " minute" : " minutes";
    return number + minute + " ago";
  } else if (intervalInSeconds < 86400) {
    const number = Math.floor(interval.length("hours"));
    const hour = number === 1 ? " hour" : " hours";
    return number + hour + " ago";
  } else {
    const number = Math.floor(interval.length("days"));
    const day = number === 1 ? " day" : " days";
    return number + day + " ago";
  }
}
