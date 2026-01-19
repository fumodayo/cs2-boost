import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import {
  FaBan,
  FaCheckCircle,
  FaExclamationTriangle,
  FaKey,
  FaEnvelope,
} from "react-icons/fa";
import { IUser } from "~/types";
import { Input } from "~/components/ui";
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
import { Button } from "~/components/ui/Button";
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
  const { t } = useTranslation("user_details_page");
  const { t: tCommon } = useTranslation("common");
  const [banReason, setBanReason] = useState("");
  const [newEmail, setNewEmail] = useState(user.email_address);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { trigger: triggerBan, isMutating: isBanning } = useSWRMutation(
    `/admin/users/${user._id}/ban`,
    () => adminService.banUser(user._id, { reason: banReason }),
  );
  const { trigger: triggerUnban, isMutating: isUnbanning } = useSWRMutation(
    `/admin/users/${user._id}/unban`,
    () => adminService.unbanUser(user._id),
  );
  const { trigger: triggerUpdate, isMutating: isUpdating } = useSWRMutation(
    `/admin/users/${user._id}/update`,
    (
      _: unknown,
      { arg }: { arg: { email_address?: string; password?: string } },
    ) => adminService.updateUserByAdmin(user._id, arg),
  );

  const handleBan = async () => {
    if (!banReason.trim()) {
      toast.error(t("settings_panel.ban_reason_required"));
      return;
    }
    try {
      await triggerBan();
      toast.success(t("settings_panel.ban_success"));
      onActionSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUnban = async () => {
    try {
      await triggerUnban();
      toast.success(t("settings_panel.unban_success"));
      onActionSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail || newEmail === user.email_address) {
      toast.error(t("settings_panel.email_no_change"));
      return;
    }
    try {
      await triggerUpdate({ email_address: newEmail });
      toast.success(t("settings_panel.email_success"));
      onActionSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      toast.error(t("settings_panel.password_required"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("settings_panel.password_mismatch"));
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("settings_panel.password_too_short"));
      return;
    }
    try {
      await triggerUpdate({ password: newPassword });
      toast.success(t("settings_panel.password_success"));
      setNewPassword("");
      setConfirmPassword("");
      onActionSuccess();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <FaEnvelope />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {t("settings_panel.email_title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("settings_panel.email_subtitle")}
            </p>
            <div className="mt-4 space-y-3">
              <Input
                label={t("settings_panel.new_email_label")}
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={user.email_address}
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleUpdateEmail}
                disabled={isUpdating || newEmail === user.email_address}
              >
                {isUpdating
                  ? tCommon("processing")
                  : t("settings_panel.update_email_btn")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <FaKey />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {t("settings_panel.password_title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("settings_panel.password_subtitle")}
            </p>
            <div className="mt-4 space-y-3">
              <Input
                label={t("settings_panel.new_password_label")}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label={t("settings_panel.confirm_password_label")}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Button
                size="sm"
                variant="primary"
                onClick={handleUpdatePassword}
                disabled={isUpdating || !newPassword}
              >
                {isUpdating
                  ? tCommon("processing")
                  : t("settings_panel.update_password_btn")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ban/Unban Section */}
      <div className="rounded-xl border border-red-500/30 bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FaExclamationTriangle />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {t("settings_panel.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.is_banned
                ? t("settings_panel.banned_subtitle", {
                    reason: user.ban_reason,
                  })
                : t("settings_panel.active_subtitle")}
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
                      {t("settings_panel.unban_btn")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("settings_panel.unban_confirm_title")}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      {t("settings_panel.unban_confirm_desc", {
                        username: user.username,
                      })}
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {tCommon("Dialog.btn.Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleUnban}
                        disabled={isUnbanning}
                      >
                        {isUnbanning
                          ? tCommon("processing")
                          : tCommon("Dialog.btn.Confirm")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="primary">
                      <FaBan className="mr-2" /> {t("settings_panel.ban_btn")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {t("settings_panel.ban_confirm_title", {
                          username: user.username,
                        })}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      {t("settings_panel.ban_confirm_desc")}
                    </AlertDialogDescription>
                    <Input
                      label={t("settings_panel.reason_label")}
                      placeholder={t("settings_panel.reason_placeholder")}
                      value={banReason}
                      onChange={(e) => setBanReason(e.target.value)}
                      className="my-4"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>
                        {tCommon("Dialog.btn.Cancel")}
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBan}
                        disabled={isBanning}
                      >
                        {isBanning
                          ? tCommon("banning")
                          : tCommon("Dialog.btn.Confirm")}
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