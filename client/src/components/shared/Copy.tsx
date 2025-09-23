import Tooltip from "../@radix-ui/Tooltip";
import React, { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6";

interface ICopyProps {
  text?: string;
  value: string | number;
  children: React.ReactNode;
}

const Copy = ({ value, children }: ICopyProps) => {
  const [isOpenCopy, setIsOpenCopy] = useState(false);

  const handleCopyToClipboard = () => {
    if (!value) return;

    navigator.clipboard.writeText(value.toString());
    setIsOpenCopy(true);
    setTimeout(() => {
      setIsOpenCopy(false);
    }, 1500);
  };

  return (
    <div
      className="flex cursor-pointer items-center gap-x-1"
      onClick={handleCopyToClipboard}
    >
      {children}
      {isOpenCopy ? (
        <Tooltip content={"Copied!"}>
          <div>
            <FaCheck className="text-success" />
          </div>
        </Tooltip>
      ) : (
        <FaCopy size={14} className="secondary" />
      )}
    </div>
  );
};

export default Copy;
