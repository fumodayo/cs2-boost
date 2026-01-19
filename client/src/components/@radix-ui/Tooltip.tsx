import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useTranslation } from "react-i18next";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipProps) => {
  const { t } = useTranslation();
  const tooltipContent = t(`Globals.${content}`, { defaultValue: content });

  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          className="inline-flex min-w-[30px] scale-95 items-center justify-center rounded-md border border-border bg-popover p-1.5 text-base capitalize text-popover-foreground shadow-sm backdrop-blur transition-all duration-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          side="bottom"
          align="center"
          sideOffset={5}
          {...props}
        >
          {tooltipContent}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

export default Tooltip;