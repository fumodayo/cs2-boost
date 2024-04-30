import React, { useEffect } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import Footer from "./Footer";
import MiniSidebar from "./MiniSidebar";
import Services from "../Home/Services";
import { FaChevronLeft } from "react-icons/fa6";

const serviceItems = [
  {
    label: "Services",
    value: "services",
  },
  {
    label: "Level Farming",
    value: "level-farming",
  },
  {
    label: "Premier",
    value: "premier",
  },
  {
    label: "Wingman",
    value: "wingman",
  },
];

interface DefaultPageProps {
  children: React.ReactNode;
}

const DefaultPage: React.FC<DefaultPageProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const { t } = useTranslation();
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments.length > 1 ? segments.pop() : null;

  const selectedMode = serviceItems.find((item) => item.value === slug);

  return (
    <div className="bg-background">
      <Navbar isNonSticky />
      <div className="h-full w-full">
        <main>
          {/* BANNER */}
          <div className="absolute -z-10 w-full">
            <div className="relative h-[60vh] overflow-hidden">
              <img
                src="/src/assets/counter-strike-2/banner.png"
                className={clsx(
                  "h-full w-full object-cover saturate-0",
                  "dark:hidden",
                )}
                style={{ objectPosition: "0px 40%" }}
                alt="Counter Strike 2"
              />
              <img
                src="/src/assets/counter-strike-2/banner.png"
                className={clsx(
                  "hidden h-full w-full object-cover saturate-0",
                  "dark:block",
                )}
                style={{ objectPosition: "0px 40%" }}
                alt="Counter Strike 2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-background/90 backdrop-blur-sm" />
            </div>
          </div>
          {/* CONTENT */}
          <div className={clsx("px-4", "sm:px-6 lg:px-8")}>
            <div className="mx-auto max-w-[1550px] py-24">
              <div
                className={clsx(
                  "flex grid-cols-1 gap-4",
                  "lg:grid lg:grid-cols-[auto,2fr,auto] lg:grid-rows-[auto,1fr] lg:flex-row",
                )}
              >
                <MiniSidebar />
                <div className="lg:col-start-2 lg:col-end-4">
                  <div className="mx-auto max-w-[1400px]">
                    <div className="max-w-screen-lg">
                      {/* BACK BUTTON */}
                      <nav className="sm:hidden">
                        <button
                          type="button"
                          onClick={() => navigate(-1)}
                          className="flex items-baseline text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                          <FaChevronLeft className="mr-1 text-xs" /> Back
                        </button>
                      </nav>
                      {/* NAVIGATION */}
                      <nav className="hidden sm:flex">
                        <ol className="flex items-center gap-x-2">
                          <li>
                            <div className="flex items-center">
                              <a
                                className={clsx(
                                  "text-xs font-medium text-muted-foreground",
                                  "hover:text-foreground",
                                )}
                                href="/"
                              >
                                Home
                              </a>
                            </div>
                          </li>
                          <li>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="12"
                                width="8"
                                viewBox="0 0 320 512"
                                className="fill-muted-foreground/50"
                              >
                                <path d="M319.9 0H248.8L.1 512H71.2L319.9 0z"></path>
                              </svg>
                              <a
                                className={clsx(
                                  "text-xs font-medium text-muted-foreground",
                                  "ml-1 hover:text-foreground",
                                )}
                                href="/counter-strike-2"
                              >
                                Counter Strike 2
                              </a>
                            </div>
                          </li>
                          {selectedMode && (
                            <li>
                              <div className="flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="12"
                                  width="8"
                                  viewBox="0 0 320 512"
                                  className="fill-muted-foreground/50"
                                >
                                  <path d="M319.9 0H248.8L.1 512H71.2L319.9 0z"></path>
                                </svg>
                                <a
                                  className={clsx(
                                    "text-xs font-medium text-muted-foreground",
                                    "ml-1 hover:text-foreground",
                                  )}
                                  href={`/counter-strike-2/${slug}`}
                                >
                                  {selectedMode.label}
                                </a>
                              </div>
                            </li>
                          )}
                        </ol>
                      </nav>

                      {/* TITLE */}
                      <div className="my-4 flex items-center gap-4">
                        <img
                          src={`/src/assets/counter-strike-2/logo/logo.png`}
                          alt="cs2"
                          className="-ml-px h-16 w-16 flex-none rounded-md object-cover object-center"
                        />
                        <div>
                          <h1 className="text-3xl font-bold text-foreground">
                            {t("CS2 Boost & Carry Services")}
                          </h1>
                          <p className="text-sm text-muted-foreground">
                            {t("Buy CS2 Boosting & Carry services")}
                          </p>
                        </div>
                      </div>
                    </div>
                    {children}
                    <div className="relative my-20">
                      <Services />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultPage;
