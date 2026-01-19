import * as React from "react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { FiCalendar } from "react-icons/fi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/@radix-ui/Popover";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
}

const dayPickerStyles = `
  .date-picker-custom .rdp-chevron {
    fill: hsl(var(--primary)) !important;
  }
  .date-picker-custom .rdp-button_previous:hover,
  .date-picker-custom .rdp-button_next:hover {
    background-color: hsl(var(--primary) / 0.1);
  }
  .date-picker-custom .rdp-selected .rdp-day_button {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-radius: 9999px;
    font-weight: 600;
  }
  .date-picker-custom .rdp-today:not(.rdp-selected) .rdp-day_button {
    border: 2px solid hsl(var(--primary));
    border-radius: 9999px;
  }
`;

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
}) => {
  const { t, i18n } = useTranslation("common");
  const locale = i18n.language === "vi" ? vi : enUS;
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(
    undefined,
  );

  const date = value ?? internalDate;
  const setDate = onChange ?? setInternalDate;

  const handleFromSelect = (selectedDate: Date | undefined) => {
    setDate({
      from: selectedDate,
      to: date?.to,
    });
  };

  const handleToSelect = (selectedDate: Date | undefined) => {
    setDate({
      from: date?.from,
      to: selectedDate,
    });
  };

  const today = new Date();

  return (
    <div className="flex items-center gap-2">
      <style>{dayPickerStyles}</style>

      {/* From Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-8 gap-1.5 rounded-md border-input px-3 text-xs font-medium"
          >
            <FiCalendar className="size-3.5 opacity-70" />
            <div className="mx-1 h-4 w-px bg-border" />
            {date?.from ? (
              <span>{format(date.from, "dd/MM/yyyy")}</span>
            ) : (
              <span className="text-muted-foreground">
                {t("date_picker.from_date")}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
          <div className="date-picker-custom p-4">
            <DayPicker
              mode="single"
              locale={locale}
              selected={date?.from}
              onSelect={handleFromSelect}
              disabled={{
                after: date?.to ? date.to : today,
              }}
              defaultMonth={date?.from}
            />
          </div>
        </PopoverContent>
      </Popover>

      <span className="text-xs text-muted-foreground">-</span>

      {/* To Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-8 gap-1.5 rounded-md border-input px-3 text-xs font-medium"
          >
            <FiCalendar className="size-3.5 opacity-70" />
            <div className="mx-1 h-4 w-px bg-border" />
            {date?.to ? (
              <span>{format(date.to, "dd/MM/yyyy")}</span>
            ) : (
              <span className="text-muted-foreground">
                {t("date_picker.to_date")}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-auto p-0">
          <div className="date-picker-custom p-4">
            <DayPicker
              mode="single"
              locale={locale}
              selected={date?.to}
              onSelect={handleToSelect}
              disabled={{
                before: date?.from,
                after: today,
              }}
              defaultMonth={date?.to || date?.from}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;