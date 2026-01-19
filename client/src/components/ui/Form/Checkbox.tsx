import React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { FaCheck } from "react-icons/fa6";
import cn from "~/libs/utils";

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  label,
  className,
  disabled = false,
  id,
}) => {
  return (
    <CheckboxPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={(isChecked) => onCheckedChange?.(isChecked as boolean)}
      disabled={disabled}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-start text-sm outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-primary",
          checked && "bg-primary",
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-primary-foreground">
          <FaCheck className="h-3 w-3" />
        </CheckboxPrimitive.Indicator>
      </span>
      {label && <span className="ml-2">{label}</span>}
    </CheckboxPrimitive.Root>
  );
};

export default Checkbox;