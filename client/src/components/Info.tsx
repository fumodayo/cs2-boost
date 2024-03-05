import { Tab } from "@headlessui/react";
import Discovery from "./Discovery";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";

type PanelItem = {
  id: number;
  title: string;
  subtitle: string;
};

type Service = {
  tab: string;
  isDisclosure: boolean;
  panel: PanelItem[];
};

interface InfoProps {
  title: string;
  serviceInfo: Service[];
}

const Info: React.FC<InfoProps> = ({ title, serviceInfo }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full rounded-lg bg-card pb-10 pl-8 pr-8 pt-6 shadow-md">
      <div className="flex flex-col gap-4 pb-4">
        <p className="text-lg font-bold">{t("Info")}</p>
        <p className="text-md mb-4 text-muted-foreground">{t(title)}</p>
        <Tab.Group>
          <Tab.List className="flex flex-wrap gap-6">
            {serviceInfo.map((item, idx) => (
              <Tab key={idx}>
                {({ selected }) => (
                  <div
                    className={
                      selected
                        ? "text-md text-md w-full rounded-lg bg-blue-600 px-8 py-2.5 font-medium text-foreground focus:outline-none"
                        : "text-md text-md w-full rounded-lg bg-accent px-8 py-2.5 font-medium text-foreground focus:outline-none"
                    }
                  >
                    {t(item.tab)}
                  </div>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {serviceInfo.map((items, idx) => (
              <Tab.Panel key={idx}>
                <div className="ml-2 flex flex-col gap-3 text-muted-foreground">
                  {items.isDisclosure
                    ? items.panel.map((item, idx) => (
                        <Discovery
                          key={idx}
                          title={item.title}
                          subtitle={item.subtitle}
                        />
                      ))
                    : items.panel.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <FaCheck className="text-blue-600" />
                          <div className="flex gap-2">
                            <span className="text-blue-600">
                              {t(item.title)}:
                            </span>
                            <p>{t(item.subtitle)}</p>
                          </div>
                        </div>
                      ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default Info;
