import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";

interface IHeadingProps {
  logo?: React.ReactNode;
  icon?: IconType;
  title: string;
  subtitle: string;
}

const Heading = ({ logo, icon: Icon, title, subtitle }: IHeadingProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 lg:shrink-0">
      <div className="flex items-center gap-x-3">
        {logo}
        {Icon && (
          <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-field p-3 text-muted-foreground shadow-sm md:flex">
            <Icon className="secondary" size={26} />
          </div>
        )}
        <div className="flex flex-col justify-center lg:flex-1">
          <h1 className="font-display max-w-4xl gap-4 text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
            {t(`Heading.title.${title}`)}
          </h1>
          <p className="text-sm text-muted-foreground">
          {t(`Heading.subtitle.${subtitle}`)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Heading;
