import { formatDistance } from "date-fns";
import { enUS, vi } from "date-fns/locale";

const formatDistanceDate = (date: Date, language: string) => {
  return formatDistance(date, Date.now(), {
    locale: language === "vi" ? vi : enUS,
  });
};

export default formatDistanceDate;
