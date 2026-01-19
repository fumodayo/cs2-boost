import React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import cn from "~/libs/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;

export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DropdownMenuPrimitive.Content> & {
    className?: string;
  }
>(({ children, className, onCloseAutoFocus, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        side="bottom"
        align="end"
        sideOffset={10}
        className={cn(
          "z-50 min-w-[8rem] overflow-visible rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-border/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
        onCloseAutoFocus={onCloseAutoFocus}
        ref={forwardedRef}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
});

export const DropdownMenuItem = DropdownMenuPrimitive.Item;

export const DropdownMenuSub = DropdownMenuPrimitive.Sub;

export const DropdownMenuSubTrigger = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[state=open]:bg-accent data-[disabled]:opacity-50"
      {...props}
      ref={forwardedRef}
    >
      {children}
    </DropdownMenuPrimitive.SubTrigger>
  );
});

export const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>
>(({ children, ...props }, forwardedRef) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        className="z-50 w-48 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        {...props}
        ref={forwardedRef}
      >
        {children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  );
});

export const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;