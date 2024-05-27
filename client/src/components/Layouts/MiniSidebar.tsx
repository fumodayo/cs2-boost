import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { IconType } from "react-icons";
import { GiDiamondHard } from "react-icons/gi";
import { GiBroadsword } from "react-icons/gi";
import { LuSwords } from "react-icons/lu";
import { HiSparkles } from "react-icons/hi2";

const serviceItems = [
  {
    icon: HiSparkles,
    label: "Services",
    value: "services",
  },
  {
    icon: GiDiamondHard,
    label: "Level Farming",
    value: "level-farming",
  },
  {
    icon: GiBroadsword,
    label: "Premier",
    value: "premier",
  },
  {
    icon: LuSwords,
    label: "Wingman",
    value: "wingman",
  },
];

interface ServiceItemProps {
  icon?: IconType;
  label?: string;
  value?: string;
  active?: string;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  icon: Icon,
  label,
  value,
  active,
}) => {
  const { t } = useTranslation();

  const linkTo =
    value === "services" ? "/counter-strike-2" : `/counter-strike-2/${value}`;

  return (
    <div>
      {value === active ? (
        <li>
          <Link
            className={clsx(
              "tab-active group flex items-center gap-x-3 rounded-md bg-accent p-2 pl-3 text-sm font-medium leading-6 text-foreground backdrop-blur-sm",
              "dark:bg-white/10",
            )}
            to={linkTo}
          >
            <span>{Icon && <Icon className="text-base" />}</span>
            <b>{label && t(label)}</b>
          </Link>
        </li>
      ) : (
        <li>
          <Link
            to={linkTo}
            className={clsx(
              "group my-1 flex items-center gap-x-3 rounded-md p-2 pl-3 text-sm font-medium leading-6 text-muted-foreground",
              "hover:bg-accent hover:text-foreground",
            )}
          >
            <span>{Icon && <Icon className="text-base" />}</span>
            <span className="whitespace-nowrap">{label && t(label)}</span>
          </Link>
        </li>
      )}
    </div>
  );
};

const MiniSidebar = () => {
  const { pathname } = useLocation();
  // Tách đường dẫn thành các đoạn bằng dấu "/"
  const segments = pathname.split("/").filter(Boolean);

  // Nếu có nhiều hơn 1 đoạn, lấy đoạn cuối cùng. Ngược lại, sử dụng giá trị mặc định "services"
  const slug = segments.length > 1 ? segments.pop() : "services";

  return (
    <div
      className={clsx(
        "relative hidden max-w-[224px]",
        "lg:row-span-2 lg:block",
      )}
    >
      <div className="sticky top-20">
        <div
          className={clsx(
            "mb-4 w-56 rounded-lg bg-card-surface px-4 py-6 shadow-md",
            "transition-all duration-200",
            "sm:px-6",
          )}
        >
          <div className="absolute inset-0 h-36 overflow-hidden rounded-t-lg">
            <img
              src="/assets/counter-strike-2/banner.png"
              className="h-full w-full object-cover"
              style={{ objectPosition: "0px 40%" }}
              alt="Banner"
            />
            <div
              className={clsx(
                "absolute inset-0 bg-gradient-to-t from-card-surface backdrop-blur-[2px]",
                "dark:to-card-surface/75",
              )}
            />
          </div>
          <div className="pointer-events-none relative flex items-center">
            <img
              src="/assets/counter-strike-2/card/text.png"
              className="h-[66px] w-44"
              alt="Game Title"
            />
            <span className="sr-only">Counter Strike 2</span>
          </div>
          <nav className="relative mt-6 flex flex-col">
            <ul className="flex flex-1 flex-col gap-y-9 border-border">
              <li>
                <ul className="-mx-2 space-y-1 border-border">
                  <div className="my-4">
                    {serviceItems.map((item) => (
                      <ServiceItem
                        key={item.value}
                        label={item.label}
                        icon={item.icon}
                        value={item.value}
                        active={slug}
                      />
                    ))}
                  </div>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MiniSidebar;
