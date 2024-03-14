import { FaUserEdit } from "react-icons/fa";
import UserPage from "../../components/UserPage";
import * as Tabs from "@radix-ui/react-tabs";
import "react-tabs/style/react-tabs.css";
import { HiMiniRectangleStack } from "react-icons/hi2";
import { FaPassport } from "react-icons/fa6";
import { useState } from "react";
import General from "../../components/Settings/General";
import IDVerification from "../../components/Settings/IDVerification";

const tabHeaders = [
  {
    label: "General",
    value: "general",
    icon: HiMiniRectangleStack,
  },
  {
    label: "ID Verification",
    value: "id-verification",
    icon: FaPassport,
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("general");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <UserPage>
      <div className="container">
        <div>
          <div className="w-full">
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-y-4">
              <div className="min-w-fit flex-1 flex-grow md:min-w-0">
                <div className="flex flex-wrap items-center gap-y-4">
                  <div className="mr-5 flex-shrink-0">
                    <div className="relative">
                      <div className="relative block h-12 w-12 shrink-0 rounded-full text-xl sm:h-16 sm:w-16">
                        <img
                          src="https://cdn.gameboost.com/users/19918/avatar/AAcHTtdFRpMwux-WHt9RoMHs81i8OXPo9eQNI82d1caCUqQLRjU=s96-c.jpeg"
                          className="h-full w-full rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-card" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-1.5 sm:truncate">
                    <h1 className="font-display flex flex-wrap items-center text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                      Sơn Thái
                    </h1>
                    <p className="text-sm font-medium text-muted-foreground sm:truncate">
                      <div className="inline-flex flex-wrap items-center gap-1">
                        <div className="lowercase">@son-thai</div>
                        <span> ⸱ </span>
                        <div>9 boosts</div>
                        <span> ⸱ </span>
                        <div>0 accounts</div>
                      </div>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 sm:justify-normal md:ml-4 md:mt-0">
                <button className="relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm outline-none transition-colors hover:bg-primary-hover focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
                  <FaUserEdit className="mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>

            {/* TABS */}
            <Tabs.Root className="mt-5" defaultValue="general">
              <Tabs.List className="relative flex gap-x-2 w-full pb-6">
                {tabHeaders.map((header) => (
                  <Tabs.Trigger
                    key={header.value}
                    value={header.value}
                    className={
                      activeTab === header.value
                        ? "active-tab flex h-10 flex-shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium"
                        : "flex h-10 flex-shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                    onClick={() => handleTabChange(header.value)}
                  >
                    <header.icon className="mr-1.5 inline-block opacity-100" />
                    {header.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
              <Tabs.Content value="general">
                <General />
              </Tabs.Content>
              <Tabs.Content value="id-verification">
                <IDVerification />
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </div>
      </div>
    </UserPage>
  );
};

export default Settings;
