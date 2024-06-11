import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Tabs from "@radix-ui/react-tabs";
import "react-tabs/style/react-tabs.css";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { HiMiniRectangleStack } from "react-icons/hi2";
import { FaLink, FaPassport, FaXmark } from "react-icons/fa6";
import { FaSave, FaUserEdit } from "react-icons/fa";

import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import { RootState } from "../../redux/store";
import { useGetUserById } from "../../hooks/useGetUserById";
import UserPage from "../../components/Layouts/UserPage";
import General from "../../components/Settings/General";
import IDVerification from "../../components/Settings/IDVerification";
import UploadImage from "../../components/UploadImage";
import Input from "../../components/Input";
import ConnectedAccounts from "../../components/Settings/ConnectedAccounts";
import Loading from "../Loading";
import { axiosAuth } from "../../axiosAuth";
import SEO from "../../components/SEO";

const tabHeaders = [
  {
    label: "General",
    value: "general",
    icon: HiMiniRectangleStack,
  },
  {
    label: "Connected Accounts",
    value: "connected-accounts",
    icon: FaLink,
  },
  {
    label: "ID Verification",
    value: "id-verification",
    icon: FaPassport,
  },
];

const Settings = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const user = useGetUserById(currentUser?._id);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<string>("general");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const [avatarImage, setAvatarImage] = useState<string | null>(null);

  const [error, setError] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      username: user?.username,
      email: user?.email,
      old_password: "",
      new_password: "",
    },
  });

  useEffect(() => {
    if (user) {
      setLoading(false);
      setValue("username", user.username || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    try {
      dispatch(updateUserStart());
      const { data } = await axiosAuth.post(
        `/user/update/${currentUser?._id}`,
        { ...form, profile_picture: avatarImage },
      );

      if (data.message === "Wrong old password") {
        setError("Wrong old password");
        return;
      }

      if (data.success === false) {
        return;
      }

      dispatch(updateUserSuccess(data));
      toast.success("User updated successfully");
      reset({
        username: data.username,
        email: data.email,
      });
      setOpenModal(false);
    } catch (error) {
      dispatch(updateUserFailure("Update user failed"));
      toast.error("Update user failed");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <SEO
        title="Account Settings"
        description="Account Settings"
        href="/dashboard/settings"
      />

      <UserPage>
        <div className="container">
          <div>
            <div className="w-full">
              {/* HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-y-4">
                <div className="min-w-fit flex-1 flex-grow md:min-w-0">
                  <div className="flex flex-wrap items-center gap-y-4">
                    <div className="mr-5 flex-shrink-0">
                      <div className="relative">
                        <div className="relative block h-12 w-12 shrink-0 rounded-full text-xl sm:h-16 sm:w-16">
                          <img
                            src={currentUser?.profile_picture}
                            className="h-full w-full rounded-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-card" />
                        </div>
                      </div>
                    </div>
                    <div className="pt-1.5 sm:truncate">
                      <h1 className="font-display flex flex-wrap items-center text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                        {currentUser?.username}
                      </h1>
                      <p className="text-sm font-medium text-muted-foreground sm:truncate">
                        <div className="inline-flex flex-wrap items-center gap-1">
                          <div className="lowercase">
                            @{currentUser?.username}
                          </div>
                          {/* <span> ⸱ </span>
                        <div>9 boosts</div>
                        <span> ⸱ </span>
                        <div>0 accounts</div> */}
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 sm:justify-normal md:ml-4 md:mt-0">
                  <Dialog.Root
                    open={openModal}
                    onOpenChange={(value) => setOpenModal(value)}
                  >
                    <Dialog.Trigger>
                      <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                        <FaUserEdit className="mr-2" />
                        Edit Profile
                      </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
                      <Dialog.Content className="data-[state=closed]:animate-slideover-close data-[state=open]:animate-slideover-show fixed right-0 top-0 z-40 mx-auto h-[100dvh] w-full overflow-auto rounded-none bg-card-alt text-left shadow-xl outline-none transition-all focus:outline-none sm:max-w-lg sm:rounded-l-xl md:right-3 md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-xl">
                        <div className="flex h-full flex-col">
                          {/* HEADER */}
                          <div className="border-b border-border px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between">
                              <Dialog.Title className="font-display text-lg font-medium leading-6 text-foreground">
                                Edit Your Profile
                              </Dialog.Title>
                              <Dialog.Close className="ml-3 flex h-7 items-center">
                                <button
                                  onClick={() => reset()}
                                  type="button"
                                  className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-transparent p-1 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
                                >
                                  <span className="sr-only">Close</span>
                                  <FaXmark className="flex items-center justify-center" />
                                </button>
                              </Dialog.Close>
                            </div>
                          </div>

                          {/* CONTENT */}
                          <div className="scroll-md relative flex-1 overflow-y-auto px-4 pt-6 sm:px-6">
                            <form className="flex flex-col gap-5 pb-20 sm:grid sm:grid-cols-2 sm:pb-10">
                              {/* USERNAME */}
                              <Input
                                label="Username"
                                register={register}
                                errors={errors}
                                style="h-9"
                                id="username"
                                placeholder="Enter your username"
                              />

                              {/* EMAIL */}
                              <div className="col-span-full">
                                <Input
                                  label="Email"
                                  register={register}
                                  errors={errors}
                                  style="h-9"
                                  id="email"
                                  disabled
                                  placeholder="Enter your email"
                                />
                                <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-xs">
                                  Please contact support if you need to change
                                  your email.
                                </p>
                              </div>

                              {/* AVATAR */}
                              <div className="col-span-full">
                                <label className="mb-1 block text-sm font-medium leading-6 text-foreground/90">
                                  Avatar
                                </label>
                                <UploadImage onChangeImage={setAvatarImage} />
                              </div>

                              {/* PASSWORD */}
                              <div className="col-span-full flex flex-col gap-2">
                                <p className="text-sm leading-6 text-muted-foreground">
                                  Please enter your old password to change your
                                  password.
                                </p>
                                <Input
                                  label="Old Password"
                                  register={register}
                                  errors={errors}
                                  style="h-9"
                                  id="old_password"
                                  type="password"
                                  placeholder="Enter your old password"
                                  failure={error}
                                />
                                <Input
                                  label="New Password"
                                  rules={{
                                    pattern:
                                      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                                  }}
                                  register={register}
                                  errors={errors}
                                  style="h-9"
                                  id="new_password"
                                  type="password"
                                  placeholder="Enter your new password"
                                />
                              </div>
                            </form>
                          </div>

                          {/* FOOTER */}
                          <div className="flex flex-shrink-0 flex-row-reverse gap-3 rounded-b-xl border-t border-border bg-card-surface px-4 py-4">
                            <button
                              type="submit"
                              onClick={handleSubmit(onSubmit)}
                              className="relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:py-2.5"
                            >
                              <FaSave className="mr-2" />
                              Save changes
                            </button>
                            <Dialog.Close>
                              <button
                                onClick={() => reset()}
                                type="button"
                                className="relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                              >
                                Cancel
                              </button>
                            </Dialog.Close>
                          </div>
                        </div>
                      </Dialog.Content>
                    </Dialog.Portal>
                  </Dialog.Root>
                </div>
              </div>

              {/* TABS */}
              <Tabs.Root className="mt-5" defaultValue="general">
                <Tabs.List className="relative flex w-full gap-x-2 pb-6">
                  {tabHeaders.map((header) => (
                    <Tabs.Trigger
                      key={header.value}
                      value={header.value}
                      className={
                        activeTab === header.value
                          ? "active-tab flex h-10 flex-shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium"
                          : "flex h-10 flex-shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                      onClick={() => handleTabChange(header.value)}
                    >
                      <header.icon className="mr-1.5 inline-block opacity-100" />
                      {header.label}
                    </Tabs.Trigger>
                  ))}
                </Tabs.List>
                <Tabs.Content value="general">
                  <General />
                </Tabs.Content>
                <Tabs.Content value="connected-accounts">
                  <ConnectedAccounts />
                </Tabs.Content>
                <Tabs.Content value="id-verification">
                  <IDVerification />
                </Tabs.Content>
              </Tabs.Root>
            </div>
          </div>
        </div>
      </UserPage>
    </>
  );
};

export default Settings;
