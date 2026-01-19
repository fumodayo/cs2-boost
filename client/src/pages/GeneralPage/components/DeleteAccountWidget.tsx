import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogClose,
  AlertDialogContent,
  DialogTrigger,
} from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/ui/Button";
import { RootState } from "~/redux/store";
import { userService } from "~/services/user.service";
import getErrorMessage from "~/utils/errorHandler";

const DeleteAccountWidget = () => {
  const { t, i18n } = useTranslation(["common"]);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const [confirmUsername, setConfirmUsername] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isVietnamese = i18n.language === "vi";

  const handleDeleteAccount = async () => {
    if (confirmUsername !== currentUser?.username) {
      toast.error(
        isVietnamese
          ? "Tên người dùng không khớp."
          : "Username does not match.",
      );
      return;
    }

    try {
      setIsDeleting(true);
      await userService.deleteAccount();
      toast.success(
        isVietnamese
          ? "Tài khoản đã được xóa thành công."
          : "Account deleted successfully.",
      );
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setConfirmUsername("");
    }
  };

  return (
    <div className="-mx-4 rounded-none border border-red-500/30 bg-gradient-to-r from-red-950/20 to-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
      <div className="flex flex-col items-start justify-between gap-4 px-4 py-5 sm:flex-row sm:items-center sm:px-6">
        <div className="space-y-1">
          <h3 className="font-display text-base font-semibold text-red-400">
            {isVietnamese ? "Xóa Tài Khoản" : "Delete Account"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isVietnamese
              ? "Hành động này không thể hoàn tác. Chúng tôi sẽ xóa vĩnh viễn tài khoản của bạn."
              : "This action is irreversible. We will permanently delete your account."}
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant="danger"
              className="flex-shrink-0 rounded-md px-5 py-2.5 text-sm"
            >
              <FaTrash className="mr-2" />
              {t("common:buttons.delete_account")}
            </Button>
          </DialogTrigger>

          {/* KHÔNG TRUYỀN CLASSNAME VÀO ĐÂY THEO YÊU CẦU */}
          <AlertDialogContent>
            {/* 
              WRAPPER THẦN THÁNH: 
              Sử dụng margin âm để thoát khỏi padding p-6 của AlertDialogContent.
              - -mx-6: Mở rộng sang trái phải 24px (bù trừ p-6).
              - -mb-6: Mở rộng xuống dưới 24px (bù trừ p-6).
              - -mt-[54px]: Bù trừ top padding (24px) + grid gap (16px) + mt-3.5 (14px) ~ 54px.
              - w-[calc(100%+3rem)]: Đảm bảo width lấp đầy sau khi bù trừ.
              - rounded-lg overflow-hidden: Để bo góc nội dung khớp với modal.
            */}
            <div className="-mx-6 -mb-6 -mt-[54px] flex w-[calc(100%+3rem)] flex-col overflow-hidden rounded-lg bg-white dark:bg-[#111216]">
              {/* --- 1. HEADER --- */}
              <div className="flex items-center justify-between p-6 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500 shadow-lg shadow-red-500/30">
                    <FaTrash className="text-xl text-white" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {isVietnamese ? "Xóa Tài Khoản" : "Delete Account"}
                  </h2>
                </div>

                <DialogClose asChild>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:border-gray-700 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                    <IoClose className="text-xl" />
                  </button>
                </DialogClose>
              </div>

              {/* --- 2. BODY --- */}
              <div className="space-y-6 p-6 pt-4 text-left">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
                  {isVietnamese
                    ? "Nhập tên người dùng của bạn để xác nhận xóa tài khoản."
                    : "Enter your username to confirm the deletion of your account."}
                </p>

                <div className="space-y-4">
                  {/* Read-only Input */}
                  <div className="group relative">
                    <input
                      className="font-mono w-full cursor-not-allowed select-none rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 opacity-80 focus:border-gray-300 focus:ring-0 dark:border-gray-700/50 dark:bg-[#1C1E24] dark:text-gray-400 dark:focus:border-gray-600"
                      readOnly
                      value={currentUser?.username || ""}
                    />
                  </div>

                  {/* Typing Input */}
                  <div className="relative">
                    <input
                      id="username-confirm"
                      type="text"
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 dark:border-gray-700 dark:bg-[#16171B] dark:text-white dark:placeholder-gray-500"
                      placeholder={
                        isVietnamese
                          ? "Nhập tên người dùng"
                          : "Enter your username"
                      }
                      value={confirmUsername}
                      onChange={(e) => setConfirmUsername(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* --- 3. FOOTER --- */}
              <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-800/50 dark:bg-[#0D0E11]">
                <DialogClose asChild>
                  <button className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-transparent dark:bg-[#22242B] dark:text-gray-200 dark:hover:bg-[#2C2E36] dark:focus:ring-gray-700">
                    {t("common:buttons.cancel")}
                  </button>
                </DialogClose>

                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    isDeleting || confirmUsername !== currentUser?.username
                  }
                  className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-red-900/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 dark:border dark:border-red-900/50 dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60 dark:focus:ring-offset-[#111216]"
                >
                  {isDeleting
                    ? t("common:buttons.deleting")
                    : t("common:buttons.delete_account")}
                </button>
              </div>
            </div>
          </AlertDialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteAccountWidget;