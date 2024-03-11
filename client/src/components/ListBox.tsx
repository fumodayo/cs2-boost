import { startTransition, useMemo, useState } from "react";
import { matchSorter } from "match-sorter";
import * as RadixSelect from "@radix-ui/react-select";
import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";

const languages = [
  { label: "English", value: "en" },
  { label: "Vietnamese", value: "vn" },
];

const ListBox = () => {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => {
    if (!searchValue) return languages;
    const keys = ["label", "value"];
    const matches = matchSorter(languages, searchValue, { keys });
    // Radix Select does not work if we don't render the selected item, so we
    // make sure to include it in the list of matches.
    const selectedLanguage = languages.find((lang) => lang.value === value);
    if (selectedLanguage && !matches.includes(selectedLanguage)) {
      matches.push(selectedLanguage);
    }
    return matches;
  }, [searchValue, value]);

  return (
    <RadixSelect.Root
      value={value}
      onValueChange={setValue}
      open={open}
      onOpenChange={setOpen}
    >
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        includesBaseElement={false}
        setValue={(value) => {
          startTransition(() => setSearchValue(value));
        }}
      >
        <RadixSelect.Trigger className="select">
          <RadixSelect.Value placeholder="Select a language" />
        </RadixSelect.Trigger>
        <RadixSelect.Content role="dialog">
          <div className="combobox-wrapper">
            <div className="combobox-icon"></div>
            <Combobox
              autoSelect
              placeholder="Search languages"
              className="combobox"
              onBlurCapture={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          <ComboboxList className="listbox">
            {matches.map(({ label, value }) => (
              <RadixSelect.Item
                key={value}
                value={value}
                asChild
                className="item"
              >
                <ComboboxItem>
                  <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="item-indicator">
                    Check Icon
                  </RadixSelect.ItemIndicator>
                </ComboboxItem>
              </RadixSelect.Item>
            ))}
          </ComboboxList>
        </RadixSelect.Content>
      </ComboboxProvider>
    </RadixSelect.Root>
  );
};

export default ListBox;
