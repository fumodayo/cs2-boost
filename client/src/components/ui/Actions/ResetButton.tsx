import { FaXmark } from "react-icons/fa6";
import { Button } from "~/components/ui/Button";
import { useTranslation } from "react-i18next";

interface IResetButtonProps {
  onReset: () => void;
}

const ResetButton = ({ onReset }: IResetButtonProps) => {
  const { t } = useTranslation("datatable");

  return (
    <Button
      variant="transparent"
      className="h-8 rounded-md px-2 py-1.5 text-xs font-medium lg:px-3"
      onClick={onReset}
    >
      {t('filters.labels.reset')}
      <FaXmark className="ml-2" />
    </Button>
  );
};

export default ResetButton;