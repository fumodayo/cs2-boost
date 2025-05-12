const formatDate = (dateInput?: Date | string) => {
  const date = new Date(dateInput as string);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB").format(date);
};

export default formatDate;
