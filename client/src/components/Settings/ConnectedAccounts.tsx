import React, { useMemo, useState } from "react";
import { SocialMediaProps, socailMedia } from "../../constants";
import { FaArrowUpRightFromSquare, FaCheck, FaXmark } from "react-icons/fa6";
import { RiLinksFill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import Input from "../Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { updateUserSuccess } from "../../redux/user/userSlice";
import { ListSocialMedia } from "../../types";

const hasConnectedSocialMedia = (
  listSocialMedia?: ListSocialMedia[],
  title?: string,
) => {
  if (listSocialMedia && title) {
    return listSocialMedia.find((social) => social.type === title);
  }
  return false;
};

const SocailWidget: React.FC<SocialMediaProps> = ({
  icon: Icon,
  title,
  color,
}) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  console.log("user", currentUser);
  const [openModal, setOpenModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      link: "",
      username: null,
      password: "",
      code: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const res = await fetch(
      `/api/user/connect-social-media/${currentUser?._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: title,
          ...form,
        }),
      },
    );
    const data = await res.json();
    if (data.success === false) {
      toast.error("That bai");
      return;
    }
    dispatch(updateUserSuccess(data));
    toast.success("Tao thanh cong");
    setOpenModal(false);
    reset();
  };

  const regexInputLink = useMemo(() => {
    switch (title) {
      case "Google":
        return /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/;
      case "Steam":
        return /(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+/;
      case "Facebook":
        return /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w-]*)?/;
      case "Twitch":
        return /(?:https?:\/\/)?twitch\.tv\/[a-zA-Z0-9]+/;
      default:
        return /[a-zA-Z0-9]/;
    }
  }, [title]);

  return (
    <div className="flex w-full items-center justify-between border-t border-border/50 px-4 py-6 sm:col-span-1 sm:px-0">
      <div className="flex items-center">
        <div
          className="flex w-12 items-center justify-center rounded-md px-2.5 py-2.5"
          style={{ backgroundColor: color }}
        >
          {Icon && <Icon className="text-[18px] text-white" />}
        </div>
        <div className="ml-2.5 truncate">
          <div className="truncate text-sm font-medium text-foreground">
            {title}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {hasConnectedSocialMedia(currentUser?.social_media, title)
              ? "Connected"
              : `Connect your ${title} account Connected`}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <Dialog.Root
          open={openModal}
          onOpenChange={(value) => setOpenModal(value)}
        >
          <Dialog.Trigger>
            {hasConnectedSocialMedia(currentUser?.social_media, title) ? (
              <button
                type="button"
                className="relative flex items-center justify-center gap-x-2 overflow-hidden whitespace-nowrap rounded-md bg-transparent px-4 py-2 text-xs font-medium text-danger-light-foreground outline-none transition-colors hover:bg-danger-light focus:outline focus:outline-offset-2 focus:outline-danger focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
              >
                <IoMdSettings />
                Edit
              </button>
            ) : (
              <button
                type="button"
                className="relative flex items-center justify-center gap-x-2 overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 !text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50"
              >
                <RiLinksFill />
                Connect
              </button>
            )}
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-background/80" />
            <Dialog.Content
              className={clsx(
                "min-h fixed top-1/2 z-40 mx-auto min-h-fit w-full -translate-y-1/2 overflow-clip rounded-xl bg-card text-left shadow-xl outline-none transition-all",
                "focus:outline-none ",
                "sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2",
              )}
            >
              {/* HEADER */}
              <div
                className={clsx(
                  "flex items-center justify-between px-6 pb-0 pt-6",
                  "sm:pt-5",
                )}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div
                      className="gradient-red flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-sm text-white ring-2"
                      style={{ backgroundColor: color }}
                    >
                      {Icon && <Icon className="text-[18px] text-white" />}
                    </div>
                  </div>
                  <Dialog.Title className="font-display text-lg font-medium leading-6 text-foreground">
                    Connect Account
                  </Dialog.Title>
                </div>
                <Dialog.Close>
                  <button
                    type="button"
                    className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary-light text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-9 sm:w-9"
                  >
                    <span className="sr-only">Close</span>
                    <FaXmark className="flex h-5 w-5 items-center justify-center" />
                  </button>
                </Dialog.Close>
              </div>

              {/* CONTENT */}
              {title === "Discord" ? (
                <div className="flex gap-x-5 p-6">
                  <Input
                    label="username"
                    register={register}
                    errors={errors}
                    style="h-9"
                    id="username"
                    placeholder="username"
                    required
                  />
                  <Input
                    label="code"
                    register={register}
                    errors={errors}
                    style="h-9"
                    id="code"
                    placeholder="code"
                    required
                  />
                </div>
              ) : (
                <div className="p-6">
                  <Input
                    label={`${title} link`}
                    register={register}
                    errors={errors}
                    style="h-9"
                    id="link"
                    placeholder={`${title} link`}
                    rules={{
                      pattern: regexInputLink,
                    }}
                    required
                  />
                </div>
              )}

              {/* FOOTER */}
              <div
                className={clsx(
                  "flex flex-row-reverse items-center gap-2 border-t border-border bg-muted/50 px-6 py-6",
                  "sm:gap-3 sm:rounded-b-xl sm:px-6 sm:py-4",
                )}
              >
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className={clsx(
                    "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <FaCheck className="mr-2" />
                  Apply
                </button>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className={clsx(
                      "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                      "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                    )}
                  >
                    Cancel
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

const ConnectedAccounts = () => {
  return (
    <div className="-mx-4 max-w-2xl border border-border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
      <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          Connected Accounts
        </h3>
      </div>
      <div className="px-0 pt-0 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-1">
          {socailMedia.map(({ icon, title, subtitle, color }) => (
            <SocailWidget
              key={subtitle}
              icon={icon}
              title={title}
              color={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectedAccounts;
