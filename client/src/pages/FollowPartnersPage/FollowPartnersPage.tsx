import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heading, Helmet, Search } from "~/components/ui";
import { FaUsers, FaSearch } from "react-icons/fa";
import { Card } from "./components";
import { RootState } from "~/redux/store";
import { Button } from "~/components/ui/Button";
import { IUser } from "~/types";
import { useTranslation } from "react-i18next";

const FollowPartnersPage = () => {
  const { t } = useTranslation(["follow_partners_page", "common"]);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state: RootState) => state.user);

  const filteredPartners = currentUser?.following.filter((partner: IUser) =>
    partner.username?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  return (
    <>
      <Helmet title="follow_partners_page" />
      <div>
        <Heading
          icon={FaUsers}
          title="follow_partners_page_title"
          subtitle="follow_partners_page_subtitle"
        />
        <main className="mt-8">
          {currentUser && currentUser.following.length > 0 && (
            <div className="mb-8 flex">
              <Search
                placeholder={t("search_placeholder", {
                  ns: "follow_partners_page",
                })}
                value={searchTerm}
                onChangeValue={setSearchTerm}
              />
            </div>
          )}

          {filteredPartners && filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPartners.map((partner: IUser) => (
                <Card key={partner._id} {...partner} />
              ))}
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                {searchTerm ? <FaSearch size={28} /> : <FaUsers size={28} />}
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {searchTerm
                  ? t("empty_state.search_title", {
                      ns: "follow_partners_page",
                    })
                  : t("empty_state.no_follow_title", {
                      ns: "follow_partners_page",
                    })}
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                {searchTerm
                  ? t("empty_state.search_subtitle", {
                      ns: "follow_partners_page",
                    })
                  : t("empty_state.no_follow_subtitle", {
                      ns: "follow_partners_page",
                    })}
              </p>
              {!searchTerm && (
                <Link to="/partners">
                  <Button size="sm" variant="primary" className="mt-6">
                    {t("empty_state.explore_btn", {
                      ns: "follow_partners_page",
                    })}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default FollowPartnersPage;