import clsx from "clsx";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

import { BsJoystick } from "react-icons/bs";
import { FaRightToBracket } from "react-icons/fa6";

import { AppContext } from "../../context/AppContext";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Button } from "../Buttons/Button";

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
        src="/assets/backgrounds/game-cta.png"
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
        <Button
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
          }
          className={clsx(
            "rounded-md border-none px-6 py-3 text-sm font-medium",
            "sm:py-2.5",
          )}
        >
          <BsJoystick className="mr-2.5" />
          {t("Select Game")}
        </Button>
        {!currentUser && (
          <Button
            color="light"
            onClick={() => onOpenSignUpModal()}
            className={clsx(
              "border-none px-6 py-3 text-sm font-medium",
              "sm:py-2.5",
            )}
          >
            <FaRightToBracket className="mr-2" />
            {t("Sign Up Today")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Stepup;
