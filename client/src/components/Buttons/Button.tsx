import clsx from "clsx";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  type?: "submit" | "button";
  color?: "primary" | "secondary" | "light" | "transparent" | "none";
};

export const Button = ({
  color = "primary",
  type = "button",
  children,
  className,
  ...props
}: ButtonProps) => {
  const colorVariants = {
    none: null,
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
        "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap outline-none transition-colors focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const CloseButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <Button
      color="none"
      className={clsx(
        "h-10 w-10 rounded-md bg-transparent px-2 py-2 text-sm font-medium text-secondary-light-foreground hover:bg-secondary-light sm:h-9 sm:w-9",
        className,
      )}
      {...props}
    >
      <span className="sr-only">Close</span>
      {children}
    </Button>
  );
};

export const CancelButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      color="none"
      className={clsx(
        "rounded-md bg-secondary px-2 py-1 text-sm font-medium text-danger shadow-sm ring-1 ring-danger-ring hover:bg-danger-hover hover:text-primary-foreground sm:py-2",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export const CompleteButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      color="none"
      className={clsx(
        "rounded-md bg-success px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-success-hover",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export const DangerButton = ({
  children,
  className,
  ...props
}: ButtonProps) => {
  return (
    <Button
      color="none"
      className={clsx(
        "rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-foreground shadow-sm hover:bg-danger-hover",
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
};
