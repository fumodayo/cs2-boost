import { useTranslation } from "react-i18next";
import Collapsible from "~/components/@radix-ui/Collapsible";

const Questions = () => {
  const { t } = useTranslation("common");
  const faqs = t("faq.questions", { returnObjects: true }) || [];

  return (
    <div className="relative w-full overflow-hidden pt-8 sm:pt-12">
      <div className="relative flex w-full flex-col">
        <div className="flex flex-col">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("faq.title")}
          </h2>
          {Array.isArray(faqs) &&
            faqs.map((faq) => (
              <Collapsible
                key={faq.key}
                title={faq.question}
                subtitle={faq.answer}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;