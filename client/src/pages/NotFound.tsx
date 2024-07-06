import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import Logo from "../components/Common/Logo";

const contacts = [
  {
    link: "",
    label: "Contact 24/7",
  },
  {
    link: "",
    label: "Status",
  },
  {
    link: "",
    label: "Discord",
  },
];

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen">
      <div
        className={clsx(
          "grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr]",
          "lg:grid-cols-[max(50%,36rem),1fr]",
        )}
      >
        {/* HEADER */}
        <header
          className={clsx(
            "mx-auto w-full max-w-7xl px-6 pt-6",
            "sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8",
          )}
        >
          <Logo />
        </header>

        {/* CONTENT */}
        <main
          className={clsx(
            "mx-auto w-full max-w-7xl px-6 py-24",
            "sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8",
          )}
        >
          <div className="max-w-lg">
            <p className="text-base font-semibold leading-8 text-blue-500">
              404
            </p>
            <h1
              className={clsx(
                "mt-4 text-3xl font-semibold tracking-tight text-foreground",
                "sm:text-5xl",
              )}
            >
              Page not found
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground">
              Sorry, we couldn’t find the page you’re looking for.
            </p>
            <div className="mt-10">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={clsx(
                  "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                  "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                )}
              >
                ← Go back
              </button>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer
          className={clsx(
            "self-end",
            "lg:col-span-2 lg:col-start-1 lg:row-start-3",
          )}
        >
          <div className="border-t border-border bg-muted/50 py-10">
            <nav
              className={clsx(
                "mx-auto flex w-full max-w-7xl items-center gap-x-4 px-6 text-sm leading-7 text-muted-foreground",
                "lg:px-8",
              )}
            >
              {contacts.map(({ link, label }) => (
                <div key={label}>
                  <a href={link}>{label}</a>
                  <svg
                    viewBox="0 0 2 2"
                    aria-hidden="true"
                    className="h-0.5 w-0.5 fill-muted-foreground"
                  >
                    <circle cx="1" cy="1" r="1"></circle>
                  </svg>
                </div>
              ))}
            </nav>
          </div>
        </footer>

        {/* BACKGROUND IMAGE */}
        <div
          className={clsx(
            "relative hidden overflow-clip",
            "lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block",
          )}
        >
          <img
            src="/assets/overwatch-2/banner.png"
            className={clsx(
              "absolute inset-0 hidden h-full w-full object-cover",
              "dark:block",
            )}
          />
          <img
            src="/assets/overwatch-2/banner.png"
            className={clsx(
              "absolute inset-0 h-full w-full object-cover saturate-0",
              "dark:hidden",
            )}
          />
          <div className="absolute inset-0 -m-5 bg-gradient-to-tl from-background to-background/50" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
