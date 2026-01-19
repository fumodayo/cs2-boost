import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  EditDialogContent,
  DialogClose,
} from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/ui/Button";
import { SingleDatePicker, Input, TextArea, Checkbox } from "~/components/ui";
import { IPromoCode, IPromoCodePayload } from "~/services/promoCode.service";

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: IPromoCodePayload) => Promise<void>;
  initialData: IPromoCode | null;
  isSubmitting: boolean;
}

const ORDER_TYPES = ["premier", "wingman", "level_farming"];

const parseDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  return new Date(dateStr);
};

const formatDateToString = (date: Date | undefined): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PromoCodeModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: PromoCodeModalProps) => {
  const { t } = useTranslation("promo_codes");
  const [formData, setFormData] = useState<IPromoCodePayload>({
    code: "",
    description: "",
    discountPercent: 10,
    maxDiscount: 0,
    minOrderAmount: 0,
    usageLimit: 0,
    applicableOrderTypes: [...ORDER_TYPES],
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        description: initialData.description || "",
        discountPercent: initialData.discountPercent,
        maxDiscount: initialData.maxDiscount || 0,
        minOrderAmount: initialData.minOrderAmount || 0,
        usageLimit: initialData.usageLimit,
        applicableOrderTypes: initialData.applicableOrderTypes,
        validFrom: initialData.validFrom.split("T")[0],
        validUntil: initialData.validUntil.split("T")[0],
        isActive: initialData.isActive,
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      setFormData({
        code: "",
        description: "",
        discountPercent: 10,
        maxDiscount: 0,
        minOrderAmount: 0,
        usageLimit: 0,
        applicableOrderTypes: [...ORDER_TYPES],
        validFrom: today,
        validUntil: nextMonth,
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseFloat(value) || 0
          : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };

  const handleOrderTypeToggle = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableOrderTypes: prev.applicableOrderTypes?.includes(type)
        ? prev.applicableOrderTypes.filter((t) => t !== type)
        : [...(prev.applicableOrderTypes || []), type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleValidFromChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      validFrom: formatDateToString(date),
    }));
  };

  const handleValidUntilChange = (date: Date | undefined) => {
    setFormData((prev) => ({
      ...prev,
      validUntil: formatDateToString(date),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <EditDialogContent title={initialData ? t("edit_promo") : t("add_promo")}>
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <p className="mb-4 text-sm text-muted-foreground">
            {initialData ? t("edit_promo_desc") : t("add_promo_desc")}
          </p>

          <form id="promo-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Code */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {t("form.code")} <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder={t("form.code_placeholder")}
                className="uppercase"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                {t("form.description")}
              </label>
              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t("form.description_placeholder")}
                rows={2}
              />
            </div>

            {/* Discount Percent */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("form.discount_percent")} (%)
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleChange}
                  min={1}
                  max={50}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("form.max_discount")} (VND)
                </label>
                <Input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("form.max_discount_hint")}
                </p>
              </div>
            </div>

            {/* Min Order Amount & Usage Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("form.min_order")} (VND)
                </label>
                <Input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleChange}
                  min={0}
                  step={1000}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("form.usage_limit")}
                </label>
                <Input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  min={0}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("form.usage_limit_hint")}
                </p>
              </div>
            </div>

            {/* Order Types */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {t("form.applicable_order_types")}
              </label>
              <div className="flex flex-wrap gap-2">
                {ORDER_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleOrderTypeToggle(type)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      formData.applicableOrderTypes?.includes(type)
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {t(`order_types.${type}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Valid Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("form.valid_from")} <span className="text-red-500">*</span>
                </label>
                <SingleDatePicker
                  value={parseDate(formData.validFrom)}
                  onChange={handleValidFromChange}
                  placeholder={t("form.valid_from")}
                  maxDate={parseDate(formData.validUntil)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t("form.valid_until")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <SingleDatePicker
                  value={parseDate(formData.validUntil)}
                  onChange={handleValidUntilChange}
                  placeholder={t("form.valid_until")}
                  minDate={parseDate(formData.validFrom)}
                />
              </div>
            </div>

            {/* Is Active */}
            <Checkbox
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: checked,
                }))
              }
              label={t("form.is_active")}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-border px-4 py-4 sm:px-6">
          <DialogClose asChild>
            <Button type="button" className="px-3 py-1.5" variant="outline">
              {t("form.cancel")}
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="promo-form"
            variant="primary"
            className="px-3 py-1.5"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("form.saving")
              : initialData
                ? t("form.update")
                : t("form.create")}
          </Button>
        </div>
      </EditDialogContent>
    </Dialog>
  );
};

export default PromoCodeModal;