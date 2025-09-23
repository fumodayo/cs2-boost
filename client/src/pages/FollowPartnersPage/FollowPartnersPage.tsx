import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Helmet, Search } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaUsers, FaSearch } from "react-icons/fa";
import { Card } from "./components";
import { RootState } from "~/redux/store";
import { Button } from "~/components/shared/Button";
import { IUser } from "~/types";
import { useTranslation } from "react-i18next";

const FollowPartnersPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state: RootState) => state.user);

  const filteredPartners = currentUser?.following.filter((partner: IUser) =>
    partner.username?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  return (
    <>
      <Helmet title="My Following Partners" />
      <div>
        <Heading
          icon={FaUsers}
          title="Following Partners"
          subtitle="A list of all the partners you are following."
        />
        <main className="mt-8">
          {currentUser && currentUser.following.length > 0 && (
            <div className="mb-8 flex">
              <Search value={searchTerm} onChangeValue={setSearchTerm} />
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
                  ? t("FollowPartnersPage.emptyState.searchTitle")
                  : t("FollowPartnersPage.emptyState.noFollowTitle")}
              </h3>
              <p className="mt-2 max-w-sm text-muted-foreground">
                {searchTerm
                  ? t("FollowPartnersPage.emptyState.searchSubtitle")
                  : t("FollowPartnersPage.emptyState.noFollowSubtitle")}
              </p>
              {!searchTerm && (
                <Link to="/partners">
                  <Button size="sm" variant="primary" className="mt-6">
                    {t("FollowPartnersPage.emptyState.exploreBtn")}
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
