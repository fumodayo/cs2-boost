import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import RadioButton from "../components/Buttons/RadioButton";
import Avatar from "../components/Common/Avatar";
import Logo from "../components/Common/Logo";
import Input from "../components/Input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { formatMoney } from "../utils/formatMoney";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrderById } from "../hooks/useGetOrderById";

const modeOfPayment = [
  {
    image: "debit_cards",
    title: "Debit/Credit cards",
    subtitle: "We accept all major debit and credit cards",
    value: "debit_cards",
  },
  {
    image: "apple_pay",
    title: "Apple Pay",
    value: "apple_pay",
  },
  {
    image: "google_pay",
    title: "Google Pay",
    value: "google_pay",
  },
  {
    image: "paysafe_card",
    title: "Paysafe Card",
    subtitle: "Prepaid card for online payments",
    value: "paysafe_card",
  },
  {
    image: "skrill",
    title: "Skrill",
    subtitle: "Skrill · Neteller · Rapid Transfer",
    value: "skrill",
  },
  {
    image: "stripe-alt",
    title: "Debit/Credit cards (Stripe)",
    subtitle: "Alternative cards payment method",
    value: "stripe-alt",
  },
];

const Checkout = () => {
  const [mode, setMode] = useState("debit_cards");
  const { id } = useParams();
  const order = useGetOrderById(id);
  const navigate = useNavigate();

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
    const res = await fetch(`/api/order/checkout/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success === false) {
      return;
    }
    navigate("/dashboard");
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // console.log(data);
  };

  if (!order) {
    return null;
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
                {formatMoney(order.currency, order.price)}
              </dd>
            </dl>
            <ul className="divide-y divide-border text-sm font-medium">
              <li className="flex items-center space-x-4 py-6">
                <img
                  src="https://cdn.gameboost.com/games/counter-strike-2/logo/card.svg"
                  alt="test"
                  className="h-12 w-12 flex-none rounded-md object-cover object-center"
                />
                <div className="flex-auto space-y-1">
                  <h3 className="capitalize text-foreground">
                    {order.title}

                    {order.start_rating && order.end_rating && (
                      <>
                        ({order.start_rating} → {order.end_rating})
                      </>
                    )}
                    {order.start_exp && order.end_exp && (
                      <>
                        ({order.start_exp} → {order.end_exp})
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
                  {formatMoney(order.currency, order.price)}
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
                  className="relative ml-1.5 inline-flex items-center justify-center overflow-hidden truncate whitespace-nowrap rounded-md bg-secondary px-4 py-2 !text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-9"
                >
                  Apply
                </button>
              </div>
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(order.currency, order.price)}</dd>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between text-foreground">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {formatMoney(order.currency, order.price)}
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
                        src="/src/assets/avatar.png"
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
                  className="mt-2 flex flex-wrap gap-2"
                >
                  {modeOfPayment.map((item) => (
                    <RadioGroup.Option
                      key={item.value}
                      value={item.value}
                      className={({ checked }) =>
                        `${
                          checked
                            ? "relative flex w-full max-w-[80px] flex-grow cursor-pointer justify-between rounded-lg bg-radio-hover px-6 py-4 text-start shadow-sm focus:outline-none sm:max-w-none sm:flex-grow-0"
                            : "relative flex w-full max-w-[80px] flex-grow cursor-pointer justify-between rounded-lg bg-radio/50 px-6 py-4 text-start hover:bg-radio focus:outline-none sm:max-w-none sm:flex-grow-0"
                        }`
                      }
                    >
                      {({ checked }) => (
                        <>
                          <span className="flex items-center">
                            <span className="mr-2 shrink-0 flex-grow-0 sm:mr-4">
                              <img
                                src={`/src/assets/payment-methods/${item.image}.png`}
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
