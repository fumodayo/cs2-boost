import React from "react";
import { useTranslation } from "react-i18next";
import { FiSearch } from "react-icons/fi";
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
    <div className="group relative w-full max-w-sm">
      {/* Icon Search */}
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-white/70">
        <FiSearch className="size-4" />
      </div>

      <input
        className={cn(
          "flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-all duration-200",
          "pl-9 pr-11",
          "border-white/10 bg-muted/20 text-muted-foreground",
          "placeholder:text-muted-foreground/50",
          "hover:border-white/20 hover:bg-muted/30 hover:text-foreground",
          "focus-visible:border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
          "focus:bg-background focus:text-foreground",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={t("common:search_by_sender") || "Search by sender..."}
        type="text"
        {...props}
      />

      {/* Shortcut Key (/) */}
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <div className="flex size-6 items-center justify-center rounded-[4px] border border-white/10 bg-white/5 text-[10px] font-medium text-muted-foreground shadow-sm">
          <span className="mb-[1px] opacity-70">/</span>
        </div>
      </div>
    </div>
  );
};

export default Search;