import { useTranslation } from "react-i18next";
import Collapsible from "~/components/@radix-ui/Collapsible";

const Questions = () => {
  const { t } = useTranslation("landing");
  const faqs = t("ask_list.faq", { returnObjects: true }) || [];

  return (
    <div>
      {Array.isArray(faqs) &&
        faqs.map((faq) => (
          <Collapsible
            key={faq.key}
            title={faq.question}
            subtitle={faq.answer}
          />
        ))}
    </div>
  );
};

export default Questions;