import { useTranslation } from "react-i18next";
import Collapsible from "~/components/@radix-ui/Collapsible";
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

const Questions = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full overflow-hidden pt-8 sm:pt-12">
      <div className="relative flex w-full flex-col">
        <div className="flex flex-col">
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {t("AskList.title")}
          </h2>
          {listOfQuestion.map((props) => (
            <Collapsible key={uuidv4()} {...props} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
