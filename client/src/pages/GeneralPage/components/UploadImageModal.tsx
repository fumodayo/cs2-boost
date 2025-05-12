import { useContext, useState } from "react";
import {
  AlertDialogContent,
  Dialog,
  DialogClose,
} from "~/components/@radix-ui/Dialog";
import { Button } from "~/components/shared";
import ScannerQR from "./ScannerQR";
import { IUserProps } from "~/types";
import { AppContext } from "~/components/context/AppContext";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { axiosAuth } from "~/axiosAuth";
import {
  verifyFailure,
  verifyStart,
  verifySuccess,
} from "~/redux/user/userSlice";
import toast from "react-hot-toast";
import { RootState } from "~/redux/store";

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
  const { t } = useTranslation();
  const { toggleConfetti, toggleCongratsDialog } = useContext(AppContext);
  const [cccdInfo, setCccdInfo] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<IUserProps | null>(null);
  const [error, setError] = useState<string | null>(null); // To track errors

  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const handleScanResult = (result: string) => {
    try {
      const parsedData = parseUserString(
        "03562893235|201817823|Bùi Sơn Thái|13102001|Nam|K67 Nguyễn Phan Vinh,Tổ 36, Thọ Quang,  Sơn Trà, Đà Nẵng|17022021",
      );
      setCccdInfo(result);
      setUserInfo(parsedData);
      setError(null); // Clear any previous errors if valid
    } catch (err) {
      setCccdInfo(null);
      setUserInfo(null);
      setError((err as Error).message); // Set the error message
    }
  };

  const handleSubmit = async () => {
    try {
      dispatch(verifyStart());
      const { data } = await axiosAuth.post(
        `/user/verify-user/${currentUser?._id}`,
        {
          ...userInfo,
        },
      );
      onOpenChange(false);
      toggleConfetti();
      toggleCongratsDialog();
      dispatch(verifySuccess(data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const { message } = err;
      dispatch(verifyFailure(message));
      toast.error("Verify failed. Try again later");
    }
    console.log("Confirmed CCCD Info:", userInfo);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        title={cccdInfo ? "Verify Your CCCD Information" : "Front of CCCD Card"}
        subtitle={
          cccdInfo
            ? "Please review and confirm your details below."
            : "Capture or upload a clear image of your CCCD card."
        }
      >
        {cccdInfo ? (
          <div className="flex w-full flex-col space-y-4">
            <div className="flex flex-col space-y-2 rounded-md py-4">
              {userInfo &&
                Object.entries(userInfo).map(([key, value]) => (
                  <div className="flex items-center space-x-2" key={key}>
                    <dt className="text-sm font-medium capitalize text-foreground">
                      {key.split("_").join(" ")}
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground">
                      {value}
                    </dd>
                  </div>
                ))}
            </div>

            <div className="flex flex-col justify-end space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              <Button
                onClick={() => setCccdInfo(null)}
                variant="light"
                className="w-full rounded-md px-4 py-2 sm:w-auto"
              >
                {t("Dialog.btn.Back")}
              </Button>
              <Button
                variant="primary"
                className="w-full rounded-md px-4 py-2 sm:w-auto"
                onClick={() => {
                  handleSubmit();
                }}
              >
                {t("Dialog.btn.Confirm")}
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
              <DialogClose className="w-full">
                <Button
                  variant="light"
                  className="w-full rounded-md px-4 py-2 sm:w-auto"
                >
                  {t("Dialog.btn.Cancel")}
                </Button>
              </DialogClose>
            </div>
            <Button
              variant="primary"
              className="w-full rounded-md px-4 py-2 sm:w-auto"
              onClick={() => {
                handleSubmit();
              }}
            >
              Trường hợp đặt biệt
            </Button>
          </div>
        )}
      </AlertDialogContent>
    </Dialog>
  );
};

export default UploadImageModal;
