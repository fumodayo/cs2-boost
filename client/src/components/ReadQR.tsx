import clsx from "clsx";
import { useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useDispatch, useSelector } from "react-redux";

import Persona from "./Icons/Persona";
import VerificationCard from "./Icons/VerificationCard";
import { User } from "../types";
import { RootState } from "../redux/store";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";

interface QRComponentProps {
  file?: File | null;
  data?: string | null;
  handleBack: () => void;
  handleConfirm?: () => void;
}

const QRComponent: React.FC<QRComponentProps> = ({
  file,
  data,
  handleBack,
  handleConfirm,
}) => {
  return (
    <div className="w-full">
      {file && (
        <img
          className="h-[350px] w-full rounded-sm object-contain py-2"
          src={URL.createObjectURL(file)}
          alt="QR Code"
        />
      )}
      {data && <p>Data: {data}</p>}
      <div className="space-y-2">
        {handleConfirm && (
          <button
            type="button"
            onClick={handleConfirm}
            className={clsx(
              "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
              "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            Use this photo
          </button>
        )}
        <button
          type="button"
          className={clsx(
            "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-bold text-primary shadow-sm outline-none ring-2 ring-primary-ring transition-colors",
            "hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
          )}
          onClick={handleBack}
        >
          Retake photo
        </button>
      </div>
    </div>
  );
};

const FormStep = ({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5">
      {/* HEADER */}
      <div className="flex w-full flex-col space-y-2 px-2">
        <h1 className="text-xl font-bold">{title}</h1>
        <p>{subtitle}.</p>
      </div>

      {/* CONTENT */}
      {children}
    </div>
  );
};

const parseUserString = (userString: string): User => {
  const parts = userString.split("|");
  const user: User = {
    phone_number: parts[0],
    cccd_number: parts[1],
    real_name: parts[2],
    date_of_birth: parseDateString(parts[3]),
    gender: parts[4],
    addresses: parts[5],
    cccd_issue_date: parseDateString(parts[6]),
  };
  return user;
};

const parseDateString = (dateString: string): Date => {
  const year = parseInt(dateString.substr(4, 4));
  const month = parseInt(dateString.substr(2, 2)) - 1; // Month in JavaScript Date starts from 0 (January)
  const day = parseInt(dateString.substr(0, 2));
  return new Date(year, month, day);
};

const ReadQR = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [step, setStep] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFile(file);
      setStep(2); // Chuyển đến bước 2 sau khi chọn hình ảnh
    }
  };

  const handleBack = () => {
    setStep(1); // Trở về bước 1 nếu muốn chọn lại ảnh
    setFile(null); // Reset file khi quay lại bước 1
  };

  const handleConfirm = async () => {
    try {
      const result = await QrScanner.scanImage(file!); // Scan ảnh khi xác nhận
      setData(result);
      dispatch(updateUserStart());
      const info = parseUserString(result);
      const res = await fetch(`/api/user/verification/${currentUser?._id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const user = await res.json();
      dispatch(updateUserSuccess(user));

      setStep(3); // Chuyển đến bước 3 khi xác nhận thành công
      setError(null); // Reset lỗi nếu có
    } catch (error) {
      dispatch(updateUserFailure("Error scanning QR code. Please try again."));
      setError("Error scanning QR code. Please try again."); // Xử lý lỗi khi scan
    }
  };

  const handleBegin = () => {
    setStep(1); // Bắt đầu quá trình xác nhận từ bước 1
  };

  return (
    <div>
      {step === 0 && (
        <FormStep
          title="Getting started"
          subtitle="We need some information to help us confirm your identity"
        >
          <Persona />
          <button
            type="button"
            className={clsx(
              "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
              "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
            )}
            onClick={handleBegin}
          >
            Begin verifying
          </button>
        </FormStep>
      )}
      {step === 1 && (
        <FormStep
          title="Front of driver license"
          subtitle="Take a clear photo of the front of your driver license"
        >
          <div className="h-full w-full bg-[#edf1fc] py-10">
            <VerificationCard />
          </div>
          <button
            type="button"
            className={clsx(
              "relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors",
              "hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
            )}
            onClick={handleClick}
          >
            Upload a photo
          </button>
          <input
            type="file"
            ref={fileRef}
            onChange={handleChange}
            accept=".png, .jpg, .jpeg"
            className="hidden"
          />
        </FormStep>
      )}
      {step === 2 && (
        <FormStep
          title="Check your photo"
          subtitle="Make sure lighting is good and any lettering is clear before
        continuing"
        >
          <QRComponent
            file={file}
            data={data}
            handleBack={handleBack}
            handleConfirm={handleConfirm}
          />
          {error && <p className="text-danger">{error}</p>}
        </FormStep>
      )}
      {step === 3 && <FormStep>DONE</FormStep>}
    </div>
  );
};

export default ReadQR;
