import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "~/libs/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap outline-none transition-colors focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        none: null,
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover focus:outline-primary font-[600]",
        secondary:
          "bg-secondary text-secondary-foreground ring-1 ring-secondary-ring hover:bg-secondary-hover focus:outline-secondary",
        light:
          "bg-secondary-light text-secondary-light-foreground hover:bg-secondary-light-hover focus:outline-secondary",
        transparent:
          "bg-transparent text-secondary-light-foreground hover:bg-secondary-light focus:outline-secondary",
      },
      size: {},
      defaultVariants: {
        variant: "primary",
        size: "",
      },
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
