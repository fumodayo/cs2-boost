import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconChecked, IconUnChecked } from "~/icons";
import cn from "~/libs/utils";

const listPaymentMethods = [
  {
    title: "VN Pay",
    subtitle: "Prepaid card for online payments.",
    image: "vn-pay",
  },
  {
    title: "Debit/Credit cards (Stripe)",
    subtitle: "Alternative cards payment method.",
    image: "stripe",
  },
  {
    title: "Zalo Pay",
    subtitle: "Prepaid card for online payments.",
    image: "zalo-pay",
  },
];

const ListPayment = () => {
  const { t } = useTranslation();
  const [selectedValue, setSelectedValue] = useState("0");

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-foreground">
        {t("CheckoutPage.label.Pay with")}
      </h3>
      <RadioGroup.Root
        className="mt-2 flex flex-wrap gap-2"
        value={selectedValue}
        onValueChange={(value) => setSelectedValue(value)}
      >
        {listPaymentMethods.map(({ title, subtitle, image }, idx) => {
          const isDisabled = idx !== 0;
          const isSelected = selectedValue === idx.toString();

          return (
            <RadioGroup.Item
              key={title}
              value={idx.toString()}
              disabled={isDisabled}
              className={cn(
                "relative flex w-full items-center justify-between rounded-lg px-6 py-4 text-start shadow-sm focus:outline-none",
                isDisabled
                  ? "cursor-not-allowed bg-muted opacity-50"
                  : "cursor-pointer",
                isSelected ? "bg-radio-hover" : "bg-radio/50 hover:bg-radio",
              )}
            >
              <div className="flex items-center">
                <div className="mr-2 shrink-0 flex-grow-0 sm:mr-4">
                  <img
                    className="h-10 w-10 shrink-0 rounded-lg object-contain"
                    src={`/assets/payment-methods/${image}.png`}
                    alt={title}
                  />
                </div>
                <div className="flex max-w-[250px] flex-col truncate text-sm sm:max-w-lg">
                  <span className="text-base font-medium text-foreground">
                    {t(`CheckoutPage.label.${title}`, { defaultValue: title })}
                    <div className="ml-1 inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring">
                      <span className="flex-1 shrink-0 truncate"> +0%</span>
                    </div>
                  </span>
                  <span className="block truncate text-muted-foreground sm:inline">
                    {t(`CheckoutPage.label.${subtitle}`, {
                      defaultValue: subtitle,
                    })}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right">
                {isSelected ? <IconChecked /> : <IconUnChecked />}
              </div>
              <div className="pointer-events-none absolute -inset-px rounded-lg border-2 border-border" />
            </RadioGroup.Item>
          );
        })}
      </RadioGroup.Root>
    </div>
  );
};

export default ListPayment;
