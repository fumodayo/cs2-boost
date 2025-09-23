import { FaXmark } from "react-icons/fa6";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface IResetButtonProps {
  onReset: () => void;
}

const ResetButton = ({ onReset }: IResetButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      variant="transparent"
      className="h-8 rounded-md px-2 py-1.5 text-xs font-medium lg:px-3"
      onClick={onReset}
    >
      {t("DataTable.Btn.label.Reset")}
      <FaXmark className="ml-2" />
    </Button>
  );
};

export default ResetButton;
