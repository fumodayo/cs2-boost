import clsx from "clsx";
import {
  FaDesktop,
  FaEye,
  FaEyeSlash,
  FaTrashCan,
  FaXmark,
} from "react-icons/fa6";
import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/store";
import Circle from "../Icons/Circle";
import Widget from "../Widget";
import { formatDistance } from "date-fns";
import SEO from "../SEO";
import { Button, CancelButton, DangerButton } from "../Buttons/Button";

const headers = ["username", "user ID", "email address", "address"];

const General = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [showIps, setShowIps] = useState(false);

  const handleShowIPs = () => {
    setShowIps(!showIps);
  };

  // const handleLogoutAllDevices = async () => {
  //   try {
  //     await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout-all`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       // body: JSON.stringify(),
  //     });
  //     dispatch(signOut());
  //   } catch (error) {
  //     return;
  //   }
  // };

  return (
    <>
      <SEO
        title="Account Settings"
        description="Account Settings"
        href="/dashboard/settings"
      />

      <div
        className={clsx(
          "mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-5",
          "lg:mx-0 lg:grid-cols-3",
        )}
      >
        {/* CREDIT */}

        {/* INFORMATION */}
        <div
          className={clsx(
            "space-y-4",
            "lg:col-span-2 lg:row-span-2 lg:row-end-2 lg:space-y-6",
          )}
        >
          {currentUser && (
            <Widget
              titleHeader="User Information"
              headers={headers}
              boostItem={currentUser}
            />
          )}

          {/* DELETE ACCOUNT */}
          <div
            className={clsx(
              "rounded-lg bg-card bg-gradient-to-br via-card to-card to-50% px-4 py-5 shadow ring-1 ring-danger-ring",
              "sm:p-6",
            )}
          >
            <div
              className={clsx(
                "flex flex-col gap-6",
                "sm:flex-row sm:items-center sm:justify-between",
              )}
            >
              <div>
                <h3 className="text-base font-semibold leading-6 text-foreground">
                  Delete Account
                </h3>
                <div className="mt-2 max-w-xl text-sm text-foreground/90">
                  This is irreversible. We will permanently remove your account,
                  you will lose all the store credit and loyalty coins you have.
                </div>
              </div>
              <DangerButton disabled>
                <FaTrashCan className="mr-2" />
                Delete Account
              </DangerButton>
            </div>
          </div>

          {/* LOGIN SESSIONS */}
          <div
            className={clsx(
              "-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm",
              "sm:mx-0 sm:rounded-xl",
            )}
          >
            <div
              className={clsx(
                "flex flex-row items-center space-y-1.5 border-b border-border bg-muted/50 px-4 py-4",
                "sm:rounded-t-xl sm:px-6",
              )}
            >
              <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
                Login Sessions
              </h3>
              <div className="ml-auto flex items-center gap-x-1.5">
                <Button
                  color="light"
                  onClick={handleShowIPs}
                  className="rounded-md px-2 py-1.5 text-xs font-medium"
                >
                  {showIps ? (
                    <>
                      <FaEyeSlash className="mr-2" />
                      Hide IPs
                    </>
                  ) : (
                    <>
                      <FaEye className="mr-2" />
                      Show IPs
                    </>
                  )}
                </Button>
                <CancelButton
                  className="!ring-0"
                  disabled
                  // onClick={handleLogoutAllDevices}
                >
                  <FaXmark className="mr-2" /> Logout All Devices
                </CancelButton>
              </div>
            </div>
            <div className="px-0 pt-0 sm:px-6">
              {currentUser &&
                currentUser.ip_logger &&
                currentUser.ip_logger.map((user) => (
                  <ul className="divide-y divide-border rounded-md">
                    <li
                      className={clsx(
                        "flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 leading-6",
                        "sm:px-0",
                      )}
                    >
                      <div className="flex min-w-[150px] flex-1 items-center">
                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border p-3 shadow-sm">
                          <FaDesktop className="text-xl text-foreground/90" />
                        </div>
                        <div className="ml-4 flex min-w-0 flex-1 flex-col">
                          <span
                            className={clsx(
                              "font-display items-center truncate font-medium",
                              "sm:flex",
                            )}
                          >
                            {user.country}
                            <span
                              className={clsx(
                                "ml-1 inline-flex items-center rounded-md bg-primary-light px-2 py-1 text-xs font-medium capitalize text-primary-light-foreground ring-1 ring-inset ring-primary-ring",
                                "sm:ml-2",
                              )}
                            >
                              <Circle />
                              {user.status}
                            </span>
                          </span>
                          <span
                            className={clsx(
                              "flex-shrink-0 items-center gap-x-1.5 truncate text-sm text-muted-foreground",
                              "sm:flex",
                            )}
                          >
                            {user.createdAt &&
                              formatDistance(user.createdAt, new Date())}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-x-3">
                        {showIps ? (
                          <span className="inline-flex h-9 items-center rounded-md bg-secondary-light px-3 py-0.5 text-sm font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                            {user.ip}
                          </span>
                        ) : (
                          <div className="block h-9 w-24 rounded-md bg-muted" />
                        )}
                      </div>
                    </li>
                  </ul>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default General;
