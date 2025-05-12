import { IconType } from "react-icons";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi2";
import { Button } from "~/components/shared";
import cn from "~/libs/utils";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconType;
}

interface IPaginationProps {
  currentPage: number;
  setPage: (page: number) => void;
  totalPages: number;
}

const ArrowButton = ({ icon: Icon, ...props }: IButtonProps) => (
  <Button
    variant="transparent"
    disabled={props.disabled}
    className="h-10 w-10 flex-grow rounded-md border border-input text-sm font-medium shadow-sm sm:flex-grow-0"
    {...props}
  >
    {Icon && <Icon />}
  </Button>
);

const Pagination = ({ currentPage, setPage, totalPages }: IPaginationProps) => {
  const handleClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const renderPageNumbers = () => {
    let pages: (number | string)[] = [];

    if (totalPages <= 7) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 4) {
      pages = [1, 2, 3, 4, 5, 6, "...", totalPages];
    } else if (currentPage >= totalPages - 3) {
      pages = [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pages = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    }

    return pages.map((page, index) => (
      <Button
        key={index}
        variant="transparent"
        className={cn(
          currentPage === page
            ? "bg-primary p-0 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            : "border border-input bg-transparent p-0 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground",
          "h-10 flex-grow rounded-md sm:w-10 sm:flex-grow-0",
        )}
        onClick={() => typeof page === "number" && handleClick(page)}
      >
        {page}
      </Button>
    ));
  };

  return (
    <div className="flex space-x-2 rounded-lg p-2 text-white">
      <ArrowButton
        disabled={currentPage === 1}
        icon={HiOutlineChevronLeft}
        onClick={() => handleClick(currentPage - 1)}
      />

      {renderPageNumbers()}

      <ArrowButton
        disabled={currentPage === totalPages}
        icon={HiOutlineChevronRight}
        onClick={() => handleClick(currentPage + 1)}
      />
    </div>
  );
};

export default Pagination;
