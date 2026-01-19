import React from "react";
import { FaCreditCard } from "react-icons/fa";
import { IReceipt } from "~/types";
import RowTable from "./RowTable";

interface PaymentMethodConfig {
  icon: React.ElementType | string;
  label: string;
}

const paymentMethodConfig: Record<string, PaymentMethodConfig> = {
  "vn-pay": {
    icon: "/assets/payment-methods/vn-pay.png",
    label: "VNPay",
  },
  "credit-card": {
    icon: FaCreditCard,
    label: "Credit Card",
  },

  default: {
    icon: FaCreditCard,
    label: "Other",
  },
};

const RowPaymentMethod: React.FC<Pick<IReceipt, "payment_method">> = ({
  payment_method,
}) => {
  const config = paymentMethodConfig[payment_method.toLowerCase()] || {
    ...paymentMethodConfig.default,
    label: payment_method,
  };

  const IconOrImageSrc = config.icon;

  return (
    <RowTable>
      <div className="flex items-center gap-2">
        {typeof IconOrImageSrc === "string" ? (
          <img
            src={IconOrImageSrc}
            alt={`${config.label} logo`}
            className="h-5 w-auto object-contain"
          />
        ) : (
          <IconOrImageSrc className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="font-medium text-foreground">{config.label}</span>
      </div>
    </RowTable>
  );
};

export default RowPaymentMethod;