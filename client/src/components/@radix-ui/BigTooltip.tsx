import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface BigTooltipProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const BigTooltip = ({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: BigTooltipProps) => (
  <TooltipPrimitive.Provider delayDuration={100}>
    <TooltipPrimitive.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {children}
    </TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

export const BigTooltipTrigger = ({
  children,
}: {
  children: React.ReactNode;
}) => <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>;

export const BigTooltipContent = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <TooltipPrimitive.Content className="z-50 w-72 max-w-none overflow-hidden rounded-md bg-card px-3 py-1.5 text-base text-foreground shadow-lg ring-1 ring-input animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 sm:block">
    {children}
  </TooltipPrimitive.Content>
);
