import React, { useEffect, useMemo, useState } from "react";
import { SocialMediaProps, socialMedia } from "../../constants";
import { FaCheck, FaXmark } from "react-icons/fa6";
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
import { axiosAuth } from "../../axiosAuth";
import SEO from "../SEO";
import { Button, CloseButton, DangerButton } from "../Buttons/Button";

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
  const [openModal, setOpenModal] = useState(false);

  const socialMediaType = currentUser?.social_media?.find(
    (social) => social.type === title,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      link: socialMediaType?.link,
      username: socialMediaType?.username,
      code: socialMediaType?.code,
    },
  });

  useEffect(() => {
    if (currentUser) {
      setValue("link", socialMediaType?.link || "");
      setValue("username", socialMediaType?.username || "");
      setValue("code", socialMediaType?.code || "");
    }
  }, [currentUser, setValue, socialMediaType]);

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { data } = await axiosAuth.post(
      `/user/connect-social-media/${currentUser?._id}`,
      {
        type: title,
        ...form,
      },
    );

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
              : `Connect your ${title}`}
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
              <DangerButton className="gap-x-2">
                <IoMdSettings />
                Edit
              </DangerButton>
            ) : (
              <Button
                color="light"
                className="gap-x-2 rounded-md px-4 py-2 text-xs font-medium shadow-sm"
              >
                <RiLinksFill />
                Connect
              </Button>
            )}
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-30 bg-background/80" />
            <Dialog.Content
              className={clsx(
                "min-h fixed top-1/2 z-30 mx-auto min-h-fit w-full -translate-y-1/2 overflow-clip rounded-xl bg-card text-left shadow-xl outline-none transition-all",
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
                  <CloseButton>
                    <FaXmark className="flex h-5 w-5 items-center justify-center" />
                  </CloseButton>
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
                    rules={{
                      maxLength: 24,
                    }}
                    placeholder="username"
                    required
                  />
                  <Input
                    label="code"
                    register={register}
                    errors={errors}
                    style="h-9"
                    id="code"
                    rules={{ pattern: /^[0-9]+$/, maxLength: 24 }}
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
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="rounded-md px-4 py-2 text-sm font-medium shadow-sm"
                >
                  <FaCheck className="mr-2" />
                  Apply
                </Button>
                <Dialog.Close asChild>
                  <Button
                    color="light"
                    className="rounded-md px-4 py-2 text-sm font-medium shadow-sm"
                  >
                    Cancel
                  </Button>
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
    <>
      <SEO
        title="Connected Accounts"
        description="Connected Accounts"
        href="/dashboard/settings"
      />

      <div className="-mx-4 max-w-2xl border border-border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
        <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            Connected Accounts
          </h3>
        </div>
        <div className="px-0 pt-0 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-1">
            {socialMedia.map(({ icon, title, subtitle, color }) => (
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
    </>
  );
};

export default ConnectedAccounts;
