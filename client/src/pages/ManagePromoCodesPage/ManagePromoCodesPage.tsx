import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { FaPlus, FaTicketAlt, FaEdit, FaTrash } from "react-icons/fa";
import {
  Heading,
  Helmet,
  ResetButton,
  Search,
  Spinner,
  ErrorDisplay,
} from "~/components/ui";
import { Button } from "~/components/ui/Button";
import {
  promoCodeService,
  IPromoCode,
  IPromoCodePayload,
} from "~/services/promoCode.service";
import getErrorMessage from "~/utils/errorHandler";
import { formatMoney, formatDateTime } from "~/utils";
import PromoCodeModal from "./PromoCodeModal";

const promoCodesHeaders = [
  { key: "code", labelKey: "code" },
  { key: "discountPercent", labelKey: "discount" },
  { key: "usageLimit", labelKey: "usage" },
  { key: "applicableOrderTypes", labelKey: "applies_to" },
  { key: "validUntil", labelKey: "valid_until" },
  { key: "isActive", labelKey: "status" },
  { key: "actions", labelKey: "actions" },
];

const ManagePromoCodesPage = () => {
  const { t } = useTranslation("promo_codes");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<IPromoCode | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: promoCodesData,
    error,
    isLoading,
    mutate,
  } = useSWR("/admin/promo-codes", () => promoCodeService.getPromoCodes());

  const { trigger: triggerCreate, isMutating: isCreating } = useSWRMutation(
    "/admin/promo-codes/create",
    (_, { arg }: { arg: IPromoCodePayload }) =>
      promoCodeService.createPromoCode(arg),
  );

  const { trigger: triggerUpdate, isMutating: isUpdating } = useSWRMutation(
    "/admin/promo-codes/update",
    (
      _,
      { arg }: { arg: { id: string; payload: Partial<IPromoCodePayload> } },
    ) => promoCodeService.updatePromoCode(arg.id, arg.payload),
  );

  const { trigger: triggerDelete, isMutating: isDeleting } = useSWRMutation(
    "/admin/promo-codes/delete",
    (_, { arg }: { arg: string }) => promoCodeService.deletePromoCode(arg),
  );

  const handleCreateOrUpdate = async (payload: IPromoCodePayload) => {
    try {
      if (editingPromoCode) {
        await triggerUpdate({ id: editingPromoCode._id, payload });
        toast.success(t("update_success"));
      } else {
        await triggerCreate(payload);
        toast.success(t("create_success"));
      }
      setIsModalOpen(false);
      setEditingPromoCode(null);
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("delete_confirm"))) return;
    try {
      await triggerDelete(id);
      toast.success(t("delete_success"));
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleEdit = (promoCode: IPromoCode) => {
    setEditingPromoCode(promoCode);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPromoCode(null);
    setIsModalOpen(true);
  };

  const promoCodes = promoCodesData?.data || [];

  const filteredPromoCodes = promoCodes.filter(
    (pc: IPromoCode) =>
      pc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pc.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getOrderTypeLabels = (types: string[]) => {
    return types.map((type) => t(`order_types.${type}`, type)).join(", ");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={t("load_error")} />;
  }

  return (
    <>
      <Helmet title="promo_codes_page" />
      <PromoCodeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromoCode(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingPromoCode}
        isSubmitting={isCreating || isUpdating}
      />

      <div>
        <Heading
          icon={FaTicketAlt}
          title="page_title"
          subtitle="page_subtitle"
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <Search
                    value={searchQuery}
                    onChangeValue={(val) => setSearchQuery(val)}
                  />
                  {searchQuery && (
                    <ResetButton onReset={() => setSearchQuery("")} />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleOpenCreate}
                  >
                    <FaPlus className="mr-2" />
                    {t("add_promo")}
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-card">
                    <tr>
                      {promoCodesHeaders.map((header) => (
                        <th
                          key={header.key}
                          className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                        >
                          {t(header.labelKey)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card-alt">
                    {filteredPromoCodes.length === 0 ? (
                      <tr>
                        <td
                          colSpan={promoCodesHeaders.length}
                          className="px-4 py-8 text-center text-muted-foreground"
                        >
                          {t("no_promo_codes")}
                        </td>
                      </tr>
                    ) : (
                      filteredPromoCodes.map((promoCode: IPromoCode) => (
                        <tr key={promoCode._id} className="hover:bg-muted/50">
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-mono font-semibold text-foreground">
                                {promoCode.code}
                              </span>
                              {promoCode.description && (
                                <span className="text-xs text-muted-foreground">
                                  {promoCode.description}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className="font-semibold text-primary">
                              {promoCode.discountPercent}%
                            </span>
                            {(promoCode.maxDiscount ?? 0) > 0 && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                (max {formatMoney(promoCode.maxDiscount, "vnd")}
                                )
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                            {promoCode.usedCount ?? 0}
                            {promoCode.usageLimit > 0 && (
                              <span> / {promoCode.usageLimit}</span>
                            )}
                            {promoCode.usageLimit === 0 && (
                              <span> ({t("unlimited")})</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {getOrderTypeLabels(promoCode.applicableOrderTypes)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                            {formatDateTime(promoCode.validUntil)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                promoCode.isActive &&
                                new Date(promoCode.validUntil) > new Date()
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {promoCode.isActive &&
                              new Date(promoCode.validUntil) > new Date()
                                ? t("active")
                                : t("inactive")}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(promoCode)}
                                disabled={isDeleting}
                              >
                                <FaEdit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => handleDelete(promoCode._id)}
                                disabled={isDeleting}
                              >
                                <FaTrash className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManagePromoCodesPage;