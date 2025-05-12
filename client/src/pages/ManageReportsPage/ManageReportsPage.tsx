import { Button, Chip, Helmet, Search } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { TbLibraryPlus, TbMessageReportFilled } from "react-icons/tb";
import { useState } from "react";
import { Inbox } from "./components";
import { HiOutlineExternalLink } from "react-icons/hi";

const ManageReportsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Helmet title="Manage Reports · CS2Boost" />
      <div>
        <Heading
          icon={TbMessageReportFilled}
          title="Reports List"
          subtitle="List of all reports."
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              {/* CHATS */}
              <div className="flex space-x-4">
                {/* SIDEBAR */}
                <div className="w-1/5 space-y-2">
                  {/* TITLE */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <h1 className="font-semibold">Inbox</h1>
                      <Chip>2 New</Chip>
                    </div>
                    <Button>
                      <TbLibraryPlus className="secondary" size={20} />
                    </Button>
                  </div>
                  {/* SEARCH */}
                  <div className="flex w-full">
                    <Search
                      type="none"
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                    />
                  </div>
                  {/* INBOX LIST */}
                  <div className="h-[100dvh] space-y-1 overflow-auto">
                    <Inbox />
                    <Inbox />
                    <Inbox />
                    <Inbox />
                    <Inbox />
                    <Inbox />
                    <Inbox />
                    <Inbox />
                    <Inbox />
                  </div>
                </div>
                {/* HEADER */}
                <div className="w-4/5">
                  <div className="flex justify-between rounded-md border-b-2 border-border bg-card p-3 shadow">
                    <div className="flex space-x-2">
                      <div className="relative block h-10 w-10 shrink-0 rounded-full text-sm">
                        <img
                          className="h-full w-full rounded-full object-cover"
                          src="https://res.cloudinary.com/du93troxt/image/upload/v1714744499/avatar_qyersf.jpg"
                          alt="avatar"
                        />
                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-card" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="font-semibold">Marting Markgatt</p>
                          <span className="text-sm">1 min</span>
                        </div>
                        <Chip>Partner</Chip>
                      </div>
                    </div>
                    <Button>
                      <HiOutlineExternalLink size={20} />
                    </Button>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManageReportsPage;
