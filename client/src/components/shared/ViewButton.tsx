import { PiSlidersHorizontal } from "react-icons/pi";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "./Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../@radix-ui/Dropdown";
import { FaCheck } from "react-icons/fa6";
import { IDataListHeaders } from "~/constants/headers";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

interface IViewButtonProps {
  headers: IDataListHeaders[];
  selectedColumns: string[];
  toggleColumn: (value: string) => void;
}

const ViewButton = ({
  headers,
  selectedColumns,
  toggleColumn,
}: IViewButtonProps) => {
  const { t } = useTranslation();

  const columnsToDisplay = headers.filter((col) => col.value !== "actions");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="light"
          className="ml-auto h-8 rounded-md px-3 text-xs font-medium shadow-sm lg:flex"
        >
          <PiSlidersHorizontal className="mr-2" />
          {t("DataTable.ViewButton.label.View")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[160px]" side="bottom" align="end">
        <h3 className="px-2 py-1.5 text-sm font-medium">
          {t("DataTable.ViewButton.label.Toggle columns")}
        </h3>
        <Separator className="-mx-1 my-1.5 h-px bg-accent/50" />
        {columnsToDisplay.map(({ label, value }) => (
          <DropdownMenuItem
            key={uuidv4()}
            onClick={() => toggleColumn(value)}
            className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm capitalize outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              {selectedColumns.includes(value) && <FaCheck />}
            </span>
            {t(`DataTable.header.${label}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewButton;
