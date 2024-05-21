import clsx from "clsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { BsJoystick } from "react-icons/bs";
import { FaRightToBracket } from "react-icons/fa6";

import { AppContext } from "../../context/AppContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Stepup = () => {
  const { t } = useTranslation();

  const { onOpenSignUpModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div
      className={clsx(
        "relative flex h-auto w-full flex-col items-center justify-center px-4 py-24",
        "sm:px-6 lg:py-60 xl:px-8",
      )}
    >
      <img
        src="/src/assets/backgrounds/game-cta.png"
        className={clsx(
          "absolute left-0 top-0 z-0 hidden h-full w-full select-none object-cover",
          "lg:h-auto",
          "dark:block",
        )}
        alt="cta"
      />
      <h2 className="font-display z-20 text-center text-4xl font-bold text-foreground">
        {t("What are you waiting for")}?
      </h2>
      <p className="secondary z-20 mt-4 max-w-md text-center font-medium text-foreground">
        {t(
          "Step up your game now! Let our pros boost your level and guide you to the higher ranks you deserve",
        )}
        .
      </p>
      <div className="mt-8 flex items-center gap-x-4">
        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          }
          className={clsx(
            "blue-glow relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-[#0B6CFB] px-6 py-3 text-sm font-medium text-white outline-none ring-inset transition-colors",
            "hover:brightness-110 focus:outline focus:outline-offset-2 focus:outline-primary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
            "dark:ring-1 dark:ring-[#1a13a1]/50 sm:py-2.5",
          )}
        >
          <BsJoystick className="mr-2.5" />
          {t("Select Game")}
        </button>
        {!currentUser && (
          <button
            onClick={() => onOpenSignUpModal()}
            type="button"
            className={clsx(
              "relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary-light px-6 py-3 text-sm font-medium text-secondary-light-foreground outline-none transition-colors",
              "hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
              "sm:py-2.5",
            )}
          >
            <FaRightToBracket className="mr-2" />
            {t("Sign Up Today")}
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepup;
