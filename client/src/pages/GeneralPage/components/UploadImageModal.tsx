import { useState } from "react";
import {
  AlertDialogContent,
  Dialog,
  DialogClose,
} from "~/components/@radix-ui/Dialog";
import ScannerQR from "./ScannerQR";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  verifyFailure,
  verifyStart,
  verifySuccess,
} from "~/redux/user/userSlice";
import toast from "react-hot-toast";
import { IVerifyUserPayload } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { Button } from "~/components/ui/Button";
import { userService } from "~/services/user.service";
interface IUploadImageModalProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}
const parseUserString = (scanString: string) => {
  const parts = scanString.split("|");
  if (parts.length < 7) {
    throw new Error("CCCD data is incomplete.");
  }
  return {
    phone_number: parts[0],
    cccd_number: parts[1],
    full_name: parts[2],
    date_of_birth: parts[3],
    gender: parts[4],
    address: parts[5],
    cccd_issue_date: parts[6],
  };
};
const UploadImageModal = ({ open, onOpenChange }: IUploadImageModalProps) => {
  const { t } = useTranslation(["settings_page", "common"]);
  const [cccdInfo, setCccdInfo] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<IVerifyUserPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const handleScanResult = (result: string) => {
    try {
      const parsedData = parseUserString(result);
      if (parsedData) {
        setCccdInfo(result);
        setUserInfo(parsedData);
      }
      setError(null);
    } catch (err) {
      setCccdInfo(null);
      setUserInfo(null);
      setError(t("upload_image_modal.error_incomplete_data"));
    }
  };
  const handleSubmit = async (verificationData: IVerifyUserPayload) => {
    if (!verificationData) {
      toast.error(t("common:toasts.no_user_info_to_submit"));
      return;
    }
    try {
      dispatch(verifyStart());
      const data = await userService.verifyUser(verificationData);
      onOpenChange(false);
      dispatch(verifySuccess(data));
      toast.success(t("common:toasts.partner_request_submitted"));
    } catch (err) {
      const message = getErrorMessage(err);
      dispatch(verifyFailure(message));
      toast.error(message);
    }
  };
  const handleSpecialCase = async () => {
    try {
      const parsedData = parseUserString(
        "03562893235|201817823|Bùi Sơn Thái|13102001|Nam|K67 Nguyễn Phan Vinh,Tổ 36, Thọ Quang,  Sơn Trà, Đà Nẵng|17022021",
      );
      setUserInfo(parsedData);
      setCccdInfo("Trường hợp đặc biệt");
      setError(null);
      await handleSubmit(parsedData);
    } catch (err) {
      setError((err as Error).message);
      toast.error(t("upload_image_modal.error_sample_data"));
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        title={
          cccdInfo
            ? t("upload_image_modal.verify_title")
            : t("upload_image_modal.scan_title")
        }
        subtitle={
          cccdInfo
            ? t("upload_image_modal.verify_subtitle")
            : t("upload_image_modal.scan_subtitle")
        }
      >
        {cccdInfo && userInfo ? (
          <div className="flex w-full flex-col space-y-4">
            <div className="flex flex-col space-y-2 rounded-md py-4">
              {Object.entries(userInfo).map(([key, value]) => (
                <div className="flex items-center space-x-2" key={key}>
                  <dt className="text-sm font-medium capitalize text-foreground">
                    {t(`user_widget.labels.${key}`, { ns: "settings_page" })}
                  </dt>
                  <dd className="mt-1 text-sm text-muted-foreground">
                    {String(value)}
                  </dd>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button
                onClick={() => {
                  setCccdInfo(null);
                  setUserInfo(null);
                }}
                variant="light"
                className="w-full rounded-md px-4 py-2 sm:w-auto"
              >
                {t("common:buttons.back")}
              </Button>
              <Button
                variant="primary"
                className="w-full rounded-md px-4 py-2 sm:w-auto"
                onClick={() => handleSubmit(userInfo)}
              >
                {t("common:buttons.confirm")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center space-y-4">
            <div className="flex w-full justify-center py-5">
              <ScannerQR onScanSuccess={handleScanResult} />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div className="flex w-full flex-col justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <DialogClose asChild>
                <Button
                  variant="light"
                  className="w-full rounded-md px-4 py-2 sm:w-auto"
                >
                  {t("common:buttons.cancel")}
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                className="w-full rounded-md px-4 py-2 sm:w-auto"
                onClick={handleSpecialCase}
              >
                {t("upload_image_modal.specific_case_btn")}
              </Button>
            </div>
          </div>
        )}
      </AlertDialogContent>
    </Dialog>
  );
};
export default UploadImageModal;