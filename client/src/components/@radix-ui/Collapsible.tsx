import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import cn from "~/libs/utils";

interface ICollapsibleProps {
  title: string;
  subtitle: string;
}

const Collapsible = ({ title, subtitle }: ICollapsibleProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CollapsiblePrimitive.Root
      className={cn(
        "z-20 mt-5 flex w-full flex-col rounded-2xl border border-border bg-card bg-opacity-80 shadow-lg backdrop-blur-md transition-colors",
        "dark:bg-[#141825]/95",
      )}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <CollapsiblePrimitive.Trigger className="flex w-full flex-1 p-6">
        <p className="text-left font-semibold text-foreground">
          {t(`AskList.card.title.${title}`)}
        </p>
        {isOpen ? (
          <IoChevronDownOutline
            className={cn(
              "ml-auto text-muted-foreground transition-transform",
              "dark:text-[#757A95]",
            )}
          />
        ) : (
          <IoChevronUpOutline
            className={cn(
              "ml-auto text-muted-foreground transition-transform",
              "dark:text-[#757A95]",
            )}
          />
        )}
      </CollapsiblePrimitive.Trigger>
      <CollapsiblePrimitive.Content
        className={cn(
          "mr-auto flex cursor-auto flex-col px-6 text-left text-sm font-medium text-muted-foreground",
          "dark:text-[#B4B9D8]",
        )}
      >
        <div className="pb-6">
          <p>{t(`AskList.card.subtitle.${subtitle}`)}</p>
        </div>
      </CollapsiblePrimitive.Content>
    </CollapsiblePrimitive.Root>
  );
};

export default Collapsible;
