import { useTranslation } from "react-i18next";
import { BiSolidBellRing } from "react-icons/bi";
import { FaPenToSquare } from "react-icons/fa6";
import { HiMiniRectangleStack } from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const list = [
  {
    path: "/settings",
    icon: HiMiniRectangleStack,
    label: "General",
  },
  {
    path: "/settings/information",
    icon: FaPenToSquare,
    label: "Information",
  },
  {
    path: "/settings/notifications",
    icon: BiSolidBellRing,
    label: "Notifications",
  },
];

const Navigation = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className="mb-4 flex gap-2">
      {list.map(({ path, icon: Icon, label }) =>
        pathname === path ? (
          <Link
            key={uuidv4()}
            to={path}
            className="active-tab flex h-10 flex-shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium dark:bg-accent"
          >
            <Icon size={18} className="mr-1.5" />
            {t(`SettingsPage.navigation.${label}`)}
          </Link>
        ) : (
          <Link
            key={uuidv4()}
            to={path}
            className="flex h-10 flex-shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <Icon size={18} className="mr-1.5 opacity-75" />
            {t(`SettingsPage.navigation.${label}`)}
          </Link>
        ),
      )}
    </div>
  );
};

export default Navigation;
