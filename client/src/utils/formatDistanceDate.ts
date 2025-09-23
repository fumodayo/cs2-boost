import { formatDistance } from "date-fns";
import { enUS, vi } from "date-fns/locale";

const formatDistanceDate = (date: string, language: string) => {
  return formatDistance(new Date(date), Date.now(), {
    locale: language === "vi" ? vi : enUS,
  });
};

export default formatDistanceDate;
