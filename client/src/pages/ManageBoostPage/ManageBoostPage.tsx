import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { HiMiniRocketLaunch } from "react-icons/hi2";
import { ManageLevelFarming, ManagePremier, ManageWingman } from "./components";
import { useState } from "react";
import Tabs from "~/components/@radix-ui/Tabs";
import { useTranslation } from "react-i18next";

const ManageBoostPage = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState("premier");

  return (
    <>
      <Helmet title="Manage Boost · CS2Boost" />
      <div>
        <Heading
          icon={HiMiniRocketLaunch}
          title="Manage Boost"
          subtitle="Adjust rate multipliers for each region"
        />
        <main className="mt-8">
          <Tabs
            value={tab}
            onValueChange={setTab}
            tabs={[
              { value: "premier", label: t("ManageBoostPage.tabs.premier") },
              { value: "wingman", label: t("ManageBoostPage.tabs.wingman") },
              {
                value: "level-farming",
                label: t("ManageBoostPage.tabs.levelFarming"),
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
