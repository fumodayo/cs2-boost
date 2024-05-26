import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import * as Popover from "@radix-ui/react-popover";
import * as Dialog from "@radix-ui/react-dialog";
import { useNavigate, useParams } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";

import UserPage from "../../components/Layouts/UserPage";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import {
  FaArrowRight,
  FaCalendarDay,
  FaCircleCheck,
  FaCreditCard,
  FaEllipsisVertical,
  FaSquareCheck,
  FaTags,
  FaXmark,
} from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FaUsers, FaFingerprint, FaPlus } from "react-icons/fa6";

import { formatMoney } from "../../utils/formatMoney";
import {
  Account,
  Conversation as ConversationType,
  Order,
  User,
} from "../../types";
import { useGetOrderById } from "../../hooks/useGetOrderById";
import { RootState } from "../../redux/store";
import { selectedConversation } from "../../redux/conversation/conversationSlice";
import { useSocketContext } from "../../context/SocketContext";
import Conversation from "../../components/Messages/Conversation";
import Copy from "../../components/Common/Copy";
import Widget from "../../components/Widget";
import Input from "../../components/Input";
import { toast } from "react-toastify";
import { HiCursorClick } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const AccountField = ({ label, value }: { label?: string; value?: string }) => {
  return (
    <div
      className={clsx(
        "border-t border-border/50 px-4 py-6",
        "sm:col-span-3 sm:grid sm:grid-cols-3 sm:px-0",
      )}
    >
      <dt className="text-sm font-medium capitalize text-foreground">
        {label}
      </dt>

      <dd
        className={clsx(
          "mt-1 flex items-center gap-x-2 text-sm leading-6 text-muted-foreground",
          "sm:col-span-2 sm:mt-0",
        )}
      >
        {label === "password" ? "******" : value} <Copy text={value} />
      </dd>
    </div>
  );
};

