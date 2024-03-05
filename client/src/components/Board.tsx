import React from "react";
import Tooltip from "./Tooltip";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";

interface BoardProps {
  services: { [key: string]: { label: string | number; note?: string }[] };
}

const Board: React.FC<BoardProps> = ({ services }) => {
  const { t } = useTranslation();
  const headers = Object.keys(services);
  const maxRows = Math.max(...headers.map((header) => services[header].length));

  return (
    <table className="w-12/12 table-auto">
      <thead>
        <tr className="text-foreground">
          {headers.map((header, idx) => (
            <th key={idx} className="px-4 py-2 text-left">
              {t(header)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="text-muted-foreground">
        {[...Array(maxRows)].map((_, rowIndex) => (
          <tr key={rowIndex} className={rowIndex % 2 === 1 ? "bg-accent" : ""}>
            {headers.map((header, colIndex) => {
              const cellData = services[header][rowIndex];
              const cellLabel = cellData?.label.toString() || "";
              const cellNote = cellData?.note || "";
              const isFirstColumn = colIndex === 0;
              const isLastColumn = colIndex === headers.length - 1;
              const roundedClass = isFirstColumn
                ? "rounded-l-lg"
                : isLastColumn
                  ? "rounded-r-lg pr-6"
                  : "";

              return (
                <td key={colIndex} className={`px-4 py-2 ${roundedClass}`}>
                  {cellNote ? (
                    <Tooltip content={t(cellNote)}>
                      <span className="flex items-center">
                        {t(cellLabel)}
                        <BsFillQuestionCircleFill className="ml-1 cursor-pointer text-xs text-success" />
                      </span>
                    </Tooltip>
                  ) : (
                    t(cellLabel)
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
