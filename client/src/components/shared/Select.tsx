import React from "react";

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (
  props,
) => {
  return (
    <select
      className="flex w-full rounded-md border border-input bg-card-alt px-3 py-1.5 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {props.children}
    </select>
  );
};

export default Select;
