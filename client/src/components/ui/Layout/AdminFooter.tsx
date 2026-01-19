import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Trans, useTranslation } from "react-i18next";
import cn from "~/libs/utils";
import { Button } from "~/components/ui/Button";
import { Link } from "react-router-dom";
import Tooltip from "~/components/@radix-ui/Tooltip";
const socials = [
  {
    key: "facebook",
    icon: FaFacebook,
    url: "https://facebook.com",
  },
  {
    key: "instagram",
    icon: FaInstagram,
    url: "https://instagram.com",
  },
  {
    key: "x",
    icon: FaTwitter,
    url: "https://x.com",
  },
  {
    key: "youtube",
    icon: FaYoutube,
    url: "https://youtube.com",
  },
  {
    key: "tiktok",
    icon: FaTiktok,
    url: "https://tiktok.com",
  },
];
const AdminFooter = () => {
  const { t } = useTranslation("common");
  return (
    <footer
      className={cn(
        "relative z-10 overflow-hidden xl:ml-64",
        "dark:bg-[#0F111A]",
      )}
    >
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
            "mx-auto max-w-[1550px] px-4 py-6",
            "sm:px-6 lg:px-8 lg:py-20",
          )}
        >
          <div className="flex flex-wrap">
            <div className={cn("w-full p-6", "sm:w-[calc(50%)]")}>
              <div className="lg:max-w-md">
                <div className="mb-6">
                  <Link className="relative" to={"/admin"}>
                    <img
                      className={cn("block h-8 w-[100px]", "dark:hidden")}
                      src="/assets/brand/icon-text.png"
                      alt="logo"
                    />
                    <img
                      className={cn("hidden h-8 w-[100px]", "dark:block")}
                      src="/assets/brand/icon-text-dark.png"
                      alt="logo"
                    />
                  </Link>
                </div>
                <h3 className="font-display text-xl font-semibold leading-normal text-foreground">
                  {t("footer.title1")}
                </h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {t("footer.subtitle1")}
                </p>
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
              {t("footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <p className="text-sm text-muted-foreground">
              <Trans
                i18nKey="footer.clone_by"
                t={t}
                components={{ b: <b /> }}
              />
            </p>
          </div>
          <div className="w-auto">
            <div className="flex flex-wrap gap-x-2">
              {socials.map(({ key, icon: Icon, url }) => (
                <div key={key} className="w-auto">
                  <Link to={url} target="_blank">
                    <Tooltip content={t(`socials.${key}`)}>
                      <Button
                        variant="transparent"
                        className="h-9 w-9 items-center justify-center rounded-md"
                      >
                        <span className="sr-only">{t(`socials.${key}`)}</span>
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
export default AdminFooter;