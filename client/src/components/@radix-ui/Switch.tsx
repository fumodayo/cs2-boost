import * as SwitchPrimitive from "@radix-ui/react-switch";

const Switch = (props: SwitchPrimitive.SwitchProps) => (
  <SwitchPrimitive.Root
    className="relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center rounded-full border border-border bg-accent transition-colors duration-200 ease-in-out hover:brightness-95 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary"
    {...props}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none inline-block h-3 w-3 translate-x-1 transform rounded-full bg-muted-foreground shadow ring-0 transition duration-200 ease-in-out data-[state=checked]:h-3.5 data-[state=checked]:w-3.5 data-[state=checked]:translate-x-[1.4rem] data-[state=checked]:bg-white" />
  </SwitchPrimitive.Root>
);

export default Switch;
