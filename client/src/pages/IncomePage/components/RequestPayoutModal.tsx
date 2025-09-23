import { useForm, SubmitHandler } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { formatMoney } from "~/utils";
import { FormField, Spinner } from "~/components/shared";
import { Dialog, DialogContent } from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/shared/Button";
import { useTranslation } from "react-i18next";
import { payoutService } from "~/services/payout.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentBalance: number;
}

const RequestPayoutModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
}: Props) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<{ amount: number }>();
  const amount = watch("amount");

  const { trigger, isMutating } = useSWRMutation(
    "/payouts/request",
    (_, { arg }: { arg: { amount: number } }) =>
      payoutService.createPayoutRequest(arg.amount),
  );

  const onSubmit: SubmitHandler<{ amount: number }> = async (data) => {
    try {
      await trigger({ amount: Number(data.amount) });
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2 className="text-xl font-bold">
          {t("IncomePage.PayoutModal.title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("IncomePage.PayoutModal.balanceInfo", {
            balance: formatMoney(currentBalance, "vnd"),
          })}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormField
            id="amount"
            type="number"
            label={t("IncomePage.PayoutModal.amountLabel")}
            placeholder={t("IncomePage.PayoutModal.amountPlaceholder")}
            register={register}
            errors={errors}
            rules={{
              required: "Amount is required.",
              valueAsNumber: true,
              max: {
                value: currentBalance,
                message: "Amount cannot exceed your balance.",
              },
              min: {
                value: 50000,
                message: "Minimum payout amount is 50,000 VND.",
              },
            }}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("Dialog.btn.Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isMutating || !amount || amount > currentBalance}
            >
              {isMutating ? (
                <Spinner size="sm" />
              ) : (
                t("IncomePage.PayoutModal.submitBtn")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPayoutModal;
