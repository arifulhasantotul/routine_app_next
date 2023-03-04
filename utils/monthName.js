export const shortMonthName = (date) => {
  const shortName = new Date(date).toLocaleString("default", {
    month: "short",
  });
  return shortName;
};

export const fullMonthName = (date) => {
  const longName = new Date(date).toLocaleString("default", { month: "long" });
  return longName;
};

export const monthDayYear = (date) => {
  if (!date) return;
  const monthDayYear = new Date(date).toLocaleString("default", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return monthDayYear;
};
