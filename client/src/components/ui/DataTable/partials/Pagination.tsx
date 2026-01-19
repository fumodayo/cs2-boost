import { IconType } from "react-icons";
import cn from "~/libs/utils";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { IPagination } from "~/types";
import { Button } from "../../Button";
import { Select } from "~/components/@radix-ui/Select";

const pages = [5, 10, 15, 20, 30];
const DEFAULT_PER_PAGE = 5;

interface IButtonProps {
  icon?: IconType;
  active?: boolean;
  value: number;
  onClick: (value: number) => void;
}

const ArrowButton = ({ icon: Icon, value, onClick }: IButtonProps) => (
  <Button
    variant="transparent"
    className="h-10 w-10 flex-grow rounded-md border border-input text-sm font-medium shadow-sm sm:flex-grow-0"
    onClick={() => onClick(value)}
  >
    {Icon && <Icon />}
  </Button>
);

const NumberButton = ({ active, value, onClick }: IButtonProps) => (
  <Button
    variant="transparent"
    className={cn(
      active
        ? "bg-primary p-0 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        : "border border-input bg-transparent p-0 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground",
      "h-10 flex-grow rounded-md p-4 sm:w-10 sm:flex-grow-0",
    )}
    onClick={() => onClick(value)}
  >
    {value}
  </Button>
);

const Pagination = ({ pagination }: { pagination: IPagination }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("per-page")) || DEFAULT_PER_PAGE;
  const maxPage = Math.ceil(pagination.total / perPage);

  const maxNumbButtonCanShow = 3;
  const beginPage = Math.max(
    1,
    currentPage - Math.floor(maxNumbButtonCanShow / 2),
  );
  const endPage = Math.min(maxPage, beginPage + maxNumbButtonCanShow - 1);

  const handlePageChange = (value: number) => {
    if (value > 0 && value <= maxPage) {
      const params = new URLSearchParams(searchParams);
      params.delete("page");
      params.append("page", String(value));
      setSearchParams(params);
    }
  };

  const handlePerPageChange = (value: number) => {
    if (value > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("per-page", String(value));
      params.set("page", "1");
      setSearchParams(params);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 px-2 py-4 sm:flex-row sm:justify-between">
      {/* SELECT PAGE - Left side */}
      <div className="flex items-center gap-2 sm:gap-3">
        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          Rows per page
        </p>
        <Select
          defaultValue={pages[0].toString()}
          value={String(perPage)}
          onValueChange={(value) => handlePerPageChange(Number(value))}
        >
          <Select.Trigger className="h-8 w-[60px] bg-background sm:w-[70px]">
            <Select.Value placeholder={perPage} />
          </Select.Trigger>
          <Select.Content>
            {pages.map((page) => (
              <Select.Item key={page} value={String(page)}>
                {page}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        {/* CURRENT PAGE INFO */}
        <span className="text-xs text-muted-foreground sm:text-sm">
          – {pagination.total} rows
        </span>
      </div>

      {/* ARROW BUTTONS - Right side */}
      <nav className="flex items-center gap-1">
        <ArrowButton
          value={1}
          icon={HiOutlineChevronDoubleLeft}
          onClick={handlePageChange}
        />
        <ArrowButton
          value={currentPage - 1}
          icon={HiOutlineChevronLeft}
          onClick={handlePageChange}
        />

        {/* NUMBER BUTTONS */}
        {Array.from({ length: endPage - beginPage + 1 }, (_, index) => {
          const pageIdx = beginPage + index;
          return (
            <NumberButton
              key={pageIdx}
              value={pageIdx}
              active={pageIdx == currentPage}
              onClick={handlePageChange}
            />
          );
        })}
        <ArrowButton
          value={currentPage + 1}
          icon={HiOutlineChevronRight}
          onClick={handlePageChange}
        />
        <ArrowButton
          value={maxPage}
          icon={HiOutlineChevronDoubleRight}
          onClick={handlePageChange}
        />
      </nav>
    </div>
  );
};

export default Pagination;