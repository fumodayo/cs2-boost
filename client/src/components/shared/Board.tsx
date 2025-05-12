import { useTranslation } from "react-i18next";

type Board = {
  header: string;
  content: string[];
};

interface IBoardProps {
  title: string;
  subtitle: string;
  boards: Board[];
}

const Board = ({ title, subtitle, boards }: IBoardProps) => {
  const { t } = useTranslation();
  const maxContentLength = Math.max(
    ...boards.map((board) => board.content.length),
  );

  return (
    <div className="w-full rounded-lg bg-card pb-10 pl-8 pr-8 pt-6 shadow-md">
      <div className="flex flex-col gap-4 pb-4">
        <p className="text-lg font-bold">{t(`Board.title.${title}`)}</p>
        <p className="text-md secondary mb-4 text-muted-foreground">
          {t(`Board.subtitle.${subtitle}`)}
        </p>
        <table className="w-12/12 table-auto">
          <thead>
            <tr className="text-foreground">
              {boards.map(({ header }) => (
                <th key={header} className="px-4 py-2 text-left">
                  {t(`Board.header.${header}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            {[...Array(maxContentLength)].map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 1 ? "bg-accent" : ""}
              >
                {boards.map((board, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {board.content[rowIndex] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Board;
