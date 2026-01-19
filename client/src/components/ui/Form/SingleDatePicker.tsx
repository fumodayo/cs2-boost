import * as React from "react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { FiCalendar } from "react-icons/fi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/@radix-ui/Popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";

interface SingleDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const dayPickerStyles = `
  .date-picker-single .rdp-chevron {
    fill: hsl(var(--primary)) !important;
  }
  .date-picker-single .rdp-button_previous:hover,
  .date-picker-single .rdp-button_next:hover {
    background-color: hsl(var(--primary) / 0.1);
  }
  .date-picker-single .rdp-selected .rdp-day_button {
    background-color: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-radius: 9999px;
    font-weight: 600;
  }
  .date-picker-single .rdp-today:not(.rdp-selected) .rdp-day_button {
    border: 2px solid hsl(var(--primary));
    border-radius: 9999px;
  }
`;

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  value,
  onChange,
  placeholder = "Chọn ngày",
  minDate,
  maxDate,
  disabled = false,
}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "vi" ? vi : enUS;
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    onChange?.(selectedDate);
    setIsOpen(false);
  };

  const disabledMatchers: Array<{ before: Date } | { after: Date }> = [];
  if (minDate) disabledMatchers.push({ before: minDate });
  if (maxDate) disabledMatchers.push({ after: maxDate });

  return (
    <>
      <style>{dayPickerStyles}</style>
      <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className="h-10 w-full justify-start gap-2 rounded-lg border-border px-3 text-sm font-normal"
          >
            <FiCalendar className="size-4 text-muted-foreground" />
            {value ? (
              <span>{format(value, "dd/MM/yyyy")}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={8}
          className="z-50 w-auto p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div
            className="date-picker-single p-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <DayPicker
              mode="single"
              locale={locale}
              selected={value}
              onSelect={handleSelect}
              disabled={
                disabledMatchers.length > 0 ? disabledMatchers : undefined
              }
              defaultMonth={value}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SingleDatePicker;