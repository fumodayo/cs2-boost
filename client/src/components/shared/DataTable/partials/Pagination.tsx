import { IconType } from "react-icons";
import cn from "~/libs/utils";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
      "h-10 flex-grow rounded-md sm:w-10 sm:flex-grow-0",
    )}
    onClick={() => onClick(value)}
  >
    {value}
  </Button>
);

const Pagination = ({ pagination }: { pagination: IPagination }) => {
  const { t } = useTranslation();
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
    <div className="flex items-center justify-center px-2 sm:justify-end">
      <div className="flex flex-1 items-center justify-between gap-x-6 sm:flex-auto lg:gap-x-8">
        {/* SELECT PAGE */}
        <div className="hidden items-center space-x-2 sm:flex">
          <p className="text-sm font-medium">
            {t("DataTable.Pagination.label.Rows per page")}
          </p>
          <Select
            defaultValue={pages[0].toString()}
            value={String(perPage)}
            onValueChange={(value) => handlePerPageChange(Number(value))}
          >
            <Select.Trigger className="h-8 w-20">
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
        </div>

        {/* CURRENT PAGE */}
        <div className="hidden items-center justify-center text-sm font-medium sm:flex">
          {pagination.total} {t("DataTable.Pagination.label.rows – Page")}{" "}
          {currentPage} {t("DataTable.Pagination.label.to")} {maxPage}
        </div>

        {/* ARROW BUTTONS */}
        <nav className="w-full sm:w-auto">
          <div className="flex w-full items-center gap-1">
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
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
