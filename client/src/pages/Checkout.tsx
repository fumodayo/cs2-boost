import { RadioGroup } from "@headlessui/react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";

import { useGetOrderById } from "../hooks/useGetOrderById";
import { formatMoney } from "../utils/formatMoney";
import RadioButton from "../components/Buttons/RadioButton";
import Avatar from "../components/Common/Avatar";
import Logo from "../components/Common/Logo";
import Input from "../components/Input";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "./Loading";
import { AppContext } from "../context/AppContext";
import { useExchangeMoney } from "../hooks/useExchangeMoney";
import { axiosAuth } from "../axiosAuth";

const modeOfPayment = [
  {
    image: "debit_cards",
    title: "Debit/Credit cards",
    subtitle: "We accept all major debit and credit cards",
    value: "debit_cards",
    available: true,
  },
  {
    image: "stripe-alt",
    title: "Debit/Credit cards (Stripe)",
    subtitle: "Alternative cards payment method",
    value: "stripe-alt",
    available: true,
  },
  {
    image: "apple_pay",
    title: "Apple Pay",
    value: "apple_pay",
    available: false,
  },
  {
    image: "google_pay",
    title: "Google Pay",
    value: "google_pay",
    available: false,
  },
  {
    image: "paysafe_card",
    title: "Paysafe Card",
    subtitle: "Prepaid card for online payments",
    value: "paysafe_card",
    available: false,
  },
  {
    image: "skrill",
    title: "Skrill",
    subtitle: "Skrill · Neteller · Rapid Transfer",
    value: "skrill",
    available: false,
  },
];

const Checkout = () => {
  const [mode, setMode] = useState("debit_cards");
  const { id } = useParams();
  const order = useGetOrderById(id);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currency } = useContext(AppContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      promo_code: "",
    },
  });

  const handleCheckout = async () => {
    const { data } = await axiosAuth.post(`/payment/create-payment`, order);
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const exchangeMoney = useExchangeMoney(order.price);

  const onSubmit: SubmitHandler<FieldValues> = () => {
    // console.log(data);
  };

  if (!order) {
    return <Loading />;
  }

  return (
    <main>
      <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-background lg:block" />
      <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-card lg:block" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <h4 className="sr-only">Checkout</h4>

        {/* DETAILS */}
        <section className="order-2 bg-card py-12 text-muted-foreground md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 className="sr-only">Order summary</h2>
            <dl>
              <dt className="text-sm font-medium">Amount due</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                {formatMoney(currency, exchangeMoney)}
              </dd>
            </dl>
            <ul className="divide-y divide-border text-sm font-medium">
              <li className="flex items-center space-x-4 py-6">
                <img
                  src={`/assets/counter-strike-2/logo/logo.png`}
                  alt="test"
                  className="h-12 w-12 flex-none rounded-md object-cover object-center"
                />
                <div className="flex-auto space-y-1">
                  <h3 className="capitalize text-foreground">
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
                  </h3>
                  <p>{order.type}</p>
                </div>
                <p className="flex-none text-base font-medium text-foreground">
                  {formatMoney(currency, exchangeMoney)}
                </p>
              </li>
            </ul>
            <dl className="space-y-6 border-t border-border pt-6 text-sm font-medium">
              <div className="flex items-end">
                <div className="w-full">
                  <div className="relative">
                    <Input
                      register={register}
                      errors={errors}
                      style="h-9"
                      id="promo_code"
                      placeholder="Discount Code"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  className="relative ml-1.5 inline-flex items-center justify-center overflow-hidden truncate whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-9"
                >
                  Apply
                </button>
              </div>
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(currency, exchangeMoney)}</dd>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between text-foreground">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {formatMoney(currency, exchangeMoney)}
                  </dd>
                </div>
              </div>
            </dl>
            <button
              onClick={handleCheckout}
              className="relative mt-4 inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:py-2.5"
            >
              Pay Now
              <FaArrowRight className="ml-2" />
            </button>
          </div>
        </section>

        {/* PAYMENT METHODS */}
        <section className="order-1 py-6 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:py-16 lg:pb-24 lg:pt-0">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 className="sr-only">Select payment processor</h2>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              {/* HEADING */}
              <div className="flex items-center justify-between">
                <Logo />

                {/* AVATAR */}
                <Avatar>
                  <button className="h-10 rounded-full ring-1 ring-accent focus:outline-none focus:ring-2 focus:ring-primary">
                    <div className="relative block h-10 w-10 shrink-0 rounded-full text-base">
                      <img
                        src={currentUser?.profile_picture}
                        alt="user"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <span className="sr-only">Open user menu for user</span>
                  </button>
                </Avatar>
              </div>

              {/* CONTENT */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground">
                  Pay with
                </h3>
                <RadioGroup
                  value={mode}
                  onChange={(value) => setMode(value)}
                  className="mt-2 flex flex-col gap-2 xl:flex-wrap"
                >
                  {modeOfPayment.map((item) => (
                    <RadioGroup.Option
                      key={item.value}
                      value={item.value}
                      disabled={!item.available}
                      className={({ checked }) =>
                        `relative flex w-full min-w-[80px] flex-grow cursor-pointer justify-between rounded-lg focus:outline-none sm:max-w-none sm:flex-grow-0 ${
                          checked
                            ? "bg-radio-hover px-6 py-4 text-start shadow-sm"
                            : "bg-radio/50 px-6 py-4 text-start hover:bg-radio"
                        } ${
                          item.available ? "" : "pointer-events-none opacity-40"
                        }`
                      }
                    >
                      {({ checked }) => (
                        <>
                          <span className="flex items-center">
                            <span className="mr-2 shrink-0 flex-grow-0 sm:mr-4">
                              <img
                                src={`/assets/payment-methods/${item.image}.png`}
                                alt={item.value}
                                className="h-10 w-10 shrink-0 object-contain"
                              />
                            </span>
                            <span className="flex max-w-[250px] flex-col truncate text-sm sm:max-w-lg">
                              <span className="text-base font-medium text-foreground">
                                {item.title}
                              </span>
                              <span className="text-muted-foreground">
                                <span className="block truncate sm:inline">
                                  {item.subtitle}
                                </span>
                              </span>
                            </span>
                          </span>
                          {/* RADIO BUTTON */}
                          <span className="mt-2 flex items-center justify-center text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                            <RadioButton checked={checked} />
                          </span>
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Checkout;
