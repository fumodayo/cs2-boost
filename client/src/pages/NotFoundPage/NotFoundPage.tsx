import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Helmet, Logo } from "~/components/shared";
import PATH from "~/constants/path";
import { IconDot } from "~/icons";
import { Button } from "~/components/shared/Button";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet title="CS2Boost - Not Found" />
      <div className="h-screen bg-background">
        <div className="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] lg:grid-cols-[max(50%,36rem),1fr]">
          <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
            <Logo />
          </header>
          <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
            <div className="max-w-lg">
              <p className="text-base font-semibold leading-8 text-blue-500">
                404
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {t("NotFoundPage.title")}
              </h1>
              <p className="mt-6 text-base leading-7 text-muted-foreground">
                {t("NotFoundPage.subtitle")}
              </p>
            </div>
            <div className="mt-10">
              <Link to={PATH.DEFAULT.HOME}>
                <Button
                  variant="secondary"
                  className="rounded-md px-4 py-2 text-sm"
                >
                  {` ← ${t("Globals.Go Back")} `}
                </Button>
              </Link>
            </div>
          </main>
          <footer className="self-end lg:col-span-2 lg:col-start-1 lg:row-start-3">
            <div className="border-t border-border bg-muted/50 py-10">
              <nav className="mx-auto flex w-full max-w-7xl items-center gap-x-4 px-6 text-sm leading-7 text-muted-foreground lg:px-8">
                <Link to={PATH.DEFAULT.HOME}>Contact 24/7</Link>
                <IconDot />
                <Link to={PATH.DEFAULT.HOME}>Status</Link>
                <IconDot />
                <Link to={PATH.DEFAULT.HOME}>Discord</Link>
              </nav>
            </div>
          </footer>
          <div className="relative hidden overflow-clip lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
            <img
              src="/assets/backgrounds/jinx-arcane.png"
              alt="banner"
              className="absolute inset-0 hidden h-full w-full object-cover dark:block"
            />
            <img
              src="/assets/backgrounds/jinx-arcane.png"
              alt="banner"
              className="absolute inset-0 block h-full w-full object-cover saturate-0 dark:hidden"
            />
            <div className="absolute inset-0 -m-5 bg-gradient-to-tl from-background to-background/50" />
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
