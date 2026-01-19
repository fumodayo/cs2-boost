import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
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
import { IUser } from "~/types";
import { Input } from "~/components/ui/Form";

interface RowUserActionsProps {
  user: IUser;
  onBanUser: (userId: string, reason: string) => Promise<void>;
  onUnbanUser: (userId: string) => Promise<void>;
  isProcessing: boolean;
}

const RowUserActions: React.FC<RowUserActionsProps> = ({
  user,
  onBanUser,
  onUnbanUser,
  isProcessing,
}) => {
  const { t } = useTranslation(["manage_users_page", "common"]);
  const [banReason, setBanReason] = useState("");

  const handleConfirmBan = () => {
    if (!banReason.trim()) {
      toast.error(t("ban_dialog.reason_required"));
      return;
    }
    onBanUser(user._id, banReason);
  };

  const handleConfirmUnban = () => {
    onUnbanUser(user._id);
  };

  return (
    <div className="flex justify-end">
      {user.is_banned ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:bg-green-50 hover:text-green-600"
            >
              <FaCheckCircle className="mr-2" /> {t("ban_dialog.unban_btn")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("ban_dialog.unban_title", { username: user.username })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("ban_dialog.unban_desc")}
                <span className="font-semibold">{user.ban_reason}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {t("common:buttons.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmUnban}
                disabled={isProcessing}
              >
                {isProcessing
                  ? t("common:processing")
                  : t("ban_dialog.confirm_unban")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="danger" size="sm" className="text-white">
              <FaBan className="mr-2" /> {t("ban_dialog.ban_btn")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("ban_dialog.ban_title", { username: user.username })}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("ban_dialog.ban_desc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input
              id="ban-reason"
              label={t("ban_dialog.reason_label")}
              placeholder={t("ban_dialog.reason_placeholder")}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="mt-2"
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBanReason("")}>
                {t("common:buttons.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmBan}
                disabled={isProcessing}
              >
                {isProcessing
                  ? t("common:processing")
                  : t("common:buttons.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default RowUserActions;