import { Heading, Helmet } from "~/components/ui";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { ManageLevelFarming, ManagePremier, ManageWingman } from "./components";
import { useLocation, useNavigate } from "react-router-dom";
import Tabs from "~/components/@radix-ui/Tabs";
import { useTranslation } from "react-i18next";
const ManageBoostPage = () => {
  const { t } = useTranslation(["manage_boost_page", "common"]);
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split("/");
  const currentTab = pathParts[pathParts.length - 1] || "premier";
  const validTabs = ["premier", "wingman", "level-farming"];
  const tab = validTabs.includes(currentTab) ? currentTab : "premier";
  const handleTabChange = (newTab: string) => {
    navigate(`/admin/manage-boost/${newTab}`);
  };
  return (
    <>
      <Helmet title="manage_boost_page" />
      <div>
        <Heading
          icon={HiMiniRocketLaunch}
          title="manage_boost_page_title"
          subtitle="manage_boost_page_subtitle"
        />
        <main className="mt-8">
          <Tabs
            value={tab}
            onValueChange={handleTabChange}
            tabs={[
              { value: "premier", label: t("tabs.premier") },
              { value: "wingman", label: t("tabs.wingman") },
              {
                value: "level-farming",
                label: t("tabs.level_farming"),
              },
            ]}
            contents={[
              <ManagePremier key="premier" />,
              <ManageWingman key="wingman" />,
              <ManageLevelFarming key="level-farming" />,
            ]}
          />
        </main>
      </div>
    </>
  );
};
export default ManageBoostPage;