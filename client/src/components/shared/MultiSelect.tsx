import { useContext } from "react";
import Select, { StylesConfig } from "react-select";
import { ICurrentUserProps, IThemeProps } from "~/types";
import { AppContext } from "../context/AppContext";
import Chip from "./Chip";
import { useSocketContext } from "~/hooks/useSocketContext";

const customStyles = (theme: IThemeProps): StylesConfig<ICurrentUserProps> => ({
  control: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#13151a" : "#fff",
    borderColor: theme === "dark" ? "#333" : "#ccc",
    color: theme === "dark" ? "#A2A2A8" : "#000",
    boxShadow: "none",
    fontSize: 15,
    borderRadius: "5px",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: theme === "dark" ? "#181b20" : "#fff",
    borderRadius: "5px",
  }),
  option: (base, { isFocused }) => ({
    ...base,
    backgroundColor: isFocused
      ? theme === "dark"
        ? "#333"
        : "#f0f0f0"
      : "transparent",
    color: theme === "dark" ? "#fff" : "#000",
    padding: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "5px",
  }),
  singleValue: (base) => ({
    ...base,
    color: theme === "dark" ? "#fff" : "#000",
    fontSize: "0.875rem",
  }),
});

const SelectItem = (partner: ICurrentUserProps) => {
  const { profile_picture, user_id, username, _id } = partner;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(_id as string);

  return (
    <div className="flex w-full items-center justify-between gap-x-1.5">
      <div className="flex items-center gap-3">
        <div className="relative block h-8 w-8 shrink-0 rounded-full text-sm">
          <img
            src={profile_picture}
            alt={user_id}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="ml-1 truncate">
          <div className="truncate text-sm font-medium text-foreground">
            <span>{username}</span>
          </div>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          #{user_id}
        </span>
      </div>
      {isOnline ? (
        <Chip className="bg-success-light text-success-light-foreground ring-success-ring">
          Online
        </Chip>
      ) : (
        <Chip className="text-danger-light-foreground ring-danger-ring">
          Offline
        </Chip>
      )}
    </div>
  );
};

const MultiSelect = ({
  options,
  ...props
}: { options: ICurrentUserProps[] } & React.ComponentProps<
  typeof Select<ICurrentUserProps>
>) => {
  const { theme } = useContext(AppContext);

  return (
    <Select
      styles={customStyles(theme)}
      isClearable
      isSearchable
      name="partner"
      placeholder="Search for a booster..."
      options={options}
      getOptionLabel={(e) => e.username as string}
      getOptionValue={(e) => e.user_id as string}
      formatOptionLabel={(e) => <SelectItem {...e} />}
      {...props}
    />
  );
};

export default MultiSelect;
