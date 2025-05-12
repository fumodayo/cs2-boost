import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { FaDesktop, FaEye, FaXmark } from "react-icons/fa6";
import { Button, Chip, Widget } from "~/components/shared";
import { IconDotBig } from "~/icons";
import { ICurrentUserProps } from "~/types";
import { formatDistanceDate } from "~/utils";
import { v4 as uuidv4 } from "uuid";

const LoginSessionsWidget = ({
  currentUser,
}: {
  currentUser: ICurrentUserProps;
}) => {
  const { t, i18n } = useTranslation();
  const [isShowIPLocation, setIsShowIPLocation] = useState(false);

  return (
    <Widget>
      <Widget.Header>
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          {t("Globals.User.ip_address.label.Login Sessions")}
        </h3>
        <div className="ml-auto flex items-center gap-x-1.5">
          <Button
            onClick={() => setIsShowIPLocation((isShow) => !isShow)}
            variant="light"
            className="rounded-md bg-secondary-light px-2 py-1.5 text-xs text-secondary-light-foreground hover:bg-secondary-light-hover focus:outline-secondary"
          >
            <FaEye className="mr-2" />
            {t("Globals.User.ip_address.label.Show IPs")}
          </Button>
          <Button
            variant="light"
            className="rounded-md bg-danger-light px-2 py-1.5 text-xs text-danger-light-foreground hover:bg-danger-light-hover focus:outline-danger"
          >
            <FaXmark className="mr-2" />
            {t("Globals.User.ip_address.label.Logout All Devices")}
          </Button>
        </div>
      </Widget.Header>
      <Widget.Content>
        <ul className="divide-y divide-border rounded-md">
          {currentUser.ip_addresses &&
            currentUser.ip_addresses.map(
              ({ ip_location, device, country, updatedAt, status }) => (
                <li
                  key={uuidv4()}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 leading-6 sm:px-0"
                >
                  <div className="flex min-w-[150px] flex-1 items-center">
                    {/* LOGO */}
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 shadow-sm">
                      {device === "Desktop" && (
                        <FaDesktop size={22} className="text-foreground/90" />
                      )}
                      {device === "Mobile" && (
                        <FaMobileAlt size={22} className="text-foreground/90" />
                      )}
                      {device === "Tablet" && (
                        <FaTabletAlt size={22} className="text-foreground/90" />
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="ml-4 flex min-w-0 flex-1 flex-col">
                      <span className="font-display truncate font-medium">
                        {t(`Globals.User.ip_address.device.${device}`)}
                        {status === "online" ? (
                          <Chip>
                            <IconDotBig />
                            <span className="flex-1 shrink-0 truncate">
                              Online
                            </span>
                          </Chip>
                        ) : (
                          <Chip className="bg-danger-light text-danger-light-foreground ring-danger">
                            <IconDotBig />
                            <span className="flex-1 shrink-0 truncate">
                              Offline
                            </span>
                          </Chip>
                        )}
                      </span>
                      <span className="flex-shrink-0 items-center gap-x-1.5 truncate text-sm text-muted-foreground sm:flex">
                        {country}
                        <span className="text-muted-foreground">·</span>

                        {formatDistanceDate(updatedAt, i18n.language)}
                      </span>
                    </div>
                  </div>

                  {/* IP ADDRESS */}
                  <div className="flex flex-shrink-0 items-center gap-x-3">
                    {isShowIPLocation ? (
                      <span className="inline-flex h-9 items-center rounded-md bg-secondary-light px-3 py-0.5 text-sm font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                        <span className="flex-1 shrink-0 truncate">
                          {ip_location}
                        </span>
                      </span>
                    ) : (
                      <div className="block h-9 w-24 rounded-md bg-muted" />
                    )}
                  </div>
                </li>
              ),
            )}
        </ul>
      </Widget.Content>
    </Widget>
  );
};

export default LoginSessionsWidget;
