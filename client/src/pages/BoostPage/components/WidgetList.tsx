import { Copy, Widget } from "~/components/shared";
import ChatWidget from "./ChatWidget";
import { listOfRanks } from "~/constants/games";
import { listOfStatus } from "~/constants/order";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa6";
import { IOrderProps } from "~/types";
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

const WidgetItemWithImage = ({
  title,
  label,
}: {
  title: string;
  label: string | number;
}) => {
  const { t } = useTranslation();
  const image = listOfRanks.find((i) => i.name === label);

  return (
    <Widget.Item>
      <dt className="text-sm font-medium capitalize text-foreground">
        {t(`Globals.Order.label.${title.split("_").join(" ")}`)}
      </dt>
      <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="w-16"
                src={`/assets/games/counter-strike-2/wingman/${image?.image}.png`}
                alt="rank"
              />
            </div>
            <div className="ml-2.5 truncate">
              <div className="truncate text-sm font-medium text-foreground">
                {label}
              </div>
            </div>
          </div>
        </div>
      </dd>
    </Widget.Item>
  );
};

const WidgetItemWithStatus = ({ status }: { status: string }) => {
  const currentStatus = listOfStatus.filter((item) => item.value === status);

  return currentStatus.map(({ icon: Icon, label }) => (
    <div
      key={uuidv4()}
      className="inline-flex items-center rounded-md bg-secondary-light px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-secondary-ring"
    >
      <Icon className="mr-1.5" />
      <span className="flex-1 shrink-0 truncate">{label}</span>
    </div>
  ));
};

const renderWidgetBoosItem = (key: string, value: string | number) => {
  switch (key) {
    case "boost_id":
      return (
        <Copy value={value} text="Id">
          #{value}
        </Copy>
      );
    case "type":
      return <span>{(value as string) && value.replace("_", " ")} Boost</span>;
    case "status":
      return <WidgetItemWithStatus status={value as string} />;
    case "price":
      return formatMoney(value as number, "vnd");
    default:
      return <span>{value}</span>;
  }
};

const WidgetList = (order: IOrderProps) => {
  const { t } = useTranslation();

  return (
    <div className="row-start-1 space-y-4 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:space-y-6">
      {/* CHAT WIDGET */}
      {order.partner && <ChatWidget {...order} />}

      {/* BOOST DATA */}
      <Widget>
        <Widget.BigHeader>
          <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
            Boost Data
          </h3>
        </Widget.BigHeader>
        <Widget.Content>
          <div className="grid grid-cols-2 lg:grid-cols-3">
            {Object.entries(order)
              .filter(([key]) => showBoost.includes(key))
              .map(([key, value]) => (
                <Widget.Item key={uuidv4()}>
                  <dt className="text-sm font-medium capitalize text-foreground">
                    {t(`Globals.Order.label.${key.split("_").join(" ")}`)}
                  </dt>
                  <dd className="mt-1 text-sm capitalize leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    <div className="flex items-center gap-x-2">
                      <span>{value}</span>
                    </div>
                  </dd>
                </Widget.Item>
              ))}

            {Object.entries(order)
              .filter(([key]) => ["begin_rank", "end_rank"].includes(key))
              .map(([key, value]) => (
                <WidgetItemWithImage key={uuidv4()} title={key} label={value} />
              ))}
          </div>
        </Widget.Content>
      </Widget>

      {/* BOOST OPTIONS */}
      {order.options && order.options.length > 0 && (
        <Widget>
          <Widget.BigHeader>
            <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
              Boost Options
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
                    {name}
                  </dt>
                  <dd className="mt-1 flex items-center text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                    <FaCheck className="mr-2 text-green-600 dark:text-green-500" />{" "}
                    Yes
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
            Boost Information
          </h3>
        </Widget.BigHeader>
        <Widget.Content>
          <div className="grid grid-cols-2 lg:grid-cols-3">
            {Object.entries(order)
              .filter(([key]) => showBoostInfo.includes(key))
              .map(([key, value]) => (
                <div key={uuidv4()}>
                  <Widget.Item>
                    <dt className="text-sm font-medium capitalize text-foreground">
                      {t(`Globals.Order.label.${key.split("_").join(" ")}`)}
                    </dt>
                    <dd className="mt-1 text-sm capitalize leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                      <div className="flex items-center gap-x-2">
                        {renderWidgetBoosItem(key, value)}
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
