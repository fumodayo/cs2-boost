import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import cn from "~/libs/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof PopoverPrimitive.Content> & { className?: string }
>(({ children, className, ...props }, forwardedRef) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-border/10",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));

