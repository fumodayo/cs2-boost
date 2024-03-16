import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

import { FaBars } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

import { AppContext } from "../../context/AppContext";
import MenuLanguage from "../Common/MenuLanguage";
import MenuTheme from "../Common/MenuTheme";
import MenuGame from "../Common/MenuGame";

interface NavbarProps {
  isNonSticky?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isNonSticky }) => {
  const { t } = useTranslation();

  const { onOpenLoginModal } = useContext(AppContext);

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
          sticky || isNonSticky
            ? clsx(
                "fixed top-0 z-30 w-full border-b border-border px-4",
                "before:absolute before:inset-0 before:bg-card-alt before:p-px before:transition-all before:duration-200",
                "sm:px-6 lg:px-8 lg:before:bg-card-surface/75 lg:before:backdrop-blur-xl",
                "dark:border-transparent dark:before:bg-[#151824] dark:lg:before:bg-[#151824]/50",
              )
            : clsx(
                "fixed top-0 z-30 w-full border-b border-transparent px-4",
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
            <MenuGame />
          </div>
          <div className="flex items-center">
            <div className={clsx("hidden items-center space-x-2", "lg:flex")}>
              {/** MENU THEME */}
              <MenuTheme />

              {/** MENU LANGUAGE */}
              <MenuLanguage />
            </div>
            <div className="relative ml-4 flow-root">
              {/** MODAL LOGIN/REGISTER */}
              <button
                type="button"
                onClick={handleOpenLoginModal}
                className={clsx(
                  "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
                  "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                {t("Log in")}
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
