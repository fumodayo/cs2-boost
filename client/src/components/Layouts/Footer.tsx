import clsx from "clsx";
import { useTranslation } from "react-i18next";

import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaDiscord,
} from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";

import MenuLanguage from "../Common/MenuLanguage";
import MenuTheme from "../Common/MenuTheme";
import Tooltip from "../Tooltip";

const social = [
  {
    name: "facebook",
    icon: FaFacebook,
  },
  {
    name: "instagram",
    icon: FaInstagram,
  },
  {
    name: "x",
    icon: FaTwitter,
  },
  {
    name: "youtube",
    icon: FaYoutube,
  },
  {
    name: "tiktok",
    icon: FaTiktok,
  },
];

const services = [
  {
    name: "CS2Boost",
    tasks: [
      { name: "Work with us", link: "" },
      { name: "Blog & News", link: "" },
      { name: "Definitions", link: "" },
      { name: "Contact us", link: "" },
    ],
  },
  {
    name: "Legal",
    tasks: [
      { name: "Terms of service", link: "" },
      { name: "Privacy policy", link: "" },
      { name: "Cookies policy", link: "" },
      { name: "Code of honor", link: "" },
    ],
  },
  {
    name: "League of Legends",
    tasks: [
      { name: "Boosting", link: "" },
      { name: "Accounts", link: "" },
      { name: "Coaching", link: "" },
      { name: "Smurf Accounts", link: "" },
    ],
  },
  {
    name: "Valorant",
    tasks: [
      { name: "Rank Boost", link: "" },
      { name: "Win Boost", link: "" },
      { name: "Placements Boost", link: "" },
      { name: "Unrated Matches", link: "" },
    ],
  },
  {
    name: "Other Games",
    tasks: [
      { name: "Overwatch 2", link: "" },
      { name: "Teamfight Tactics", link: "" },
      { name: "LoL: Wild Rift", link: "" },
      { name: "Counter Strike 2", link: "" },
    ],
  },
];

type Task = {
  name?: string;
  link?: string;
};

interface TaskItemProps {
  name?: string;
  tasks?: Task[];
}

const TaskItem: React.FC<TaskItemProps> = ({ name, tasks }) => {
  return (
    <div className={clsx("w-1/2 p-6", "md:w-[calc(25%)] xl:w-[calc(14.28%)]")}>
      <h3 className="font-display mb-6 text-lg font-semibold leading-normal text-foreground">
        {name}
      </h3>
      <ul className="space-y-3.5">
        {tasks?.map(({ name, link }) => (
          <li key={name}>
            <a
              className={clsx(
                "font-medium leading-relaxed text-muted-foreground",
                "dark:hover:text-foreground",
              )}
              href={`${link}`}
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={clsx("relative z-20 mx-auto ", "dark:bg-[#0F111A]")}>
      <div className={clsx("border-t border-border", "xl:hidden")} />
      <div
        className={clsx(
          "pointer-events-none absolute -top-[7.8rem] -z-0 hidden w-full justify-center",
          "xl:flex",
        )}
      >
        <img
          src="/src/assets/backgrounds/footer_sep.png"
          className="-z-0 brightness-50 filter"
          alt="separator"
        />
      </div>
      <div className="z-20 mx-auto divide-y divide-border">
        <div
          className={clsx(
            "mx-auto max-w-[1550px] px-2 py-6",
            "sm:px-2 lg:px-8 lg:py-20",
          )}
        >
          <div className={clsx("flex flex-wrap", "lg:-m-8")}>
            {services.map(({ name, tasks }) => (
              <TaskItem key={name} name={name} tasks={tasks} />
            ))}

            <div
              className={clsx(
                "w-full p-6",
                "sm:w-[calc(50%)] xl:w-[calc(28.57%)]",
              )}
            >
              <div className="lg:max-w-sm">
                <h3 className="font-display mb-6 text-lg font-semibold leading-normal text-foreground">
                  {t("Need Help")}?
                </h3>
                <p className="font-sans mb-5 leading-relaxed text-muted-foreground">
                  {t(
                    "We're here to help. Our expert human-support team is at your service 24/7",
                  )}
                  .
                </p>
                <div
                  className={clsx(
                    "mb-3 flex w-full flex-wrap items-center gap-4 overflow-visible",
                    "md:max-w-xl",
                  )}
                >
                  <button
                    type="button"
                    className={clsx(
                      "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                      "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                      "sm:py-2.5",
                    )}
                  >
                    <LuMessagesSquare className="mr-2 text-xl" />
                    {t("Let's Chat")}
                  </button>
                  <a
                    href="_blank"
                    className={clsx(
                      "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md !bg-[#5865f2] bg-secondary px-5 py-3 text-sm font-medium !text-white text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors ",
                      "hover:!bg-[#6773f4] hover:bg-secondary-hover hover:!ring-[#5865f2] focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                      "sm:py-2.5",
                    )}
                  >
                    <FaDiscord className="mr-2 text-xl" />
                    {t("Join Discord")}
                  </a>
                </div>
                <div className="flex w-full flex-1 items-center gap-x-2">
                  {/* MENU LANGUAGE */}
                  <MenuLanguage />

                  {/** MENU THEME */}
                  <MenuTheme />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "mx-auto flex max-w-[1550px] flex-col flex-wrap items-center justify-between gap-4 px-4 py-6",
            "sm:flex-row sm:px-6 lg:px-8",
          )}
        >
          <div className="flex flex-col">
            <p className="mb-0.5 text-sm font-medium text-muted-foreground">
              NoCopyright © {new Date().getFullYear()} CS2Boost
            </p>
            <div className="text-xs font-medium text-muted-foreground">
              <div>
                <b>Clone website by:</b> fumodayo
              </div>
            </div>
          </div>
          <div className="w-auto">
            <div className="flex flex-wrap gap-x-2">
              <div className="flex w-auto">
                {social.map((item) => (
                  <Tooltip key={item.name} content={item.name}>
                    <a
                      href={`https://${item.name}.com`}
                      className={clsx(
                        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-1 py-0.5 text-sm font-medium text-secondary-light-foreground outline-none transition-colors",
                        "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                      )}
                      target="_blank"
                    >
                      <span className="sr-only">{item.name}</span>
                      <item.icon />
                    </a>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
