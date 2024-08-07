import * as Select from "@radix-ui/react-select";
import clsx from "clsx";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { FaChevronDown } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./Buttons/Button";

type NavigationButtonProps = {
  icon: IconType;
  value: number;
  onClick: (value: number) => void;
};

type NumberButtonProps = {
  value: number;
  active?: boolean;
  onClick: (value: number) => void;
};

interface NavigationProps {
  countingPage?: number;
  page?: number;
  pages?: number;
}

const ArrowButton: React.FC<NavigationButtonProps> = ({
  icon: Icon,
  value,
  onClick,
}) => {
  return (
    <Button
      color="transparent"
      onClick={() => onClick(value)}
      className={clsx(
        "h-10 w-10 flex-grow rounded-md border border-input text-sm font-medium shadow-sm",
        "sm:flex-grow-0",
      )}
    >
      {Icon && <Icon />}
    </Button>
  );
};

const NumberButton: React.FC<NumberButtonProps> = ({
  value,
  active,
  onClick,
}) => {
  return (
    <Button
      color="none"
      onClick={() => onClick(value)}
      className={clsx(
        active
          ? "bg-primary p-0 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          : "border border-input bg-transparent p-0  text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground",
        "h-10 flex-grow rounded-md",
        "sm:w-10 sm:flex-grow-0",
      )}
    >
      {value}
    </Button>
  );
};

const Navigation: React.FC<NavigationProps> = ({
  countingPage,
  page,
  pages,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentParams = queryString.parse(location.search);
  const selectRowsPerPage = ["5", "10", "15", "20", "30"];

  const [pageSize, setPageSize] = useState<string>(() => {
    return (currentParams.pageSize as string) || "5";
  });

  useEffect(() => {
    const params = queryString.parse(location.search);
    setPageSize((params.pageSize as string) || "5");
  }, [location.search]);

  if (!page || !pages) {
    return null;
  }

  const numButtonsToShow = 3;
  const startPage = Math.max(1, page - Math.floor(numButtonsToShow / 2));
  const endPage = Math.min(pages, startPage + numButtonsToShow - 1);

  const handlePageChange = (value: number) => {
    if (value > 0 && value <= pages) {
      const queryParams = { ...currentParams, page: value };
      navigate({
        pathname: location.pathname,
        search: queryString.stringify(queryParams),
      });
    }
  };

  const handlePageSizeChange = (value: string) => {
    if (Number(value) > 0) {
      const queryParams = {
        ...currentParams,
        pageSize: value,
        page: 1, // reset to first page when pageSize changes
      };
      navigate({
        pathname: location.pathname,
        search: queryString.stringify(queryParams),
      });
    }
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-center px-2",
        "sm:justify-end",
      )}
    >
      <div
        className={clsx(
          "flex flex-1 items-center justify-between gap-x-6",
          "sm:flex-auto lg:gap-x-8",
        )}
      >
        <div className="hidden items-center space-x-2 sm:flex">
          <p className="text-sm font-medium">Rows per page</p>
          <Select.Root value={pageSize} onValueChange={handlePageSizeChange}>
            <Select.Trigger>
              <Button
                color="transparent"
                className="h-8 w-[70px] justify-between rounded-md px-3 py-2 text-sm shadow-sm"
              >
                <Select.Value placeholder="5" />
                <Select.Icon>
                  <FaChevronDown className="h-4 w-4 opacity-50" />
                </Select.Icon>
              </Button>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                side="top"
                align="end"
                sideOffset={10}
                alignOffset={10}
                className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-border/50 bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              >
                <Select.Viewport>
                  <Select.Group>
                    {selectRowsPerPage.map((value) => (
                      <Select.Item
                        key={value}
                        className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground"
                        value={value}
                      >
                        <Select.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <FaCheck />
                        </Select.ItemIndicator>
                        <Select.ItemText className="w-1/3">
                          {value}
                        </Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <div className="hidden items-center justify-center text-sm font-medium sm:flex">
          {countingPage} rows – Page {page} to {pages}
        </div>
        <nav className="w-full sm:w-auto">
          <div className="flex w-full items-center gap-1">
            <ArrowButton
              icon={HiOutlineChevronDoubleLeft}
              value={1}
              onClick={handlePageChange}
            />
            <ArrowButton
              icon={HiChevronLeft}
              value={page - 1}
              onClick={handlePageChange}
            />

            {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
              const pageNum = startPage + index;
              return (
                <NumberButton
                  key={pageNum}
                  value={pageNum}
                  active={pageNum === page}
                  onClick={handlePageChange}
                />
              );
            })}

            <ArrowButton
              icon={HiChevronRight}
              value={page + 1}
              onClick={handlePageChange}
            />
            <ArrowButton
              icon={HiOutlineChevronDoubleRight}
              value={pages}
              onClick={handlePageChange}
            />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
