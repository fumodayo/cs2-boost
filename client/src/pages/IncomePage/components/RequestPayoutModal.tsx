import { useForm, SubmitHandler } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { formatMoney } from "~/utils";
import { FormField, Spinner } from "~/components/ui";
import { Dialog, DialogContent } from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/ui/Button";
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
  const { t } = useTranslation(["income_page", "common"]);
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
        <h2 className="text-xl font-bold">{t("payout_modal.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("payout_modal.balance_info", {
            balance: formatMoney(currentBalance, "vnd"),
          })}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <FormField
            id="amount"
            type="number"
            label={t("payout_modal.amount_label")}
            placeholder={t("payout_modal.amount_placeholder")}
            register={register}
            errors={errors}
            rules={{
              required: t("payout_modal.validation.amount_required"),
              valueAsNumber: true,
              max: {
                value: currentBalance,
                message: t("payout_modal.validation.amount_exceed"),
              },
              min: {
                value: 50000,
                message: t("payout_modal.validation.minimum_amount"),
              },
            }}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("common:buttons.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isMutating || !amount || amount > currentBalance}
            >
              {isMutating ? (
                <Spinner size="sm" />
              ) : (
                t("payout_modal.submit_btn")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestPayoutModal;