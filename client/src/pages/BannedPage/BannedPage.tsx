import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Helmet, Logo } from "~/components/shared";
import { IconDot } from "~/icons";
import { RootState } from "~/redux/store";
import PATH from "~/constants/path";
import { Button } from "~/components/shared/Button";
import { getLocalStorage } from "~/utils/localStorage";
import { authService } from "~/services/auth.service";
import { signOut } from "~/redux/user/userSlice";
import getErrorMessage from "~/utils/errorHandler";
import toast from "react-hot-toast";

const BannedPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = async () => {
    try {
      const payload = {
        ip_location: getLocalStorage("ip_location", ""),
        id: currentUser?._id as string,
      };
      await authService.signout(payload);
      dispatch(signOut());
      navigate("/");
    } catch (err) {
      const error = getErrorMessage(err);
      toast.error(error);
    }
  };

  return (
    <>
      <Helmet title="CS2Boost - Account Banned" />
      <div className="h-screen bg-background">
        <div className="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] lg:grid-cols-[max(50%,36rem),1fr]">
          <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
            <Logo />
          </header>

          <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
            <div className="max-w-lg">
              <p className="text-base font-semibold leading-8 text-destructive">
                Account Suspended
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {t("BannedPage.title")}
              </h1>
              <p className="mt-6 text-base leading-7 text-muted-foreground">
                {t("BannedPage.subtitle")}
              </p>

              {currentUser?.ban_reason && (
                <div className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 p-4 text-left">
                  <h2 className="font-semibold text-destructive">
                    {t("BannedPage.reasonLabel")}:
                  </h2>
                  <p className="mt-2 text-sm text-foreground">
                    {currentUser.ban_reason}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10">
              <Button
                className="rounded-md px-4 py-2 text-sm"
                onClick={handleLogout}
              >
                {t("Globals.Logout")}
              </Button>
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
              src="/assets/games/genshin-impact/banner.png"
              alt="banner"
              className="absolute inset-0 hidden h-full w-full object-cover dark:block"
            />
            <img
              src="/assets/games/genshin-impact/banner.png"
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

export default BannedPage;
