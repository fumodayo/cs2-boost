import React from "react";
import { LuChevronDown } from "react-icons/lu";

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props,
) => {
  return (
    <div className="relative w-full">
      <select
        className="flex w-full appearance-none rounded-md border border-input bg-card-alt py-1.5 pl-3 pr-5 text-xs shadow-sm transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        {...props}
      >
        {props.children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-[8px] flex items-center">
        <LuChevronDown className="text-muted-foreground" size={14} />
      </div>
    </div>
  );
};

export default Select;