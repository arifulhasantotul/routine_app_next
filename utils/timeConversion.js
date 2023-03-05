export const militaryTimeToStandard = (time) => {
  if (!time) return;
  const [hours, minutes] = time.split(":");
  const hour = +hours; // convert to number
  if (hour > 12) {
    return `${hour - 12}:${minutes} PM`;
  } else if (hour === 12) {
    return `${hour}:${minutes} PM`;
  } else if (+hour === 0) {
    return `12:${minutes} AM`;
  } else {
    return `${hour}:${minutes} AM`;
  }
};
