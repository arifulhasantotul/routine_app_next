import moment from "moment";

export const militaryTimeToStandardTime = (time) => {
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

export const next30Minutes = (time) => {
  let newTime = moment(time, "HH:mm").add(30, "minutes").format("HH:mm");
  return newTime;
};

export const differenceBetweenTwoTime = (startTime, endTime) => {
  let difference = moment
    .duration(moment(endTime, "HH:mm").diff(moment(startTime, "HH:mm")))
    .asMinutes();
  return difference;
};
