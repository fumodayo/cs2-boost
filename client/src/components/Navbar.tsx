import { IoIosSunny } from "react-icons/io";
import { FaBars } from "react-icons/fa";
import { FaMoon } from "react-icons/fa";
import { IoChevronDownOutline } from "react-icons/io5";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { AppContext } from "../context/AppContext";
import MenuLanguage from "./Common/MenuLanguage";
import MenuTheme from "./Common/MenuTheme";
import MenuGame from "./Common/MenuGame";

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const { theme, currency, onOpenLoginModal } = useContext(AppContext);

  /** Sticky navbar */
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  const handleOpenLoginModal = () => {
    onOpenLoginModal();
  };

  return (
    <header className="relative">
      <nav
        className={`${
          sticky
            ? clsx(
                "fixed top-0 z-40 w-full border-b border-border px-4",
                "before:absolute before:inset-0 before:bg-card-alt before:p-px before:transition-all before:duration-200",
                "sm:px-6 lg:px-8 lg:before:bg-card-surface/75 lg:before:backdrop-blur-xl",
                "dark:border-transparent dark:before:bg-[#151824] dark:lg:before:bg-[#151824]/50",
              )
            : clsx(
                "fixed top-0 z-40 w-full border-b border-transparent px-4",
                "sm:px-6 lg:px-8",
                "dark:border-transparent",
              )
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1550px] items-center justify-between">
          {/* Only show in phone */}
          <div className={clsx("flex flex-1 justify-end", "sm:hidden")}>
            <FaBars className="text-2xl" />
          </div>

          <div className={clsx("relative ml-4", "lg:ml-0")}>
            <a className="relative" href="/">
              <img
                className={clsx("block h-8 w-[100px]", "dark:hidden")}
                src="/src/assets/brand/icon-text-dark.png"
                alt="CS2 Boost Logo"
              />
              <img
                className={clsx("hidden h-8 w-[100px]", "dark:block")}
                src="/src/assets/brand/icon-text.png"
                alt="CS2 Boost Logo"
              />
            </a>
          </div>

          <div
            className={clsx(
              "ml-6 mr-auto hidden items-center gap-x-4",
              "lg:flex",
            )}
          >
            {/** SELECT GAME */}
            <PopoverPrimitive.Root>
              <PopoverPrimitive.Trigger>
                <button
                  type="button"
                  className={clsx(
                    "relative flex h-11 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-muted-foreground bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-light-foreground outline-none transition-colors",
                    "hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <img
                    src="/src/assets/illustrations/target.svg"
                    className="h-5 w-5 fill-muted-foreground"
                    alt="target"
                  />
                  <div className="mx-1 capitalize">{t("Select Game")}</div>
                  <IoChevronDownOutline />
                </button>
              </PopoverPrimitive.Trigger>
              <PopoverPrimitive.Content
                side="bottom"
                align="start"
                className="backdrop-brightness-5 z-50 w-64 min-w-[8rem] overflow-hidden rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border backdrop-blur-lg"
              >
                <MenuGame />
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Root>
          </div>
          <div className="flex items-center">
            <div className={clsx("hidden items-center space-x-2", "lg:flex")}>
              {/** MENU LANGUAGE */}
              <PopoverPrimitive.Root>
                <PopoverPrimitive.Trigger>
                  <button
                    type="button"
                    className={clsx(
                      "relative flex h-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                    )}
                  >
                    <span
                      className={`fi fis fi-${
                        i18n.language === "en" ? "gb" : "vn"
                      } -ml-2 mr-2 h-6 w-6 rounded-full`}
                    />
                    {i18n.language === "en" ? t("English") : t("Vietnamese")}
                    <span className="mx-2">/</span>
                    {currency === "vnd" ? t("VND") : t("US Dollar")}
                  </button>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Content
                  side="bottom"
                  align="start"
                  className="backdrop-brightness-5 absolute z-50 min-w-[400px] translate-y-3 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-white/10 backdrop-blur-lg"
                >
                  <MenuLanguage />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Root>

              {/** MENU THEME */}
              <PopoverPrimitive.Root>
                <PopoverPrimitive.Trigger>
                  <button
                    type="button"
                    className={clsx(
                      "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent font-medium text-secondary-light-foreground outline-none transition-colors",
                      "sm:h-9 sm:w-9",
                      "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary-light focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                    )}
                  >
                    {theme === "dark" ? (
                      <FaMoon />
                    ) : (
                      <IoIosSunny className="text-2xl" />
                    )}
                  </button>
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Content
                  side="bottom"
                  align="start"
                  className="backdrop-brightness-5 absolute z-50 min-w-[180px] translate-y-3 overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-white/10 backdrop-blur-lg"
                >
                  <MenuTheme />
                </PopoverPrimitive.Content>
              </PopoverPrimitive.Root>
            </div>
            <div className="relative ml-4 flow-root lg:ml-6">
              {/** MODAL LOGIN/REGISTER */}
              <button
                onClick={handleOpenLoginModal}
                type="button"
                className={clsx(
                  "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
                  "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                {t("Log in")}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
