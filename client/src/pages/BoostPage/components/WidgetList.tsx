import { Copy, Widget } from "~/components/ui";
import ChatWidget from "./ChatWidget";
import { listOfRanks } from "~/constants/games";
import { listOfStatus } from "~/constants/order";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";
import { IOrder } from "~/types";
import { formatMoney } from "~/utils";
import { v4 as uuidv4 } from "uuid";

const showBoost = [
  "begin_rating",
  "end_rating",
  "begin_exp",
  "end_exp",
  "server",
];

const showBoostInfo = ["title", "boost_id", "status", "game", "type", "price"];

const WidgetList = (order: IOrder) => {
  const { t } = useTranslation(["boost_page", "common", "datatable"]);

  const renderWidgetBoostItem = (key: string, value: string | number) => {
    switch (key) {
      case "boost_id":
        return (
          <Copy value={value} text={t("widget_list.labels.boost_id")}>
            #{value}
          </Copy>
        );
      case "type": {
        const translatedType = t(`common:game_modes.${value}`);
        return (
          <span>
            {translatedType} {t("datatable:tooltip.boost_suffix")}
          </span>
        );
      }
      case "status": {
        const currentStatus = listOfStatus.find((item) => item.value === value);
        if (!currentStatus) return <span>{String(value)}</span>;
        const { icon: Icon, translationKey } = currentStatus;
        return (
          <div className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring">
            {Icon && <Icon className="mr-1.5" />}
            <span>{t(`datatable:order_statuses.${translationKey}`)}</span>
          </div>
        );
      }
      case "price":
        return formatMoney(value as number, "vnd");
      default:
        return <span>{value}</span>;
    }
  };

  return (
    <div className="row-start-1 space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:space-y-6">
      {/* CHAT WIDGET */}
      {order.partner && <ChatWidget {...order} />}

      {/* BOOST DATA */}
      <Widget>
        <Widget.BigHeader>
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            {t("widget_list.boost_data")}
          </h3>
        </Widget.BigHeader>
        <Widget.Content>
          <div className="grid grid-cols-2 lg:grid-cols-3">
            {Object.entries(order)
              .filter(
                ([key]) =>
                  showBoost.includes(key) && order[key as keyof IOrder],
              )
              .map(([key, value]) => (
                <Widget.Item key={uuidv4()}>
                  <dt className="text-sm font-medium capitalize text-foreground">
                    {t(`widget_list.labels.${key}`)}
                  </dt>
                  <dd className="mt-1 text-sm capitalize leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    <div className="flex items-center gap-x-2">
                      <span>{value}</span>
                    </div>
                  </dd>
                </Widget.Item>
              ))}

            {Object.entries(order)
              .filter(
                ([key]) =>
                  ["begin_rank", "end_rank"].includes(key) &&
                  order[key as keyof IOrder],
              )
              .map(([key, value]) => {
                const rankInfo = listOfRanks.find((r) => r.name === value);
                return (
                  <Widget.Item key={key}>
                    <dt className="text-sm font-medium capitalize text-foreground">
                      {t(`widget_list.labels.${key}`)}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                      <div className="flex items-center gap-x-2">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {rankInfo && (
                              <img
                                className="w-16"
                                src={`/assets/games/counter-strike-2/wingman/${rankInfo.image}.png`}
                                alt={rankInfo.name}
                              />
                            )}
                          </div>
                          <div className="ml-2.5 truncate">
                            <div className="truncate text-sm font-medium text-foreground">
                              {value}
                            </div>
                          </div>
                        </div>
                      </div>
                    </dd>
                  </Widget.Item>
                );
              })}
          </div>
        </Widget.Content>
      </Widget>

      {/* BOOST OPTIONS */}
      {order.options && order.options.length > 0 && (
        <Widget>
          <Widget.BigHeader>
            <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
              {t("widget_list.boost_options")}
            </h3>
          </Widget.BigHeader>
          <Widget.Content>
            <div className="grid grid-cols-2 lg:grid-cols-3">
              {order.options.map(({ name }) => (
                <div
                  className="col-span-3 flex items-center border-t border-border/50 px-4 py-6 sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                  key={uuidv4()}
                >
                  <dt className="text-sm font-medium capitalize text-foreground">
                    {t(
                      `common:bill_card.options.${name.toLowerCase().replace(/ /g, "_")}`,
                      { defaultValue: name },
                    )}
                  </dt>
                  <dd className="mt-1 flex items-center text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    <FaCheck className="mr-2 text-green-600 dark:text-green-500" />{" "}
                    {t("widget_list.yes")}
                  </dd>
                </div>
              ))}
            </div>
          </Widget.Content>
        </Widget>
      )}

      {/* BOOST INFORMATION */}
      <Widget>
        <Widget.BigHeader>
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            {t("widget_list.boost_information")}
          </h3>
        </Widget.BigHeader>
        <Widget.Content>
          <div className="grid grid-cols-2 lg:grid-cols-3">
            {Object.entries(order)
              .filter(
                ([key]) =>
                  showBoostInfo.includes(key) && order[key as keyof IOrder],
              )
              .map(([key, value]) => (
                <div key={uuidv4()}>
                  <Widget.Item>
                    <dt className="text-sm font-medium capitalize text-foreground">
                      {t(`widget_list.labels.${key}`)}
                    </dt>
                    <dd className="mt-1 text-sm capitalize leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                      <div className="flex items-center gap-x-2">
                        {renderWidgetBoostItem(key, value)}
                      </div>
                    </dd>
                  </Widget.Item>
                </div>
              ))}
          </div>
        </Widget.Content>
      </Widget>
    </div>
  );
};

export default WidgetList;