import React from "react";

interface ButtonProps {
    children: React.ReactNode
}

const Button:React.FC<ButtonProps> = ({children}) => {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center transition-colors focus:outline focus:outline-offset-2 focus-visible:outline outline-none disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden font-medium active:translate-y-px whitespace-nowrap bg-primary hover:bg-primary-hover text-primary-foreground shadow-sm focus:outline-primary py-2 px-4 text-sm rounded-md capitalize"
    >
      {children}
    </button>
  );
};

export default Button;
