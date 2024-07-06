import clsx from "clsx";
import React from "react";
import { FaXmark } from "react-icons/fa6";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  type?: "submit" | "button";
  color?: "primary" | "secondary" | "light" | "transparent";
};

export const Button = ({
  color = "primary",
  type = "button",
  children,
  className,
  ...props
}: ButtonProps) => {
  const colorVariants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-primary",
    secondary:
      "bg-secondary text-secondary-foreground ring-1 ring-secondary-ring hover:bg-secondary-hover focus:outline-secondary",
    light:
      "border border-muted-foreground/20 bg-secondary-light text-secondary-light-foreground hover:bg-secondary-light-hover focus:outline-secondary",
    transparent:
      "bg-transparent text-secondary-light-foreground hover:bg-secondary-light focus:outline-secondary",
  };

  return (
    <button
      type={type}
      className={clsx(
        colorVariants[color],
        "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap outline-none transition-colors focus:outline focus:outline-offset-2 focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const CloseButton = (props: ButtonProps) => {
  return (
    <button
      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-2 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
      {...props}
    >
      <span className="sr-only">Close</span>
      <FaXmark className="flex items-center justify-center text-2xl" />
    </button>
  );
};
