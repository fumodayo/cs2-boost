import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cn from "~/libs/utils";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  noteText?: string;
  errorMessage?: string;
}

const Input = ({
  label,
  noteText,
  errorMessage,
  placeholder = "Write something...",
  className,
  onChange,
  ...props
}: IInputProps) => {
  const { t } = useTranslation();
  const [hideError, setHideError] = useState(true);

  useEffect(() => {
    if (errorMessage) {
      setHideError(false);
    }
  }, [errorMessage]);

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between">
          <label className="block text-sm font-medium leading-6 text-foreground/90">
            {t(`Input.label.${label}`, { defaultValue: label })}
          </label>
        </div>
      )}
      <div className="relative">
        <input
          className={cn(
            "flex w-full rounded-md border border-input bg-card-alt px-3 py-1.5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          placeholder={placeholder}
          onChange={(e) => {
            setHideError(true);
            onChange?.(e);
          }}
          {...props}
        />
      </div>
      {errorMessage && !hideError && (
        <p className="mt-2 text-sm text-red-500">
          {t(`Input.Errors.label.${errorMessage}`, {
            defaultValue: errorMessage,
          })}
        </p>
      )}
      {noteText && (
        <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-xs">
          {t(`Input.noteText.label.${noteText}`, {
            defaultValue: noteText,
          })}
        </p>
      )}
    </div>
  );
};

export default Input;
