import { Helmet, Search } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaWallet } from "react-icons/fa6";
import { useState } from "react";
import { Card } from "./components";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { v4 as uuidv4 } from "uuid";

const FollowPartnersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state: RootState) => state.user);

  const filteredPartners = currentUser?.following.filter((partner) =>
    partner.username?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  return (
    <>
      <Helmet title="My Following Partners List" />
      <div>
        <Heading
          icon={FaWallet}
          title="Following Partner"
          subtitle="List of all your following partners."
        />
        <main>
          <div className="mt-8 space-y-8">
            {/* SEARCH */}
            <div className="flex">
              <Search
                type="none"
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </div>
            {currentUser?.following.length === 0 && (
              <div className="mt-8 px-1">Hãy theo dõi thêm partner nhé ^^</div>
            )}
            <div className="grid grid-cols-4 gap-4">
              {filteredPartners?.map((card) => (
                <Card key={uuidv4()} {...card} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default FollowPartnersPage;
