import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { gameMode, IGameModeProps } from "~/constants/mode";
import cn from "~/libs/utils";
import { v4 as uuidv4 } from "uuid";

const Tab = ({ icon: Icon, label, path }: IGameModeProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <Link
      to={path}
      className={cn(
        pathname === path
          ? "flex items-center gap-x-3 rounded-md bg-accent p-2 pl-3 text-sm font-medium leading-6 text-foreground backdrop-blur-sm dark:bg-white/10"
          : "flex items-center gap-x-3 rounded-md p-2 pl-3 text-sm font-medium leading-6 text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <Icon size={20} />
      <span className="whitespace-nowrap">
        {t(`Globals.GameMode.${label}`)}
      </span>
    </Link>
  );
};

const SubSidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="relative hidden max-w-[244px] lg:row-span-2 lg:block">
      <div className="sticky top-20">
        {/* CONTENT */}
        <div className="mb-4 w-56 rounded-lg bg-card-surface px-4 py-6 shadow-md transition-all duration-200">
          {/* BANNER */}
          <div className="absolute inset-0 h-36 overflow-hidden rounded-t-lg">
            <img
              className="h-full w-full object-cover"
              src="/assets/games/counter-strike-2/banner.png"
              alt="banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card-surface backdrop-blur-[2px] dark:to-card-surface/25" />
          </div>
          <div className="pointer-events-none relative flex items-center">
            <img
              className="h-[66px] w-44"
              src="/assets/games/counter-strike-2/text.png"
              alt="game-title"
            />
            <span className="sr-only">Counter Strike 2</span>
          </div>
          <nav className="relative mt-6 flex flex-col">
            <ul className="my-5 flex flex-1 flex-col gap-y-1 border-border">
              {gameMode.map((props) => (
                <li key={uuidv4()}>
                  <Tab {...props} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* RATING */}
        <div className="flex w-full max-w-xl select-none flex-col rounded-lg bg-card-surface">
          <div
            className="flex flex-col gap-2 rounded-lg px-6 py-3"
            style={{
              background:
                "radial-gradient(44.73% 58.02% at 50% 100%, rgba(0, 182, 122, 0.3) 0%, rgba(0, 182, 122, 0) 100%)",
            }}
          >
            <div className="flex flex-col items-center">
              <div className="secondary text-sm font-semibold text-foreground">
                {t("Globals.TrustpilotBadge.Excellent")}
                <span className="mx-1 text-[#00B67A]">4.6</span>
                {t("Globals.TrustpilotBadge.out of")} 5.0
              </div>
              <p className="secondary mt-1 text-xs text-muted-foreground">
                {t("Globals.TrustpilotBadge.Based on 9,510 reviews")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubSidebar;
