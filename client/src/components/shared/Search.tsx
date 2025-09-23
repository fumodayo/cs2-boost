import React from "react";
import { useTranslation } from "react-i18next";
import cn from "~/libs/utils";

interface ISearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (value: string) => void;
}

const Search: React.FC<ISearchProps> = ({
  value,
  onChangeValue,
  className,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <input
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-card-alt px-3 py-1 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[250px]",
          className,
        )}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={`${t("DataTable.PlusButton.label.Search")}...`}
        type="text"
        {...props}
      />
      <div className="pointer-events-none absolute right-1.5 top-1/2 flex size-5 -translate-y-1/2 items-center rounded bg-secondary ring-1 ring-border">
        <span className="mx-auto text-sm text-muted-foreground">/</span>
      </div>
    </div>
  );
};

export default Search;
