import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FaArrowRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "~/axiosAuth";
import { Button, FormField, Helmet, Logo } from "~/components/shared";
import { authFailure, authStart, authSuccess } from "~/redux/admin/adminSlice";
import { RootState } from "~/redux/store";

const AdminLoginPage = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.admin);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
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
        const { data } = await axiosInstance.post(`/auth/admin/login`, {
          ...form,
        });
        console.log({ data });
        dispatch(authSuccess(data));
        reset();
        navigator("/admin/dashboard");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const { message } = err;
        dispatch(authFailure(message));
      }
    } else {
      return;
    }
  };

  const preventEnterKeySubmission = (
    e: React.KeyboardEvent<HTMLFormElement>,
  ) => {
    const target = e.target;
    if (e.key === "Enter" && target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Helmet title="CS2Boost - Login Admin" />
      <div className="h-screen bg-background">
        <div className="grid min-h-full grid-cols-1 grid-rows-[1fr,auto,1fr] lg:grid-cols-[max(50%,36rem),1fr]">
          <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
            <Logo />
          </header>
          <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
            <div className="max-w-lg">
              <form
                onSubmit={handleSubmit(onSubmit)}
                onKeyDown={preventEnterKeySubmission}
                className="space-y-4"
              >
                <h1 className="font-display mb-2 text-2xl font-semibold text-foreground">
                  Login as a Admin User
                </h1>
                <FormField
                  autoFocus
                  id="username"
                  placeholder="Username"
                  className="px-4 py-2.5"
                  register={register}
                  errors={errors}
                  errorMessage={error ?? undefined}
                />
                <FormField
                  id="password"
                  placeholder="Password"
                  className="mt-2 px-4 py-2.5"
                  type="password"
                  register={register}
                  errors={errors}
                  errorMessage={error ?? undefined}
                />
                <Button
                  disabled={loading}
                  variant="primary"
                  className="mt-4 w-full rounded-md px-5 py-3 text-sm sm:py-2.5"
                >
                  Login <FaArrowRight className="ml-2" />
                </Button>
              </form>
            </div>
          </main>
          <div className="relative hidden overflow-clip lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
            <img
              src="/assets/games/valorant/banner.png"
              alt="banner"
              className="absolute inset-0 hidden h-full w-full object-cover dark:block"
            />
            <img
              src="/assets/games/valorant/banner.png"
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

export default AdminLoginPage;
