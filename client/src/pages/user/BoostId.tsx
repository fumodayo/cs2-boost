import UserPage from "../../components/UserPage";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import * as Popover from "@radix-ui/react-popover";
import {
  FaCalendarDay,
  FaCreditCard,
  FaEllipsisVertical,
  FaTags,
  FaXmark,
} from "react-icons/fa6";
import { BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import Copy from "../../components/Copy";
import Widget from "../../components/Widget";
import { FaUsers, FaFingerprint, FaPlus } from "react-icons/fa6";
import * as Dialog from "@radix-ui/react-dialog";

const BoostId = () => {
  const boostItem = {
    id: "17823",
    title: "Arena 2v2",
    game: "Counter Strike 2",
    type: "Premier",
    server: "US",
    startRating: 0,
    endRating: 10000,
    area: "United States",
    price: 15.2,
    status: "pending",
    startRank: "silver_1",
    endRank: "distinguished_master_guardian",
  };

  const headers = [
    "server",
    "start rating",
    "end rating",
    "start rank",
    "end rank",
  ];

  const boostOptions = ["live stream"];

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
      label: "No Discount",
      icon: FaTags,
    },
    {
      label: "Debit/Credit cards (Ecommpay)",
      icon: FaCreditCard,
    },
    {
      label: "Mar 9th, 2024 - 1:49 am",
      icon: FaCalendarDay,
    },
  ];

  return (
    <UserPage>
      {/* HEADER */}
      <div className="w-full">
        <div className="container relative !pb-0">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="min-w-fit flex-1 flex-grow md:min-w-0">
              <div className="flex flex-wrap items-center gap-y-4">
                <div className="mr-5 flex-shrink-0">
                  <div className="relative">
                    <div className="relative block h-12 w-12 shrink-0 rounded-lg text-xl sm:h-16 sm:w-16">
                      <img
                        src="https://cdn.gameboost.com/games/world-of-warcraft/logo/card.svg"
                        alt="logo"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* TITLE */}
                <div className="pt-1.5 sm:truncate">
                  <h1 className="font-display flex flex-wrap items-center text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                    Arena 2v2, 0-1400, US
                    <span className="ml-2 inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium tracking-normal text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      Pending
                    </span>
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground sm:truncate">
                    <div className="inline-flex flex-wrap items-center gap-1.5">
                      <a className="cursor-pointer">#{boostItem.id}</a>
                      <Copy text={boostItem.id} />
                      <span> ⸱ </span>
                      <div>{boostItem.title}</div>
                      <span> ⸱ </span>
                      <div>{boostItem.area}</div>
                      <span> ⸱ </span>
                      <div>{boostItem.price}</div>
                    </div>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 sm:justify-normal md:ml-4 md:mt-0">
              <a className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                <HiMiniRocketLaunch className="mr-2" />
                Complete Payment
              </a>
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-9 sm:w-9">
                    <span className="sr-only">Open actions menu</span>
                    <FaEllipsisVertical />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="backdrop-brightness-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-48 min-w-[8rem] overflow-hidden rounded-md border bg-popover/75 p-2 text-popover-foreground shadow-md ring-1 ring-border/10 backdrop-blur-lg">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      Boost Actions
                    </div>
                    <button className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors hover:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      <FaEdit className="mr-2 w-5 text-center text-muted-foreground" />
                      Edit Boost
                    </button>
                    <button className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-2 text-sm text-danger-light-foreground outline-none transition-colors hover:bg-danger-light focus:bg-danger-light focus:text-danger-light-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      <BsTrash className="mr-2 w-5 text-center text-danger-light-foreground" />
                      Delete Boost
                    </button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container relative space-y-4 lg:space-y-6">
        <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-y-5 xl:mx-0 xl:grid-cols-3 xl:gap-x-5">
          <div className="column-grid columns-1 space-y-4 md:columns-2 xl:col-start-3 xl:row-end-1 xl:columns-1 xl:space-y-6">
            {/* BOOSTER INFORMATION */}
            <div className="-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
              <div className="px-4 py-6 sm:px-6">
                <div className="text-center">
                  <FaUsers className="mx-auto" />
                  <h2 className="text-base font-medium leading-6 text-foreground">
                    No Boosters Found
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Once your order is paid, a booster will be assigned to your
                    order.
                  </p>
                </div>
              </div>
            </div>

            {/* LOGIN INFORMATION */}
            <div className="-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
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
              <div className="flex items-center border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-6">
                <Dialog.Root>
                  <Dialog.Trigger asChild>
                    <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                      <FaPlus className="mr-2" /> Add Logins
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
                              Add Account Logins
                            </Dialog.Title>
                            <Dialog.Close asChild>
                              <div className="ml-3 flex h-7 items-center">
                                <button className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-transparent p-1 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                                  <span className="sr-only">Close</span>
                                  <FaXmark className="flex items-center justify-center text-2xl" />
                                </button>
                              </div>
                            </Dialog.Close>
                          </div>
                        </div>

                        {/* CONTENT */}
                        <div className="scroll-md relative flex-1 overflow-y-auto px-4 pt-6 sm:px-6">
                          <div className="rounded-lg border border-border bg-accent px-3 py-2">
                            <div className="flex items-center">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-1.5 shadow-sm lg:h-14 lg:w-14">
                                <img
                                  src="https://cdn.gameboost.com/games/world-of-warcraft/logo/icon.svg"
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
                            <div className="w-full">
                              <div className="mb-1 flex justify-between">
                                <label className="block text-sm font-medium leading-6 text-foreground/90">
                                  Email
                                </label>
                              </div>
                              <div className="relative">
                                <input
                                  className="block w-full rounded-md border-0 bg-field py-1.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                                  placeholder="email"
                                />
                              </div>
                            </div>
                          </form>
                        </div>

                        {/* FOOTER */}
                        <div className="flex flex-shrink-0 flex-row-reverse gap-3 rounded-b-xl border-t border-border bg-card-surface px-4 py-4">
                          <button className="relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:w-auto sm:py-2.5">
                            <FaPlus className="mr-2" />
                            Add Account
                          </button>
                          <Dialog.Close>
                            <button className="relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:w-auto">
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

            {/* PAYMENT */}
            <div className="-mx-4 border border-border/50 bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
              <div className="flex flex-row items-center justify-between space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <h3 className="font-sans mt-1 text-base font-semibold text-card-surface-foreground">
                    €15,20
                  </h3>
                </div>
                <span className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                  Unpaid
                </span>
              </div>
              <div className="px-0 pt-0 sm:px-6">
                <div className="grid grid-cols-2 gap-y-4 py-6 lg:grid-cols-3">
                  {paymentItems.map((payment) => (
                    <div className="col-span-3 flex w-full flex-none items-center gap-x-4 px-4 sm:col-span-3 sm:px-0">
                      <dt className="w-5 flex-none text-center">
                        <span className="sr-only">{payment.label}</span>
                        <payment.icon className="text-muted-foreground" />
                      </dt>
                      <dd className="text-sm leading-6 text-muted-foreground">
                        {payment.label}
                      </dd>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center border-t border-border bg-muted/50 px-4 py-3 sm:rounded-b-xl sm:px-6">
                <a className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-transparent px-2 py-1.5 text-xs font-medium text-success-light-foreground outline-none transition-colors hover:bg-success-light focus:outline focus:outline-offset-2 focus:outline-success focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                  Pay Now →
                </a>
              </div>
            </div>
          </div>

          <div className="row-start-1 space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:space-y-6">
            <Widget
              titleHeader="Boost Data"
              headers={headers}
              boostItem={boostItem}
            />
            <Widget titleHeader="Boost Options" boostOptions={boostOptions} />
            <Widget
              titleHeader="Boost Information"
              headers={headerInformation}
              boostItem={boostItem}
            />
          </div>
        </div>
      </div>
    </UserPage>
  );
};

export default BoostId;
