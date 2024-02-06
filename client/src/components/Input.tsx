import clsx from "clsx";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  rules?: RegisterOptions;
  errors: FieldErrors;
}

const Input: React.FC<InputProps> = ({
  id,
  type = "text",
  placeholder,
  disabled,
  required,
  register,
  rules,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((show) => !show);

  const error = errors[id];

  return (
    <div className="relative w-full">
      <input
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        {...register(id, { required, ...rules })}
        className={clsx(
          "block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1   placeholder:text-muted-foreground disabled:pointer-events-none disabled:opacity-50",
          "sm:text-sm",
          errors[id] ? "ring-red-500" : "ring-field-ring",
          errors[id] ? "focus:ring-red-500" : "focus:ring-field-ring-hover",
          errors[id] ? "hover:ring-red-500" : "hover:ring-field-ring-hover",
        )}
        autoFocus
      />
      {type === "password" && (
        <span className="text-md absolute right-4 top-0 z-10 origin-[0]  translate-y-3 transform cursor-pointer text-neutral-600 duration-150 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75">
          {showPassword ? (
            <FaEye onClick={togglePassword} size={18} />
          ) : (
            <FaEyeSlash onClick={togglePassword} size={18} />
          )}
        </span>
      )}

      {/* ERRORS PATTERN */}
      {error?.type === "required" && (
        <p className="mt-1 text-sm text-red-400">
          {placeholder} không được để trống
        </p>
      )}
      {id === "password" && error?.type === "minLength" && (
        <p className="mt-1 text-sm text-red-400">
          {placeholder} chứa ít nhất 8 ký tự
        </p>
      )}
      {id === "password" && error?.type === "maxLength" && (
        <p className="mt-1 text-sm text-red-400">
          {placeholder} không được dài hơn 24 ký tự
        </p>
      )}
      {id !== "password" && error?.type === "pattern" && (
        <p className="mt-1 text-sm text-danger-light-foreground">
          {placeholder} sai định dạng
        </p>
      )}
      {id === "password" && error?.type === "pattern" && (
        <p className="mt-1 text-sm text-red-400">
          <span className="mr-1 font-medium">Mật khẩu phải có:</span>
          Ít nhất ký tự chữ hoa, chữ thường, số và kí hiệu đặt biệt
        </p>
      )}
    </div>
  );
};

export default Input;
