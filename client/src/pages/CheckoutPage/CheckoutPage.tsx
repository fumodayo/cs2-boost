import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa6";
import {
  Avatar,
  Helmet,
  Logo,
  Spinner,
  ErrorDisplay,
} from "~/components/shared";
import { ListPayment, RequestBooster } from "./component";
import { Button } from "~/components/shared/Button";
import { formatMoney } from "~/utils";
import { createPaymentUrl } from "~/services/payment.service";
import { IUser } from "~/types";
import { orderService } from "~/services/order.service";

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { id: boost_id } = useParams<{ id: string }>();

  const {
    data: order,
    error,
    isLoading,
  } = useSWR(boost_id ? `/order/${boost_id}` : null, () =>
    orderService.getOrderById(boost_id!),
  );

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!order?.price || !boost_id) return;

    try {
      setIsCheckingOut(true);
      const { success, data } = await createPaymentUrl({
        amountInput: order.price,
        contentPayment: boost_id,
        productTypeSelect: "other",
        langSelect: "vn",
      });

      if (success) {
        window.location.href = data;
      } else {
        toast.error("Could not create payment URL. Please try again.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong during checkout.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <ErrorDisplay message="The order you are looking for does not exist or could not be loaded." />
    );
  }

  const { price, title, type, game, assign_partner } = order;

  return (
    <>
      <Helmet
        title={`Buy ${type?.replace("_", " ").toLocaleLowerCase()} Boost ${title}`}
      />
      <div>
        <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-background lg:block" />
        <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-card lg:block" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
          <h4 className="sr-only">Checkout</h4>
          {/* PAYMENT METHODS */}
          <section
            id="section-one-heading"
            className="pb-6 pt-2.5 lg:mx-auto lg:w-full lg:max-w-lg lg:py-16 lg:pb-24 lg:pt-0"
          >
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="flex items-center justify-between">
                <Logo />
                <Avatar />
              </div>
              <ListPayment />
            </div>
          </section>

          {/* ORDER SUMMARY */}
          <section
            id="section-two-heading"
            className="bg-card py-12 text-muted-foreground md:px-10 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
          >
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <h2 className="sr-only">Order summary</h2>
              <dl>
                <dt className="text-sm font-medium">
                  {t("CheckoutPage.label.Amount due")}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  {formatMoney(price, "vnd")}
                </dd>
              </dl>
              <div className="divide-y divide-border text-sm font-medium">
                <div className="flex items-center space-x-4 py-6">
                  <img
                    className="h-12 w-12 flex-none rounded-md object-cover object-center"
                    src="/assets/games/counter-strike-2/logo.png"
                    alt="logo"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="text-foreground">{title}</h3>
                    <p className="capitalize">
                      {game?.replace("-", " ")} · {type?.replace("_", " ")}{" "}
                      Boost
                    </p>
                  </div>
                  <p className="flex-none text-base font-medium text-foreground">
                    {formatMoney(price, "vnd")}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <RequestBooster
                  orderId={order.boost_id}
                  initialAssignedPartner={assign_partner as IUser}
                />
              </div>

              <dl className="space-y-6 border-t border-border pt-6 text-sm font-medium">
                <div className="flex items-center justify-between text-foreground">
                  <dt className="text-base">{t("CheckoutPage.label.Total")}</dt>
                  <dd className="text-base">{formatMoney(price, "vnd")}</dd>
                </div>
              </dl>
              <Button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                variant="primary"
                className="blue-glow mt-4 hidden w-full rounded-lg bg-[#0B6CFB] px-5 py-3.5 text-base text-white ring-inset hover:brightness-110 focus:outline-primary dark:ring-1 dark:ring-[#1a13a1]/50 sm:flex sm:py-2.5"
              >
                {t("CheckoutPage.label.Pay Now")}
                <FaArrowRight className="ml-2" />
              </Button>
            </div>
            <div className="mt-4 bg-muted px-6 py-4">
              Since this is a demo product, you can find the bank account for
              testing payments
              <Link
                target="_blank"
                className="text-primary hover:underline"
                to={"https://sandbox.vnpayment.vn/apis/vnpay-demo/"}
              >
                {" "}
                here
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
