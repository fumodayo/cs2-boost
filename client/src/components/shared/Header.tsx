import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { FaArrowRight, FaBagShopping } from "react-icons/fa6";
import cn from "~/libs/utils";
import { IconSuccessLight } from "~/icons";
import Logo from "./Logo";
import { Button } from "./Button";
import MenuGames from "./MenuGames";
import MenuTheme from "./MenuTheme";
import MenuLanguage from "./MenuLanguage";
import { Link, useLocation } from "react-router-dom";
import Avatar from "./Avatar";
import { useTranslation } from "react-i18next";
import { RootState } from "~/redux/store";
import { useSelector } from "react-redux";
import { useSocketContext } from "~/hooks/useSocketContext";
import { ROLE } from "~/types/constants";
import { MenuNotifications } from "./Notification";

const Header = () => {
  const { t } = useTranslation();
  const { toggleLoginModal } = useContext(AppContext);
  const [isScroll, setIsScroll] = useState(false);
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { onlinePartners } = useSocketContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  return (
    <header className="relative">
      <nav
        className={cn(
          isScroll || pathname !== "/"
            ? cn(
                "fixed top-0 z-30 w-full border-b border-border px-4",
                "before:absolute before:inset-0 before:bg-card-alt before:p-px before:transition-all before:duration-200",
                "sm:px-6 lg:px-8 lg:before:bg-card-surface/75 lg:before:backdrop-blur-xl",
                "dark:border-transparent dark:before:bg-[#151824] dark:lg:before:bg-[#151824]/50",
              )
            : cn(
                "fixed top-0 z-30 w-full border-b border-transparent px-4",
                "sm:px-6 lg:px-8",
                "dark:border-transparent",
              ),
        )}
      >
        <div className="mx-auto flex h-16 max-w-[1550px] items-center justify-between">
          {/* Mobile nav */}

          <div className="relative ml-4 lg:ml-0">
            <Logo />
          </div>

          <div
            className={cn(
              "ml-6 mr-auto hidden items-center gap-x-3",
              "lg:flex",
            )}
          >
            <MenuGames />
            <Link to="/partners">
              <div className="success-light-gradient h-11 rounded-full px-4 text-sm">
                <div className="relative flex h-full items-center text-secondary-foreground">
                  <IconSuccessLight />
                  <span className="mr-1 font-semibold text-success-light-foreground/90">
                    {onlinePartners.length}
                  </span>
                  {t("Header.Active Partners")}
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center">
            <div className={cn("hidden items-center gap-x-3", "lg:flex")}>
              <MenuLanguage />

              {currentUser?.role.includes(ROLE.CLIENT) ? (
                <>
                  <Link to="/orders">
                    <Button
                      variant="light"
                      className="h-11 rounded-full px-4 py-2 text-sm"
                    >
                      <FaBagShopping
                        size={18}
                        className="mr-2 text-foreground/70"
                      />
                      {t("Header.My Orders")}
                    </Button>
                  </Link>
                  <MenuNotifications />
                </>
              ) : (
                <MenuTheme />
              )}
            </div>
            <div className="relative ml-3 flow-root">
              {currentUser?.role.includes(ROLE.CLIENT) ? (
                <Avatar />
              ) : (
                <Button
                  variant="primary"
                  className="rounded-full px-4 py-2 text-sm font-medium shadow-sm"
                  onClick={() => toggleLoginModal()}
                >
                  {t("Header.Log in")}
                  <FaArrowRight className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
