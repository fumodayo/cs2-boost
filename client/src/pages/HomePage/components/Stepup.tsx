import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BsJoystick } from "react-icons/bs";
import { FaRightToBracket } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { AppContext } from "~/components/context/AppContext";
import { Button } from "~/components/shared";
import cn from "~/libs/utils";
import { RootState } from "~/redux/store";

const Stepup = () => {
  const { t } = useTranslation();
  const { toggleRegisterModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div
      className={cn(
        "relative flex h-auto w-full flex-col items-center justify-center px-4 py-24",
        "sm:px-6 lg:py-60 xl:px-8",
      )}
    >
      <img
        className={cn(
          "absolute left-0 top-0 z-0 hidden h-full w-full select-none object-cover",
          "dark:block",
          "lg:h-auto",
        )}
        src="/assets/backgrounds/game-cta.png"
        loading="lazy"
        alt="cta"
      />
      <h2 className="font-display z-20 text-center text-4xl font-bold text-foreground">
        {t("Stepup.heading")}
      </h2>
      <p className="secondary z-20 mt-4 max-w-md text-center font-medium text-foreground/90">
        {t("Stepup.subheading")}
      </p>
      <div className="mt-8 flex items-center gap-x-4">
        <Button
          className={cn(
            "rounded-md bg-[#0B6CFB] px-6 py-3 text-sm text-white ring-inset hover:brightness-110 focus:outline-primary",
            "dark:ring-1 dark:ring-[#1a13a1]/50",
            "sm:py-2.5",
          )}
          variant="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <BsJoystick className="mr-2.5" />
          {t("Stepup.btn1")}
        </Button>
        {!currentUser && (
          <Button
            className={cn("rounded-md px-6 py-3 text-sm", "sm:py-2.5")}
            variant="light"
            onClick={toggleRegisterModal}
          >
            <FaRightToBracket className="mr-2" />
            {t("Stepup.btn2")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Stepup;
