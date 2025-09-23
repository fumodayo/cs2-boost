import { useEffect, useMemo, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaDiscord } from "react-icons/fa6";
import { GiSamuraiHelmet } from "react-icons/gi";
import { PiTreasureChestFill } from "react-icons/pi";
import { IoRocket } from "react-icons/io5";
import { listOfGames } from "~/constants/games";
import {
  IListOfPath,
  listOfPathClient,
  listOfPathPartner,
} from "~/constants/role";
import { RootState } from "~/redux/store";
import Tooltip from "../@radix-ui/Tooltip";
import { TFunction } from "i18next";

const createGamePaths = (gameSlug: string): IListOfPath[] => [
  { path: `/${gameSlug}`, icon: IoRocket, label: "Boosting", isActive: true },
  {
    path: `/${gameSlug}/accounts`,
    icon: GiSamuraiHelmet,
    label: "Accounts",
    isActive: false,
  },
  {
    path: `/${gameSlug}/items`,
    icon: PiTreasureChestFill,
    label: "Items",
    isActive: false,
  },
];

const TabItem = ({
  tab,
  currentBasePath,
  t,
}: {
  tab: IListOfPath;
  currentBasePath: string;
  t: TFunction;
}) => {
  const { path, label, icon: Icon, isActive = true } = tab;

  const isCurrentlyActive = path === currentBasePath;
  if (isCurrentlyActive) {
    return (
      <Link
        to={path}
        className="group relative flex h-full items-center gap-x-2 bg-gradient-to-t px-4 py-2 text-sm font-medium leading-6 text-foreground backdrop-blur-sm hover:from-blue-500/10"
      >
        <Icon size={16} className="text-blue-500" />
        <span className="truncate">{t(`Globals.Services.${label}`)}</span>
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
    );
  }

  if (isActive) {
    return (
      <Link
        to={path}
        className="group relative flex h-full items-center gap-x-2 from-accent px-4 py-2 text-sm font-medium leading-6 text-muted-foreground hover:bg-gradient-to-t hover:text-foreground"
      >
        <Icon
          size={16}
          className="text-muted-foreground/50 group-hover:text-foreground"
        />
        <span className="truncate">{t(`Globals.Services.${label}`)}</span>
      </Link>
    );
  }

  return (
    <Tooltip content="Coming Soon">
      <div className="group relative flex h-full cursor-not-allowed items-center gap-x-2 px-4 py-2 text-sm font-medium leading-6 opacity-20">
        <Icon size={16} className="text-base text-muted-foreground/50" />
        <span className="truncate">{t(`Globals.Services.${label}`)}</span>
      </div>
    </Tooltip>
  );
};

const SubHeader = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [isShowSubheader, setIsShowSubheader] = useState(true);
  const lastScrollY = useRef(0);

  const secondQuery = useMemo(() => pathname.split("/")[1] || "", [pathname]);
  const isPartner = useMemo(
    () => currentUser?.role?.includes("partner") ?? false,
    [currentUser],
  );
  const game = useMemo(
    () => listOfGames.find(({ value }) => value === secondQuery),
    [secondQuery],
  );

   const tabs: IListOfPath[] = useMemo(() => {
    // 1. Xác định bộ tab mặc định dựa trên vai trò người dùng.
    // Đây sẽ là fallback cho bất kỳ path nào không được định nghĩa cụ thể.
    const roleBasedDefaultPaths = isPartner ? listOfPathPartner : listOfPathClient;

    // 2. Kiểm tra xem path hiện tại có phải là một game không.
    const isGamePath = listOfGames.some(({ value }) => value === secondQuery);
    if (isGamePath) {
      return createGamePaths(secondQuery);
    }

    // 3. Định nghĩa các path đặc biệt có bộ tab riêng (chủ yếu cho Partner).
    const specialUserPaths: Record<string, IListOfPath[]> = {
      "pending-boosts": listOfPathPartner,
      "progress-boosts": listOfPathPartner,
      income: listOfPathPartner,
    };
    
    // Nếu path nằm trong danh sách đặc biệt, trả về bộ tab tương ứng.
    if (specialUserPaths[secondQuery]) {
      return specialUserPaths[secondQuery];
    }

    // 4. Nếu không phải là game và cũng không phải path đặc biệt,
    // trả về bộ tab mặc định dựa trên vai trò.
    // Điều này bao gồm các path đã biết như 'orders', 'wallet', 'settings'
    // VÀ BẤT KỲ PATH NÀO KHÁC không xác định.
    return roleBasedDefaultPaths;

  }, [secondQuery, isPartner]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsShowSubheader(
        currentScrollY < lastScrollY.current || currentScrollY < 10,
      );
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`absolute top-16 z-40 h-[58px] w-full border-b border-t border-border/50 bg-card-alt/75 px-4 transition-all duration-300 ease-in-out before:absolute before:inset-0 before:p-px before:backdrop-blur-xl sm:fixed sm:px-6 lg:px-8 ${
        isShowSubheader
          ? "translate-y-0 opacity-100"
          : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative z-10 mx-auto flex h-full max-w-full items-center justify-between overflow-clip sm:justify-normal lg:max-w-[1550px]">
        <div className="flex h-full items-center sm:gap-x-1 lg:w-[30%]">
          <Link
            className="flex items-center gap-x-3 truncate"
            to={tabs[0]?.path ?? "/"}
          >
            {game ? (
              <>
                <img
                  className="h-8 w-8"
                  src={`/assets/games/${game.value}/logo.png`}
                  alt={game.label}
                />
                <h2 className="font-display truncate text-xl font-bold tracking-tight text-foreground">
                  {game.label}
                </h2>
              </>
            ) : (
              currentUser && (
                <>
                  <img
                    className="size-8 rounded ring-1 ring-border/50"
                    src={currentUser.profile_picture}
                    alt="avatar"
                  />
                  <h2 className="font-display truncate text-xl font-bold tracking-tight text-foreground">
                    {currentUser.username}
                  </h2>
                </>
              )
            )}
          </Link>
        </div>
        <div className="hidden h-full items-center justify-center lg:flex lg:w-[60%] xl:w-[40%]">
          {tabs.map((tab) => (
            <TabItem
              key={tab.path}
              tab={tab}
              currentBasePath={`/${secondQuery}`}
              t={t}
            />
          ))}
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
