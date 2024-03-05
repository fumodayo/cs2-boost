import { Disclosure } from "@headlessui/react";
import { IoChevronDownOutline } from "react-icons/io5";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface DiscoveryProps {
  title?: string;
  subtitle?: string;
}

const Discovery: React.FC<DiscoveryProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();

  return (
    <Disclosure>
      {({ open }) => (
        <div
          className={clsx(
            "z-20 mt-5 flex w-full flex-col rounded-2xl border border-border bg-card bg-opacity-80 shadow-lg backdrop-blur-md transition-colors",
            "dark:bg-[#141825]/95",
          )}
          style={{
            boxShadow: "0px 0px 2px 0px rgba(255, 255, 255, 0.06) inset",
          }}
        >
          <Disclosure.Button className="p-6">
            <div className="flex w-full">
              <p className="text-left font-semibold text-foreground">
                {title && t(title)}?
              </p>
              <IoChevronDownOutline
                className={clsx(
                  "ml-auto text-muted-foreground transition-transform",
                  "dark:text-[#757A95]",
                  open ? "rotate-180 transform" : "",
                )}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel
            className={clsx(
              "disclosure-panel mr-auto flex cursor-auto flex-col px-6 pb-6 text-left text-sm font-medium text-muted-foreground",
              "dark:text-[#B4B9D8]",
            )}
          >
            {subtitle && t(subtitle)}.
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

export default Discovery;
