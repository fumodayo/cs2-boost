import { useTranslation } from "react-i18next";
import { Details } from "~/components/ui";
import { FaqItem, Tab, TabDataFromJSON } from "~/types/translate.types";

const ListDetail = () => {
  const { t } = useTranslation("common");

  const detailsTabsData = t("details.tabs", {
    returnObjects: true,
    ns: "common",
  }) as Record<string, TabDataFromJSON>;
  const faqData =
    (t("faq.questions", { returnObjects: true, ns: "common" }) as FaqItem[]) ||
    [];

  const tabs: Tab[] = Object.values(detailsTabsData).map((tabData) => ({
    heading: tabData.heading,
    panel: tabData.items ? Object.values(tabData.items) : [],
    isQuestions: tabData.heading === detailsTabsData.faq.heading,
  }));

  return (
    <Details
      title={t("details.title")}
      subtitle={t("details.subtitle.premier")}
      tabs={tabs}
      questions={faqData}
    />
  );
};

export default ListDetail;