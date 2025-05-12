import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import cn from "~/libs/utils";

interface ISearchProps {
  type?: "params" | "none";
  searchTerm?: string;
  setSearchTerm: (term: string) => void;
}

const Search = ({
  type = "params",
  searchTerm,
  setSearchTerm,
}: ISearchProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (value: string) => {
    if (type === "params") {
      setSearchTerm(value);
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      params.append("search", value);
      setSearchParams(params);
    }
    if (type === "none") {
      setSearchTerm(value);
    }
  };

  return (
    <div className="relative">
      <input
        className={cn(
          "flex h-8 w-[150px] rounded-md border border-input bg-card-alt px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "lg:w-[250px] w-full",
        )}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={`${t("DataTable.PlusButton.label.Search")}...`}
        type="text"
      />
      <div className="pointer-events-none absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center rounded bg-secondary ring-1 ring-border">
        <span className="mx-auto text-sm text-muted-foreground">/</span>
      </div>
    </div>
  );
};

export default Search;
