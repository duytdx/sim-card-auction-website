export function durationToSeconds(duration) {
  const daysInSeconds = (duration.days || 0) * 86400;
  const hoursInSeconds = (duration.hours || 0) * 3600;
  const minutesInSeconds = (duration.minutes || 0) * 60;
  return daysInSeconds + hoursInSeconds + minutesInSeconds;
}

export function formatDate(date) {
  return new Date(date).toLocaleString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

export function getTime(date) {
  return new Date(date).toLocaleString("en-us", {
    hour: "numeric",
    minute: "numeric",
  });
}

export function getDateDifference(utcDate) {
  const currentDate = new Date(); // Current date in local time
  const givenDate = new Date(utcDate); // Convert UTC date string to Date object

  // Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate - givenDate;

  // Convert the difference to various time units
  const seconds = Math.floor(differenceInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return the appropriate value
  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return `${seconds}s`;
  }
}
