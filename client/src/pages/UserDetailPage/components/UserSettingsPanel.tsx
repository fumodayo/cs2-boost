import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { FaBan, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { IUser } from "~/types";
import { Input } from "~/components/shared";
import getErrorMessage from "~/utils/errorHandler";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/@radix-ui/AlertDialog";
import { Button } from "~/components/shared/Button";
import { useTranslation } from "react-i18next";
import { adminService } from "~/services/admin.service";

interface UserSettingsPanelProps {
  user: IUser;
  onActionSuccess: () => void;
}

const UserSettingsPanel: React.FC<UserSettingsPanelProps> = ({
  user,
  onActionSuccess,
}) => {
  const { t } = useTranslation();
  const [banReason, setBanReason] = useState("");

  const { trigger: triggerBan, isMutating: isBanning } = useSWRMutation(
    `/admin/users/${user._id}/ban`,
    () => adminService.banUser(user._id, { reason: banReason }),
  );
  const { trigger: triggerUnban, isMutating: isUnbanning } = useSWRMutation(
    `/admin/users/${user._id}/unban`,
    () => adminService.unbanUser(user._id),
  );

  const handleBan = async () => {
    if (!banReason.trim()) {
      toast.error("Please provide a reason.");
      return;
    }
    try {
      await triggerBan();
      toast.success("User banned successfully.");
      onActionSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUnban = async () => {
    try {
      await triggerUnban();
      toast.success("User unbanned successfully.");
      onActionSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-red-500/30 bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FaExclamationTriangle />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("UserDetailsPage.SettingsPanel.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.is_banned
                ? t("UserDetailsPage.SettingsPanel.bannedSubtitle", {
                    reason: user.ban_reason,
                  })
                : t("UserDetailsPage.SettingsPanel.activeSubtitle")}
            </p>
            <div className="mt-4">
              {user.is_banned ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-50"
                    >
                      <FaCheckCircle className="mr-2" />
                      {t("UserDetailsPage.SettingsPanel.unbanBtn")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("UserDetailsPage.SettingsPanel.unbanConfirmTitle")}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      {t("UserDetailsPage.SettingsPanel.unbanConfirmDesc", {
                        username: user.username,
                      })}
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {t("Dialog.btn.Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnban}
                        disabled={isUnbanning}
                      >
                        {isUnbanning
                          ? t("Common.processing")
                          : t("Dialog.btn.Confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="primary">
                      <FaBan className="mr-2" />{" "}
                      {t("UserDetailsPage.SettingsPanel.banBtn")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("UserDetailsPage.SettingsPanel.banConfirmTitle", {
                          username: user.username,
                        })}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      {t("UserDetailsPage.SettingsPanel.banConfirmDesc")}
                    </AlertDialogDescription>
                    <Input
                      placeholder="Reason..."
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="my-4"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBan}
                        disabled={isBanning}
                      >
                        {isBanning
                          ? t("Common.banning")
                          : t("Dialog.btn.Confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPanel;
