import * as TabsPrimitive from "@radix-ui/react-tabs";
import cn from "~/libs/utils";

interface ITabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  tabs: { label: string; value: string }[];
  contents: React.ReactNode[];
}

const Tabs = ({ value, onValueChange, tabs, contents }: ITabsProps) => {
  return (
    <TabsPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className="w-full"
    >
      <TabsPrimitive.List className="mb-6 flex flex-wrap gap-3 border-b border-muted">
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "cursor-pointer rounded-lg bg-accent px-6 py-2 text-sm font-medium text-foreground transition-colors",
              "data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground",
            )}
          >
            {tab.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab, i) => (
        <TabsPrimitive.Content
          key={tab.value}
          value={tab.value}
          className="space-y-6"
        >
          {contents[i]}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
};

export default Tabs;
