import { Disclosure } from "@headlessui/react";
import { IoChevronDownOutline } from "react-icons/io5";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

const questions = [
  {
    title: "What is GameBoost?",
    subtitle:
      "GameBoost is your all-in-one gaming solution for affordable Boosting, expert Coaching, and top-quality gaming accounts. We support popular games such as",
  },
  {
    title: "What types of payment methods does GameBoost accept",
    subtitle:
      "GameBoost accepts all major debit and credit cards, PayPal, PaySafeCard, Apple Pay, Google Pay, Direct Bank Transfer, and Skrill, providing you with a variety of payment options to choose from",
  },
  {
    title: "Why Should I Choose GameBoost",
    subtitle:
      "GameBoost is the highest rated platform on TrustPilot, with a 5.0-star rating and up to 40% lower prices than the competition. Combined with 24/7 live support, this makes us the most affordable and trustworthy gaming services platform on the market",
  },
  {
    title: "How do I leave feedback or review for the services",
    subtitle:
      "We highly value customer feedback so if you want to take a moment to leave us a review you can do it on: Trustpilot and Discord. We really appreciate it",
  },
  {
    title: "Does GameBoost offer discounts or promotions for its services",
    subtitle:
      "At GameBoost, we offer discounts, promotions, and events with the chance to win amazing prizes. Feel free to contact our LiveChat for a discount code if you don't have one and to follow our Discord for new events! Discord",
  },
  {
    title: "I have more questions, where can I get more info",
    subtitle: "We are here 24/7. Feel free to contact us on our Live Chat",
  },
];

interface QuestionItemProps {
  title?: string;
  subtitle?: string;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ title, subtitle }) => {
  const { t } = useTranslation();

  return (
    <Disclosure>
      {({ open }) => (
        <div
          className={clsx(
            "z-20 mt-5 flex w-full flex-col rounded-2xl border border-border bg-card bg-opacity-80 shadow-lg backdrop-blur-md transition-colors",
            "dark:bg-[#141825]/95",
          )}
          style={{
            boxShadow: "0px 0px 2px 0px rgba(255, 255, 255, 0.06) inset",
          }}
        >
          <Disclosure.Button className="p-6">
            <div className="flex w-full">
              <p className="text-left font-semibold text-foreground">
                {title && t(title)}?
              </p>
              <IoChevronDownOutline
                className={clsx(
                  "ml-auto text-muted-foreground transition-transform",
                  "dark:text-[#757A95]",
                  open ? "rotate-180 transform" : "",
                )}
              />
            </div>
          </Disclosure.Button>
          <Disclosure.Panel
            className={clsx(
              "disclosure-panel mr-auto flex cursor-auto flex-col px-6 pb-6 text-left text-sm font-medium text-muted-foreground",
              "dark:text-[#B4B9D8]",
            )}
          >
            {subtitle && t(subtitle)}.
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

const Questions = () => {
  const { t } = useTranslation();

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className={clsx(
          "relative z-20 mx-auto flex w-full max-w-7xl flex-col px-4",
          "sm:px-6 xl:px-8",
        )}
      >
        <div className="grid grid-cols-5">
          <div
            className={clsx(
              "col-span-5 flex flex-col items-center justify-center text-center",
              "md:items-start md:text-start lg:col-span-2",
            )}
          >
            <h2
              className={clsx(
                "font-display max-w-md text-4xl font-bold tracking-tight text-foreground",
                "md:max-w-xs",
              )}
            >
              {t("Frequently Asked Questions")}
            </h2>
            <p
              className={clsx(
                "mt-4 max-w-md font-medium text-foreground",
                "md:max-w-xs",
              )}
            >
              {t(
                "Got anymore questions? Feel free to contact us on Discord or Live Chat",
              )}
              !
            </p>
          </div>
          <div
            className={clsx(
              "relative col-span-5 mt-12 flex flex-col",
              "lg:col-span-3 lg:mt-0",
            )}
          >
            {questions.map((item) => (
              <QuestionItem title={item.title} subtitle={item.subtitle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
