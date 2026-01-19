import { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import cn from "~/libs/utils";

interface IFormFieldProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: Path<T>;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  register: UseFormRegister<T>;
  required?: boolean;
  noteText?: string;
  rules?: RegisterOptions<T>;
  errors: FieldErrors<T>;
}

const FormField = <T extends FieldValues>({
  id,
  label,
  placeholder,
  errorMessage,
  className,
  register,
  errors,
  required,
  rules,
  type,
  maxLength,
  minLength,
  noteText,
  onChange: onChangeFromProps,
  ...props
}: IFormFieldProps<T>) => {
  const { t } = useTranslation();
  const error = errors[id];
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((show) => !show);

  const { onChange: rhfOnChange, ...restOfRegister } = register(id, {
    required,
    ...rules,
    maxLength,
    minLength,
  });

  const getErrorDisplay = () => {
    if (errorMessage && !error) {
      return errorMessage;
    }
    if (error?.message) {
      return String(error.message);
    }
    if (error?.type === "required") {
      return t("validation:required");
    }
    if (error?.type === "maxLength") {
      return t("validation:max_length", { count: maxLength });
    }
    if (error?.type === "minLength") {
      return t("validation:min_length", { count: minLength });
    }
    return null;
  };

  const errorDisplay = getErrorDisplay();

  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex justify-between">
          <label className="block text-sm font-medium leading-6 text-foreground/90">
            {label}
          </label>
        </div>
      )}
      <div className="relative">
        <input
          {...restOfRegister}
          className={cn(
            "flex w-full rounded-md border border-input bg-card-alt px-3 py-1.5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          placeholder={placeholder}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          onChange={(e) => {
            rhfOnChange(e);
            onChangeFromProps?.(e);
          }}
          {...props}
        />
        {noteText && (
          <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-xs">
            {noteText}
          </p>
        )}
        {type === "password" && (
          <span
            onClick={toggleShowPassword}
            className="absolute right-4 top-0 z-10 origin-[0] translate-y-3 transform cursor-pointer text-neutral-600 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
          >
            {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
          </span>
        )}

        {errorDisplay && (
          <p className="mt-2 text-sm text-red-500">{errorDisplay}</p>
        )}
      </div>
    </div>
  );
};

export default FormField;