import { useCallback, useState } from "react";
import clsx from "clsx";
import {
  FaDiscord,
  FaGoogle,
  FaSteam,
  FaFacebook,
  FaTwitch,
} from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { IconType } from "react-icons";

const socialMedia = [
  {
    icon: FaDiscord,
    title: "Discord",
    subtitle: "Login with Discord",
    color: "#5865f2",
  },
  {
    icon: FaGoogle,
    title: "Google",
    subtitle: "Login with Google",
    color: "#ea4335",
  },
  {
    icon: FaSteam,
    title: "Steam",
    subtitle: "Login with Steam",
    color: "#1348a3",
  },
  {
    icon: FaFacebook,
    title: "Facebook",
    subtitle: "Login with Facebook",
    color: "#1877f2",
  },
  {
    icon: FaTwitch,
    title: "Twitch",
    subtitle: "Login with Twitch",
    color: "#9146ff",
  },
];

type SocialServiceProps = {
  icon?: IconType;
  title?: string;
  subtitle?: string;
  color?: string;
};

const SocialService: React.FC<SocialServiceProps> = ({
  icon: Icon,
  subtitle,
  color,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const dynamicStyles = isHovered
    ? {
        backgroundColor: color,
        color: color,
        ringColor: color,
      }
    : {};

  return (
    <a
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        "relative inline-flex flex-1 items-center justify-center overflow-hidden whitespace-nowrap rounded-md bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors",
        `hover:bg-secondary-hover hover:!text-neutral-100 focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:py-2.5`,
      )}
      style={{
        ...dynamicStyles,
      }}
    >
      {Icon && <Icon className="text-lg" />}
      <span className="sr-only">{subtitle}</span>
    </a>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
  text?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  content,
  title,
  subtitle,
  text,
}) => {
  const handleClose = useCallback(() => {
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background backdrop-blur-sm">
      <div
        className={clsx(
          "fixed top-1/2 z-50 mx-auto min-h-fit w-full -translate-y-1/2 rounded-xl text-left shadow-xl outline-none transition-all",
          "sm:left-1/2 sm:max-w-4xl sm:-translate-x-1/2",
          "focus:outline-none",
        )}
      >
        <div className="flex w-full overflow-hidden rounded-lg bg-card">
          <div
            className={clsx(
              "order-1 hidden rounded-r-lg bg-cover bg-center md:block md:w-1/2",
            )}
          >
            <img className="w-full h-full object-cover" src="/src/assets/illustrations/login-bg.png" alt="logo" />
          </div>
          <div
            className={clsx(
              "order-0 mx-auto w-full p-8 py-12 sm:max-w-lg sm:p-14 md:w-1/2",
            )}
          >
            <h2 className="font-display mb-2 text-3xl font-semibold text-foreground">
              {title}
            </h2>
            {subtitle}
            <div className="mt-8">
              <div className="space-y-8">
                <div
                  className={clsx(
                    "flex items-center justify-between gap-2 sm:gap-2",
                  )}
                >
                  {/* SOCIAL */}
                  {socialMedia.map((item) => (
                    <SocialService
                      icon={item.icon}
                      subtitle={item.subtitle}
                      color={item.color}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={clsx("w-1/5 border-b border-border lg:w-1/4")}
                  />
                  <div className="text-center text-xs capitalize text-muted-foreground">
                    Or {text} with email
                  </div>
                  <span
                    className={clsx("w-1/5 border-b border-border lg:w-1/4")}
                  />
                </div>
                {content}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          type="button"
          className={clsx(
            "absolute right-3 top-3 z-10 inline-flex h-7 w-7 items-center justify-center overflow-hidden whitespace-nowrap rounded-full bg-secondary-light p-1 text-sm font-medium text-secondary-light-foreground outline-none transition-colors hover:bg-secondary-light-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50 sm:h-7 sm:w-7 md:text-white/80",
          )}
        >
          <span className="sr-only">Close</span>
          <FaXmark />
        </button>
      </div>
    </div>
  );
};

export default Modal;
