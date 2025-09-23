const formatDateTime = (dateInput?: Date | string) => {
  const date = new Date(dateInput as string);
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  }).format(date);
};

export default formatDateTime;
