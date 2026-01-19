import * as Tabs from "@radix-ui/react-tabs";
import Collapsible from "~/components/@radix-ui/Collapsible";
import { FaCheck } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { DetailsProps } from "~/types/translate.types";

const Details = ({ title, subtitle, tabs, questions = [] }: DetailsProps) => {
  return (
    <div className="w-full rounded-lg bg-card px-4 pb-8 pt-5 shadow-md sm:px-8 sm:pb-10 sm:pt-6">
      <div className="flex flex-col gap-3 pb-4 sm:gap-4">
        <h2 className="text-base font-bold sm:text-lg">{title}</h2>
        <p className="secondary mb-2 text-xs text-muted-foreground sm:mb-4 sm:text-base">
          {subtitle}
        </p>
        <Tabs.Root defaultValue="0">
          <Tabs.List className="flex flex-wrap gap-2 sm:gap-6">
            {tabs.map(({ heading }, idx) => (
              <Tabs.Trigger
                key={uuidv4()}
                value={idx.toString()}
                className="rounded-lg bg-accent px-3 py-2 text-xs font-medium text-foreground focus:outline-none data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground sm:px-8 sm:py-2.5 sm:text-base"
              >
                {heading}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {tabs.map(({ panel, isQuestions }, idx) => (
            <Tabs.Content
              key={uuidv4()}
              value={idx.toString()}
              className="ml-0 flex flex-col gap-2 text-muted-foreground sm:ml-2 sm:gap-3"
            >
              <div className="mt-3 sm:mt-4">
                {panel.map(({ title, subtitle }) => (
                  <div
                    key={uuidv4()}
                    className="mt-2 flex items-start gap-3 sm:items-center sm:gap-4"
                  >
                    <FaCheck className="mt-0.5 flex-shrink-0 text-xs text-blue-600 sm:mt-0 sm:text-base" />
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                      <span className="text-xs text-blue-600 sm:text-base">
                        {title}
                      </span>
                      <p className="text-xs sm:text-base">{subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              {isQuestions &&
                questions.map((faq) => (
                  <Collapsible
                    key={faq.key}
                    title={faq.question}
                    subtitle={faq.answer}
                  />
                ))}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </div>
  );
};

export default Details;