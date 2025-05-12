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
          className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close inline-flex min-w-[30px] scale-95 items-center justify-center rounded-md border border-border bg-popover p-1.5 text-base capitalize text-popover-foreground shadow-sm backdrop-blur"
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
