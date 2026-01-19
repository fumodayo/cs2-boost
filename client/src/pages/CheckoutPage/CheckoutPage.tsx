import { Trans, useTranslation } from "react-i18next";
import { Link, Navigate, useParams } from "react-router-dom";
import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { FaArrowRight, FaTag, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Avatar,
  Helmet,
  Logo,
  Spinner,
  ErrorDisplay,
  Input,
} from "~/components/ui";
import { ListPayment, RequestBooster } from "./component";
import { Button } from "~/components/ui/Button";
import { formatMoney } from "~/utils";
import { createPaymentUrl } from "~/services/payment.service";
import { IUser } from "~/types";
import { orderService } from "~/services/order.service";
import { RootState } from "~/redux/store";
import {
  promoCodeService,
  IValidatePromoResponse,
} from "~/services/promoCode.service";
import getErrorMessage from "~/utils/errorHandler";
const CheckoutPage = () => {
  const { t } = useTranslation(["checkout_page", "common", "promo_codes"]);
  const { id: boost_id } = useParams<{ id: string }>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const {
    data: order,
    error,
    isLoading,
  } = useSWR(boost_id ? `/order/${boost_id}` : null, () =>
    orderService.getOrderById(boost_id!),
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] =
    useState<IValidatePromoResponse | null>(null);
  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !order) return;
    try {
      setIsApplyingPromo(true);
      const response = await promoCodeService.validatePromoCode(
        promoCode,
        order.type,
        order.price,
      );
      if (response.success) {
        setAppliedPromo(response.data);
        toast.success(t("promo_codes:checkout.discount_applied"));
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      setAppliedPromo(null);
    } finally {
      setIsApplyingPromo(false);
    }
  };
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
  };
  const handleCheckout = async () => {
    if (!order?.price || !boost_id) return;
    const finalPrice = appliedPromo ? appliedPromo.finalPrice : order.price;
    try {
      setIsCheckingOut(true);
      if (finalPrice <= 0 && appliedPromo) {
        const result = await orderService.completeFreeOrder(
          boost_id,
          appliedPromo.code,
        );
        if (result.success) {
          toast.success(t("checkout_page:free_order_success"));
          window.location.href = "/orders/boosts";
        } else {
          toast.error(t("errors.checkout_failed"));
        }
        return;
      }
      const { success, data } = await createPaymentUrl({
        amountInput: finalPrice,
        contentPayment: boost_id,
        productTypeSelect: "other",
        langSelect: "vn",
      });
      if (success) {
        window.location.href = data;
      } else {
        toast.error(t("errors.create_payment_url_failed"));
      }
    } catch (e) {
      console.error(e);
      toast.error(t("errors.checkout_failed"));
    } finally {
      setIsCheckingOut(false);
    }
  };
  if (currentUser?.is_banned) {
    return <Navigate to="/banned" replace />;
  }
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  if (error || !order) {
    return <ErrorDisplay message={t("errors.no_order")} />;
  }
  const { price, title, type, game, assign_partner } = order;
  const finalPrice = appliedPromo ? appliedPromo.finalPrice : price;
  return (
    <>
      <Helmet title={title} isTranslate={false} />
      <div>
        <div className="fixed left-0 top-0 hidden h-full w-1/2 bg-background lg:block" />
        <div className="fixed right-0 top-0 hidden h-full w-1/2 bg-card lg:block" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
          <h4 className="sr-only">{t("sr_only.checkout")}</h4>
          {/* PAYMENT METHODS */}
          <section
            id="section-one-heading"
            className="pb-6 pt-2.5 lg:mx-auto lg:w-full lg:max-w-lg lg:py-16 lg:pb-24 lg:pt-0"
          >
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="flex items-center justify-between px-4 sm:px-0">
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
              <h2 className="sr-only">{t("sr_only.order_summary")}</h2>
              <dl>
                <dt className="text-sm font-medium">{t("amount_due")}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  {formatMoney(finalPrice, "vnd")}
                  {appliedPromo && (
                    <span className="ml-2 text-lg text-muted-foreground line-through">
                      {formatMoney(price, "vnd")}
                    </span>
                  )}
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
              {/* PROMO CODE SECTION */}
              <div className="border-t border-border py-4">
                <label className="mb-2 flex items-center text-sm font-medium text-foreground">
                  <FaTag className="mr-2 text-primary" />
                  {t("promo_codes:checkout.promo_code")}
                </label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-lg border border-green-500 bg-green-50 px-4 py-3 dark:bg-green-900/20">
                    <div>
                      <p className="font-semibold text-green-700 dark:text-green-400">
                        {appliedPromo.code}
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-500">
                        -{appliedPromo.discountPercent}% (
                        {formatMoney(appliedPromo.discountAmount, "vnd")})
                      </p>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:text-green-800 dark:text-green-400"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value.toUpperCase())
                      }
                      placeholder={t("promo_codes:form.code_placeholder")}
                      className="flex-1 uppercase"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyPromo}
                      disabled={isApplyingPromo || !promoCode.trim()}
                    >
                      {isApplyingPromo
                        ? t("promo_codes:checkout.applying")
                        : t("promo_codes:checkout.apply")}
                    </Button>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <RequestBooster
                  orderId={order.boost_id}
                  initialAssignedPartner={assign_partner as IUser}
                />
              </div>
              {/* PRICE BREAKDOWN */}
              <dl className="space-y-4 border-t border-border pt-6 text-sm font-medium">
                {appliedPromo && (
                  <>
                    <div className="flex items-center justify-between">
                      <dt>{t("promo_codes:checkout.original_price")}</dt>
                      <dd>{formatMoney(price, "vnd")}</dd>
                    </div>
                    <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                      <dt>{t("promo_codes:checkout.discount")}</dt>
                      <dd>
                        -{formatMoney(appliedPromo.discountAmount, "vnd")}
                      </dd>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between text-foreground">
                  <dt className="text-base">{t("total")}</dt>
                  <dd className="text-base">
                    {formatMoney(finalPrice, "vnd")}
                  </dd>
                </div>
              </dl>
              <Button
                disabled={isCheckingOut}
                onClick={handleCheckout}
                variant="primary"
                className="blue-glow mt-4 w-full rounded-lg bg-[#0B6CFB] px-5 py-3.5 text-base text-white ring-inset hover:brightness-110 focus:outline-primary dark:ring-1 dark:ring-[#1a13a1]/50 sm:flex sm:py-2.5"
              >
                {t("pay_now")}
                <FaArrowRight className="ml-2" />
              </Button>
            </div>
            <div className="mt-4 bg-muted px-6 py-4">
              <Trans
                i18nKey="demo_notice"
                t={t}
                components={{
                  1: (
                    <Link
                      target="_blank"
                      className="text-primary hover:underline"
                      to={"https://sandbox.vnpayment.vn/apis/vnpay-demo/"}
                    />
                  ),
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default CheckoutPage;