const AccountWidget = ({ order }: { order: Order }) => {
  const { username, password, backup_code, _id } = order.account as Account;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: username,
      password: password,
      backup_code: backup_code,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { username, password, backup_code } = data;

    await fetch("/api/account/edit-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account_id: _id,
        username: username,
        password: password,
        backup_code: backup_code,
      }),
    });

    location.reload();
  };

  return (
    <div
      className={clsx(
        "-mx-4 border border-border bg-card text-card-foreground shadow-sm",
        "sm:mx-0 sm:rounded-xl",
      )}
    >
      <div
        className={clsx(
          "flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6",
          "sm:rounded-t-xl sm:px-6",
        )}
      >
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          Account Credentials
        </h3>
      </div>
      <div className="px-0 pt-0 sm:px-6">
        <div className={clsx("grid grid-cols-2", "lg:grid-cols-3")}>
          <AccountField label="login" value={username} />
          <AccountField label="password" value={password} />
          <AccountField label="backup Code" value={backup_code} />
        </div>
      </div>
      <div
        className={clsx(
          "flex items-center border-t border-border bg-muted/50 px-4 py-3",
          "sm:rounded-b-xl sm:px-6",
        )}
      >
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className={clsx(
                "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors",
                "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <FaEdit className="mr-2" /> Edit Logins
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
            <Dialog.Content
              className={clsx(
                "fixed right-0 top-0 z-40 mx-auto h-[100dvh] w-full overflow-auto rounded-none bg-card-alt text-left shadow-xl outline-none transition-all focus:outline-none",
                "sm:max-w-lg sm:rounded-l-xl md:right-3 md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-xl",
              )}
            >
              <div className="flex h-full flex-col">
                {/* HEADER */}
                <div className="border-b border-border px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <Dialog.Title className="font-display text-lg font-medium leading-6 text-foreground">
                      Edit Account Logins
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          className={clsx(
                            "relative inline-flex h-8 w-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-transparent p-1 text-sm font-medium text-secondary-light-foreground outline-none transition-colors ",
                            "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                          )}
                        >
                          <span className="sr-only">Close</span>
                          <FaXmark className="flex items-center justify-center text-2xl" />
                        </button>
                      </div>
                    </Dialog.Close>
                  </div>
                </div>

                {/* CONTENT */}
                <div
                  className={clsx(
                    "scroll-md relative flex-1 overflow-y-auto px-4 pt-6",
                    "sm:px-6",
                  )}
                >
                  <div className="rounded-lg border border-border bg-accent px-3 py-2">
                    <div className="flex items-center">
                      <div
                        className={clsx(
                          "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-1.5 shadow-sm",
                          "lg:h-14 lg:w-14",
                        )}
                      >
                        <img
                          src={order.image}
                          alt={order.title}
                          className="h-8 w-8"
                        />
                      </div>
                      <div className="ml-2.5 truncate">
                        <div className="text-sm font-medium text-foreground">
                          {order.title}
                          {order.end_rating && (
                            <>
                              ({order.start_rating} → {order.end_rating})
                            </>
                          )}
                          {order.end_exp && (
                            <>
                              ({order.start_exp} exp → {order.end_exp} exp)
                            </>
                          )}
                          {order.start_rank && order.end_rank && (
                            <>
                              ({order.start_rank.replace("_", " ")} →{" "}
                              {order.end_rank.replace("_", " ")})
                            </>
                          )}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {order.type}
                        </div>
                      </div>
                    </div>
                  </div>
                  <form className="space-y-5 py-5">
                    <Input
                      id="username"
                      label="Username"
                      placeholder="someone..."
                      style="h-12"
                      required
                      register={register}
                      errors={errors}
                    />
                    <Input
                      id="password"
                      label="Password"
                      placeholder="password"
                      type="password"
                      style="h-12"
                      required
                      register={register}
                      errors={errors}
                    />
                    <div className="col-span-full">
                      <Input
                        id="backup_code"
                        label="Backup Code"
                        placeholder="backup code"
                        style="h-12"
                        required
                        register={register}
                        errors={errors}
                      />
                      <a
                        href="https://store.steampowered.com/twofactor/manage"
                        className={clsx(
                          "mt-1 text-sm leading-6 text-muted-foreground hover:underline",
                          "sm:text-xs",
                        )}
                      >
                        How to Generate Steam Guard Backup Codes ?
                      </a>
                    </div>
                  </form>
                </div>

                {/* FOOTER */}
                <div className="flex flex-shrink-0 flex-row-reverse gap-3 rounded-b-xl border-t border-border bg-card-surface px-4 py-4">
                  <button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    className={clsx(
                      "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors ",
                      "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:py-2.5",
                    )}
                  >
                    <FaEdit className="mr-2" />
                    Edit Account
                  </button>
                  <Dialog.Close>
                    <button
                      className={clsx(
                        "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                        "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:w-auto",
                      )}
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
  );
};

const BoosterWidget = ({ booster }: { booster: User }) => {
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(booster._id as string);

  return (
    <div
      className={clsx(
        "-mx-4 border border-border bg-card text-card-foreground shadow-sm",
        "sm:mx-0 sm:rounded-xl",
      )}
    >
      <div
        className={clsx(
          "flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6",
          "sm:rounded-t-xl sm:px-6",
        )}
      >
        <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
          Booster Information
        </h3>
      </div>
      <div className={clsx("px-4 py-2 pt-0", "sm:px-6 sm:py-5")}>
        <div className="flex flex-col items-center justify-center">
          <div className="flex-shrink-0">
            <div className="relative">
              <div
                className={clsx(
                  "relative block h-12 w-12 shrink-0 rounded-full text-xl",
                  "sm:h-16 sm:w-16",
                )}
              >
                <img
                  src={booster.profile_picture}
                  className="h-full w-full rounded-full object-cover"
                />
                <span
                  className={clsx(
                    isOnline ? "bg-green-400" : "bg-gray-400",
                    "absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-card",
                  )}
                />
              </div>
            </div>
          </div>
          <div
            className={clsx(
              "flex flex-col items-center gap-y-2 pt-1.5",
              "sm:truncate",
            )}
          >
            <h1
              className={clsx(
                "font-display flex flex-wrap items-center text-3xl font-semibold text-foreground",
                "sm:truncate sm:tracking-tight",
              )}
            >
              {booster.username}
            </h1>
            <p
              className={clsx(
                "text-sm font-medium text-muted-foreground",
                "sm:truncate",
              )}
            >
              <div className="inline-flex flex-wrap items-center gap-1">
                <div className="lowercase">#{booster.user_id}</div>
                {/* <span> ⸱ </span>
                <div>9 boosts</div>
                <span> ⸱ </span>
                <div>0 accounts</div> */}
              </div>
            </p>
            <a
              href={`/profile/${booster.user_id}`}
              className={clsx(
                "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors",
                "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <HiCursorClick className="mr-2" /> View Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const BoostId = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = useGetOrderById(id);

  dispatch(selectedConversation(order.conversation as ConversationType));

  let headers = [];

  if (order.type === "premier") {
    headers = ["server", "server", "start rating", "end rating"];
  } else if (order.type === "wingman") {
    headers = ["server", "start rank", "end rank"];
  } else if (order.type === "level farming") {
    headers = ["server", "start exp", "end exp"];
  }

  const headerInformation = [
    "title",
    "boost id",
    "status",
    "game",
    "type",
    "server",
    "price",
  ];

  const paymentItems = [
    {
      value: "discount",
      label: "No Discount",
      icon: FaTags,
    },
    {
      value: "credit_card",
      label: "Debit/Credit cards (Ecommpay)",
      icon: FaCreditCard,
    },
    {
      value: "created_at",
      label: "Mar 9th, 2024 - 1:49 am",
      icon: FaCalendarDay,
    },
  ];

  console.log(order);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      username: "",
      password: "",
      backup_code: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (form) => {
    const { username, password, backup_code } = form;
    const account = {
      order_id: id,
      username: username,
      password: password,
      backup_code: backup_code,
    };

    const res = await fetch("/api/account/create-account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });

    const data = await res.json();

    if (data.success === false) {
      toast.error("Create account failed");
      return;
    }

    toast.success("Create account successfully");
    location.reload();
  };

  const handleAcceptBoost = async () => {
    const res = await fetch(`/api/order/accept-order/${order.boost_id}`, {
      method: "POST",
    });

    const data = await res.json();

    if (data.success === false) {
      toast.error("Accept Boost failed");
      navigate("/dashboard/pending-boosts");
      return;
    }

    toast.success("Accept Boost");
    navigate("/dashboard/progress-boosts");
  };

  const handleComplete = async (boost_id: string) => {
    const res = await fetch(`/api/order/complete-order/${boost_id}`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success === false) {
      toast.error("Completed Boost failed");
      return;
    }

    toast.success("Completed Boost");
    navigate("/dashboard/progress-boosts");
  };

  const handleCancel = async (boost_id: string) => {
    const res = await fetch(`/api/order/cancel-order/${boost_id}`, {
      method: "POST",
    });

    const data = await res.json();
    if (data.success === false) {
      toast.error("Cancel Boost failed");
      return;
    }

    toast.success("Cancel Boost failed");
    navigate("/dashboard/progress-boosts");
  };

  return (
    <UserPage>
      {/* HEADER */}
      <div className="w-full">
        <div className="container relative !pb-0">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className={clsx("min-w-fit flex-1 flex-grow", "md:min-w-0")}>
              <div className="flex flex-wrap items-center gap-y-4">
                <div className="mr-5 flex-shrink-0">
                  <div className="relative">
                    <div
                      className={clsx(
                        "relative block h-12 w-12 shrink-0 rounded-lg text-xl",
                        "sm:h-16 sm:w-16",
                      )}
                    >
                      <img
                        src={order.image}
                        alt="logo"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* TITLE */}
                <div className={clsx("pt-1.5", "sm:truncate")}>
                  <h1
                    className={clsx(
                      "font-display flex flex-wrap items-center text-3xl font-semibold capitalize text-foreground",
                      "sm:truncate sm:tracking-tight",
                    )}
                  >
                    {order.title}
                    {order.end_rating && (
                      <>
                        ({order.start_rating} → {order.end_rating})
                      </>
                    )}
                    {order.end_exp && (
                      <>
                        ({order.start_exp} exp → {order.end_exp} exp)
                      </>
                    )}
                    {order.start_rank && order.end_rank && (
                      <>
                        ({order.start_rank.replace("_", " ")} →{" "}
                        {order.end_rank.replace("_", " ")})
                      </>
                    )}
                    <span className="ml-2 inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium tracking-normal text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      {order.status}
                    </span>
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground sm:truncate">
                    <div className="inline-flex flex-wrap items-center gap-1.5">
                      <a className="cursor-pointer">#{order.boost_id}</a>
                      <Copy text={order?.boost_id} />
                      <span> ⸱ </span>
                      <div>{order.title}</div>
                      <span> ⸱ </span>
                      <div>{order.server}</div>
                      <span> ⸱ </span>
                      <div>{formatMoney(order.currency, order.price)}</div>
                    </div>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:justify-normal md:ml-4 md:mt-0">
              {order.status === "pending" && (
                <a
                  href={`/checkout/${order.boost_id}`}
                  className={clsx(
                    "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
                    "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  <HiMiniRocketLaunch className="mr-2" />
                  Complete Payment
                </a>
              )}
              {currentUser?.role?.includes("booster") &&
                order.status === "in active" && (
                  <button
                    type="button"
                    onClick={handleAcceptBoost}
                    className={clsx(
                      "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
                      "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                    )}
                  >
                    <FaSquareCheck className="mr-2" />
                    Accept Boost
                  </button>
                )}
              {currentUser?.role?.includes("booster") &&
                order.status === "in progress" && (
                  <div className="flex gap-x-2">
                    <button
                      onClick={() => handleComplete(order.boost_id as string)}
                      type="button"
                      className={clsx(
                        "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-success px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
                        "hover:bg-success-hover focus:outline focus:outline-offset-2 focus:outline-success focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                      )}
                    >
                      <FaCircleCheck className="mr-1" />
                      Completed Boost
                    </button>
                    <button
                      onClick={() => handleCancel(order.boost_id as string)}
                      className={clsx(
                        "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-2 py-1 text-sm font-medium text-danger shadow-sm outline-none ring-1 ring-danger-ring transition-colors ",
                        "hover:bg-danger-hover hover:text-primary-foreground focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:py-2",
                      )}
                    >
                      <IoClose className="mr-1 text-xl" />
                      Cancel Boost
                    </button>
                  </div>
                )}
              {order.status === "pending" && (
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button
                      className={clsx(
                        "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                        "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                        "sm:h-9 sm:w-9",
                      )}
                    >
                      <span className="sr-only">Open actions menu</span>
                      <FaEllipsisVertical />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content
                      side="bottom"
                      align="end"
                      sideOffset={10}
                      className="backdrop-brightness-5 z-50 w-48 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                    >
                      <div className="px-2 py-1.5 text-sm font-medium">
                        Boost Actions
                      </div>
                      <button
                        className={clsx(
                          "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                          "hover:bg-accent focus:text-accent-foreground",
                        )}
                      >
                        <FaEdit className="mr-2 w-5 text-center text-muted-foreground" />
                        Edit Boost
                      </button>
                      <Dialog.Root>
                        <Dialog.Trigger>
                          <button
                            className={clsx(
                              "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors",
                              "hover:bg-danger-light focus:bg-danger-light focus:text-danger-light-foreground",
                            )}
                          >
                            <BsTrash className="mr-2 w-5 text-center text-danger-light-foreground" />
                            Delete Boost
                          </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
                          <Dialog.Content
                            className={clsx(
                              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200",
                              "sm:rounded-lg md:w-full",
                            )}
                          >
                            <div
                              className={clsx(
                                "flex flex-col space-y-2 text-center",
                                "sm:text-left",
                              )}
                            >
                              {/* CONTENT */}
                              <Dialog.Title className="text-lg font-semibold text-foreground">
                                Delete Boost
                              </Dialog.Title>
                              <Dialog.Description className="text-sm text-muted-foreground">
                                Are you sure you want to delete this boost?
                              </Dialog.Description>

                              {/* FOOTER */}
                              <div
                                className={clsx(
                                  "mt-3.5 flex flex-col space-y-2",
                                  "sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0",
                                )}
                              >
                                <Dialog.Close>
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
                                <button
                                  type="button"
                                  className={clsx(
                                    "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
                                    "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                                  )}
                                >
                                  Confirm <FaArrowRight className="ml-1" />
                                </button>
                              </div>
                            </div>
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container relative space-y-4 lg:space-y-6">
        <div
          className={clsx(
            "mx-auto grid grid-cols-1 grid-rows-1 items-start gap-y-5",
            "xl:mx-0 xl:grid-cols-3 xl:gap-x-5",
          )}
        >
          <div
            className={clsx(
              "column-grid columns-1 space-y-4",
              "md:columns-2 xl:col-start-3 xl:row-end-1 xl:columns-1 xl:space-y-6",
            )}
          >
            {/* BOOSTER INFORMATION */}
            {order.booster ? (
              <BoosterWidget booster={order.booster as User} />
            ) : (
              <div
                className={clsx(
                  "-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm",
                  "sm:mx-0 sm:rounded-xl",
                )}
              >
                <div className={clsx("px-4 py-6", "sm:px-6")}>
                  <div className="text-center">
                    <FaUsers className="mx-auto" />
                    <h2 className="text-base font-medium leading-6 text-foreground">
                      No Boosters Found
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Once your order is paid, a booster will be assigned to
                      your order.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* LOGIN INFORMATION */}
            {order.account ? (
              <AccountWidget order={order} />
            ) : (
              <div
                className={clsx(
                  "-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm",
                  "sm:mx-0 sm:rounded-xl",
                )}
              >
                <div className="px-0 py-6 sm:px-6">
                  <div className="text-center">
                    <FaFingerprint className="mx-auto" />
                    <h2 className="text-base font-medium leading-6 text-foreground">
                      No Logins Provided
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Click the button below to add the logins of your account.
                    </p>
                  </div>
                </div>
                <div
                  className={clsx(
                    "flex items-center border-t border-border bg-muted/50 px-4 py-3",
                    "sm:rounded-b-xl sm:px-6",
                  )}
                >
                  <Dialog.Root>
                    <Dialog.Trigger asChild>
                      <button
                        className={clsx(
                          "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors ",
                          "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                        )}
                      >
                        <FaPlus className="mr-2" /> Add Logins
                      </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                      <Dialog.Overlay className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />
                      <Dialog.Content
                        className={clsx(
                          "data-[state=closed]:animate-slideover-close data-[state=open]:animate-slideover-show fixed right-0 top-0 z-40 mx-auto h-[100dvh] w-full overflow-auto rounded-none bg-card-alt text-left shadow-xl outline-none transition-all focus:outline-none sm:max-w-lg sm:rounded-l-xl md:right-3 md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-xl",
                        )}
                      >
                        <div className="flex h-full flex-col">
                          {/* HEADER */}
                          <div className="border-b border-border px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between">
                              <Dialog.Title className="font-display text-lg font-medium leading-6 text-foreground">
                                Add Account Logins
                              </Dialog.Title>
                              <Dialog.Close asChild>
                                <div className="ml-3 flex h-7 items-center">
                                  <button
                                    className={clsx(
                                      "relative inline-flex h-8 w-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-transparent p-1 text-sm font-medium text-secondary-light-foreground outline-none transition-colors",
                                      "hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                                    )}
                                  >
                                    <span className="sr-only">Close</span>
                                    <FaXmark className="flex items-center justify-center text-2xl" />
                                  </button>
                                </div>
                              </Dialog.Close>
                            </div>
                          </div>

                          {/* CONTENT */}
                          <div
                            className={clsx(
                              "scroll-md relative flex-1 overflow-y-auto px-4 pt-6",
                              "sm:px-6",
                            )}
                          >
                            <div className="rounded-lg border border-border bg-accent px-3 py-2">
                              <div className="flex items-center">
                                <div
                                  className={clsx(
                                    "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-1.5 shadow-sm",
                                    "lg:h-14 lg:w-14",
                                  )}
                                >
                                  <img
                                    src="/src/assets/counter-strike-2/logo/logo.png"
                                    alt="Arena 2v2, 0->1400, US"
                                    className="h-8 w-8"
                                  />
                                </div>
                                <div className="ml-2.5 truncate">
                                  <div className="text-sm font-medium text-foreground">
                                    Arena 2v2, 0-1400, US
                                  </div>
                                  <div className="truncate text-xs text-muted-foreground">
                                    Arena 2v2
                                  </div>
                                </div>
                              </div>
                            </div>
                            <form className="space-y-5 py-5">
                              <Input
                                id="username"
                                label="Username"
                                placeholder="someone..."
                                style="h-12"
                                required
                                register={register}
                                errors={errors}
                              />
                              <Input
                                id="password"
                                label="Password"
                                placeholder="password"
                                type="password"
                                style="h-12"
                                required
                                register={register}
                                errors={errors}
                              />
                              <div className="col-span-full">
                                <Input
                                  id="backup_code"
                                  label="Backup Code"
                                  placeholder="backup code"
                                  style="h-12"
                                  required
                                  register={register}
                                  errors={errors}
                                />
                                <a
                                  href="https://store.steampowered.com/twofactor/manage"
                                  className={clsx(
                                    "mt-1 text-sm leading-6 text-muted-foreground hover:underline",
                                    "sm:text-xs",
                                  )}
                                >
                                  How to Generate Steam Guard Backup Codes ?
                                </a>
                              </div>
                            </form>
                          </div>

                          {/* FOOTER */}
                          <div className="flex flex-shrink-0 flex-row-reverse gap-3 rounded-b-xl border-t border-border bg-card-surface px-4 py-4">
                            <button
                              type="submit"
                              onClick={handleSubmit(onSubmit)}
                              className={clsx(
                                "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors ",
                                "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                                "sm:w-auto sm:py-2.5",
                              )}
                            >
                              <FaPlus className="mr-2" />
                              Add Account
                            </button>
                            <Dialog.Close>
                              <button
                                className={clsx(
                                  "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
                                  "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                                  "sm:w-auto",
                                )}
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
            )}

            {/* PAYMENT */}
            {order.status === "pending" && (
              <div
                className={clsx(
                  "-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm",
                  "sm:mx-0 sm:rounded-xl",
                )}
              >
                <div
                  className={clsx(
                    "flex flex-row items-center justify-between space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 ",
                    "sm:rounded-t-xl sm:px-6",
                  )}
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Amount
                    </p>
                    <h3 className="font-sans mt-1 text-base font-semibold text-card-surface-foreground">
                      {formatMoney(order.currency, order.price)}
                    </h3>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                    {order.status}
                  </span>
                </div>
                <div className={clsx("px-0 pt-0", "sm:px-6")}>
                  <div
                    className={clsx(
                      "grid grid-cols-2 gap-y-4 py-6",
                      "lg:grid-cols-3",
                    )}
                  >
                    {paymentItems.map((payment, idx) => (
                      <div
                        key={idx}
                        className={clsx(
                          "col-span-3 flex w-full flex-none items-center gap-x-4 px-4",
                          "sm:col-span-3 sm:px-0",
                        )}
                      >
                        <dt className="w-5 flex-none text-center">
                          <span className="sr-only">{payment.label}</span>
                          <payment.icon className="text-muted-foreground" />
                        </dt>
                        <dd className="text-sm leading-6 text-muted-foreground">
                          {order.createdAt && (
                            <span>
                              {payment.value === "created_at"
                                ? format(
                                    order.createdAt,
                                    "MMM do, yyyy - h:mm a",
                                  )
                                : payment.label}
                            </span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </div>
                </div>
                <div
                  className={clsx(
                    "flex items-center border-t border-border bg-muted/50 px-4 py-3",
                    "sm:rounded-b-xl sm:px-6",
                  )}
                >
                  <a
                    href={`/checkout/${order.boost_id}`}
                    className={clsx(
                      "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-success-light-foreground outline-none transition-colors ",
                      "hover:bg-success-light focus:outline focus:outline-offset-2 focus:outline-success focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
                    )}
                  >
                    Pay Now →
                  </a>
                </div>
              </div>
            )}
          </div>
          <div
            className={clsx(
              "row-start-1 space-y-4",
              "lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:space-y-6",
            )}
          >
            {/* CONVERSATION */}
            <Conversation order={order} />

            <Widget
              titleHeader="Boost Data"
              headers={headers}
              boostItem={order}
            />
            {order.options && order.options.length > 0 && (
              <Widget
                titleHeader="Boost Options"
                boostOptions={order.options}
              />
            )}
            <Widget
              titleHeader="Boost Information"
              headers={headerInformation}
              boostItem={order}
            />
          </div>
        </div>
      </div>
    </UserPage>
  );
};

export default BoostId;
