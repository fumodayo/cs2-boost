import { HTMLAttributes } from "react";
import cn from "~/libs/utils";

interface IChipProps extends HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

const Chip = ({ children, className, ...props }: IChipProps) => (
  <span
    {...props}
    className={cn(
      "ml-1 inline-flex items-center rounded-md bg-primary-light px-2 py-1 text-xs font-semibold text-primary-light-foreground ring-1 ring-inset ring-primary-ring",
      className,
    )}
  >
    {children}
  </span>
);

export default Chip;
