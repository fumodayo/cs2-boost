import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { FaArrowRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FormField, Helmet, Logo } from "~/components/ui";
import { Button } from "~/components/ui/Button";
import { RootState } from "~/redux/store";
import { authFailure, authStart, authSuccess } from "~/redux/user/userSlice";
import { authService } from "~/services/auth.service";
import getErrorMessage from "~/utils/errorHandler";

const AdminLoginPage = () => {
  const { t } = useTranslation(["auth", "common"]);

  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onBlur",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { username, password } = form;
    if (username && password) {
      try {
        dispatch(authStart());
        const data = await authService.loginWithAdmin({
          username,
          password,
        });
        dispatch(authSuccess(data));
        reset();
        navigator("/admin/dashboard");
      } catch (err) {
        const message = getErrorMessage(err);
        dispatch(authFailure(message));
      }
    } else {
      return;
    }
  };

  return (
    <>
      <Helmet title="admin_login_page" />
      <div className="h-screen bg-background text-foreground">
        <div className="grid min-h-full grid-cols-1 lg:grid-cols-2">
          {/* Left Panel - Form */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16">
            <header className="mx-auto w-full max-w-md">
              <Logo />
            </header>

            <main className="flex flex-1 items-center justify-center">
              <div className="w-full max-w-md space-y-6 rounded-2xl bg-card p-8 shadow-lg">
                <h1 className="font-display text-3xl font-bold">
                  {t("admin_login.title")}
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    disabled={loading}
                    autoFocus
                    id="username"
                    placeholder={t("labels.username")}
                    className="px-4 py-3"
                    register={register}
                    errors={errors}
                    errorMessage={error ?? undefined}
                  />
                  <FormField
                    disabled={loading}
                    id="password"
                    placeholder={t("labels.password")}
                    type="password"
                    className="px-4 py-3"
                    register={register}
                    errors={errors}
                    errorMessage={error ?? undefined}
                  />
                  <Button
                    disabled={loading}
                    variant="primary"
                    className="mt-4 w-full rounded-md px-5 py-3 text-sm font-medium"
                  >
                    {t("admin_login.login_button")}{" "}
                    <FaArrowRight className="ml-2" />
                  </Button>
                </form>
              </div>
            </main>

            <footer className="mx-auto w-full max-w-md pt-6 text-center text-sm text-muted-foreground">
              <div className="flex flex-col">
                <p className="mb-0.5 text-sm font-medium text-muted-foreground">
                  {t("common:footer.copyright", {
                    year: new Date().getFullYear(),
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  <Trans
                    i18nKey="common:footer.clone_by"
                    t={t}
                    components={{ b: <b /> }}
                  />
                </p>
              </div>
            </footer>
          </div>

          {/* Right Panel - Banner */}
          <div className="relative hidden lg:block">
            <img
              src="/assets/games/valorant/banner.png"
              alt="banner"
              className="absolute inset-0 h-full w-full object-cover saturate-0 dark:saturate-100"
            />
            <div className="absolute inset-0 bg-gradient-to-tl from-background to-background/50" />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;