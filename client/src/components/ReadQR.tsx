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
import { axiosAuth } from "../axiosAuth";
import { Button, CancelButton } from "./Buttons/Button";

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
          <Button
            onClick={handleConfirm}
            className="w-full rounded-md px-4 py-2.5 text-sm font-medium"
          >
            Use this photo
          </Button>
        )}
        <CancelButton
          className="w-full px-4 py-2.5 text-sm font-medium"
          onClick={handleBack}
        >
          Retake photo
        </CancelButton>
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
      const { data } = await axiosAuth.post(
        `/user/verification/${currentUser?._id}`,
        info,
      );
      dispatch(updateUserSuccess(data));

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
          <Button
            className="w-full rounded-md  px-4 py-2 text-sm font-medium shadow-sm"
            onClick={handleBegin}
          >
            Begin verifying
          </Button>
        </FormStep>
      )}
      {step === 1 && (
        <FormStep
          title="Front of CCCD card"
          subtitle="Take a clear photo of the front of your CCCD card"
        >
          <div className="h-full w-full bg-[#edf1fc] py-10">
            <VerificationCard />
          </div>
          <Button
            className="w-full rounded-md  px-4 py-2 text-sm font-medium shadow-sm"
            onClick={handleClick}
          >
            Upload a photo
          </Button>
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
