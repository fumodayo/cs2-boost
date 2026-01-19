import { useTranslation } from "react-i18next";
import { Board } from "~/components/ui";
interface BoardTableData {
  headers: string[];
  rows: string[][];
}
interface BoardData {
  title: string;
  subtitle: string;
  table?: BoardTableData;
}
interface TransformedBoard {
  header: string;
  content: string[];
}
/**
 * Chuyển đổi dữ liệu bảng từ định dạng "row-based" (hàng ngang) sang "column-based" (hàng dọc).
 * @param data - Dữ liệu bảng được lấy từ file JSON.
 * @returns Một mảng các object, mỗi object đại diện cho một cột của bảng.
 */
const transformBoardData = (
  data: BoardData | undefined,
): TransformedBoard[] => {
  if (!data?.table?.headers || !data.table.rows) {
    return [];
  }
  const { headers, rows } = data.table;
  return headers.map((header: string, index: number): TransformedBoard => {
    return {
      header: header,
      content: rows.map((row: string[]) => row[index]),
    };
  });
};
const ListBoard = () => {
  const { t } = useTranslation("level_farming");
  const earnedXpData = t("boards.earned_xp", {
    returnObjects: true,
  }) as BoardData;
  const xpPenaltyData = t("boards.xp_penalty", {
    returnObjects: true,
  }) as BoardData;
  const transformedEarnedXp = transformBoardData(earnedXpData);
  const transformedXpPenalty = transformBoardData(xpPenaltyData);
  return (
    <>
      {earnedXpData && (
        <Board
          title={earnedXpData.title}
          subtitle={earnedXpData.subtitle}
          boards={transformedEarnedXp}
        />
      )}
      {xpPenaltyData && (
        <Board
          title={xpPenaltyData.title}
          subtitle={xpPenaltyData.subtitle}
          boards={transformedXpPenalty}
        />
      )}
    </>
  );
};
export default ListBoard;