import { useEffect, useMemo, useState } from "react";
import { FaDiscord } from "react-icons/fa6";
import { GiSamuraiHelmet } from "react-icons/gi";
import { PiTreasureChestFill } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import { listOfGames } from "~/constants/games";
import Tooltip from "../@radix-ui/Tooltip";
import { IoRocket } from "react-icons/io5";
import {
  IListOfPath,
  listOfPathClient,
  listOfPathPartner,
} from "~/constants/role";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { v4 as uuidv4 } from "uuid";

const listOfPathGame = (game: string) => {
  return [
    {
      path: `/${game}`,
      icon: IoRocket,
      label: "Boosting",
      isActive: false,
    },
    {
      path: `/${game}/accounts`,
      icon: GiSamuraiHelmet,
      label: "Accounts",
      isActive: false,
    },
    {
      path: `/${game}/items`,
      icon: PiTreasureChestFill,
      label: "Items",
      isActive: false,
    },
  ];
};

const SubHeader = () => {
  const { t } = useTranslation();
  const [isShowSubheader, setIsShowSubheader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const { pathname } = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, secondQuery] = pathname.split("/");

  const { currentUser } = useSelector((state: RootState) => state.user);
  const currentRole = currentUser?.role;

  const optionTabs = {
    "counter-strike-2": [
      {
        path: "/counter-strike-2",
        icon: IoRocket,
        label: "Boosting",
        isActive: false,
      },
      {
        path: "/counter-strike-2/accounts",
        icon: GiSamuraiHelmet,
        label: "Accounts",
        isActive: false,
      },
      {
        path: "/counter-strike-2/items",
        icon: PiTreasureChestFill,
        label: "Items",
        isActive: false,
      },
    ],
    "pending-boosts": listOfPathPartner,
    "progress-boosts": listOfPathPartner,
    income: listOfPathPartner,
    orders: currentRole?.includes("partner")
      ? listOfPathPartner
      : listOfPathClient,
    wallet: currentRole?.includes("partner")
      ? listOfPathPartner
      : listOfPathClient,
    settings: currentRole?.includes("partner")
      ? listOfPathPartner
      : listOfPathClient,
    "follow-partners": currentRole?.includes("partner")
      ? listOfPathPartner
      : listOfPathClient,
    supports: currentRole?.includes("partner")
      ? listOfPathPartner
      : listOfPathClient,
    "free-fire": listOfPathGame("free-fire"),
    "genshin-impact": listOfPathGame("genshin-impact"),
    "honkai-star-rail": listOfPathGame("honkai-star-rail"),
    "league-of-legends": listOfPathGame("league-of-legends"),
    minecraft: listOfPathGame("minecraft"),
    "overwatch-2": listOfPathGame("overwatch-2"),
    "pubg-mobile": listOfPathGame("pubg-mobile"),
    roblox: listOfPathGame("roblox"),
    rust: listOfPathGame("rust"),
    valorant: listOfPathGame("valorant"),
    "war-thunder": listOfPathGame("war-thunder"),
    warframe: listOfPathGame("warframe"),
    "world-of-tanks": listOfPathGame("world-of-tanks"),
  };

  const game = useMemo(() => {
    return listOfGames.find(({ value }) => value === secondQuery);
  }, [secondQuery]);

  const tabs: IListOfPath[] = useMemo(() => {
    return (Object.keys(optionTabs).includes(secondQuery)
      ? optionTabs[secondQuery as keyof typeof optionTabs]
      : []) as IListOfPath[];
  }, [secondQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!isFirstRender) {
        if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsShowSubheader(true);
        } else {
          // Scrolling down
          setIsShowSubheader(false);
        }
      }

      setLastScrollY(currentScrollY);
      setIsFirstRender(false); // Set flag to false after first scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isFirstRender]);

  return (
    <div
      className="absolute top-16 z-40 h-[58px] w-full border-b border-t border-border/50 bg-card-alt/75 px-4 transition-all duration-200 before:absolute before:inset-0 before:p-px before:backdrop-blur-xl before:transition-all before:duration-200 sm:fixed sm:px-6 lg:px-8"
      style={{ display: isShowSubheader ? "block" : "none" }}
    >
      <div className="relative z-10 mx-auto flex h-full max-w-full items-center justify-between overflow-clip sm:justify-normal lg:max-w-[1550px]">
        <div className="flex h-full items-center sm:gap-x-1 lg:w-[30%]">
          <Link
            className="flex items-center gap-x-3 truncate"
            to={tabs[0].path}
          >
            {game ? (
              <>
                <img
                  className="h-8 w-8"
                  src={`/assets/games/${game.value}/logo.png`}
                  alt="logo"
                />
                <h2 className="font-display truncate text-xl font-bold tracking-tight text-foreground">
                  {game.label}
                </h2>
              </>
            ) : (
              <>
                <img
                  className="size-8 rounded ring-1 ring-border/50"
                  src={currentUser?.profile_picture}
                  alt="logo"
                />
                <h2 className="font-display truncate text-xl font-bold tracking-tight text-foreground">
                  {currentUser?.username}
                </h2>
              </>
            )}
          </Link>
        </div>
        <div className="hidden h-full items-center justify-center lg:flex lg:w-[60%] xl:w-[40%]">
          {tabs.map(({ icon: Icon, path, label, isActive = true }) =>
            path === "/" + secondQuery ? (
              <Link
                key={uuidv4()}
                className="group relative flex h-full items-center gap-x-2 bg-gradient-to-t px-4 py-2 text-sm font-medium leading-6 text-foreground backdrop-blur-sm hover:from-blue-500/10"
                to={path}
              >
                <Icon size={16} className="text-blue-500" />
                <span className="truncate">
                  {t(`Globals.Services.${label}`)}
                </span>
                <div
                  className="absolute bottom-0 left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-t-full"
                  style={{
                    background:
                      "linear-gradient(110deg, rgb(83, 134, 239) 6.61%, rgb(69, 116, 234) 92.12%)",
                  }}
                />
                <div
                  className="absolute -bottom-4 left-1/2 h-16 w-16 -translate-x-1/2 opacity-30 blur"
                  style={{
                    background:
                      "linear-gradient(110deg, rgb(83, 134, 239) 6.61%, rgb(69, 116, 234) 92.12%)",
                  }}
                />
              </Link>
            ) : isActive ? (
              <Link
                key={uuidv4()}
                to={path}
                className="group relative flex h-full items-center gap-x-2 from-accent px-4 py-2 text-sm font-medium leading-6 text-muted-foreground hover:bg-gradient-to-t hover:text-foreground"
              >
                <Icon
                  size={16}
                  className="text-muted-foreground/50 group-hover:text-foreground"
                />
                <span className="truncate">
                  {t(`Globals.Services.${label}`)}
                </span>
              </Link>
            ) : (
              <Tooltip key={uuidv4()} content="Coming Soon">
                <div className="group relative flex h-full items-center gap-x-2 px-4 py-2 text-sm font-medium leading-6 opacity-20">
                  <Icon
                    size={16}
                    className="text-base text-muted-foreground/50"
                  />
                  <span className="truncate">
                    {t(`Globals.Services.${label}`)}
                  </span>
                </div>
              </Tooltip>
            ),
          )}
        </div>
        <div className="ml-2 flex h-8 justify-end gap-x-2 sm:ml-auto lg:w-[30%]">
          <Link
            className="relative hidden items-center justify-center overflow-hidden whitespace-nowrap rounded-md !bg-[#5865f2] bg-transparent px-2 py-1.5 text-xs font-medium !text-white text-secondary-light-foreground outline-none transition-colors hover:!bg-[#6773f4] hover:bg-secondary-light hover:!ring-[#5865f2] focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 xl:flex"
            to="/"
          >
            <FaDiscord size={16} className="sm:mr-2" />
            {t("Globals.Join Discord")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
