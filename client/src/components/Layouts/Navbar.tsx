import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import * as Dialog from "@radix-ui/react-dialog";

import { FaBars } from "react-icons/fa";
import { FaArrowRight, FaXmark } from "react-icons/fa6";

import { AppContext } from "../../context/AppContext";
import { RootState } from "../../redux/store";
import MenuLanguage from "../Common/MenuLanguage";
import MenuTheme from "../Common/MenuTheme";
import MenuGame from "../Common/MenuGame";
import Avatar from "../Common/Avatar";
import Logo from "../Common/Logo";
import { listOfGame } from "../../constants";

interface NavbarProps {
  isNonSticky?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isNonSticky }) => {
  const { t } = useTranslation();
  const { currentUser } = useSelector((state: RootState) => state.user);

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
          <div className={clsx("flex items-center gap-2 lg:hidden")}>
            <Dialog.Root>
              <Dialog.Trigger>
                <button className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-1.5 text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                  <span className="sr-only">Open menu</span>
                  <FaBars className="text-lg" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm">
                  <Dialog.Content className="fixed left-0 top-0 z-30 mx-auto h-[100dvh] w-full overflow-auto rounded-none bg-card-alt text-left shadow-xl outline-none transition-all focus:outline-none sm:max-w-sm sm:rounded-l-xl md:left-3 md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-xl">
                    <div className="flex h-full flex-col">
                      <div className="flex items-center justify-between border-b border-border bg-card-surface px-4 py-4">
                        <Logo />
                        <Dialog.Close>
                          <button
                            type="button"
                            className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-4 py-2 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                          >
                            <span className="sr-only">Close</span>
                            <FaXmark />
                          </button>
                        </Dialog.Close>
                      </div>
                      <div className="border-t border-border px-4 pt-4">
                        <p className="font-medium text-foreground">
                          Select a game
                        </p>
                        <ul className="my-6 flex flex-col space-y-4 px-2">
                          {listOfGame.map(
                            ({ href, image, label, available }) =>
                              available ? (
                                <li className="flow-root" key={label}>
                                  <a
                                    className="-m-2 flex items-center justify-between gap-2 rounded-lg px-2.5 py-3.5 font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                    href={`/${href}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <img
                                        className="h-6 w-6"
                                        src={`/assets/${image}/logo.svg`}
                                        alt={label}
                                      />
                                      {label}
                                    </div>
                                  </a>
                                </li>
                              ) : (
                                <li className="flow-root opacity-50">
                                  <a
                                    className="pointer-events-none -m-2 flex items-center justify-between gap-2 rounded-lg px-2.5 py-3.5 font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                                    href={`/${href}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <img
                                        className="h-6 w-6"
                                        src={`/assets/${image}/logo.svg`}
                                        alt={label}
                                      />
                                      {label}
                                    </div>
                                  </a>
                                </li>
                              ),
                          )}
                        </ul>
                      </div>
                      <div className="space-y-6 border-t border-border px-6 py-6">
                        <div className="flex w-full items-center">
                          <MenuLanguage /> <MenuTheme />
                        </div>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Overlay>
              </Dialog.Portal>
            </Dialog.Root>
          </div>

          <div className={clsx("relative ml-4", "lg:ml-0")}>
            <Logo />
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
              {!currentUser && <MenuTheme />}

              {/** MENU LANGUAGE */}
              <MenuLanguage />
            </div>
            <div className="relative ml-4 flow-root">
              {/** MODAL LOGIN/REGISTER */}
              {currentUser ? (
                <Avatar>
                  <button className="h-10 rounded-full ring-1 ring-accent focus:outline-none focus:ring-2 focus:ring-primary">
                    <div className="relative block h-10 w-10 shrink-0 rounded-full text-base">
                      <img
                        src={currentUser?.profile_picture}
                        alt={currentUser.username}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <span className="sr-only">Open user menu for user</span>
                  </button>
                </Avatar>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
