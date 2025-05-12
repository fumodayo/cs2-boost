import * as Tabs from "@radix-ui/react-tabs";
import Collapsible from "../@radix-ui/Collapsible";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

const listOfQuestion = [
  {
    title: "What is Counter Strike 2 Boost?",
    subtitle:
      "If you’re seeking to elevate your gaming experience in Counter Strike 2 but lack the time or dedication to climb the ranks on your own, you can explore the option of utilizing a CS2 boosting service. This service enables you to enlist the expertise of a skilled player who will play on your behalf and help you attain your desired rank.",
  },
  {
    title: "CS2 Boosting is it safe?",
    subtitle:
      "When striving for progress in the gaming world, the preservation of your achievements becomes paramount. To guarantee a secure and discreet CS2 boost, we exclusively enlist the services of exceptional and trustworthy boosters, each equipped with our premium private VPN. This extensively tested approach has proven its effectiveness in countless games, providing you with peace of mind and assurance of a risk-free experience when utilizing our service.",
  },
  {
    title: "How can I be sure my Steam account won't be stolen?",
    subtitle:
      "The combination of your unique login credentials and the protection provided by Steam Guard makes it virtually impossible for anyone to steal your account. We prioritize the utmost security measures to ensure your peace of mind and safeguard your valuable gaming assets.",
  },
  {
    title: "How does CS2 boosting work?",
    subtitle:
      "CS2 boosting involves hiring professional players who will play on your account to help you achieve your desired rank. They use their skills and expertise to win matches and enhance your in-game performance.",
  },
  {
    title: "How long does CS2 boosting take?",
    subtitle:
      "The duration of CS2 boosting depends on various factors, including your current rank and the desired rank. Generally, our boosters work efficiently to complete the boosting process as quickly as possible while maintaining the highest quality standards. You can check the estimated completion time for your specific order in our Members Area dashboard.",
  },
];

type Panel = {
  title?: string;
  subtitle?: string;
};

type Tab = {
  heading: string;
  panel: Panel[];
  isQuestions?: boolean;
};

interface IDetailsProps {
  title: string;
  subtitle?: string;
  tabs: Tab[];
}

const Details = ({ title = "Info", subtitle, tabs }: IDetailsProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full rounded-lg bg-card pb-10 pl-8 pr-8 pt-6 shadow-md">
      <div className="flex flex-col gap-4 pb-4">
        <h2 className="text-lg font-bold">{t(`Details.title.${title}`)}</h2>
        <p className="secondary mb-4 text-muted-foreground">
          {t(`Details.subtitle.${subtitle}`)}
        </p>
        <Tabs.Root defaultValue="0">
          <Tabs.List className="flex gap-6">
            {tabs.map(({ heading }, idx) => (
              <Tabs.Trigger
                key={uuidv4()}
                value={idx.toString()}
                className="text-md text-md rounded-lg bg-accent px-8 py-2.5 font-medium text-foreground focus:outline-none data-[state=active]:bg-blue-600 data-[state=active]:text-primary-foreground"
              >
                {t(`Details.tabs.heading.${heading}`)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {tabs.map(({ panel, isQuestions }, idx) => (
            <Tabs.Content
              key={uuidv4()}
              value={idx.toString()}
              className="ml-2 flex flex-col gap-3 text-muted-foreground"
            >
              <div className="mt-4">
                {panel.map(({ title, subtitle }) => (
                  <div key={uuidv4()} className="mt-2 flex items-center gap-4">
                    <FaCheck className="text-blue-600" />
                    <div className="flex gap-2">
                      <span className="text-blue-600">
                        {t(`Details.tabs.title.${title}`)}
                      </span>
                      <p>{t(`Details.tabs.subtitle.${subtitle}`)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {isQuestions &&
                listOfQuestion.map((props) => (
                  <Collapsible key={uuidv4()} {...props} />
                ))}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </div>
  );
};

export default Details;
