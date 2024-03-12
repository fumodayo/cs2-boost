import { useState } from "react";
import Tooltip from "./Tooltip";
import { FaCheck, FaCopy } from "react-icons/fa6";

const Copy = ({ text }: { text: string }) => {
  const [isCopy, setCopy] = useState(false);

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, 1500);
  };

  return (
    <div>
      {isCopy ? (
        <Tooltip content="id Copied">
          <FaCheck className="cursor-pointer text-success" />
        </Tooltip>
      ) : (
        <FaCopy
          onClick={() => handleCopyToClipboard(text)}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default Copy;
