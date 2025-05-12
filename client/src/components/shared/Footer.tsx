import {
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Button } from "./Button";
import Logo from "./Logo";
import MenuLanguage from "./MenuLanguage";
import MenuTheme from "./MenuTheme";
import { LuMessagesSquare } from "react-icons/lu";
import { Link } from "react-router-dom";
import Tooltip from "../@radix-ui/Tooltip";
import cn from "~/libs/utils";
import { useTranslation } from "react-i18next";

const socials = [
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

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={cn("relative z-20 mx-auto", "dark:bg-[#0F111A]")}>
      <div className="border-t border-border/40" />
      <div
        className={cn(
          "pointer-events-none absolute -top-[8rem] -z-0 hidden w-full justify-center",
          "xl:flex",
        )}
      >
        <img
          className="-z-0 brightness-50 filter"
          src="/assets/backgrounds/footer_sep.png"
          alt="separator"
        />
      </div>
      <div className="z-20 mx-auto divide-y divide-border/40">
        <div
          className={cn(
            "mx-auto max-w-[1550px] px-2 py-6",
            "sm:px-2 lg:px-8 lg:py-20",
          )}
        >
          <div className={cn("flex flex-wrap", "lg:-m-8")}>
            <div className={cn("w-full p-6", "sm:w-[calc(50%)]")}>
              <div className="lg:max-w-md">
                <div className="mb-6">
                  <Logo />
                </div>
                <h3 className="font-display text-xl font-semibold leading-normal text-foreground">
                  {t("Footer.title1")}
                </h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {t("Footer.subtitle1")}
                </p>
              </div>
            </div>
            <div className={cn("w-full p-6", "sm:w-[calc(50%)]")}>
              <div className="lg:max-w-sm">
                <h3 className="font-display mb-6 text-lg font-semibold leading-normal text-foreground">
                  {t("Footer.title2")}
                </h3>
                <p className="mb-5 leading-relaxed text-muted-foreground">
                  {t("Footer.subtitle2")}
                </p>
                <div
                  className={cn(
                    "mb-3 flex w-full flex-wrap items-center gap-4 overflow-visible",
                    "md:max-w-xl",
                  )}
                >
                  <Button
                    variant="transparent"
                    className={cn("rounded-md px-5 py-3 text-sm", "sm:py-2.5")}
                  >
                    <LuMessagesSquare size={20} className="mr-2" />
                    {t("Footer.btn1")}
                  </Button>
                  <Button
                    variant="primary"
                    className={cn(
                      "rounded-md bg-[#5865f2] px-5 py-3 text-sm text-white hover:bg-[#6773f4] hover:ring-[#5865f2]",
                      "sm:py-2.5",
                    )}
                  >
                    <FaDiscord size={20} className="mr-2" />
                    {t("Footer.btn2")}
                  </Button>
                  <div className="flex w-full flex-1 items-center gap-x-2">
                    <MenuLanguage variant="transparent" />
                    <MenuTheme />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "mx-auto flex max-w-[1550px] flex-col flex-wrap items-center justify-between gap-4 px-4 py-6",
            "sm:flex-row sm:px-6 lg:px-8",
          )}
        >
          <div className="flex flex-col">
            <p className="mb-0.5 text-sm font-medium text-muted-foreground">
              Copyright © {new Date().getFullYear()} Global Gaming Services
              d.o.o. All rights Reserved
            </p>
            <p className="text-sm text-muted-foreground">
              Clone website by:<b> fumodayo</b>
            </p>
          </div>
          <div className="w-auto">
            <div className="flex flex-wrap gap-x-2">
              {socials.map(({ name, icon: Icon }) => (
                <div key={name} className="w-auto">
                  <Link to={`https://${name}.com`} target="_blank">
                    <Tooltip content={name}>
                      <Button
                        variant="transparent"
                        className="h-9 w-9 items-center justify-center rounded-md"
                      >
                        <span className="sr-only">{name}</span>
                        <Icon />
                      </Button>
                    </Tooltip>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
